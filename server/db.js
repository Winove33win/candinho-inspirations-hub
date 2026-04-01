import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host:               process.env.DB_HOST     || 'localhost',
  port:               parseInt(process.env.DB_PORT || '3306'),
  user:               process.env.DB_USER     || 'smartx',
  password:           process.env.DB_PASS     || '',
  database:           process.env.DB_NAME     || 'smartx',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  charset:            'utf8mb4',
  timezone:           'Z',
});

// Test connection at startup
pool.query('SELECT 1')
  .then(() => console.log(`[DB] Connected to ${process.env.DB_NAME || 'smartx'} at ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}`))
  .catch(err => console.error('[DB] Connection failed:', err.message));

export default pool;
