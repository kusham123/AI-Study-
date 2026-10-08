import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import api, { errMsg } from '../api.js';

export default function Tutor() {
  const [msgs, setMsgs] = useState([]);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState('ask');
  const send = async (e) => {
    e.preventDefault(); if (!q.trim()) return;
    const text = q; setQ(''); setBusy(true); setMsgs((m) => [...m, { role: 'me', text }]);
    try {
      const { data } = await api.post(mode === 'ask' ? '/ai/ask' : '/ai/summarize', mode === 'ask' ? { question: text } : { text });
      setMsgs((m) => [...m, { role: 'ai', text: data.answer || data.summary }]);
    } catch (x) { setMsgs((m) => [...m, { role: 'ai', text: errMsg(x) }]); }
    setBusy(false);
  };
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-4"><h1 className="text-2xl font-bold">AI tutor</h1>
        <div className="flex rounded-lg bg-slate-200 p-1 text-sm">{[['ask', 'Ask a question'], ['sum', 'Summarize text']].map(([k, l]) => <button key={k} onClick={() => setMode(k)} className={`rounded-md px-3 py-1.5 font-medium ${mode === k ? 'bg-white shadow-sm' : 'text-slate-600'}`}>{l}</button>)}</div></div>
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {!msgs.length && <p className="card text-slate-500">Ask anything, like “Explain recursion with an example”, or switch to Summarize and paste a chapter.</p>}
        {msgs.map((m, i) => <div key={i} className={`max-w-[85%] rounded-xl px-4 py-3 text-sm ${m.role === 'me' ? 'ml-auto bg-brand text-white' : 'bg-white border border-slate-200'}`}><ReactMarkdown>{m.text}</ReactMarkdown></div>)}
        {busy && <div className="text-sm text-slate-500">Tutor is writing…</div>}
      </div>
      <form onSubmit={send} className="mt-4 flex gap-2"><textarea rows={mode === 'sum' ? 4 : 1} className="input" placeholder={mode === 'ask' ? 'Type your question' : 'Paste the text to summarize'} value={q} onChange={(e) => setQ(e.target.value)} /><button className="btn" disabled={busy}>Send</button></form>
    </div>
  );
}
