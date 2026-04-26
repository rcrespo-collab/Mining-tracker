const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function logActivity(userId, entityType, entityId, action, changes) {
  db.prepare('INSERT INTO activity_log (id, user_id, entity_type, entity_id, action, changes) VALUES (?, ?, ?, ?, ?, ?)')
    .run(uuidv4(), userId, entityType, entityId, action, JSON.stringify(changes));
}

router.get('/', requireAuth, (req, res) => {
  const { status, mineral, buyer_id } = req.query;
  let query = `
    SELECT t.*,
      b.company_name as buyer_name,
      s.name as matched_source_name,
      u.name as created_by_name
    FROM trade_requests t
    LEFT JOIN buyers b ON t.buyer_id = b.id
    LEFT JOIN mining_sources s ON t.matched_source_id = s.id
    LEFT JOIN users u ON t.created_by = u.id
    WHERE 1=1`;
  const params = [];

  if (status) { query += ' AND t.status = ?'; params.push(status); }
  if (mineral) { query += ' AND t.mineral_type = ?'; params.push(mineral); }
  if (buyer_id) { query += ' AND t.buyer_id = ?'; params.push(buyer_id); }

  query += ' ORDER BY t.created_at DESC';
  res.json(db.prepare(query).all(...params));
});

router.post('/', requireAuth, (req, res) => {
  const id = uuidv4();
  const { buyer_id, mineral_type, requested_volume, unit, target_price, currency = 'USD',
    matched_source_id, status = 'open', notes } = req.body;

  if (!buyer_id || !mineral_type) return res.status(400).json({ error: 'Buyer and mineral type required' });

  db.prepare(`INSERT INTO trade_requests (id, buyer_id, mineral_type, requested_volume, unit, target_price, currency, matched_source_id, status, notes, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(id, buyer_id, mineral_type, requested_volume, unit, target_price, currency,
      matched_source_id || null, status, notes, req.user.id);

  logActivity(req.user.id, 'trade_request', id, 'create', req.body);
  res.status(201).json(db.prepare(`
    SELECT t.*, b.company_name as buyer_name, s.name as matched_source_name
    FROM trade_requests t
    LEFT JOIN buyers b ON t.buyer_id = b.id
    LEFT JOIN mining_sources s ON t.matched_source_id = s.id
    WHERE t.id = ?`).get(id));
});

router.get('/:id', requireAuth, (req, res) => {
  const trade = db.prepare(`
    SELECT t.*,
      b.company_name as buyer_name, b.contact_name as buyer_contact,
      s.name as matched_source_name, s.contact_name as source_contact,
      u.name as created_by_name
    FROM trade_requests t
    LEFT JOIN buyers b ON t.buyer_id = b.id
    LEFT JOIN mining_sources s ON t.matched_source_id = s.id
    LEFT JOIN users u ON t.created_by = u.id
    WHERE t.id = ?`).get(req.params.id);
  if (!trade) return res.status(404).json({ error: 'Trade request not found' });
  res.json(trade);
});

router.put('/:id', requireAuth, (req, res) => {
  const trade = db.prepare('SELECT * FROM trade_requests WHERE id = ?').get(req.params.id);
  if (!trade) return res.status(404).json({ error: 'Trade request not found' });

  const { buyer_id, mineral_type, requested_volume, unit, target_price, currency,
    matched_source_id, status, notes } = req.body;

  const changes = {};
  const newVals = { buyer_id, mineral_type, requested_volume, unit, target_price, currency, matched_source_id, status, notes };
  for (const [k, v] of Object.entries(newVals)) {
    if (v !== undefined && String(v) !== String(trade[k])) changes[k] = { from: trade[k], to: v };
  }

  db.prepare(`UPDATE trade_requests SET buyer_id=?, mineral_type=?, requested_volume=?, unit=?, target_price=?, currency=?, matched_source_id=?, status=?, notes=?, updated_at=datetime('now') WHERE id=?`)
    .run(buyer_id ?? trade.buyer_id, mineral_type ?? trade.mineral_type, requested_volume ?? trade.requested_volume,
      unit ?? trade.unit, target_price ?? trade.target_price, currency ?? trade.currency,
      matched_source_id !== undefined ? (matched_source_id || null) : trade.matched_source_id,
      status ?? trade.status, notes ?? trade.notes, req.params.id);

  if (Object.keys(changes).length) logActivity(req.user.id, 'trade_request', req.params.id, 'update', changes);
  res.json(db.prepare(`
    SELECT t.*, b.company_name as buyer_name, s.name as matched_source_name
    FROM trade_requests t
    LEFT JOIN buyers b ON t.buyer_id = b.id
    LEFT JOIN mining_sources s ON t.matched_source_id = s.id
    WHERE t.id = ?`).get(req.params.id));
});

module.exports = router;
