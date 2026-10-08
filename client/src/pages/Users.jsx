import { useEffect, useState } from 'react';
import api from '../api.js';

export default function Users() {
  const [list, setList] = useState([]);
  const load = () => api.get('/users').then((r) => setList(r.data));
  useEffect(() => { load(); }, []);
  const role = async (id, r) => { await api.put(`/users/${id}/role`, { role: r }); load(); };
  return (
    <div className="space-y-5"><h1 className="text-2xl font-bold">Users</h1>
      <div className="card overflow-x-auto p-0"><table className="w-full text-sm"><thead className="bg-slate-50 text-left text-slate-600"><tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Role</th><th /></tr></thead>
        <tbody>{list.map((u) => <tr key={u.id} className="border-t"><td className="p-3 font-medium">{u.name}</td><td className="p-3">{u.email}</td>
          <td className="p-3"><select className="input !w-auto !py-1.5" value={u.role} onChange={(e) => role(u.id, e.target.value)}>{['student', 'teacher', 'admin'].map((r) => <option key={r}>{r}</option>)}</select></td>
          <td className="p-3"><button className="btn-ghost" onClick={async () => { if (confirm(`Remove ${u.name}?`)) { await api.delete(`/users/${u.id}`); load(); } }}>Remove</button></td></tr>)}</tbody></table></div>
    </div>
  );
}
