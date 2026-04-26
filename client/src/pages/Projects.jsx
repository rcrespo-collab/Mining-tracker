import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { projectsApi, documentsApi } from '../api';
import Header from '../components/Header';
import { StatusBadge, StageBadge, MineralTag, JORCBadge } from '../components/Badges';
import FilterBar from '../components/FilterBar';
import Modal from '../components/Modal';
import { Input, Textarea, Select, FormGrid, FormSection, Checkbox } from '../components/FormField';
import MineralSelect from '../components/MineralSelect';
import OwnershipArc from '../components/OwnershipArc';
import DropZone from '../components/DropZone';
import { PageLoader } from '../components/LoadingSpinner';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';

const COUNTRIES = ['Australia', 'Canada', 'Chile', 'Peru', 'South Africa', 'DRC', 'Ghana', 'Zambia', 'Kazakhstan', 'Brazil', 'Mexico', 'USA', 'China', 'Russia', 'Other'];

const EMPTY_FORM = {
  project_name: '', country: '', region: '', lat: '', lng: '',
  mineral_types: [], size_hectares: '', investment_needed: '', currency: 'USD',
  ownership_available_pct: '', has_historical_data: false, has_jorc: false,
  jorc_resource_tonnes: '', jorc_grade: '', jorc_grade_unit: 'g/t',
  stage: 'exploration', status: 'active', description: '',
};

function formatCurrency(val, currency) {
  if (!val) return '—';
  if (val >= 1e9) return `${currency} ${(val / 1e9).toFixed(1)}B`;
  if (val >= 1e6) return `${currency} ${(val / 1e6).toFixed(1)}M`;
  if (val >= 1e3) return `${currency} ${(val / 1e3).toFixed(0)}K`;
  return `${currency} ${val.toLocaleString()}`;
}

function ProjectForm({ initial = EMPTY_FORM, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.project_name.trim()) return;
    onSave({
      ...form,
      lat: form.lat ? parseFloat(form.lat) : null,
      lng: form.lng ? parseFloat(form.lng) : null,
      size_hectares: form.size_hectares ? parseFloat(form.size_hectares) : null,
      investment_needed: form.investment_needed ? parseFloat(form.investment_needed) : null,
      ownership_available_pct: form.ownership_available_pct ? parseFloat(form.ownership_available_pct) : null,
      jorc_resource_tonnes: form.jorc_resource_tonnes ? parseFloat(form.jorc_resource_tonnes) : null,
      jorc_grade: form.jorc_grade ? parseFloat(form.jorc_grade) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormSection title="Project Info">
        <FormGrid>
          <Input label="Project Name" required value={form.project_name} onChange={e => set('project_name', e.target.value)} />
          <Select label="Status" value={form.status} onChange={e => set('status', e.target.value)}>
            <option value="active">Active</option>
            <option value="on hold">On Hold</option>
            <option value="closed">Closed</option>
          </Select>
        </FormGrid>
        <FormGrid>
          <Select label="Country" value={form.country} onChange={e => set('country', e.target.value)}>
            <option value="">Select country...</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Input label="Region" value={form.region} onChange={e => set('region', e.target.value)} />
        </FormGrid>
        <FormGrid>
          <Input label="Latitude" type="number" step="any" value={form.lat} onChange={e => set('lat', e.target.value)} />
          <Input label="Longitude" type="number" step="any" value={form.lng} onChange={e => set('lng', e.target.value)} />
        </FormGrid>
        <MineralSelect value={form.mineral_types} onChange={v => set('mineral_types', v)} label="Mineral Types" />
      </FormSection>

      <FormSection title="Investment Details">
        <FormGrid>
          <Input label="Size (hectares)" type="number" step="any" value={form.size_hectares} onChange={e => set('size_hectares', e.target.value)} />
          <Input label="Ownership Available %" type="number" min="0" max="100" step="0.1" value={form.ownership_available_pct} onChange={e => set('ownership_available_pct', e.target.value)} />
        </FormGrid>
        <FormGrid>
          <Input label="Investment Needed" type="number" step="any" value={form.investment_needed} onChange={e => set('investment_needed', e.target.value)} />
          <Select label="Currency" value={form.currency} onChange={e => set('currency', e.target.value)}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="AUD">AUD</option>
            <option value="CAD">CAD</option>
            <option value="GBP">GBP</option>
          </Select>
        </FormGrid>
        <Select label="Stage" value={form.stage} onChange={e => set('stage', e.target.value)}>
          <option value="exploration">Exploration</option>
          <option value="development">Development</option>
          <option value="producing">Producing</option>
        </Select>
        <div className="flex gap-6">
          <Checkbox label="Has Historical Data" checked={form.has_historical_data} onChange={e => set('has_historical_data', e.target.checked)} />
          <Checkbox label="Has JORC Resource" checked={form.has_jorc} onChange={e => set('has_jorc', e.target.checked)} />
        </div>
      </FormSection>

      {form.has_jorc && (
        <FormSection title="JORC Resource">
          <FormGrid>
            <Input label="Resource Tonnes" type="number" step="any" value={form.jorc_resource_tonnes} onChange={e => set('jorc_resource_tonnes', e.target.value)} />
            <Input label="Grade" type="number" step="any" value={form.jorc_grade} onChange={e => set('jorc_grade', e.target.value)} />
          </FormGrid>
          <Select label="Grade Unit" value={form.jorc_grade_unit} onChange={e => set('jorc_grade_unit', e.target.value)}>
            <option value="g/t">g/t</option>
            <option value="%">%</option>
            <option value="%Cu">%Cu</option>
            <option value="%Fe">%Fe</option>
            <option value="ppm">ppm</option>
          </Select>
        </FormSection>
      )}

      <FormSection>
        <Textarea label="Description" value={form.description} onChange={e => set('description', e.target.value)} rows={4} />
      </FormSection>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={saving || !form.project_name.trim()} className="btn-primary">
          {saving ? 'Saving…' : 'Save Project'}
        </button>
      </div>
    </form>
  );
}

function ProjectCard({ project, onClick }) {
  let minerals = [];
  try { minerals = JSON.parse(project.mineral_types || '[]'); } catch {}

  return (
    <button onClick={onClick} className="card text-left w-full hover:border-[#D4860B]/40">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-sora font-semibold text-white text-base truncate">{project.project_name}</h3>
          <p className="text-slate-400 text-xs mt-0.5">{[project.region, project.country].filter(Boolean).join(', ')}</p>
        </div>
        <div className="flex flex-col items-end gap-1 ml-2">
          <JORCBadge hasJorc={project.has_jorc} />
          <StageBadge stage={project.stage} />
        </div>
      </div>
      <div className="flex flex-wrap gap-1 mb-3">
        {minerals.map(m => <MineralTag key={m} mineral={m} />)}
      </div>
      <div className="grid grid-cols-3 gap-2 text-center border-t border-[#2E3349] pt-3">
        <div>
          <div className="font-mono text-[#D4860B] font-bold text-sm">{project.size_hectares ? project.size_hectares.toLocaleString() : '—'}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wide">Hectares</div>
        </div>
        <div>
          <div className="font-mono text-[#D4860B] font-bold text-sm">{formatCurrency(project.investment_needed, project.currency)}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wide">Investment</div>
        </div>
        <div>
          <div className="font-mono text-[#D4860B] font-bold text-sm">{project.ownership_available_pct ? `${project.ownership_available_pct}%` : '—'}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wide">Avail. Equity</div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <StatusBadge status={project.status} />
        <span className="text-xs text-slate-600">{project.created_by_name}</span>
      </div>
    </button>
  );
}

function DocumentRow({ doc, projectId, onDeleted }) {
  const toast = useToast();
  const { user } = useAuth();

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirm('Delete this document?')) return;
    try {
      await documentsApi.delete(projectId, doc.id);
      toast('Document deleted');
      onDeleted(doc.id);
    } catch (e) { toast(e.message, 'error'); }
  };

  const sizeKb = (doc.file_size / 1024).toFixed(0);
  const sizeMb = (doc.file_size / 1024 / 1024).toFixed(1);

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-[#2E3349] last:border-0 group">
      <div className="text-slate-500 text-lg">📄</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-slate-200 truncate">{doc.original_name}</div>
        <div className="text-xs text-slate-500">
          {doc.file_size > 1024 * 1024 ? `${sizeMb} MB` : `${sizeKb} KB`} · {doc.uploaded_by_name} · {new Date(doc.uploaded_at).toLocaleDateString()}
        </div>
      </div>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <a
          href={documentsApi.downloadUrl(doc.id)}
          download
          onClick={e => e.stopPropagation()}
          className="text-xs text-[#D4860B] hover:text-[#F0A830] font-medium"
        >
          Download
        </a>
        {user?.role === 'admin' && (
          <button onClick={handleDelete} className="text-xs text-red-400 hover:text-red-300 font-medium">Delete</button>
        )}
      </div>
    </div>
  );
}

export function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ mineral: '', country: '', status: '', stage: '', has_jorc: '' });
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const load = useCallback(() => {
    const params = {};
    if (filters.country) params.country = filters.country;
    if (filters.status) params.status = filters.status;
    if (filters.stage) params.stage = filters.stage;
    if (filters.has_jorc) params.has_jorc = filters.has_jorc;
    if (filters.mineral) params.mineral = filters.mineral;
    projectsApi.list(params).then(setProjects).finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (data) => {
    setSaving(true);
    try {
      await projectsApi.create(data);
      toast('Project created');
      setShowForm(false);
      load();
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex flex-col h-full"><Header title="Projects" /><PageLoader /></div>;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Investment Projects"
        actions={<button onClick={() => setShowForm(true)} className="btn-primary text-sm py-1.5">+ Add Project</button>}
      />
      <FilterBar
        filters={[
          { name: 'mineral', label: 'All Minerals', options: ['Gold','Silver','Copper','Lithium','Cobalt','Nickel','Iron Ore','Zinc'].map(m => ({ value: m, label: m })) },
          { name: 'country', label: 'All Countries', options: COUNTRIES.map(c => ({ value: c, label: c })) },
          { name: 'status', label: 'All Statuses', options: [{ value: 'active', label: 'Active' }, { value: 'on hold', label: 'On Hold' }, { value: 'closed', label: 'Closed' }] },
          { name: 'stage', label: 'All Stages', options: [{ value: 'exploration', label: 'Exploration' }, { value: 'development', label: 'Development' }, { value: 'producing', label: 'Producing' }] },
          { name: 'has_jorc', label: 'JORC?', options: [{ value: 'true', label: 'JORC Yes' }, { value: 'false', label: 'No JORC' }] },
        ]}
        values={filters}
        onChange={(k, v) => setFilters(f => ({ ...f, [k]: v }))}
      />
      <div className="flex-1 overflow-y-auto p-6">
        {projects.length === 0 ? (
          <div className="text-center text-slate-500 py-16">No projects found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {projects.map(p => (
              <ProjectCard key={p.id} project={p} onClick={() => navigate(`/projects/${p.id}`)} />
            ))}
          </div>
        )}
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Add Investment Project" maxWidth="max-w-3xl">
        <ProjectForm onSave={handleCreate} onCancel={() => setShowForm(false)} saving={saving} />
      </Modal>
    </div>
  );
}

export function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [docs, setDocs] = useState([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  useEffect(() => {
    projectsApi.get(id).then(setProject).catch(() => navigate('/projects'));
    documentsApi.list(id).then(setDocs);
  }, [id]);

  const handleUpdate = async (data) => {
    setSaving(true);
    try {
      const updated = await projectsApi.update(id, data);
      setProject(updated);
      setEditing(false);
      toast('Project updated');
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this project and all its documents?')) return;
    try {
      await projectsApi.delete(id);
      toast('Project deleted');
      navigate('/projects');
    } catch (e) { toast(e.message, 'error'); }
  };

  const handleUpload = async (file) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const doc = await documentsApi.upload(id, fd);
      setDocs(d => [doc, ...d]);
      toast('Document uploaded');
    } catch (e) { toast(e.message, 'error'); }
    finally { setUploading(false); }
  };

  if (!project) return <PageLoader />;

  let minerals = [];
  try { minerals = JSON.parse(project.mineral_types || '[]'); } catch {}

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title={project.project_name}
        actions={
          <div className="flex gap-2">
            <button onClick={() => navigate('/projects')} className="btn-secondary text-sm py-1.5">← Back</button>
            <button onClick={() => setEditing(true)} className="btn-primary text-sm py-1.5">Edit</button>
            {user?.role === 'admin' && (
              <button onClick={handleDelete} className="btn-danger text-sm py-1.5">Delete</button>
            )}
          </div>
        }
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Hero card */}
          <div className="card">
            <div className="flex items-start gap-6">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h2 className="font-sora font-bold text-white text-2xl">{project.project_name}</h2>
                    <p className="text-slate-400 mt-1">{[project.region, project.country].filter(Boolean).join(', ')}</p>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <JORCBadge hasJorc={project.has_jorc} />
                    <StageBadge stage={project.stage} />
                    <StatusBadge status={project.status} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {minerals.map(m => <MineralTag key={m} mineral={m} />)}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Size', value: project.size_hectares ? `${project.size_hectares.toLocaleString()} ha` : '—', mono: true },
                    { label: 'Investment Needed', value: formatCurrency(project.investment_needed, project.currency), mono: true },
                    { label: 'Historical Data', value: project.has_historical_data ? 'Yes' : 'No' },
                    { label: 'Coordinates', value: project.lat && project.lng ? `${project.lat}, ${project.lng}` : '—', mono: true },
                  ].map(({ label, value, mono }) => (
                    <div key={label}>
                      <div className="label">{label}</div>
                      <div className={`text-sm text-slate-200 ${mono ? 'font-mono' : ''}`}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
              {project.ownership_available_pct && (
                <OwnershipArc pct={project.ownership_available_pct} />
              )}
            </div>
          </div>

          {/* JORC */}
          {project.has_jorc && (
            <div className="card border-[#D4860B]/30">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#D4860B] mb-3">JORC Resource Estimate</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="label">Resource Tonnes</div>
                  <div className="font-mono text-white font-semibold text-lg">
                    {project.jorc_resource_tonnes ? project.jorc_resource_tonnes.toLocaleString() : '—'}
                  </div>
                </div>
                <div>
                  <div className="label">Grade</div>
                  <div className="font-mono text-white font-semibold text-lg">
                    {project.jorc_grade ? `${project.jorc_grade} ${project.jorc_grade_unit}` : '—'}
                  </div>
                </div>
                <div>
                  <div className="label">Status</div>
                  <div className="text-sm text-slate-200">Compliant JORC 2012</div>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {project.description && (
            <div className="card">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#D4860B] mb-2">Description</h3>
              <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{project.description}</p>
            </div>
          )}

          {/* Documents */}
          <div className="card">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#D4860B] mb-4">
              Documents ({docs.length})
            </h3>
            <DropZone
              onFile={handleUpload}
              label={uploading ? 'Uploading…' : 'Drop a document here or click to upload'}
              accept=".pdf,.xlsx,.xls,.doc,.docx,.jpg,.jpeg,.png,.csv"
            />
            {docs.length > 0 && (
              <div className="mt-4">
                {docs.map(doc => (
                  <DocumentRow key={doc.id} doc={doc} projectId={id} onDeleted={did => setDocs(d => d.filter(x => x.id !== did))} />
                ))}
              </div>
            )}
          </div>

          <div className="text-xs text-slate-600 text-right">
            Added by {project.created_by_name} · {new Date(project.created_at).toLocaleString()}
          </div>
        </div>
      </div>

      <Modal open={editing} onClose={() => setEditing(false)} title="Edit Project" maxWidth="max-w-3xl">
        <ProjectForm
          initial={{ ...EMPTY_FORM, ...project, mineral_types: minerals }}
          onSave={handleUpdate}
          onCancel={() => setEditing(false)}
          saving={saving}
        />
      </Modal>
    </div>
  );
}
