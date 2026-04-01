import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/support
router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM support_tickets WHERE member_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    return res.json({ data: rows });
  } catch (err) {
    console.error('[SUPPORT::LIST]', err);
    return res.status(500).json({ error: 'Erro ao listar tickets' });
  }
});

// POST /api/support
router.post('/', requireAuth, async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ error: 'Assunto e mensagem são obrigatórios' });
    }

    const id = uuidv4();
    await db.query(
      'INSERT INTO support_tickets (id, member_id, subject, message, status) VALUES (?, ?, ?, ?, ?)',
      [id, req.user.id, subject.trim(), message.trim(), 'open']
    );

    const [created] = await db.query('SELECT * FROM support_tickets WHERE id = ?', [id]);
    return res.status(201).json({ data: created[0] });
  } catch (err) {
    console.error('[SUPPORT::CREATE]', err);
    return res.status(500).json({ error: 'Erro ao enviar ticket' });
  }
});

export default router;
