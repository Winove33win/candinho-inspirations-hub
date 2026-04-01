// ================================================================
// migrations/002_import_wix.js
// Run on the server: node migrations/002_import_wix.js
// Imports New+Artist+Details.csv (Wix export) into artist_details
// ================================================================
import 'dotenv/config';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import db from '../server/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CSV_PATH  = path.join(__dirname, 'New+Artist+Details.csv');

// ── Column indices (0-based) ────────────────────────────────────
const C = {
  wixId:              0,
  owner:              3,   // Wix Owner ID → fallback member_id
  fullName:           4,
  email:              6,
  cellPhone:          7,
  address1:           8,
  city:               9,
  countryResidence:   10,
  postalCode:         11,
  countryOfBirth:     12,
  dateOfBirth:        13,
  artisticName:       14,
  howIsDefined:       16,
  profileImage:       20,
  videoBannerMobile:  22,
  videoBannerWeb:     23,
  facebook:           24,
  instagram:          25,
  website:            26,
  musicStreaming:     27,
  youtubeChannel:     29,
  video1:             30,
  video2:             31,
  video3:             32,
  acceptedTerms1:     36,
  acceptedTerms2:     37,
  video4:             47,
  video5:             48,
  video6:             49,
  video7:             50,
  video8:             51,
  video9:             52,
  audio:              53,
  profileText2:       54,
  biographyPt:        56,
  video10:            57,
  slug:               62,
  address2:           64,
  visaoGeral:         71,
  historia:           72,
  carreira:           73,
  mais:               74,
  image1:             75,  image1Text:  76,
  image2:             77,  image2Text:  78,
  image3:             79,  image3Text:  80,
  image4:             81,  image4Text:  82,
  image5:             83,  image5Text:  84,
  image6:             85,  image6Text:  89,
  image7:             86,  image7Text:  88,
  image8:             87,  image8Text:  90,
  image9:             91,  image9Text:  93,
  image10:            92,  image10Text: 94,
  image11:            95,  image11Text: 104,
  image12:            96,  image12Text: 103,
  memberId:           120,
  perfilCompleto:     121,
};

// ── CSV parser — handles quoted fields with embedded newlines ───
function parseCSV(content) {
  const records = [];
  let pos = 0;
  const len = content.length;

  while (pos < len) {
    const record = [];
    while (pos < len) {
      let field = '';
      if (content[pos] === '"') {
        pos++;
        while (pos < len) {
          if (content[pos] === '"') {
            if (pos + 1 < len && content[pos + 1] === '"') {
              field += '"'; pos += 2;
            } else { pos++; break; }
          } else { field += content[pos++]; }
        }
      } else {
        while (pos < len && content[pos] !== ',' && content[pos] !== '\n' && content[pos] !== '\r') {
          field += content[pos++];
        }
      }
      record.push(field);
      if (pos < len && content[pos] === ',') { pos++; }
      else {
        if (pos < len && content[pos] === '\r') pos++;
        if (pos < len && content[pos] === '\n') pos++;
        break;
      }
    }
    if (record.length > 1 || (record.length === 1 && record[0] !== '')) {
      records.push(record);
    }
  }
  return records;
}

function clean(val) {
  if (!val) return null;
  const v = val.trim();
  if (!v || v === '""') return null;
  if (v.startsWith('wix:document://')) return null;
  if (v.startsWith('wix:') && !v.startsWith('wix:image://') && !v.startsWith('wix:audio://')) return null;
  return v;
}

function wixImageUrl(val) {
  const v = clean(val);
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  const m = v.match(/^wix:image:\/\/v1\/([^/]+)\//);
  return m ? `https://static.wixstatic.com/media/${m[1]}` : null;
}

function wixAudioUrl(val) {
  const v = clean(val);
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  const m = v.match(/^wix:audio:\/\/v1\/([^/]+)\//);
  return m ? `https://static.wixstatic.com/mp3/${m[1]}` : null;
}

function extractUrl(val) {
  const v = clean(val);
  if (!v) return null;
  if (v.includes('google.com') && v.includes('url=')) {
    const m = v.match(/[?&]url=([^&]+)/);
    if (m) { try { return decodeURIComponent(m[1]); } catch { /* ignore */ } }
  }
  return /^https?:\/\//i.test(v) ? v : null;
}

function boolVal(val) {
  const v = clean(val);
  return (v === 'true' || v === '1') ? 1 : 0;
}

function validDate(val) {
  const v = clean(val);
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : v;
}

function slugify(text) {
  if (!text) return null;
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    .substring(0, 80);
}

async function main() {
  console.log(`Reading ${CSV_PATH} ...`);
  const content = readFileSync(CSV_PATH, 'utf-8');
  const rows    = parseCSV(content);
  const data    = rows.slice(1); // skip header
  console.log(`${data.length} artists to process.\n`);

  let imported = 0, skipped = 0, errors = 0;

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    try {
      const artisticName = clean(row[C.artisticName]);
      const fullName     = clean(row[C.fullName]);

      if (!artisticName && !fullName) { skipped++; continue; }

      const memberId = clean(row[C.memberId]) || clean(row[C.owner]) || randomUUID();

      // Skip duplicates
      const [existing] = await db.query(
        'SELECT id FROM artist_details WHERE member_id = ?', [memberId]
      );
      if (existing.length > 0) {
        console.log(`  SKIP  ${artisticName || fullName} (already in DB)`);
        skipped++;
        continue;
      }

      // Ensure user row exists
      const [userRow] = await db.query('SELECT id FROM users WHERE id = ?', [memberId]);
      if (userRow.length === 0) {
        const email = clean(row[C.email]) || `wix-${memberId.slice(0, 8)}@smartx.placeholder`;
        const hash  = await bcrypt.hash(randomUUID(), 4);
        await db.query(
          'INSERT IGNORE INTO users (id, email, password, role) VALUES (?, ?, ?, ?)',
          [memberId, email, hash, 'member']
        );
      }

      // Slug
      let slug = clean(row[C.slug]) || slugify(artisticName || fullName);
      const [slugCheck] = await db.query(
        'SELECT id FROM artist_details WHERE slug = ?', [slug]
      );
      if (slugCheck.length > 0) slug = `${slug}-${memberId.slice(0, 4)}`;

      const fields = {
        id:                   randomUUID(),
        member_id:            memberId,
        slug,
        artistic_name:        artisticName,
        full_name:            fullName,
        cell_phone:           clean(row[C.cellPhone]),
        date_of_birth:        validDate(row[C.dateOfBirth]),
        country_of_birth:     clean(row[C.countryOfBirth]),
        country_residence:    clean(row[C.countryResidence]),
        city:                 clean(row[C.city]),
        address1:             clean(row[C.address1]),
        address2:             clean(row[C.address2]),
        postal_code:          clean(row[C.postalCode]),
        how_is_it_defined:    clean(row[C.howIsDefined]),
        profile_text2:        clean(row[C.profileText2]),
        profile_image:        wixImageUrl(row[C.profileImage]),
        biography1:           clean(row[C.biographyPt]),
        facebook:             extractUrl(row[C.facebook]),
        instagram:            extractUrl(row[C.instagram]),
        website:              extractUrl(row[C.website]),
        music_spotify_apple:  extractUrl(row[C.musicStreaming]),
        youtube_channel:      extractUrl(row[C.youtubeChannel]),
        audio:                wixAudioUrl(row[C.audio]),
        video_banner_portrait:  clean(row[C.videoBannerMobile]),
        video_banner_landscape: clean(row[C.videoBannerWeb]),
        link_to_video:        extractUrl(row[C.video1]),
        link_to_video2:       extractUrl(row[C.video2]),
        link_to_video3:       extractUrl(row[C.video3]),
        link_to_video4:       extractUrl(row[C.video4]),
        link_to_video5:       extractUrl(row[C.video5]),
        link_to_video6:       extractUrl(row[C.video6]),
        link_to_video7:       extractUrl(row[C.video7]),
        link_to_video8:       extractUrl(row[C.video8]),
        link_to_video9:       extractUrl(row[C.video9]),
        link_to_video10:      extractUrl(row[C.video10]),
        visao_geral_titulo:   clean(row[C.visaoGeral]),
        historia_titulo:      clean(row[C.historia]),
        carreira_titulo:      clean(row[C.carreira]),
        mais_titulo:          clean(row[C.mais]),
        image1:  wixImageUrl(row[C.image1]),  image1_text:  clean(row[C.image1Text]),
        image2:  wixImageUrl(row[C.image2]),  image2_text:  clean(row[C.image2Text]),
        image3:  wixImageUrl(row[C.image3]),  image3_text:  clean(row[C.image3Text]),
        image4:  wixImageUrl(row[C.image4]),  image4_text:  clean(row[C.image4Text]),
        image5:  wixImageUrl(row[C.image5]),  image5_text:  clean(row[C.image5Text]),
        image6:  wixImageUrl(row[C.image6]),  image6_text:  clean(row[C.image6Text]),
        image7:  wixImageUrl(row[C.image7]),  image7_text:  clean(row[C.image7Text]),
        image8:  wixImageUrl(row[C.image8]),  image8_text:  clean(row[C.image8Text]),
        image9:  wixImageUrl(row[C.image9]),  image9_text:  clean(row[C.image9Text]),
        image10: wixImageUrl(row[C.image10]), image10_text: clean(row[C.image10Text]),
        image11: wixImageUrl(row[C.image11]), image11_text: clean(row[C.image11Text]),
        image12: wixImageUrl(row[C.image12]), image12_text: clean(row[C.image12Text]),
        accepted_terms1: boolVal(row[C.acceptedTerms1]),
        accepted_terms2: boolVal(row[C.acceptedTerms2]),
        perfil_completo: boolVal(row[C.perfilCompleto]),
      };

      const cols  = Object.keys(fields).map(k => `\`${k}\``).join(', ');
      const vals  = Object.values(fields);
      const ph    = vals.map(() => '?').join(', ');
      await db.query(`INSERT INTO artist_details (${cols}) VALUES (${ph})`, vals);

      console.log(`  OK    ${artisticName || fullName} → /artistas/${slug}`);
      imported++;
    } catch (err) {
      console.error(`  ERR   Row ${i + 2}: ${err.message}`);
      errors++;
    }
  }

  console.log(`\n✓ Done: ${imported} imported, ${skipped} skipped, ${errors} errors`);
  process.exit(0);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
