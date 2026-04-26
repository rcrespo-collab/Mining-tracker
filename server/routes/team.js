const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAdmin, (req, res) => {
  const users = db.prepare('SELECT id, name, email, role, active, created_at FROM users ORDER BY created_at DESC').all();
  res.json(users);
});

router.post('/', requireAdmin, (req, res) => {
  const { name, email, password, role = 'member' } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password required' });

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const id = uuidv4();
  const password_hash = bcrypt.hashSync(password, 10);
  db.prepare('INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)').run(id, name, email, password_hash, role);
  res.status(201).json({ id, name, email, role, active: 1 });
});

router.put('/:id', requireAdmin, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { name, email, role, active, password } = req.body;
  const password_hash = password ? bcrypt.hashSync(password, 10) : user.password_hash;

  db.prepare('UPDATE users SET name=?, email=?, role=?, active=?, password_hash=? WHERE id=?')
    .run(name ?? user.name, email ?? user.email, role ?? user.role,
      active !== undefined ? (active ? 1 : 0) : user.active, password_hash, req.params.id);

  res.json(db.prepare('SELECT id, name, email, role, active, created_at FROM users WHERE id = ?').get(req.params.id));
});

module.exports = router;
