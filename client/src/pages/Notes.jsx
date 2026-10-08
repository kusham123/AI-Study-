import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import api, { errMsg } from '../api.js';

export default function Notes() {
  const [list, setList] = useState([]); const [topic, setTopic] = useState(''); const [busy, setBusy] = useState(false); const [open, setOpen] = useState(null); const [err, setErr] = useState('');
  const load = () => api.get('/notes').then((r) => setList(r.data));
  useEffect(() => { load(); }, []);
  const make = async (e) => { e.preventDefault(); setBusy(true); setErr(''); try { const { data } = await api.post('/notes/generate', { topic }); setTopic(''); setOpen(data.id); load(); } catch (x) { setErr(errMsg(x)); } setBusy(false); };
  const del = async (id) => { await api.delete(`/notes/${id}`); load(); };
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Notes</h1>
      <form onSubmit={make} className="card flex flex-col sm:flex-row gap-3"><input className="input" placeholder="Topic or pasted material to turn into notes" value={topic} onChange={(e) => setTopic(e.target.value)} required /><button className="btn" disabled={busy}>{busy ? 'Writing notes…' : 'Generate notes'}</button></form>
      {err && <p className="text-sm text-red-600">{err}</p>}
      {!list.length && <p className="text-slate-500">No notes yet. Enter a topic above to create your first set.</p>}
      {list.map((n) => (
        <div key={n.id} className="card">
          <div className="flex justify-between"><button className="font-semibold text-left" onClick={() => setOpen(open === n.id ? null : n.id)}>{n.title}</button><button className="btn-ghost" onClick={() => del(n.id)}>Delete</button></div>
          {open === n.id && <div className="prose prose-sm max-w-none mt-3 border-t pt-3"><ReactMarkdown>{n.content}</ReactMarkdown></div>}
        </div>
      ))}
    </div>
  );
}
