import { Navigate, NavLink, Outlet, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/Auth.jsx';
import Auth from './pages/Auth.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Tutor from './pages/Tutor.jsx';
import Notes from './pages/Notes.jsx';
import Quizzes from './pages/Quizzes.jsx';
import Plans from './pages/Plans.jsx';
import Assignments from './pages/Assignments.jsx';
import Users from './pages/Users.jsx';

const NAV = [
  ['/', 'Dashboard', ['student', 'teacher', 'admin']],
  ['/tutor', 'AI tutor', ['student', 'teacher']],
  ['/notes', 'Notes', ['student', 'teacher']],
  ['/quizzes', 'Quizzes', ['student', 'teacher']],
  ['/plans', 'Study plans', ['student']],
  ['/assignments', 'Assignments', ['student', 'teacher', 'admin']],
  ['/users', 'Users', ['admin']],
];

function Shell() {
  const { user, logout } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return (
    <div className="min-h-screen md:flex">
      <aside className="bg-ink text-white md:w-60 md:min-h-screen p-4 flex md:flex-col gap-2 overflow-x-auto">
        <div className="hidden md:block px-2 py-3 mb-4 text-lg font-extrabold tracking-tight">AI Study</div>
        {NAV.filter((n) => n[2].includes(user.role)).map(([to, label]) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-brand text-white' : 'text-slate-300 hover:bg-white/10'}`}>{label}</NavLink>
        ))}
        <div className="hidden md:block mt-auto border-t border-white/10 pt-4 px-2 text-sm">
          <div className="font-semibold">{user.name}</div>
          <div className="mb-3 text-slate-400 capitalize">{user.role}</div>
          <button onClick={logout} className="text-amber hover:underline">Sign out</button>
        </div>
      </aside>
      <main className="flex-1 p-5 md:p-8 max-w-5xl w-full mx-auto"><Outlet /></main>
    </div>
  );
}

const Guard = ({ roles, children }) => { const { user } = useAuth(); return roles.includes(user.role) ? children : <Navigate to="/" replace />; };

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Auth />} />
      <Route element={<Shell />}>
        <Route index element={<Dashboard />} />
        <Route path="tutor" element={<Tutor />} />
        <Route path="notes" element={<Notes />} />
        <Route path="quizzes" element={<Quizzes />} />
        <Route path="plans" element={<Plans />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="users" element={<Guard roles={['admin']}><Users /></Guard>} />
      </Route>
    </Routes>
  );
}
