import { useEffect, useState } from 'react';
import api, { errMsg } from '../api.js';
import { useAuth } from '../context/Auth.jsx';

export default function Assignments() {
  const { user } = useAuth(); const canEdit = user.role !== 'student';
  const [list, setList] = useState([]); const [f, setF] = useState({ title: '', description: '', dueDate: '' }); const [err, setErr] = useState('');
  const load = () => api.get('/assignments').then((r) => setList(r.data));
  useEffect(() => { load(); }, []);
  const add = async (e) => { e.preventDefault(); try { await api.post('/assignments', f); setF({ title: '', description: '', dueDate: '' }); load(); } catch (x) { setErr(errMsg(x)); } };
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Assignments</h1>
      {canEdit && (
        <form onSubmit={add} className="card grid gap-3 sm:grid-cols-2">
          <input className="input" placeholder="Title" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} required />
          <input className="input" type="date" value={f.dueDate} onChange={(e) => setF({ ...f, dueDate: e.target.value })} required />
          <textarea className="input sm:col-span-2" rows={3} placeholder="Instructions for students" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
          <button className="btn sm:col-span-2 sm:w-fit">Post assignment</button>{err && <p className="text-sm text-red-600">{err}</p>}
        </form>
      )}
      {!list.length && <p className="text-slate-500">{canEdit ? 'Post your first assignment above.' : 'No assignments yet. Check back later.'}</p>}
      {list.map((a) => (
        <div key={a.id} className="card flex justify-between gap-4"><div><div className="font-semibold">{a.title}</div><p className="text-sm text-slate-600 mt-1">{a.description}</p><p className="text-xs text-slate-500 mt-2">By {a.teacher?.name} · Due {a.dueDate}</p></div>
          {canEdit && <button className="btn-ghost h-fit" onClick={async () => { await api.delete(`/assignments/${a.id}`); load(); }}>Delete</button>}</div>
      ))}
    </div>
  );
}
