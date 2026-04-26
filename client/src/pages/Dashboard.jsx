import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../api';
import Header from '../components/Header';
import { PageLoader } from '../components/LoadingSpinner';

const ENTITY_LABELS = {
  mining_source: 'Source',
  buyer: 'Buyer',
  trade_request: 'Trade',
  investment_project: 'Project',
};

const ACTION_COLORS = {
  create: 'text-green-400',
  update: 'text-blue-400',
  delete: 'text-red-400',
};

function StatCard({ label, value, sub, accent, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="card text-left w-full hover:border-[#D4860B]/40 transition-all"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-3xl font-mono font-bold" style={{ color: accent || '#F0A830' }}>{value}</div>
          <div className="text-sm font-medium text-slate-300 mt-1">{label}</div>
          {sub && <div className="text-xs text-slate-500 mt-0.5">{sub}</div>}
        </div>
        <span className="text-2xl opacity-30">{icon}</span>
      </div>
    </button>
  );
}

function ActivityItem({ item }) {
  const label = ENTITY_LABELS[item.entity_type] || item.entity_type;
  const actionColor = ACTION_COLORS[item.action] || 'text-slate-400';
  const date = new Date(item.created_at).toLocaleString();

  let detail = '';
  try {
    const changes = JSON.parse(item.changes || '{}');
    if (item.action === 'create') {
      const name = changes.name || changes.project_name || changes.company_name || changes.mineral_type || '';
      if (name) detail = `"${name}"`;
    } else if (item.action === 'update') {
      const keys = Object.keys(changes);
      if (keys.length) detail = `updated ${keys.slice(0, 2).join(', ')}`;
    }
  } catch {}

  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-[#2E3349] last:border-0">
      <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
        item.action === 'create' ? 'bg-green-500' :
        item.action === 'update' ? 'bg-blue-500' : 'bg-red-500'
      }`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-300">
          <span className="font-medium text-slate-100">{item.user_name || 'Unknown'}</span>
          {' '}
          <span className={actionColor}>{item.action}d</span>
          {' '}
          <span className="text-slate-400">{label}</span>
          {detail && <span className="text-slate-500"> {detail}</span>}
        </p>
        <p className="text-xs text-slate-600 mt-0.5">{date}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    dashboardApi.stats().then(setData).catch(console.error);
  }, []);

  if (!data) return (
    <div className="flex flex-col h-full">
      <Header title="Dashboard" />
      <PageLoader />
    </div>
  );

  const { stats, recentActivity } = data;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Dashboard"
        actions={
          <div className="flex gap-2">
            <button onClick={() => navigate('/sources/new')} className="btn-secondary text-xs py-1.5 px-3">+ Source</button>
            <button onClick={() => navigate('/buyers/new')} className="btn-secondary text-xs py-1.5 px-3">+ Buyer</button>
            <button onClick={() => navigate('/trades/new')} className="btn-secondary text-xs py-1.5 px-3">+ Trade</button>
            <button onClick={() => navigate('/projects/new')} className="btn-primary text-xs py-1.5 px-3">+ Project</button>
          </div>
        }
      />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Active Sources" value={stats.activeSources} icon="⛰" onClick={() => navigate('/sources')} />
          <StatCard label="Open Trades" value={stats.openTrades} icon="↔" accent="#60A5FA" sub={`${stats.totalTrades} total`} onClick={() => navigate('/trades')} />
          <StatCard label="Active Projects" value={stats.activeProjects} icon="◉" accent="#A78BFA" onClick={() => navigate('/projects')} />
          <StatCard label="Active Buyers" value={stats.activeBuyers} icon="🏢" accent="#34D399" sub={`${stats.matchedTrades} matched trades`} onClick={() => navigate('/buyers')} />
        </div>

        {/* Activity Feed */}
        <div className="card">
          <h2 className="font-sora font-semibold text-white mb-4">Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <p className="text-slate-500 text-sm">No activity yet.</p>
          ) : (
            <div className="divide-y divide-[#2E3349]">
              {recentActivity.map(item => <ActivityItem key={item.id} item={item} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
