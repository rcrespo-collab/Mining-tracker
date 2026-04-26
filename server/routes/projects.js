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
  const { mineral, country, status, stage, has_jorc } = req.query;
  let query = `SELECT p.*, u.name as created_by_name FROM investment_projects p LEFT JOIN users u ON p.created_by = u.id WHERE 1=1`;
  const params = [];

  if (country) { query += ' AND p.country = ?'; params.push(country); }
  if (status) { query += ' AND p.status = ?'; params.push(status); }
  if (stage) { query += ' AND p.stage = ?'; params.push(stage); }
  if (has_jorc !== undefined) { query += ' AND p.has_jorc = ?'; params.push(has_jorc === 'true' ? 1 : 0); }

  query += ' ORDER BY p.created_at DESC';
  let projects = db.prepare(query).all(...params);

  if (mineral) {
    projects = projects.filter(p => {
      try { return JSON.parse(p.mineral_types || '[]').includes(mineral); } catch { return false; }
    });
  }

  res.json(projects);
});

router.post('/', requireAuth, (req, res) => {
  const id = uuidv4();
  const { project_name, country, region, lat, lng, mineral_types = [], size_hectares,
    investment_needed, currency = 'USD', ownership_available_pct,
    has_historical_data = false, has_jorc = false, jorc_resource_tonnes, jorc_grade, jorc_grade_unit,
    stage = 'exploration', status = 'active', description } = req.body;

  if (!project_name) return res.status(400).json({ error: 'Project name is required' });

  db.prepare(`INSERT INTO investment_projects (id, project_name, country, region, lat, lng, mineral_types, size_hectares, investment_needed, currency, ownership_available_pct, has_historical_data, has_jorc, jorc_resource_tonnes, jorc_grade, jorc_grade_unit, stage, status, description, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(id, project_name, country, region, lat, lng, JSON.stringify(mineral_types),
      size_hectares, investment_needed, currency, ownership_available_pct,
      has_historical_data ? 1 : 0, has_jorc ? 1 : 0, jorc_resource_tonnes, jorc_grade, jorc_grade_unit,
      stage, status, description, req.user.id);

  logActivity(req.user.id, 'investment_project', id, 'create', req.body);
  res.status(201).json(db.prepare('SELECT * FROM investment_projects WHERE id = ?').get(id));
});

router.get('/:id', requireAuth, (req, res) => {
  const project = db.prepare('SELECT p.*, u.name as created_by_name FROM investment_projects p LEFT JOIN users u ON p.created_by = u.id WHERE p.id = ?').get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

router.put('/:id', requireAuth, (req, res) => {
  const project = db.prepare('SELECT * FROM investment_projects WHERE id = ?').get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  const { project_name, country, region, lat, lng, mineral_types, size_hectares,
    investment_needed, currency, ownership_available_pct,
    has_historical_data, has_jorc, jorc_resource_tonnes, jorc_grade, jorc_grade_unit,
    stage, status, description } = req.body;

  const mineralJson = mineral_types !== undefined ? JSON.stringify(mineral_types) : project.mineral_types;

  db.prepare(`UPDATE investment_projects SET project_name=?, country=?, region=?, lat=?, lng=?, mineral_types=?, size_hectares=?, investment_needed=?, currency=?, ownership_available_pct=?, has_historical_data=?, has_jorc=?, jorc_resource_tonnes=?, jorc_grade=?, jorc_grade_unit=?, stage=?, status=?, description=?, updated_at=datetime('now') WHERE id=?`)
    .run(project_name ?? project.project_name, country ?? project.country, region ?? project.region,
      lat ?? project.lat, lng ?? project.lng, mineralJson,
      size_hectares ?? project.size_hectares, investment_needed ?? project.investment_needed,
      currency ?? project.currency, ownership_available_pct ?? project.ownership_available_pct,
      has_historical_data !== undefined ? (has_historical_data ? 1 : 0) : project.has_historical_data,
      has_jorc !== undefined ? (has_jorc ? 1 : 0) : project.has_jorc,
      jorc_resource_tonnes ?? project.jorc_resource_tonnes, jorc_grade ?? project.jorc_grade,
      jorc_grade_unit ?? project.jorc_grade_unit, stage ?? project.stage,
      status ?? project.status, description ?? project.description, req.params.id);

  logActivity(req.user.id, 'investment_project', req.params.id, 'update', req.body);
  res.json(db.prepare('SELECT * FROM investment_projects WHERE id = ?').get(req.params.id));
});

router.delete('/:id', requireAdmin, (req, res) => {
  const project = db.prepare('SELECT id FROM investment_projects WHERE id = ?').get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  db.prepare('DELETE FROM project_documents WHERE project_id = ?').run(req.params.id);
  db.prepare('DELETE FROM investment_projects WHERE id = ?').run(req.params.id);
  logActivity(req.user.id, 'investment_project', req.params.id, 'delete', {});
  res.json({ success: true });
});

module.exports = router;
