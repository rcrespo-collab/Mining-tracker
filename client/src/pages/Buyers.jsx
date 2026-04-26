import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { buyersApi } from '../api';
import Header from '../components/Header';
import { StatusBadge, MineralTag } from '../components/Badges';
import FilterBar from '../components/FilterBar';
import Modal from '../components/Modal';
import { Input, Textarea, Select, FormGrid, FormSection } from '../components/FormField';
import MineralSelect from '../components/MineralSelect';
import { PageLoader } from '../components/LoadingSpinner';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';

const COUNTRIES = ['Australia', 'Canada', 'Chile', 'Peru', 'South Africa', 'Japan', 'South Korea', 'China', 'Germany', 'France', 'UK', 'USA', 'India', 'Brazil', 'Other'];
const MINERALS = ['Gold', 'Silver', 'Copper', 'Lithium', 'Cobalt', 'Nickel', 'Iron Ore', 'Zinc', 'Uranium', 'Platinum', 'Manganese', 'Tin'];

const EMPTY_FORM = {
  company_name: '', contact_name: '', contact_email: '', contact_phone: '',
  country: '', minerals_of_interest: [], preferred_volume: '', preferred_unit: 'tonnes',
  notes: '', status: 'active',
};

function BuyerForm({ initial = EMPTY_FORM, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.company_name.trim()) return;
    onSave({
      ...form,
      preferred_volume: form.preferred_volume ? parseFloat(form.preferred_volume) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormSection title="Company">
        <FormGrid>
          <Input label="Company Name" required value={form.company_name} onChange={e => set('company_name', e.target.value)} />
          <Select label="Status" value={form.status} onChange={e => set('status', e.target.value)}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </FormGrid>
        <FormGrid>
          <Select label="Country" value={form.country} onChange={e => set('country', e.target.value)}>
            <option value="">Select country...</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
        </FormGrid>
      </FormSection>

      <FormSection title="Contact">
        <FormGrid>
          <Input label="Contact Name" value={form.contact_name} onChange={e => set('contact_name', e.target.value)} />
          <Input label="Email" type="email" value={form.contact_email} onChange={e => set('contact_email', e.target.value)} />
        </FormGrid>
        <Input label="Phone" value={form.contact_phone} onChange={e => set('contact_phone', e.target.value)} />
      </FormSection>

      <FormSection title="Buying Preferences">
        <MineralSelect value={form.minerals_of_interest} onChange={v => set('minerals_of_interest', v)} />
        <FormGrid>
          <Input label="Preferred Volume" type="number" step="any" value={form.preferred_volume} onChange={e => set('preferred_volume', e.target.value)} />
          <Select label="Unit" value={form.preferred_unit} onChange={e => set('preferred_unit', e.target.value)}>
            <option value="tonnes">Tonnes</option>
            <option value="oz">Troy oz</option>
            <option value="kg">Kg</option>
          </Select>
        </FormGrid>
        <Textarea label="Notes" value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} />
      </FormSection>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={saving || !form.company_name.trim()} className="btn-primary">
          {saving ? 'Saving…' : 'Save Buyer'}
        </button>
      </div>
    </form>
  );
}

export function BuyersList() {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ mineral: '', country: '', status: '' });
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const load = useCallback(() => {
    const params = {};
    if (filters.mineral) params.mineral = filters.mineral;
    if (filters.country) params.country = filters.country;
    if (filters.status) params.status = filters.status;
    if (search) params.search = search;
    buyersApi.list(params).then(setBuyers).finally(() => setLoading(false));
  }, [filters, search]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (data) => {
    setSaving(true);
    try {
      await buyersApi.create(data);
      toast('Buyer created');
      setShowForm(false);
      load();
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex flex-col h-full"><Header title="Buyers" /><PageLoader /></div>;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Buyers"
        actions={<button onClick={() => setShowForm(true)} className="btn-primary text-sm py-1.5">+ Add Buyer</button>}
      />
      <FilterBar
        filters={[
          { name: 'mineral', label: 'All Minerals', options: MINERALS.map(m => ({ value: m, label: m })) },
          { name: 'country', label: 'All Countries', options: COUNTRIES.map(c => ({ value: c, label: c })) },
          { name: 'status', label: 'All Statuses', options: [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }] },
        ]}
        values={filters}
        onChange={(k, v) => setFilters(f => ({ ...f, [k]: v }))}
        onSearch={setSearch}
        searchValue={search}
      />
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-[#0D1018] border-b border-[#2E3349]">
            <tr>
              <th className="table-header">Company</th>
              <th className="table-header">Contact</th>
              <th className="table-header">Country</th>
              <th className="table-header">Minerals of Interest</th>
              <th className="table-header">Preferred Volume</th>
              <th className="table-header">Status</th>
              <th className="table-header">Added</th>
            </tr>
          </thead>
          <tbody>
            {buyers.length === 0 && (
              <tr><td colSpan={7} className="text-center text-slate-500 py-12">No buyers found</td></tr>
            )}
            {buyers.map(b => {
              let minerals = [];
              try { minerals = JSON.parse(b.minerals_of_interest || '[]'); } catch {}
              return (
                <tr key={b.id} className="table-row" onClick={() => navigate(`/buyers/${b.id}`)}>
                  <td className="table-cell font-medium text-white">{b.company_name}</td>
                  <td className="table-cell">
                    <div className="text-slate-300">{b.contact_name || '—'}</div>
                    <div className="text-xs text-slate-500">{b.contact_email}</div>
                  </td>
                  <td className="table-cell text-slate-400">{b.country || '—'}</td>
                  <td className="table-cell">
                    <div className="flex flex-wrap gap-1">
                      {minerals.slice(0, 3).map(m => <MineralTag key={m} mineral={m} />)}
                      {minerals.length > 3 && <span className="text-xs text-slate-500">+{minerals.length - 3}</span>}
                    </div>
                  </td>
                  <td className="table-cell font-mono text-slate-300">
                    {b.preferred_volume ? `${b.preferred_volume.toLocaleString()} ${b.preferred_unit}` : '—'}
                  </td>
                  <td className="table-cell"><StatusBadge status={b.status} /></td>
                  <td className="table-cell text-xs text-slate-500">
                    {b.created_by_name && <div>{b.created_by_name}</div>}
                    <div>{new Date(b.created_at).toLocaleDateString()}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Add Buyer">
        <BuyerForm onSave={handleCreate} onCancel={() => setShowForm(false)} saving={saving} />
      </Modal>
    </div>
  );
}

export function BuyerDetail() {
  const { id } = useParams();
  const [buyer, setBuyer] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  useEffect(() => {
    buyersApi.get(id).then(setBuyer).catch(() => navigate('/buyers'));
  }, [id]);

  const handleUpdate = async (data) => {
    setSaving(true);
    try {
      const updated = await buyersApi.update(id, data);
      setBuyer(updated);
      setEditing(false);
      toast('Buyer updated');
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this buyer?')) return;
    try {
      await buyersApi.delete(id);
      toast('Buyer deleted');
      navigate('/buyers');
    } catch (e) { toast(e.message, 'error'); }
  };

  if (!buyer) return <PageLoader />;

  let minerals = [];
  try { minerals = JSON.parse(buyer.minerals_of_interest || '[]'); } catch {}

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title={buyer.company_name}
        actions={
          <div className="flex gap-2">
            <button onClick={() => navigate('/buyers')} className="btn-secondary text-sm py-1.5">← Back</button>
            <button onClick={() => setEditing(true)} className="btn-primary text-sm py-1.5">Edit</button>
            {user?.role === 'admin' && (
              <button onClick={handleDelete} className="btn-danger text-sm py-1.5">Delete</button>
            )}
          </div>
        }
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-sora font-bold text-white text-xl">{buyer.company_name}</h2>
                <p className="text-slate-400 text-sm mt-1">{buyer.country}</p>
              </div>
              <StatusBadge status={buyer.status} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div><div className="label">Contact</div><div className="text-sm text-slate-200">{buyer.contact_name || '—'}</div></div>
              <div><div className="label">Email</div><div className="text-sm text-slate-200">{buyer.contact_email || '—'}</div></div>
              <div><div className="label">Phone</div><div className="text-sm text-slate-200">{buyer.contact_phone || '—'}</div></div>
              <div>
                <div className="label">Preferred Volume</div>
                <div className="font-mono text-sm text-slate-200">
                  {buyer.preferred_volume ? `${buyer.preferred_volume.toLocaleString()} ${buyer.preferred_unit}` : '—'}
                </div>
              </div>
              <div><div className="label">Added By</div><div className="text-sm text-slate-200">{buyer.created_by_name || '—'}</div></div>
              <div><div className="label">Added On</div><div className="text-sm text-slate-200">{new Date(buyer.created_at).toLocaleDateString()}</div></div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#D4860B] mb-3">Minerals of Interest</h3>
            <div className="flex flex-wrap gap-2">
              {minerals.length === 0 ? <span className="text-slate-500 text-sm">None specified</span> :
                minerals.map(m => <MineralTag key={m} mineral={m} />)}
            </div>
          </div>

          {buyer.notes && (
            <div className="card">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#D4860B] mb-2">Notes</h3>
              <p className="text-sm text-slate-300 whitespace-pre-wrap">{buyer.notes}</p>
            </div>
          )}
        </div>
      </div>

      <Modal open={editing} onClose={() => setEditing(false)} title="Edit Buyer">
        <BuyerForm
          initial={{ ...EMPTY_FORM, ...buyer, minerals_of_interest: minerals }}
          onSave={handleUpdate}
          onCancel={() => setEditing(false)}
          saving={saving}
        />
      </Modal>
    </div>
  );
}
