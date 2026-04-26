# Mining Tracker — Advisory & Trading Platform

A full-stack internal tool for a mining investment advisory and mineral trading firm.
Supports concurrent multi-user access with role-based permissions.

---

## Quick Start

### 1. Install all dependencies

```bash
npm run install:all
```

### 2. Start the development servers

```bash
npm run dev
```

This starts both the API server (port 3001) and the React frontend (port 5173) concurrently.

Open **http://localhost:5173** in your browser.

---

## Default Login Credentials

| Role   | Email               | Password     |
|--------|---------------------|--------------|
| Admin  | admin@miningapp.com | Admin1234!   |
| Member | sarah@miningapp.com | Member1234!  |

> Admins can delete records, manage team members, and access all sections.
> Members can create and edit records but cannot delete or manage team.

---

## Platform Sections

### Dashboard (`/`)
Summary cards showing live counts of active sources, open trades, active projects, and buyers.
Includes a real-time activity feed showing the last 20 actions across the platform, with quick-add buttons.

### Sources (`/sources`)
Track mineral supply sources — mines and producers you can contact for trading supply.
Each source has location data, capacity/month, grade, and full contact details.
Filter by mineral type, country, or status. Click a row to view/edit the full detail page.

### Buyers (`/buyers`)
Track companies and contacts looking to buy minerals.
Each buyer lists their minerals of interest (as color-coded tags), preferred volume, and contact info.
Filter by mineral, country, or status.

### Trade Requests (`/trades`)
Log of inbound buyer requests and the sourcing process.
Each trade moves through a pipeline: **Open → Sourcing → Matched → Closed**.
On the detail page you can link a matched source via dropdown and click pipeline stages to advance status.

### Projects (`/projects`) — Advisory
Investment-grade mining concessions being marketed to investors.
Displayed as a card grid with mineral tags, size, investment needed, equity %, JORC badge, and stage.
Detail page includes a JORC resource section and a drag-and-drop document upload area (PDF, Excel, images, up to 50MB each).

### Team (`/team`) — Admin only
Create new users with name, email, password, and role.
Toggle users active/inactive without deleting them.
Edit existing users including password resets.

---

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Backend  | Node.js + Express                       |
| Database | SQLite via `better-sqlite3` (file-based)|
| Auth     | JWT (7-day tokens)                      |
| Frontend | React 18 + Vite + Tailwind CSS 3        |
| Fonts    | Sora (headings), IBM Plex Mono (data)   |
| Files    | Local disk (`server/uploads/`)          |

---

## Project Structure

```
/
├── server/
│   ├── index.js           Express entry point
│   ├── db.js              SQLite schema + seed data
│   ├── middleware/
│   │   ├── auth.js        JWT middleware
│   │   └── upload.js      Multer file upload (50MB limit)
│   ├── routes/
│   │   ├── auth.js
│   │   ├── sources.js
│   │   ├── buyers.js
│   │   ├── trades.js
│   │   ├── projects.js
│   │   ├── documents.js
│   │   ├── dashboard.js
│   │   └── team.js
│   └── uploads/           Document storage (gitignored)
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/
│   │   ├── components/
│   │   ├── api/
│   │   └── context/
│   ├── tailwind.config.js
│   └── vite.config.js     Proxies /api → localhost:3001
└── package.json           Root with concurrently scripts
```

---

## Notes

- The SQLite database file is created automatically at `server/mining.db` on first run.
- Seed data (2 sources, 2 buyers, 1 project, 1 trade) is inserted only once on first run.
- Uploaded documents are stored in `server/uploads/` — back this directory up separately.
- JWT secret can be overridden via the `JWT_SECRET` environment variable.
