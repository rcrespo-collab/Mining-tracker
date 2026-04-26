const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// POST /api/projects/:id/documents
router.post('/projects/:id/documents', requireAuth, upload.single('file'), (req, res) => {
  const project = db.prepare('SELECT id FROM investment_projects WHERE id = ?').get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const id = uuidv4();
  db.prepare('INSERT INTO project_documents (id, project_id, filename, original_name, file_type, file_size, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(id, req.params.id, req.file.filename, req.file.originalname, req.file.mimetype, req.file.size, req.user.id);

  res.status(201).json(db.prepare('SELECT d.*, u.name as uploaded_by_name FROM project_documents d LEFT JOIN users u ON d.uploaded_by = u.id WHERE d.id = ?').get(id));
});

// GET /api/projects/:id/documents
router.get('/projects/:id/documents', requireAuth, (req, res) => {
  const docs = db.prepare('SELECT d.*, u.name as uploaded_by_name FROM project_documents d LEFT JOIN users u ON d.uploaded_by = u.id WHERE d.project_id = ? ORDER BY d.uploaded_at DESC').all(req.params.id);
  res.json(docs);
});

// DELETE /api/projects/:id/documents/:docId
router.delete('/projects/:id/documents/:docId', requireAdmin, (req, res) => {
  const doc = db.prepare('SELECT * FROM project_documents WHERE id = ? AND project_id = ?').get(req.params.docId, req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  const filePath = path.join(__dirname, '../uploads', doc.filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  db.prepare('DELETE FROM project_documents WHERE id = ?').run(req.params.docId);
  res.json({ success: true });
});

// GET /api/documents/:docId/download
router.get('/documents/:docId/download', requireAuth, (req, res) => {
  const doc = db.prepare('SELECT * FROM project_documents WHERE id = ?').get(req.params.docId);
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  const filePath = path.join(__dirname, '../uploads', doc.filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found on disk' });

  res.setHeader('Content-Disposition', `attachment; filename="${doc.original_name}"`);
  res.setHeader('Content-Type', doc.file_type || 'application/octet-stream');
  res.sendFile(filePath);
});

module.exports = router;
