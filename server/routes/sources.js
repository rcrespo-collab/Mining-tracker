const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

function logActivity(userId, entityType, entityId, action, changes) {
  db.prepare('INSERT INTO activity_log (id, user_id, entity_type, entity_id, action, changes) VALUES (?, ?, ?, ?, ?, ?)')
    .run(uuidv4(), userId, entityType, entityId, action, JSON.stringify(changes));
}

router.get('/', requireAuth, (req, res) => {
  const { mineral, status, country, search } = req.query;
  let query = `SELECT s.*, u.name as created_by_name FROM mining_sources s LEFT JOIN users u ON s.created_by = u.id WHERE 1=1`;
  const params = [];

  if (mineral) { query += ' AND s.mineral_type = ?'; params.push(mineral); }
  if (status) { query += ' AND s.status = ?'; params.push(status); }
  if (country) { query += ' AND s.country = ?'; params.push(country); }
  if (search) { query += ' AND (s.name LIKE ? OR s.contact_company LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

  query += ' ORDER BY s.created_at DESC';
  res.json(db.prepare(query).all(...params));
});

router.post('/', requireAuth, (req, res) => {
  const id = uuidv4();
  const { name, country, region, lat, lng, mineral_type, capacity_per_month, unit, grade, grade_unit,
    contact_name, contact_email, contact_phone, contact_company, notes, status = 'active' } = req.body;

  if (!name) return res.status(400).json({ error: 'Name is required' });

  db.prepare(`INSERT INTO mining_sources (id, name, country, region, lat, lng, mineral_type, capacity_per_month, unit, grade, grade_unit, contact_name, contact_email, contact_phone, contact_company, notes, status, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(id, name, country, region, lat, lng, mineral_type, capacity_per_month, unit, grade, grade_unit,
      contact_name, contact_email, contact_phone, contact_company, notes, status, req.user.id);

  logActivity(req.user.id, 'mining_source', id, 'create', req.body);
  res.status(201).json(db.prepare('SELECT * FROM mining_sources WHERE id = ?').get(id));
});

router.get('/:id', requireAuth, (req, res) => {
  const source = db.prepare('SELECT s.*, u.name as created_by_name FROM mining_sources s LEFT JOIN users u ON s.created_by = u.id WHERE s.id = ?').get(req.params.id);
  if (!source) return res.status(404).json({ error: 'Source not found' });
  res.json(source);
});

router.put('/:id', requireAuth, (req, res) => {
  const source = db.prepare('SELECT * FROM mining_sources WHERE id = ?').get(req.params.id);
  if (!source) return res.status(404).json({ error: 'Source not found' });

  const { name, country, region, lat, lng, mineral_type, capacity_per_month, unit, grade, grade_unit,
    contact_name, contact_email, contact_phone, contact_company, notes, status } = req.body;

  const changes = {};
  const fields = { name, country, region, lat, lng, mineral_type, capacity_per_month, unit, grade, grade_unit, contact_name, contact_email, contact_phone, contact_company, notes, status };
  for (const [k, v] of Object.entries(fields)) {
    if (v !== undefined && v !== source[k]) changes[k] = { from: source[k], to: v };
  }

  db.prepare(`UPDATE mining_sources SET name=?, country=?, region=?, lat=?, lng=?, mineral_type=?, capacity_per_month=?, unit=?, grade=?, grade_unit=?, contact_name=?, contact_email=?, contact_phone=?, contact_company=?, notes=?, status=?, updated_at=datetime('now') WHERE id=?`)
    .run(name ?? source.name, country ?? source.country, region ?? source.region, lat ?? source.lat, lng ?? source.lng,
      mineral_type ?? source.mineral_type, capacity_per_month ?? source.capacity_per_month, unit ?? source.unit,
      grade ?? source.grade, grade_unit ?? source.grade_unit, contact_name ?? source.contact_name,
      contact_email ?? source.contact_email, contact_phone ?? source.contact_phone, contact_company ?? source.contact_company,
      notes ?? source.notes, status ?? source.status, req.params.id);

  if (Object.keys(changes).length) logActivity(req.user.id, 'mining_source', req.params.id, 'update', changes);
  res.json(db.prepare('SELECT * FROM mining_sources WHERE id = ?').get(req.params.id));
});

router.delete('/:id', requireAdmin, (req, res) => {
  const source = db.prepare('SELECT id FROM mining_sources WHERE id = ?').get(req.params.id);
  if (!source) return res.status(404).json({ error: 'Source not found' });
  db.prepare('DELETE FROM mining_sources WHERE id = ?').run(req.params.id);
  logActivity(req.user.id, 'mining_source', req.params.id, 'delete', {});
  res.json({ success: true });
});

module.exports = router;
