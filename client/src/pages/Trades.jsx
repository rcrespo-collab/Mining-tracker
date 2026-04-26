import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tradesApi, buyersApi, sourcesApi } from '../api';
import Header from '../components/Header';
import { StatusBadge, MineralTag } from '../components/Badges';
import FilterBar from '../components/FilterBar';
import Modal from '../components/Modal';
import { Input, Textarea, Select, FormGrid, FormSection } from '../components/FormField';
import { PageLoader } from '../components/LoadingSpinner';
import { useToast } from '../components/Toast';

const MINERALS = ['Gold', 'Silver', 'Copper', 'Lithium', 'Cobalt', 'Nickel', 'Iron Ore', 'Zinc', 'Uranium', 'Platinum', 'Manganese', 'Tin'];
const STATUSES = ['open', 'sourcing', 'matched', 'closed'];

const EMPTY_FORM = {
  buyer_id: '', mineral_type: '', requested_volume: '', unit: 'tonnes',
  target_price: '', currency: 'USD', matched_source_id: '', status: 'open', notes: '',
};

const STATUS_PIPELINE = ['open', 'sourcing', 'matched', 'closed'];
const STATUS_LABELS = { open: 'Open', sourcing: 'Sourcing', matched: 'Matched', closed: 'Closed' };

function TradeForm({ initial = EMPTY_FORM, buyers, sources, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.buyer_id || !form.mineral_type) return;
    onSave({
      ...form,
      requested_volume: form.requested_volume ? parseFloat(form.requested_volume) : null,
      target_price: form.target_price ? parseFloat(form.target_price) : null,
      matched_source_id: form.matched_source_id || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormSection title="Request Details">
        <FormGrid>
          <Select label="Buyer" required value={form.buyer_id} onChange={e => set('buyer_id', e.target.value)}>
            <option value="">Select buyer...</option>
            {buyers.map(b => <option key={b.id} value={b.id}>{b.company_name}</option>)}
          </Select>
          <Select label="Mineral Type" required value={form.mineral_type} onChange={e => set('mineral_type', e.target.value)}>
            <option value="">Select mineral...</option>
            {MINERALS.map(m => <option key={m} value={m}>{m}</option>)}
          </Select>
        </FormGrid>
        <FormGrid>
          <Input label="Requested Volume" type="number" step="any" value={form.requested_volume} onChange={e => set('requested_volume', e.target.value)} />
          <Select label="Unit" value={form.unit} onChange={e => set('unit', e.target.value)}>
            <option value="tonnes">Tonnes</option>
            <option value="oz">Troy oz</option>
            <option value="kg">Kg</option>
          </Select>
        </FormGrid>
        <FormGrid>
          <Input label="Target Price" type="number" step="any" value={form.target_price} onChange={e => set('target_price', e.target.value)} placeholder="per unit" />
          <Select label="Currency" value={form.currency} onChange={e => set('currency', e.target.value)}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="AUD">AUD</option>
            <option value="GBP">GBP</option>
          </Select>
        </FormGrid>
      </FormSection>

      <FormSection title="Status & Matching">
        <FormGrid>
          <Select label="Status" value={form.status} onChange={e => set('status', e.target.value)}>
            {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </Select>
          <Select label="Matched Source" value={form.matched_source_id} onChange={e => set('matched_source_id', e.target.value)}>
            <option value="">None</option>
            {sources.filter(s => s.status === 'active').map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.mineral_type})</option>
            ))}
          </Select>
        </FormGrid>
        <Textarea label="Notes" value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} />
      </FormSection>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={saving || !form.buyer_id || !form.mineral_type} className="btn-primary">
          {saving ? 'Saving…' : 'Save Trade'}
        </button>
      </div>
    </form>
  );
}

export function TradesList() {
  const [trades, setTrades] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', mineral: '' });
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const load = useCallback(() => {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.mineral) params.mineral = filters.mineral;
    Promise.all([
      tradesApi.list(params),
      buyersApi.list(),
      sourcesApi.list(),
    ]).then(([t, b, s]) => { setTrades(t); setBuyers(b); setSources(s); }).finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (data) => {
    setSaving(true);
    try {
      await tradesApi.create(data);
      toast('Trade request created');
      setShowForm(false);
      load();
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex flex-col h-full"><Header title="Trade Requests" /><PageLoader /></div>;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Trade Requests"
        actions={<button onClick={() => setShowForm(true)} className="btn-primary text-sm py-1.5">+ New Trade</button>}
      />
      <FilterBar
        filters={[
          { name: 'status', label: 'All Statuses', options: STATUSES.map(s => ({ value: s, label: STATUS_LABELS[s] })) },
          { name: 'mineral', label: 'All Minerals', options: MINERALS.map(m => ({ value: m, label: m })) },
        ]}
        values={filters}
        onChange={(k, v) => setFilters(f => ({ ...f, [k]: v }))}
      />
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-[#0D1018] border-b border-[#2E3349]">
            <tr>
              <th className="table-header">Buyer</th>
              <th className="table-header">Mineral</th>
              <th className="table-header font-mono">Volume</th>
              <th className="table-header font-mono">Target Price</th>
              <th className="table-header">Status</th>
              <th className="table-header">Matched Source</th>
              <th className="table-header">Date</th>
            </tr>
          </thead>
          <tbody>
            {trades.length === 0 && (
              <tr><td colSpan={7} className="text-center text-slate-500 py-12">No trade requests found</td></tr>
            )}
            {trades.map(t => (
              <tr key={t.id} className="table-row" onClick={() => navigate(`/trades/${t.id}`)}>
                <td className="table-cell font-medium text-white">{t.buyer_name || '—'}</td>
                <td className="table-cell">{t.mineral_type && <MineralTag mineral={t.mineral_type} />}</td>
                <td className="table-cell font-mono text-slate-300">
                  {t.requested_volume ? `${t.requested_volume.toLocaleString()} ${t.unit}` : '—'}
                </td>
                <td className="table-cell font-mono text-slate-300">
                  {t.target_price ? `${t.currency} ${t.target_price.toLocaleString()}` : '—'}
                </td>
                <td className="table-cell"><StatusBadge status={t.status} /></td>
                <td className="table-cell text-slate-400">{t.matched_source_name || '—'}</td>
                <td className="table-cell text-xs text-slate-500">{new Date(t.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title="New Trade Request">
        <TradeForm buyers={buyers} sources={sources} onSave={handleCreate} onCancel={() => setShowForm(false)} saving={saving} />
      </Modal>
    </div>
  );
}

export function TradeDetail() {
  const { id } = useParams();
  const [trade, setTrade] = useState(null);
  const [buyers, setBuyers] = useState([]);
  const [sources, setSources] = useState([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    Promise.all([tradesApi.get(id), buyersApi.list(), sourcesApi.list()])
      .then(([t, b, s]) => { setTrade(t); setBuyers(b); setSources(s); })
      .catch(() => navigate('/trades'));
  }, [id]);

  const handleUpdate = async (data) => {
    setSaving(true);
    try {
      const updated = await tradesApi.update(id, data);
      setTrade(updated);
      setEditing(false);
      toast('Trade updated');
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  const updateStatus = async (status) => {
    try {
      const updated = await tradesApi.update(id, { status });
      setTrade(updated);
      toast(`Status updated to ${status}`);
    } catch (e) { toast(e.message, 'error'); }
  };

  if (!trade) return <PageLoader />;

  const currentStep = STATUS_PIPELINE.indexOf(trade.status);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Trade Request"
        actions={
          <div className="flex gap-2">
            <button onClick={() => navigate('/trades')} className="btn-secondary text-sm py-1.5">← Back</button>
            <button onClick={() => setEditing(true)} className="btn-primary text-sm py-1.5">Edit</button>
          </div>
        }
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Pipeline */}
          <div className="card">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#D4860B] mb-4">Pipeline Status</h3>
            <div className="flex items-center gap-0">
              {STATUS_PIPELINE.map((s, i) => (
                <React.Fragment key={s}>
                  <button
                    onClick={() => updateStatus(s)}
                    className={`flex-1 py-2 text-xs font-semibold text-center rounded transition-all ${
                      i <= currentStep
                        ? 'bg-[#D4860B] text-white'
                        : 'bg-[#0F1117] text-slate-500 hover:bg-[#21253A]'
                    } ${i === 0 ? 'rounded-r-none' : i === STATUS_PIPELINE.length - 1 ? 'rounded-l-none' : 'rounded-none'}`}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                  {i < STATUS_PIPELINE.length - 1 && (
                    <div className={`w-px h-8 ${i < currentStep ? 'bg-[#D4860B]' : 'bg-[#2E3349]'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-sora font-bold text-white text-xl">{trade.buyer_name}</h2>
                <p className="text-slate-400 text-sm mt-1">Trade Request</p>
              </div>
              <div className="flex gap-2">
                {trade.mineral_type && <MineralTag mineral={trade.mineral_type} />}
                <StatusBadge status={trade.status} />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Volume', value: trade.requested_volume ? `${trade.requested_volume.toLocaleString()} ${trade.unit}` : '—', mono: true },
                { label: 'Target Price', value: trade.target_price ? `${trade.currency} ${trade.target_price.toLocaleString()}` : '—', mono: true },
                { label: 'Matched Source', value: trade.matched_source_name || 'None' },
                { label: 'Created By', value: trade.created_by_name || '—' },
              ].map(({ label, value, mono }) => (
                <div key={label}>
                  <div className="label">{label}</div>
                  <div className={`text-sm text-slate-200 ${mono ? 'font-mono' : ''}`}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {trade.matched_source_name && (
            <div className="card border-[#D4860B]/20">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#D4860B] mb-3">Matched Source</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><div className="label">Source</div><div className="text-sm text-slate-200">{trade.matched_source_name}</div></div>
                <div><div className="label">Source Contact</div><div className="text-sm text-slate-200">{trade.source_contact || '—'}</div></div>
              </div>
            </div>
          )}

          {trade.notes && (
            <div className="card">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#D4860B] mb-2">Notes</h3>
              <p className="text-sm text-slate-300 whitespace-pre-wrap">{trade.notes}</p>
            </div>
          )}
        </div>
      </div>

      <Modal open={editing} onClose={() => setEditing(false)} title="Edit Trade Request">
        <TradeForm
          initial={{ ...EMPTY_FORM, ...trade, matched_source_id: trade.matched_source_id || '' }}
          buyers={buyers}
          sources={sources}
          onSave={handleUpdate}
          onCancel={() => setEditing(false)}
          saving={saving}
        />
      </Modal>
    </div>
  );
}
