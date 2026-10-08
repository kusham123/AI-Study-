import { useEffect, useState } from 'react';
import api, { errMsg } from '../api.js';

function Take({ quiz, onClose }) {
  const [ans, setAns] = useState({}); const [done, setDone] = useState(false);
  const score = quiz.questions.filter((q, i) => ans[i] === q.answer).length;
  return (
    <div className="card space-y-5">
      <div className="flex justify-between"><h2 className="font-bold text-lg">{quiz.topic}</h2><button className="btn-ghost" onClick={onClose}>Close</button></div>
      {quiz.questions.map((q, i) => (
        <div key={i}><p className="font-medium mb-2">{i + 1}. {q.q}</p>
          <div className="space-y-2">{q.options.map((o, j) => {
            const picked = ans[i] === j; const right = done && j === q.answer; const wrong = done && picked && j !== q.answer;
            return <button key={j} disabled={done} onClick={() => setAns({ ...ans, [i]: j })} className={`block w-full rounded-lg border px-3 py-2 text-left text-sm ${right ? 'border-mint bg-mint-soft' : wrong ? 'border-red-400 bg-red-50' : picked ? 'border-brand bg-brand-soft' : 'border-slate-300 hover:bg-slate-50'}`}>{o}</button>;
          })}</div>
          {done && <p className="mt-2 text-sm text-slate-600">{q.explain}</p>}
        </div>
      ))}
      {done ? <p className="font-bold text-brand">You scored {score} of {quiz.questions.length}.</p> : <button className="btn" onClick={() => setDone(true)} disabled={Object.keys(ans).length < quiz.questions.length}>Submit answers</button>}
    </div>
  );
}

export default function Quizzes() {
  const [list, setList] = useState([]); const [topic, setTopic] = useState(''); const [count, setCount] = useState(5); const [busy, setBusy] = useState(false); const [active, setActive] = useState(null); const [err, setErr] = useState('');
  const load = () => api.get('/quizzes').then((r) => setList(r.data));
  useEffect(() => { load(); }, []);
  const make = async (e) => { e.preventDefault(); setBusy(true); setErr(''); try { const { data } = await api.post('/quizzes/generate', { topic, count }); setTopic(''); setActive(data); load(); } catch (x) { setErr(errMsg(x)); } setBusy(false); };
  if (active) return <Take quiz={active} onClose={() => setActive(null)} />;
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Quizzes</h1>
      <form onSubmit={make} className="card flex flex-col sm:flex-row gap-3"><input className="input" placeholder="Quiz topic" value={topic} onChange={(e) => setTopic(e.target.value)} required />
        <select className="input sm:w-36" value={count} onChange={(e) => setCount(e.target.value)}>{[5, 8, 10].map((n) => <option key={n} value={n}>{n} questions</option>)}</select><button className="btn" disabled={busy}>{busy ? 'Creating…' : 'Create quiz'}</button></form>
      {err && <p className="text-sm text-red-600">{err}</p>}
      {!list.length && <p className="text-slate-500">No quizzes yet. Create one from any topic.</p>}
      {list.map((q) => <div key={q.id} className="card flex items-center justify-between"><div><div className="font-semibold">{q.topic}</div><div className="text-sm text-slate-500">{q.questions.length} questions</div></div>
        <div className="flex gap-2"><button className="btn" onClick={() => setActive(q)}>Start</button><button className="btn-ghost" onClick={async () => { await api.delete(`/quizzes/${q.id}`); load(); }}>Delete</button></div></div>)}
    </div>
  );
}
