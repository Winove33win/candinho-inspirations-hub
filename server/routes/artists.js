import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = Router();

// Columns that can be saved on artist_details (allowlist)
const ARTIST_FIELDS = [
  'perfil_completo', 'artistic_name', 'full_name', 'profile_image',
  'how_is_it_defined1', 'how_is_it_defined', 'cell_phone', 'date_of_birth',
  'country_of_birth', 'profile_text2', 'address1', 'postal_code', 'address2',
  'city', 'country_residence', 'accepted_terms1', 'accepted_terms2',
  'biography1', 'facebook', 'instagram', 'music_spotify_apple', 'youtube_channel', 'website',
  'audio', 'video_banner_landscape', 'video_banner_portrait',
  'link_to_video', 'link_to_video2', 'link_to_video3', 'link_to_video4', 'link_to_video5',
  'link_to_video6', 'link_to_video7', 'link_to_video8', 'link_to_video9', 'link_to_video10',
  'visao_geral_titulo', 'historia_titulo', 'carreira_titulo', 'mais_titulo',
  'image1', 'image1_text', 'image2', 'image2_text', 'image3', 'image3_text',
  'image4', 'image4_text', 'image5', 'image5_text', 'image6', 'image6_text',
  'image7', 'image7_text', 'image8', 'image8_text', 'image9', 'image9_text',
  'image10', 'image10_text', 'image11', 'image11_text', 'image12', 'image12_text',
];

function slugify(text) {
  if (!text) return null;
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || null;
}

async function ensureUniqueSlug(baseSlug, excludeId) {
  if (!baseSlug) return null;

  let slug = baseSlug;
  let attempt = 0;

  while (true) {
    const [rows] = await db.query(
      'SELECT id FROM artist_details WHERE slug = ? AND id != ?',
      [slug, excludeId || '']
    );
    if (rows.length === 0) return slug;
    attempt++;
    slug = `${baseSlug}-${attempt}`;
  }
}

// GET /api/artists/me
router.get('/me', requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM artist_details WHERE member_id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      // Create skeleton
      const newId = uuidv4();
      await db.query(
        'INSERT INTO artist_details (id, member_id, perfil_completo) VALUES (?, ?, 0)',
        [newId, req.user.id]
      );
      const [created] = await db.query('SELECT * FROM artist_details WHERE id = ?', [newId]);
      return res.json({ data: created[0] });
    }

    return res.json({ data: rows[0] });
  } catch (err) {
    console.error('[ARTISTS::GET_ME]', err);
    return res.status(500).json({ error: 'Erro ao carregar dados do artista' });
  }
});

// PUT /api/artists/me
router.put('/me', requireAuth, async (req, res) => {
  try {
    const body = req.body;
    const updates = {};

    for (const field of ARTIST_FIELDS) {
      if (field in body) {
        const val = body[field];
        if (typeof val === 'string') {
          updates[field] = val.trim() === '' ? null : val.trim();
        } else {
          updates[field] = val ?? null;
        }
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar' });
    }

    // Update slug when artistic_name changes
    if ('artistic_name' in updates && updates.artistic_name) {
      const [existing] = await db.query(
        'SELECT id, slug FROM artist_details WHERE member_id = ?',
        [req.user.id]
      );
      const currentSlug = existing[0]?.slug;
      const newBase = slugify(updates.artistic_name);

      if (!currentSlug) {
        updates.slug = await ensureUniqueSlug(newBase, existing[0]?.id);
      }
    }

    const setClauses = Object.keys(updates).map(k => `\`${k}\` = ?`).join(', ');
    const values = [...Object.values(updates), req.user.id];

    await db.query(
      `UPDATE artist_details SET ${setClauses} WHERE member_id = ?`,
      values
    );

    const [updated] = await db.query(
      'SELECT * FROM artist_details WHERE member_id = ?',
      [req.user.id]
    );

    return res.json({ data: updated[0] });
  } catch (err) {
    console.error('[ARTISTS::UPDATE_ME]', err);
    return res.status(500).json({ error: 'Erro ao salvar dados do artista' });
  }
});

// POST /api/artists/me/upload/:folder
router.post(
  '/me/upload/:folder',
  requireAuth,
  (req, res, next) => {
    const allowed = ['profile', 'photos', 'videos', 'docs'];
    if (!allowed.includes(req.params.folder)) {
      return res.status(400).json({ error: 'Pasta de upload inválida' });
    }
    next();
  },
  upload.single('file'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'Arquivo não recebido' });
    }

    // Return a path relative to the uploads root so the frontend can display it
    const relativePath = `uploads/${req.user.id}/${req.params.folder}/${req.file.filename}`;
    return res.json({ path: relativePath });
  }
);

export default router;
