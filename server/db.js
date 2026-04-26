const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'mining.db');
const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function migrate() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'member',
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS mining_sources (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      country TEXT,
      region TEXT,
      lat REAL,
      lng REAL,
      mineral_type TEXT,
      capacity_per_month REAL,
      unit TEXT,
      grade REAL,
      grade_unit TEXT,
      contact_name TEXT,
      contact_email TEXT,
      contact_phone TEXT,
      contact_company TEXT,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      created_by TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (created_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS buyers (
      id TEXT PRIMARY KEY,
      company_name TEXT NOT NULL,
      contact_name TEXT,
      contact_email TEXT,
      contact_phone TEXT,
      country TEXT,
      minerals_of_interest TEXT DEFAULT '[]',
      preferred_volume REAL,
      preferred_unit TEXT,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      created_by TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (created_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS trade_requests (
      id TEXT PRIMARY KEY,
      buyer_id TEXT,
      mineral_type TEXT,
      requested_volume REAL,
      unit TEXT,
      target_price REAL,
      currency TEXT DEFAULT 'USD',
      matched_source_id TEXT,
      status TEXT NOT NULL DEFAULT 'open',
      notes TEXT,
      created_by TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (buyer_id) REFERENCES buyers(id),
      FOREIGN KEY (matched_source_id) REFERENCES mining_sources(id),
      FOREIGN KEY (created_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS investment_projects (
      id TEXT PRIMARY KEY,
      project_name TEXT NOT NULL,
      country TEXT,
      region TEXT,
      lat REAL,
      lng REAL,
      mineral_types TEXT DEFAULT '[]',
      size_hectares REAL,
      investment_needed REAL,
      currency TEXT DEFAULT 'USD',
      ownership_available_pct REAL,
      has_historical_data INTEGER DEFAULT 0,
      has_jorc INTEGER DEFAULT 0,
      jorc_resource_tonnes REAL,
      jorc_grade REAL,
      jorc_grade_unit TEXT,
      stage TEXT DEFAULT 'exploration',
      status TEXT NOT NULL DEFAULT 'active',
      description TEXT,
      created_by TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (created_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS project_documents (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      file_type TEXT,
      file_size INTEGER,
      uploaded_by TEXT,
      uploaded_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (project_id) REFERENCES investment_projects(id),
      FOREIGN KEY (uploaded_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS activity_log (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      entity_type TEXT,
      entity_id TEXT,
      action TEXT,
      changes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);
}

function seed() {
  const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@miningapp.com');
  if (existingAdmin) return;

  const { v4: uuidv4 } = require('uuid');
  const adminId = uuidv4();
  const memberId = uuidv4();
  const adminHash = bcrypt.hashSync('Admin1234!', 10);
  const memberHash = bcrypt.hashSync('Member1234!', 10);

  db.prepare(`INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)`).run(
    adminId, 'Admin User', 'admin@miningapp.com', adminHash, 'admin'
  );
  db.prepare(`INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)`).run(
    memberId, 'Sarah Chen', 'sarah@miningapp.com', memberHash, 'member'
  );

  const src1 = uuidv4();
  const src2 = uuidv4();
  db.prepare(`INSERT INTO mining_sources (id, name, country, region, lat, lng, mineral_type, capacity_per_month, unit, grade, grade_unit, contact_name, contact_email, contact_phone, contact_company, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    src1, 'Atacama Gold Fields', 'Chile', 'Atacama Desert', -23.6509, -68.3198,
    'Gold', 1200, 'oz', 4.2, 'g/t',
    'Carlos Mendez', 'carlos@atacamagold.cl', '+56 9 8765 4321', 'Atacama Gold S.A.',
    'active', adminId
  );
  db.prepare(`INSERT INTO mining_sources (id, name, country, region, lat, lng, mineral_type, capacity_per_month, unit, grade, grade_unit, contact_name, contact_email, contact_phone, contact_company, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    src2, 'Pilbara Iron Corp', 'Australia', 'Pilbara Region', -21.1333, 119.7333,
    'Iron Ore', 85000, 'tonnes', 62.5, '%Fe',
    'James O\'Brien', 'james@pilbarairon.com.au', '+61 8 9182 3344', 'Pilbara Iron Corp Pty Ltd',
    'active', adminId
  );

  const buyer1 = uuidv4();
  const buyer2 = uuidv4();
  db.prepare(`INSERT INTO buyers (id, company_name, contact_name, contact_email, contact_phone, country, minerals_of_interest, preferred_volume, preferred_unit, notes, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    buyer1, 'Pacific Metals Group', 'Akira Tanaka', 'a.tanaka@pacificmetals.jp',
    '+81 3 5555 0101', 'Japan', JSON.stringify(['Gold', 'Copper', 'Silver']),
    500, 'oz', 'Long-term supply contracts preferred. Q1 delivery preferred.', 'active', adminId
  );
  db.prepare(`INSERT INTO buyers (id, company_name, contact_name, contact_email, contact_phone, country, minerals_of_interest, preferred_volume, preferred_unit, notes, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    buyer2, 'European Battery Solutions', 'Marie Dubois', 'marie.dubois@eubatterysol.eu',
    '+33 1 4400 5566', 'France', JSON.stringify(['Lithium', 'Cobalt', 'Nickel']),
    2000, 'tonnes', 'Battery-grade material required. Purity specs attached.', 'active', adminId
  );

  const proj1 = uuidv4();
  db.prepare(`INSERT INTO investment_projects (id, project_name, country, region, lat, lng, mineral_types, size_hectares, investment_needed, currency, ownership_available_pct, has_historical_data, has_jorc, jorc_resource_tonnes, jorc_grade, jorc_grade_unit, stage, status, description, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    proj1, 'Sierra Cobre Norte', 'Peru', 'Cajamarca Region', -7.1591, -78.5128,
    JSON.stringify(['Copper', 'Silver']),
    4500, 85000000, 'USD', 49,
    1, 1, 280000000, 0.68, '%Cu',
    'development', 'active',
    'A high-grade copper porphyry deposit in northern Peru with significant silver credits. Fully permitted for development phase. Road access, 3-phase power within 12km. Offtake discussions with two Asian smelters ongoing.',
    adminId
  );

  const trade1 = uuidv4();
  db.prepare(`INSERT INTO trade_requests (id, buyer_id, mineral_type, requested_volume, unit, target_price, currency, matched_source_id, status, notes, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    trade1, buyer1, 'Gold', 300, 'oz', 1950, 'USD', src1, 'matched',
    'Buyer confirmed interest. Source capacity confirmed. Awaiting final pricing sign-off.',
    adminId
  );

  // Seed some activity log entries
  const logEntries = [
    { id: uuidv4(), user_id: adminId, entity_type: 'mining_source', entity_id: src1, action: 'create', changes: JSON.stringify({ name: 'Atacama Gold Fields' }) },
    { id: uuidv4(), user_id: adminId, entity_type: 'mining_source', entity_id: src2, action: 'create', changes: JSON.stringify({ name: 'Pilbara Iron Corp' }) },
    { id: uuidv4(), user_id: adminId, entity_type: 'buyer', entity_id: buyer1, action: 'create', changes: JSON.stringify({ company_name: 'Pacific Metals Group' }) },
    { id: uuidv4(), user_id: adminId, entity_type: 'buyer', entity_id: buyer2, action: 'create', changes: JSON.stringify({ company_name: 'European Battery Solutions' }) },
    { id: uuidv4(), user_id: adminId, entity_type: 'investment_project', entity_id: proj1, action: 'create', changes: JSON.stringify({ project_name: 'Sierra Cobre Norte' }) },
    { id: uuidv4(), user_id: adminId, entity_type: 'trade_request', entity_id: trade1, action: 'create', changes: JSON.stringify({ mineral_type: 'Gold', status: 'matched' }) },
  ];
  const insertLog = db.prepare('INSERT INTO activity_log (id, user_id, entity_type, entity_id, action, changes) VALUES (?, ?, ?, ?, ?, ?)');
  for (const e of logEntries) insertLog.run(e.id, e.user_id, e.entity_type, e.entity_id, e.action, e.changes);
}

migrate();
seed();

module.exports = db;
