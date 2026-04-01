import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import db            from './db.js';
import authRoutes     from './routes/auth.js';
import artistRoutes   from './routes/artists.js';
import projectRoutes  from './routes/projects.js';
import eventRoutes    from './routes/events.js';
import documentRoutes from './routes/documents.js';
import supportRoutes  from './routes/support.js';
import publicRoutes   from './routes/public.js';
import adminRoutes    from './routes/admin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR    = path.join(__dirname, '..', 'dist');
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

const app = express();

// ── CORS ──────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
}));

// ── Body parsers ──────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Static: uploaded files ────────────────────────────────────────
app.use('/uploads', express.static(UPLOADS_DIR));

// ── API routes ────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/artists',   artistRoutes);
app.use('/api/projects',  projectRoutes);
app.use('/api/events',    eventRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/support',   supportRoutes);
app.use('/api/public',    publicRoutes);
app.use('/api/admin',     adminRoutes);

// ── Health check ─────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/api/health/db', async (_req, res) => {
  try {
    const [pingRows] = await db.query('SELECT 1 AS ping');
    const [tableRows] = await db.query(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() ORDER BY TABLE_NAME"
    );
    return res.json({ ok: true, ping: pingRows[0].ping, tables: tableRows.map(t => t.TABLE_NAME) });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// ── Serve React SPA ──────────────────────────────────────────────
app.use(express.static(DIST_DIR));
app.get('*', (_req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

// ── Start ────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT || '3000');
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`SMARTx API running at http://${HOST}:${PORT}`);
});

export default app;
