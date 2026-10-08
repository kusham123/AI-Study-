import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import api, { errMsg } from '../api.js';
import { useAuth } from '../context/Auth.jsx';

export default function Auth() {
  const { user, login } = useAuth();
  const [mode, setMode] = useState('login');
  const [f, setF] = useState({ name: '', email: '', password: '', role: 'student' });
  const [err, setErr] = useState('');
  if (user) return <Navigate to="/" replace />;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault(); setErr('');
    try { login((await api.post(`/auth/${mode}`, f)).data); } catch (x) { setErr(errMsg(x)); }
  };
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-ink p-12 text-white">
        <div className="text-xl font-extrabold">AI Study</div>
        <div>
          <h1 className="text-4xl font-extrabold leading-tight max-w-md">Study smarter with a tutor that knows what you're learning.</h1>
          <p className="mt-4 max-w-md text-slate-300">Get a study plan, notes and quizzes for any topic in seconds.</p>
        </div>
        <div className="flex gap-2 text-sm"><span className="rounded-full bg-mint px-3 py-1">Notes</span><span className="rounded-full bg-amber px-3 py-1 text-ink">Quizzes</span><span className="rounded-full bg-brand px-3 py-1">Study plans</span></div>
      </div>
      <div className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-sm space-y-4">
          <h2 className="text-2xl font-bold">{mode === 'login' ? 'Sign in' : 'Create your account'}</h2>
          {mode === 'register' && <input className="input" placeholder="Full name" value={f.name} onChange={set('name')} required />}
          <input className="input" type="email" placeholder="Email" value={f.email} onChange={set('email')} required />
          <input className="input" type="password" placeholder="Password (6+ characters)" value={f.password} onChange={set('password')} required />
          {mode === 'register' && (
            <select className="input" value={f.role} onChange={set('role')}><option value="student">I'm a student</option><option value="teacher">I'm a teacher</option></select>
          )}
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button className="btn w-full">{mode === 'login' ? 'Sign in' : 'Create account'}</button>
          <p className="text-sm text-slate-600">
            {mode === 'login' ? 'New here?' : 'Already registered?'}{' '}
            <button type="button" className="font-semibold text-brand" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErr(''); }}>{mode === 'login' ? 'Create an account' : 'Sign in'}</button>
          </p>
        </form>
      </div>
    </div>
  );
}
