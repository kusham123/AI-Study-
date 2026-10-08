import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import api, { errMsg } from '../api.js';
import { useAuth } from '../context/Auth.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [s, setS] = useState({});
  const [rec, setRec] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { api.get('/stats').then((r) => setS(r.data)); }, []);
  const recommend = async () => { setBusy(true); try { setRec((await api.post('/ai/recommend')).data.recommendations); } catch (e) { setRec(errMsg(e)); } setBusy(false); };
  const tiles = [['Notes', s.notes, 'bg-brand-soft text-brand'], ['Quizzes', s.quizzes, 'bg-mint-soft text-mint'], ['Study plans', s.plans, 'bg-amber-soft text-amber'], ['Assignments', s.assignments, 'bg-slate-100 text-ink']];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Welcome back, {user.name.split(' ')[0]}</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map(([l, v, c]) => <div key={l} className={`rounded-xl p-5 ${c}`}><div className="text-3xl font-extrabold">{v ?? '–'}</div><div className="text-sm font-medium">{l}</div></div>)}
      </div>
      {user.role !== 'admin' && (
        <div className="card">
          <div className="flex items-center justify-between gap-4"><div><h2 className="font-semibold">What to learn next</h2><p className="text-sm text-slate-500">Suggestions based on your recent notes and quizzes.</p></div>
            <button className="btn" onClick={recommend} disabled={busy}>{busy ? 'Thinking…' : 'Get suggestions'}</button></div>
          {rec && <div className="prose prose-sm mt-4 max-w-none"><ReactMarkdown>{rec}</ReactMarkdown></div>}
        </div>
      )}
    </div>
  );
}
