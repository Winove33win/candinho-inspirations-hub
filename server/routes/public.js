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

// GET /api/public/artists  — list published artists with search + pagination
// Query params: q (name search), country, page (1-based), limit (default 24)
router.get('/artists', async (req, res) => {
  try {
    const q       = (req.query.q || '').trim();
    const country = (req.query.country || '').trim();
    const page    = Math.max(1, parseInt(req.query.page) || 1);
    const limit   = Math.min(100, Math.max(1, parseInt(req.query.limit) || 24));
    const offset  = (page - 1) * limit;

    const conditions = ['(perfil_completo = 1 OR artistic_name IS NOT NULL)'];
    const params = [];

    if (q) {
      conditions.push('(artistic_name LIKE ? OR full_name LIKE ?)');
      params.push(`%${q}%`, `%${q}%`);
    }
    if (country) {
      conditions.push('country_residence = ?');
      params.push(country);
    }

    const where = conditions.join(' AND ');

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total FROM artist_details WHERE ${where}`,
      params
    );

    const [rows] = await db.query(
      `SELECT id, slug, member_id, artistic_name, full_name,
              country_residence, city, profile_image, profile_text2,
              how_is_it_defined
       FROM artist_details
       WHERE ${where}
       ORDER BY updated_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Distinct countries for filter dropdown
    const [countryRows] = await db.query(
      `SELECT DISTINCT country_residence
       FROM artist_details
       WHERE (perfil_completo = 1 OR artistic_name IS NOT NULL) AND country_residence IS NOT NULL
       ORDER BY country_residence ASC`
    );

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const artists = rows.map(r => ({
      id:          r.id,
      slug:        r.slug || r.id,
      stageName:   r.artistic_name || r.full_name || 'Artista SMARTx',
      country:     r.country_residence,
      city:        r.city,
      avatarUrl:   resolveFileUrl(r.profile_image, baseUrl),
      impactPhrase: r.profile_text2 || null,
      category:    r.how_is_it_defined || null,
    }));

    return res.json({
      data:      artists,
      total:     Number(total),
      page,
      limit,
      pages:     Math.ceil(Number(total) / limit),
      countries: countryRows.map(r => r.country_residence).filter(Boolean),
    });
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
