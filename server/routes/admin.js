import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Middleware: only admins can use these routes
function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito a administradores' });
  }
  next();
}

router.use(requireAuth, requireAdmin);

// POST /api/admin/artists/import
// Import a single artist record from CSV data.
// Creates a placeholder user account if member_id is not a known user.
router.post('/artists/import', async (req, res) => {
  try {
    const data = req.body;
    const memberId = data.member_id || uuidv4();

    // Check if artist already exists
    const [existing] = await db.query(
      'SELECT id FROM artist_details WHERE member_id = ?',
      [memberId]
    );
    if (existing.length > 0) {
      return res.json({ status: 'skipped', member_id: memberId });
    }

    // Ensure a user row exists for this memberId
    const [userRow] = await db.query('SELECT id FROM users WHERE id = ?', [memberId]);
    if (userRow.length === 0) {
      const email = data.email || `imported-${memberId}@smartx.placeholder`;
      const hash  = await bcrypt.hash(uuidv4(), 6); // placeholder password
      await db.query(
        'INSERT INTO users (id, email, password, role) VALUES (?, ?, ?, ?)',
        [memberId, email, hash, 'member']
      );
    }

    const ALLOWED = [
      'artistic_name', 'full_name', 'country_residence', 'city', 'profile_text2',
      'profile_image', 'country_of_birth', 'visao_geral_titulo', 'historia_titulo',
      'carreira_titulo', 'mais_titulo', 'biography1', 'audio',
      'video_banner_portrait', 'video_banner_landscape',
      'link_to_video', 'link_to_video2', 'link_to_video3', 'link_to_video4',
      'link_to_video5', 'link_to_video6', 'link_to_video7', 'link_to_video8',
      'link_to_video9', 'link_to_video10',
      'address1', 'address2', 'postal_code', 'city',
      'image1', 'image1_text', 'image2', 'image2_text', 'image3', 'image3_text',
      'image4', 'image4_text', 'image5', 'image5_text', 'image6', 'image6_text',
      'image7', 'image7_text', 'image8', 'image8_text', 'image9', 'image9_text',
      'image10', 'image10_text', 'image11', 'image11_text', 'image12', 'image12_text',
      'facebook', 'instagram', 'website', 'music_spotify_apple', 'youtube_channel',
      'accepted_terms1', 'accepted_terms2', 'perfil_completo', 'cell_phone',
      'date_of_birth',
    ];

    const fields = { id: uuidv4(), member_id: memberId };
    for (const f of ALLOWED) {
      if (f in data) fields[f] = data[f] ?? null;
    }

    const cols = Object.keys(fields).map(k => `\`${k}\``).join(', ');
    const vals = Object.values(fields);
    const placeholders = vals.map(() => '?').join(', ');

    await db.query(`INSERT INTO artist_details (${cols}) VALUES (${placeholders})`, vals);

    return res.status(201).json({ status: 'imported', member_id: memberId });
  } catch (err) {
    console.error('[ADMIN::IMPORT]', err);
    return res.status(500).json({ error: err.message || 'Erro ao importar artista' });
  }
});

export default router;
