import { useEffect, useState } from 'react';
import api, { errMsg } from '../api.js';

export default function Plans() {
  const [list, setList] = useState([]); const [f, setF] = useState({ goal: '', days: 7, hours: 2 }); const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  const load = () => api.get('/plans').then((r) => setList(r.data));
  useEffect(() => { load(); }, []);
  const make = async (e) => { e.preventDefault(); setBusy(true); setErr(''); try { await api.post('/plans/generate', f); setF({ ...f, goal: '' }); load(); } catch (x) { setErr(errMsg(x)); } setBusy(false); };
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Study plans</h1>
      <form onSubmit={make} className="card grid gap-3 sm:grid-cols-[1fr_7rem_7rem_auto]">
        <input className="input" placeholder="Your goal, e.g. Pass calculus exam" value={f.goal} onChange={(e) => setF({ ...f, goal: e.target.value })} required />
        <input className="input" type="number" min="1" max="30" title="Days" value={f.days} onChange={(e) => setF({ ...f, days: e.target.value })} />
        <input className="input" type="number" min="1" max="12" title="Hours per day" value={f.hours} onChange={(e) => setF({ ...f, hours: e.target.value })} />
        <button className="btn" disabled={busy}>{busy ? 'Planning…' : 'Build plan'}</button>
      </form>
      <p className="text-xs text-slate-500 -mt-3">Fields: goal, number of days, hours per day.</p>
      {err && <p className="text-sm text-red-600">{err}</p>}
      {list.map((p) => (
        <div key={p.id} className="card">
          <div className="flex justify-between mb-3"><h2 className="font-bold">{p.goal}</h2><button className="btn-ghost" onClick={async () => { await api.delete(`/plans/${p.id}`); load(); }}>Delete</button></div>
          <div className="grid gap-3 md:grid-cols-2">{p.plan.map((d, i) => (
            <div key={i} className="rounded-lg bg-brand-soft p-3"><div className="flex justify-between text-sm font-semibold"><span>{d.day}</span><span className="text-brand">{d.hours} h</span></div><div className="text-sm font-medium mt-1">{d.focus}</div>
              <ul className="mt-1 list-disc pl-4 text-sm text-slate-700">{d.tasks.map((t, k) => <li key={k}>{t}</li>)}</ul></div>))}</div>
        </div>
      ))}
    </div>
  );
}
