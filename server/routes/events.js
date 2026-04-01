import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const EVENT_FIELDS = [
  'name', 'banner', 'date', 'start_time', 'end_time',
  'place', 'cta_link', 'description', 'status',
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

// GET /api/events
router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM events WHERE member_id = ? ORDER BY date DESC',
      [req.user.id]
    );
    return res.json({ data: rows });
  } catch (err) {
    console.error('[EVENTS::LIST]', err);
    return res.status(500).json({ error: 'Erro ao listar eventos' });
  }
});

// GET /api/events/:id
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM events WHERE id = ? AND member_id = ?',
      [req.params.id, req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Evento não encontrado' });
    return res.json({ data: rows[0] });
  } catch (err) {
    console.error('[EVENTS::GET]', err);
    return res.status(500).json({ error: 'Erro ao buscar evento' });
  }
});

// POST /api/events
router.post('/', requireAuth, async (req, res) => {
  try {
    const fields = pickFields(req.body, EVENT_FIELDS);
    const id = uuidv4();

    const cols = ['id', 'member_id', ...Object.keys(fields)];
    const vals = [id, req.user.id, ...Object.values(fields)];
    const placeholders = cols.map(() => '?').join(', ');

    await db.query(
      `INSERT INTO events (${cols.map(c => `\`${c}\``).join(', ')}) VALUES (${placeholders})`,
      vals
    );

    const [created] = await db.query('SELECT * FROM events WHERE id = ?', [id]);
    return res.status(201).json({ data: created[0] });
  } catch (err) {
    console.error('[EVENTS::CREATE]', err);
    return res.status(500).json({ error: 'Erro ao criar evento' });
  }
});

// PUT /api/events/:id
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const [existing] = await db.query(
      'SELECT id FROM events WHERE id = ? AND member_id = ?',
      [req.params.id, req.user.id]
    );
    if (existing.length === 0) return res.status(404).json({ error: 'Evento não encontrado' });

    const fields = pickFields(req.body, EVENT_FIELDS);
    if (Object.keys(fields).length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar' });
    }

    const setClauses = Object.keys(fields).map(k => `\`${k}\` = ?`).join(', ');
    const values = [...Object.values(fields), req.params.id, req.user.id];

    await db.query(
      `UPDATE events SET ${setClauses} WHERE id = ? AND member_id = ?`,
      values
    );

    const [updated] = await db.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    return res.json({ data: updated[0] });
  } catch (err) {
    console.error('[EVENTS::UPDATE]', err);
    return res.status(500).json({ error: 'Erro ao atualizar evento' });
  }
});

// DELETE /api/events/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM events WHERE id = ? AND member_id = ?',
      [req.params.id, req.user.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Evento não encontrado' });
    return res.json({ success: true });
  } catch (err) {
    console.error('[EVENTS::DELETE]', err);
    return res.status(500).json({ error: 'Erro ao excluir evento' });
  }
});

export default router;
