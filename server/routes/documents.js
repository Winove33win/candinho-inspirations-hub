import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/documents
router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM documents WHERE member_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    return res.json({ data: rows });
  } catch (err) {
    console.error('[DOCUMENTS::LIST]', err);
    return res.status(500).json({ error: 'Erro ao listar documentos' });
  }
});

// POST /api/documents
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, file_url, kind } = req.body;

    if (!title || !file_url) {
      return res.status(400).json({ error: 'Título e arquivo são obrigatórios' });
    }

    const id = uuidv4();
    await db.query(
      'INSERT INTO documents (id, member_id, title, file_url, kind) VALUES (?, ?, ?, ?, ?)',
      [id, req.user.id, title.trim(), file_url.trim(), kind || 'outro']
    );

    const [created] = await db.query('SELECT * FROM documents WHERE id = ?', [id]);
    return res.status(201).json({ data: created[0] });
  } catch (err) {
    console.error('[DOCUMENTS::CREATE]', err);
    return res.status(500).json({ error: 'Erro ao criar documento' });
  }
});

// DELETE /api/documents/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM documents WHERE id = ? AND member_id = ?',
      [req.params.id, req.user.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Documento não encontrado' });
    return res.json({ success: true });
  } catch (err) {
    console.error('[DOCUMENTS::DELETE]', err);
    return res.status(500).json({ error: 'Erro ao excluir documento' });
  }
});

export default router;
