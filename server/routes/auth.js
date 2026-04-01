import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';
import { signToken, requireAuth } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter ao menos 6 caracteres' });
    }

    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'E-mail já cadastrado' });
    }

    const id = uuidv4();
    const hash = await bcrypt.hash(password, 10);

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query(
        'INSERT INTO users (id, email, password, role) VALUES (?, ?, ?, ?)',
        [id, email.trim().toLowerCase(), hash, 'member']
      );

      // Create empty artist_details skeleton
      await conn.query(
        'INSERT INTO artist_details (id, member_id, perfil_completo) VALUES (?, ?, 0)',
        [uuidv4(), id]
      );

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }

    const token = signToken({ id, email: email.trim().toLowerCase(), role: 'member' });
    return res.status(201).json({ token, user: { id, email: email.trim().toLowerCase(), role: 'member' } });
  } catch (err) {
    console.error('[AUTH::REGISTER]', err);
    return res.status(500).json({ error: 'Erro interno ao criar conta', detail: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
    }

    const [rows] = await db.query(
      'SELECT id, email, password, role FROM users WHERE email = ?',
      [email.trim().toLowerCase()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos' });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos' });
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    return res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    console.error('[AUTH::LOGIN]', err);
    return res.status(500).json({ error: 'Erro interno ao fazer login', detail: err.message });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, email, role FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    return res.json({ user: rows[0] });
  } catch (err) {
    console.error('[AUTH::ME]', err);
    return res.status(500).json({ error: 'Erro interno' });
  }
});

export default router;
