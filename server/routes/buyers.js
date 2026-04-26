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
  const { mineral, country, status, search } = req.query;
  let query = `SELECT b.*, u.name as created_by_name FROM buyers b LEFT JOIN users u ON b.created_by = u.id WHERE 1=1`;
  const params = [];

  if (country) { query += ' AND b.country = ?'; params.push(country); }
  if (status) { query += ' AND b.status = ?'; params.push(status); }
  if (search) { query += ' AND (b.company_name LIKE ? OR b.contact_name LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

  query += ' ORDER BY b.created_at DESC';
  let buyers = db.prepare(query).all(...params);

  if (mineral) {
    buyers = buyers.filter(b => {
      try { return JSON.parse(b.minerals_of_interest || '[]').includes(mineral); } catch { return false; }
    });
  }

  res.json(buyers);
});

router.post('/', requireAuth, (req, res) => {
  const id = uuidv4();
  const { company_name, contact_name, contact_email, contact_phone, country,
    minerals_of_interest = [], preferred_volume, preferred_unit, notes, status = 'active' } = req.body;

  if (!company_name) return res.status(400).json({ error: 'Company name is required' });

  db.prepare(`INSERT INTO buyers (id, company_name, contact_name, contact_email, contact_phone, country, minerals_of_interest, preferred_volume, preferred_unit, notes, status, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(id, company_name, contact_name, contact_email, contact_phone, country,
      JSON.stringify(minerals_of_interest), preferred_volume, preferred_unit, notes, status, req.user.id);

  logActivity(req.user.id, 'buyer', id, 'create', req.body);
  res.status(201).json(db.prepare('SELECT * FROM buyers WHERE id = ?').get(id));
});

router.get('/:id', requireAuth, (req, res) => {
  const buyer = db.prepare('SELECT b.*, u.name as created_by_name FROM buyers b LEFT JOIN users u ON b.created_by = u.id WHERE b.id = ?').get(req.params.id);
  if (!buyer) return res.status(404).json({ error: 'Buyer not found' });
  res.json(buyer);
});

router.put('/:id', requireAuth, (req, res) => {
  const buyer = db.prepare('SELECT * FROM buyers WHERE id = ?').get(req.params.id);
  if (!buyer) return res.status(404).json({ error: 'Buyer not found' });

  const { company_name, contact_name, contact_email, contact_phone, country,
    minerals_of_interest, preferred_volume, preferred_unit, notes, status } = req.body;

  const minJson = minerals_of_interest !== undefined ? JSON.stringify(minerals_of_interest) : buyer.minerals_of_interest;

  db.prepare(`UPDATE buyers SET company_name=?, contact_name=?, contact_email=?, contact_phone=?, country=?, minerals_of_interest=?, preferred_volume=?, preferred_unit=?, notes=?, status=?, updated_at=datetime('now') WHERE id=?`)
    .run(company_name ?? buyer.company_name, contact_name ?? buyer.contact_name, contact_email ?? buyer.contact_email,
      contact_phone ?? buyer.contact_phone, country ?? buyer.country, minJson,
      preferred_volume ?? buyer.preferred_volume, preferred_unit ?? buyer.preferred_unit,
      notes ?? buyer.notes, status ?? buyer.status, req.params.id);

  logActivity(req.user.id, 'buyer', req.params.id, 'update', req.body);
  res.json(db.prepare('SELECT * FROM buyers WHERE id = ?').get(req.params.id));
});

router.delete('/:id', requireAdmin, (req, res) => {
  const buyer = db.prepare('SELECT id FROM buyers WHERE id = ?').get(req.params.id);
  if (!buyer) return res.status(404).json({ error: 'Buyer not found' });
  db.prepare('DELETE FROM buyers WHERE id = ?').run(req.params.id);
  logActivity(req.user.id, 'buyer', req.params.id, 'delete', {});
  res.json({ success: true });
});

module.exports = router;
