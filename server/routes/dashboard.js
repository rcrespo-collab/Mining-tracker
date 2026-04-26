const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', requireAuth, (req, res) => {
  const activeSources = db.prepare("SELECT COUNT(*) as count FROM mining_sources WHERE status = 'active'").get().count;
  const openTrades = db.prepare("SELECT COUNT(*) as count FROM trade_requests WHERE status IN ('open', 'sourcing')").get().count;
  const activeProjects = db.prepare("SELECT COUNT(*) as count FROM investment_projects WHERE status = 'active'").get().count;
  const activeBuyers = db.prepare("SELECT COUNT(*) as count FROM buyers WHERE status = 'active'").get().count;
  const totalTrades = db.prepare("SELECT COUNT(*) as count FROM trade_requests").get().count;
  const matchedTrades = db.prepare("SELECT COUNT(*) as count FROM trade_requests WHERE status = 'matched'").get().count;

  const recentActivity = db.prepare(`
    SELECT a.*, u.name as user_name
    FROM activity_log a
    LEFT JOIN users u ON a.user_id = u.id
    ORDER BY a.created_at DESC
    LIMIT 20
  `).all();

  res.json({
    stats: { activeSources, openTrades, activeProjects, activeBuyers, totalTrades, matchedTrades },
    recentActivity,
  });
});

module.exports = router;
