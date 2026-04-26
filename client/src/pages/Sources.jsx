import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { sourcesApi } from '../api';
import Header from '../components/Header';
import { StatusBadge, MineralTag } from '../components/Badges';
import FilterBar from '../components/FilterBar';
import Modal from '../components/Modal';
import { Input, Textarea, Select, FormGrid, FormSection } from '../components/FormField';
import { PageLoader } from '../components/LoadingSpinner';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';

const MINERALS = ['Gold', 'Silver', 'Copper', 'Lithium', 'Cobalt', 'Nickel', 'Iron Ore', 'Zinc', 'Uranium', 'Platinum', 'Manganese', 'Tin'];
const COUNTRIES = ['Australia', 'Canada', 'Chile', 'Peru', 'South Africa', 'DRC', 'Ghana', 'Zambia', 'Kazakhstan', 'Brazil', 'Mexico', 'USA', 'China', 'Russia', 'Other'];

const EMPTY_FORM = {
  name: '', country: '', region: '', lat: '', lng: '',
  mineral_type: '', capacity_per_month: '', unit: 'tonnes',
  grade: '', grade_unit: 'g/t',
  contact_name: '', contact_email: '', contact_phone: '', contact_company: '',
  notes: '', status: 'active',
};

function SourceForm({ initial = EMPTY_FORM, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({
      ...form,
      lat: form.lat ? parseFloat(form.lat) : null,
      lng: form.lng ? parseFloat(form.lng) : null,
      capacity_per_month: form.capacity_per_month ? parseFloat(form.capacity_per_month) : null,
      grade: form.grade ? parseFloat(form.grade) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormSection title="Basic Info">
        <FormGrid>
          <Input label="Source Name" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Atacama Gold Fields" />
          <Select label="Status" value={form.status} onChange={e => set('status', e.target.value)}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </Select>
        </FormGrid>
        <FormGrid>
          <Select label="Country" value={form.country} onChange={e => set('country', e.target.value)}>
            <option value="">Select country...</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Input label="Region" value={form.region} onChange={e => set('region', e.target.value)} placeholder="e.g. Atacama Desert" />
        </FormGrid>
        <FormGrid>
          <Input label="Latitude" type="number" step="any" value={form.lat} onChange={e => set('lat', e.target.value)} placeholder="-23.65" />
          <Input label="Longitude" type="number" step="any" value={form.lng} onChange={e => set('lng', e.target.value)} placeholder="-68.32" />
        </FormGrid>
      </FormSection>

      <FormSection title="Mineral & Capacity">
        <FormGrid>
          <Select label="Mineral Type" value={form.mineral_type} onChange={e => set('mineral_type', e.target.value)}>
            <option value="">Select mineral...</option>
            {MINERALS.map(m => <option key={m} value={m}>{m}</option>)}
          </Select>
          <Select label="Unit" value={form.unit} onChange={e => set('unit', e.target.value)}>
            <option value="tonnes">Tonnes</option>
            <option value="oz">Troy oz</option>
            <option value="kg">Kg</option>
          </Select>
        </FormGrid>
        <FormGrid>
          <Input label="Capacity / Month" type="number" step="any" value={form.capacity_per_month} onChange={e => set('capacity_per_month', e.target.value)} placeholder="1200" />
          <FormGrid cols={2}>
            <Input label="Grade" type="number" step="any" value={form.grade} onChange={e => set('grade', e.target.value)} placeholder="4.2" />
            <Select label="Grade Unit" value={form.grade_unit} onChange={e => set('grade_unit', e.target.value)}>
              <option value="g/t">g/t</option>
              <option value="%">%</option>
              <option value="%Fe">%Fe</option>
              <option value="ppm">ppm</option>
              <option value="%Cu">%Cu</option>
            </Select>
          </FormGrid>
        </FormGrid>
      </FormSection>

      <FormSection title="Contact">
        <FormGrid>
          <Input label="Contact Name" value={form.contact_name} onChange={e => set('contact_name', e.target.value)} />
          <Input label="Company" value={form.contact_company} onChange={e => set('contact_company', e.target.value)} />
        </FormGrid>
        <FormGrid>
          <Input label="Email" type="email" value={form.contact_email} onChange={e => set('contact_email', e.target.value)} />
          <Input label="Phone" value={form.contact_phone} onChange={e => set('contact_phone', e.target.value)} />
        </FormGrid>
      </FormSection>

      <FormSection>
        <Textarea label="Notes" value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} />
      </FormSection>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={saving || !form.name.trim()} className="btn-primary">
          {saving ? 'Saving…' : 'Save Source'}
        </button>
      </div>
    </form>
  );
}

export function SourcesList() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ mineral: '', status: '', country: '' });
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const load = useCallback(() => {
    const params = {};
    if (filters.mineral) params.mineral = filters.mineral;
    if (filters.status) params.status = filters.status;
    if (filters.country) params.country = filters.country;
    if (search) params.search = search;
    sourcesApi.list(params).then(setSources).finally(() => setLoading(false));
  }, [filters, search]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (data) => {
    setSaving(true);
    try {
      await sourcesApi.create(data);
      toast('Source created successfully');
      setShowForm(false);
      load();
    } catch (e) {
      toast(e.message, 'error');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex flex-col h-full"><Header title="Sources" /><PageLoader /></div>;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Mining Sources"
        actions={<button onClick={() => setShowForm(true)} className="btn-primary text-sm py-1.5">+ Add Source</button>}
      />
      <FilterBar
        filters={[
          { name: 'mineral', label: 'All Minerals', options: MINERALS.map(m => ({ value: m, label: m })) },
          { name: 'status', label: 'All Statuses', options: [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }, { value: 'pending', label: 'Pending' }] },
          { name: 'country', label: 'All Countries', options: COUNTRIES.map(c => ({ value: c, label: c })) },
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
              <th className="table-header">Name</th>
              <th className="table-header">Country</th>
              <th className="table-header">Mineral</th>
              <th className="table-header font-mono">Capacity/Mo</th>
              <th className="table-header font-mono">Grade</th>
              <th className="table-header">Contact</th>
              <th className="table-header">Status</th>
              <th className="table-header">Added</th>
            </tr>
          </thead>
          <tbody>
            {sources.length === 0 && (
              <tr><td colSpan={8} className="text-center text-slate-500 py-12">No sources found</td></tr>
            )}
            {sources.map(s => (
              <tr key={s.id} className="table-row" onClick={() => navigate(`/sources/${s.id}`)}>
                <td className="table-cell font-medium text-white">{s.name}</td>
                <td className="table-cell text-slate-400">{s.country}{s.region ? `, ${s.region}` : ''}</td>
                <td className="table-cell">{s.mineral_type && <MineralTag mineral={s.mineral_type} />}</td>
                <td className="table-cell font-mono text-slate-300">
                  {s.capacity_per_month ? `${s.capacity_per_month.toLocaleString()} ${s.unit}` : '—'}
                </td>
                <td className="table-cell font-mono text-slate-300">
                  {s.grade ? `${s.grade} ${s.grade_unit}` : '—'}
                </td>
                <td className="table-cell">
                  <div className="text-slate-300">{s.contact_name || '—'}</div>
                  <div className="text-xs text-slate-500">{s.contact_company}</div>
                </td>
                <td className="table-cell"><StatusBadge status={s.status} /></td>
                <td className="table-cell text-xs text-slate-500">
                  {s.created_by_name && <div>{s.created_by_name}</div>}
                  <div>{new Date(s.created_at).toLocaleDateString()}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Add Mining Source">
        <SourceForm onSave={handleCreate} onCancel={() => setShowForm(false)} saving={saving} />
      </Modal>
    </div>
  );
}

export function SourceDetail() {
  const { id } = useParams();
  const [source, setSource] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  useEffect(() => {
    sourcesApi.get(id).then(setSource).catch(() => navigate('/sources'));
  }, [id]);

  const handleUpdate = async (data) => {
    setSaving(true);
    try {
      const updated = await sourcesApi.update(id, data);
      setSource(updated);
      setEditing(false);
      toast('Source updated');
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this source? This cannot be undone.')) return;
    try {
      await sourcesApi.delete(id);
      toast('Source deleted');
      navigate('/sources');
    } catch (e) { toast(e.message, 'error'); }
  };

  if (!source) return <PageLoader />;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title={source.name}
        actions={
          <div className="flex gap-2">
            <button onClick={() => navigate('/sources')} className="btn-secondary text-sm py-1.5">← Back</button>
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
                <h2 className="font-sora font-bold text-white text-xl">{source.name}</h2>
                <p className="text-slate-400 text-sm mt-1">{[source.region, source.country].filter(Boolean).join(', ')}</p>
              </div>
              <div className="flex gap-2">
                {source.mineral_type && <MineralTag mineral={source.mineral_type} />}
                <StatusBadge status={source.status} />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Capacity/Month', value: source.capacity_per_month ? `${source.capacity_per_month.toLocaleString()} ${source.unit}` : '—' },
                { label: 'Grade', value: source.grade ? `${source.grade} ${source.grade_unit}` : '—' },
                { label: 'Coordinates', value: source.lat && source.lng ? `${source.lat}, ${source.lng}` : '—' },
                { label: 'Added By', value: source.created_by_name || '—' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="label">{label}</div>
                  <div className="font-mono text-sm text-slate-200">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#D4860B] mb-4">Contact Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Name', value: source.contact_name },
                { label: 'Company', value: source.contact_company },
                { label: 'Email', value: source.contact_email },
                { label: 'Phone', value: source.contact_phone },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="label">{label}</div>
                  <div className="text-sm text-slate-200">{value || '—'}</div>
                </div>
              ))}
            </div>
          </div>

          {source.notes && (
            <div className="card">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#D4860B] mb-2">Notes</h3>
              <p className="text-sm text-slate-300 whitespace-pre-wrap">{source.notes}</p>
            </div>
          )}
        </div>
      </div>

      <Modal open={editing} onClose={() => setEditing(false)} title="Edit Source">
        <SourceForm
          initial={{ ...EMPTY_FORM, ...source }}
          onSave={handleUpdate}
          onCancel={() => setEditing(false)}
          saving={saving}
        />
      </Modal>
    </div>
  );
}
