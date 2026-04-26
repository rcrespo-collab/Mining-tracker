import React, { useEffect, useState } from 'react';
import { teamApi } from '../api';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { Input, Select, FormGrid, FormSection } from '../components/FormField';
import { PageLoader } from '../components/LoadingSpinner';
import { useToast } from '../components/Toast';

const EMPTY_FORM = { name: '', email: '', password: '', role: 'member' };

function UserForm({ initial = EMPTY_FORM, onSave, onCancel, saving, isEdit }) {
  const [form, setForm] = useState(initial);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || (!isEdit && !form.password)) return;
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormSection>
        <FormGrid>
          <Input label="Full Name" required value={form.name} onChange={e => set('name', e.target.value)} />
          <Input label="Email" type="email" required value={form.email} onChange={e => set('email', e.target.value)} />
        </FormGrid>
        <FormGrid>
          <Input
            label={isEdit ? 'New Password (leave blank to keep)' : 'Password'}
            type="password"
            required={!isEdit}
            value={form.password}
            onChange={e => set('password', e.target.value)}
            placeholder={isEdit ? 'Leave blank to keep current' : ''}
          />
          <Select label="Role" value={form.role} onChange={e => set('role', e.target.value)}>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </Select>
        </FormGrid>
      </FormSection>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving…' : isEdit ? 'Update User' : 'Create User'}
        </button>
      </div>
    </form>
  );
}

export default function Team() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const load = () => teamApi.list().then(setUsers).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleCreate = async (data) => {
    setSaving(true);
    try {
      await teamApi.create(data);
      toast('User created');
      setShowCreate(false);
      load();
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  const handleUpdate = async (data) => {
    setSaving(true);
    try {
      const payload = { name: data.name, email: data.email, role: data.role };
      if (data.password) payload.password = data.password;
      await teamApi.update(editUser.id, payload);
      toast('User updated');
      setEditUser(null);
      load();
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  const toggleActive = async (user) => {
    try {
      await teamApi.update(user.id, { active: !user.active });
      toast(`User ${user.active ? 'deactivated' : 'activated'}`);
      load();
    } catch (e) { toast(e.message, 'error'); }
  };

  if (loading) return <div className="flex flex-col h-full"><Header title="Team" /><PageLoader /></div>;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Team Management"
        actions={<button onClick={() => setShowCreate(true)} className="btn-primary text-sm py-1.5">+ Add User</button>}
      />
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-[#0D1018] border-b border-[#2E3349]">
            <tr>
              <th className="table-header">Name</th>
              <th className="table-header">Email</th>
              <th className="table-header">Role</th>
              <th className="table-header">Status</th>
              <th className="table-header">Joined</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="table-row">
                <td className="table-cell">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#D4860B]/20 border border-[#D4860B]/40 flex items-center justify-center text-[#F0A830] text-xs font-bold flex-shrink-0">
                      {u.name?.[0] || '?'}
                    </div>
                    <span className="font-medium text-white">{u.name}</span>
                  </div>
                </td>
                <td className="table-cell text-slate-400">{u.email}</td>
                <td className="table-cell">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${u.role === 'admin' ? 'bg-amber-900/50 text-amber-300 border border-amber-700' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="table-cell">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${u.active ? 'bg-green-900/50 text-green-300 border-green-800' : 'bg-red-900/50 text-red-300 border-red-800'}`}>
                    {u.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="table-cell text-xs text-slate-500">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="table-cell">
                  <div className="flex gap-2">
                    <button onClick={() => setEditUser(u)} className="text-xs text-[#D4860B] hover:text-[#F0A830] transition-colors">Edit</button>
                    <button onClick={() => toggleActive(u)} className={`text-xs transition-colors ${u.active ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}`}>
                      {u.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Add Team Member">
        <UserForm onSave={handleCreate} onCancel={() => setShowCreate(false)} saving={saving} />
      </Modal>

      <Modal open={!!editUser} onClose={() => setEditUser(null)} title="Edit User">
        {editUser && (
          <UserForm
            initial={{ name: editUser.name, email: editUser.email, password: '', role: editUser.role }}
            onSave={handleUpdate}
            onCancel={() => setEditUser(null)}
            saving={saving}
            isEdit
          />
        )}
      </Modal>
    </div>
  );
}
