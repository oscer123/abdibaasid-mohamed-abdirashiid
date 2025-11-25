import React from 'react';
import { Tenant, User, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Search, Plus, MoreHorizontal, Mail, Shield } from 'lucide-react';

interface UserListProps {
  tenant: Tenant;
  users: User[];
  currentLang: Language;
}

export const UserList: React.FC<UserListProps> = ({ tenant, users, currentLang }) => {
  const t = TRANSLATIONS[currentLang];
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
           <input 
             type="text" 
             placeholder="Search users..." 
             className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
           <Plus size={18} />
           {t.addUser}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
           <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                 <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                 <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.role}</th>
                 <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.department}</th>
                 <th className="px-6 py-4 text-right"></th>
              </tr>
           </thead>
           <tbody className="divide-y divide-gray-100">
              {filteredUsers.map(user => (
                 <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border">
                             {user.photoUrl ? (
                                <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover" />
                             ) : (
                                <span className="font-bold text-gray-500">{user.name.charAt(0)}</span>
                             )}
                          </div>
                          <div>
                             <p className="font-semibold text-gray-900">{user.name}</p>
                             <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <Mail size={12} />
                                {user.email}
                             </div>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          user.role === 'TENANT_ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          user.role === 'TEACHER' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-gray-100 text-gray-700 border-gray-200'
                       }`}>
                          {user.role === 'TENANT_ADMIN' && <Shield size={10} />}
                          {user.role.replace('_', ' ')}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                       {user.department || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                          <MoreHorizontal size={20} />
                       </button>
                    </td>
                 </tr>
              ))}
           </tbody>
        </table>
      </div>
    </div>
  );
};