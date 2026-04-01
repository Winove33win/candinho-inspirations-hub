import { Router } from 'express';
import db from '../db.js';

const router = Router();

function resolveFileUrl(path, baseUrl) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${baseUrl}/${path}`;
}

function detectVideoProvider(url) {
  if (!url) return undefined;
  const lower = url.toLowerCase();
  if (lower.includes('youtu')) return 'youtube';
  if (lower.includes('vimeo')) return 'vimeo';
  if (/(\.mp4|\.webm|\.ogg)(\?.*)?$/.test(lower)) return 'file';
  return undefined;
}

// GET /api/public/artists  — list all published artists
router.get('/artists', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, slug, member_id, artistic_name, full_name, country_residence, city, profile_image
       FROM artist_details
       WHERE perfil_completo = 1
       ORDER BY updated_at DESC`
    );

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const artists = rows.map(r => ({
      id:          r.id,
      slug:        r.slug || r.id,
      stageName:   r.artistic_name || r.full_name || 'Artista SMARTx',
      country:     r.country_residence,
      city:        r.city,
      avatarUrl:   resolveFileUrl(r.profile_image, baseUrl),
    }));

    return res.json({ data: artists });
  } catch (err) {
    console.error('[PUBLIC::ARTISTS]', err);
    return res.status(500).json({ error: 'Erro ao buscar artistas' });
  }
});

// GET /api/public/artists/:slug  — full artist profile
router.get('/artists/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // Try slug, then id, then member_id
    let record = null;
    for (const col of ['slug', 'id', 'member_id']) {
      const [rows] = await db.query(
        `SELECT * FROM artist_details WHERE \`${col}\` = ? LIMIT 1`,
        [slug]
      );
      if (rows.length > 0) { record = rows[0]; break; }
    }

    if (!record) {
      return res.status(404).json({ error: 'Artista não encontrado' });
    }

    // Photos
    const photos = [];
    for (let i = 1; i <= 12; i++) {
      const p = record[`image${i}`];
      if (!p) continue;
      const url = resolveFileUrl(p, baseUrl);
      if (url) photos.push({ url, alt: record[`image${i}_text`] || undefined });
    }

    // Videos
    const videoKeys = ['link_to_video','link_to_video2','link_to_video3','link_to_video4','link_to_video5',
                       'link_to_video6','link_to_video7','link_to_video8','link_to_video9','link_to_video10'];
    const videos = videoKeys
      .map(k => record[k])
      .filter(Boolean)
      .map(url => ({ url, provider: detectVideoProvider(url) }));

    // Projects
    const [projectRows] = await db.query(
      `SELECT * FROM projects WHERE member_id = ? AND status = 'published' ORDER BY updated_at DESC`,
      [record.member_id]
    );
    const projects = projectRows.map(p => ({
      id:             p.id,
      title:          p.title,
      about:          p.about,
      partners:       p.partners,
      teamArt:        p.team_art,
      teamTech:       p.team_tech,
      projectSheetUrl: resolveFileUrl(p.project_sheet, baseUrl),
      coverUrl:       resolveFileUrl(p.cover_image, baseUrl),
      bannerUrl:      resolveFileUrl(p.banner_image, baseUrl),
    }));

    // Events
    const [eventRows] = await db.query(
      `SELECT * FROM events WHERE member_id = ? AND status = 'published' ORDER BY date ASC`,
      [record.member_id]
    );
    const events = eventRows.map(e => ({
      id:          e.id,
      name:        e.name,
      description: e.description,
      date:        e.date,
      startTime:   e.start_time,
      endTime:     e.end_time,
      place:       e.place,
      ctaLink:     e.cta_link,
      bannerUrl:   resolveFileUrl(e.banner, baseUrl),
    }));

    // Socials
    const socials = [
      { label: 'Site oficial',          url: record.website },
      { label: 'Instagram',             url: record.instagram },
      { label: 'Facebook',              url: record.facebook },
      { label: 'YouTube',               url: record.youtube_channel },
      { label: 'Spotify / Apple Music', url: record.music_spotify_apple },
    ].filter(s => s.url);

    // Stats
    const stats = [];
    if (record.country_residence) stats.push({ key: 'País',      value: record.country_residence });
    if (record.city)               stats.push({ key: 'Cidade',   value: record.city });
    if (record.profile_text2)      stats.push({ key: 'Destaque', value: record.profile_text2 });

    const avatarUrl  = resolveFileUrl(record.profile_image, baseUrl);
    const landscape  = resolveFileUrl(record.video_banner_landscape, baseUrl);
    const portrait   = resolveFileUrl(record.video_banner_portrait, baseUrl);
    const coverUrl   = (landscape && detectVideoProvider(landscape) !== 'youtube' ? landscape : null)
                    || (portrait  && detectVideoProvider(portrait)  !== 'youtube' ? portrait  : null);

    return res.json({
      id:        record.id,
      slug:      record.slug || record.id,
      stageName: record.artistic_name || record.full_name || 'Artista SMARTx',
      country:   record.country_residence,
      city:      record.city,
      avatarUrl,
      coverUrl,
      stats,
      vision:    record.visao_geral_titulo,
      history:   record.historia_titulo,
      career:    record.carreira_titulo,
      more:      record.mais_titulo,
      socials,
      photos,
      videos,
      projects,
      events,
    });
  } catch (err) {
    console.error('[PUBLIC::ARTIST_DETAIL]', err);
    return res.status(500).json({ error: 'Erro ao buscar artista' });
  }
});

export default router;
