import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const PROJECT_FIELDS = [
  'title', 'cover_image', 'banner_image', 'about',
  'block1_title', 'block1_image', 'block2_title', 'block2_image',
  'block3_title', 'block3_image', 'block4_title', 'block4_image',
  'block5_title', 'block5_image',
  'team_tech', 'team_art', 'project_sheet', 'partners', 'status',
];

function pickFields(body, fields) {
  const result = {};
  for (const f of fields) {
    if (f in body) {
      const v = body[f];
      result[f] = typeof v === 'string' ? (v.trim() === '' ? null : v.trim()) : (v ?? null);
    }
  }
  return result;
}

// GET /api/projects
router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM projects WHERE member_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    return res.json({ data: rows });
  } catch (err) {
    console.error('[PROJECTS::LIST]', err);
    return res.status(500).json({ error: 'Erro ao listar projetos' });
  }
});

// GET /api/projects/:id
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM projects WHERE id = ? AND member_id = ?',
      [req.params.id, req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Projeto não encontrado' });
    return res.json({ data: rows[0] });
  } catch (err) {
    console.error('[PROJECTS::GET]', err);
    return res.status(500).json({ error: 'Erro ao buscar projeto' });
  }
});

// POST /api/projects
router.post('/', requireAuth, async (req, res) => {
  try {
    const fields = pickFields(req.body, PROJECT_FIELDS);
    const id = uuidv4();

    const cols = ['id', 'member_id', ...Object.keys(fields)];
    const vals = [id, req.user.id, ...Object.values(fields)];
    const placeholders = cols.map(() => '?').join(', ');

    await db.query(
      `INSERT INTO projects (${cols.map(c => `\`${c}\``).join(', ')}) VALUES (${placeholders})`,
      vals
    );

    const [created] = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
    return res.status(201).json({ data: created[0] });
  } catch (err) {
    console.error('[PROJECTS::CREATE]', err);
    return res.status(500).json({ error: 'Erro ao criar projeto' });
  }
});

// PUT /api/projects/:id
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const [existing] = await db.query(
      'SELECT id FROM projects WHERE id = ? AND member_id = ?',
      [req.params.id, req.user.id]
    );
    if (existing.length === 0) return res.status(404).json({ error: 'Projeto não encontrado' });

    const fields = pickFields(req.body, PROJECT_FIELDS);
    if (Object.keys(fields).length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar' });
    }

    const setClauses = Object.keys(fields).map(k => `\`${k}\` = ?`).join(', ');
    const values = [...Object.values(fields), req.params.id, req.user.id];

    await db.query(
      `UPDATE projects SET ${setClauses} WHERE id = ? AND member_id = ?`,
      values
    );

    const [updated] = await db.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    return res.json({ data: updated[0] });
  } catch (err) {
    console.error('[PROJECTS::UPDATE]', err);
    return res.status(500).json({ error: 'Erro ao atualizar projeto' });
  }
});

// DELETE /api/projects/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM projects WHERE id = ? AND member_id = ?',
      [req.params.id, req.user.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Projeto não encontrado' });
    return res.json({ success: true });
  } catch (err) {
    console.error('[PROJECTS::DELETE]', err);
    return res.status(500).json({ error: 'Erro ao excluir projeto' });
  }
});

export default router;
