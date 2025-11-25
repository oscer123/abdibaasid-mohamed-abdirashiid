import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Tenant, AttendanceRecord, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Users, UserCheck, UserX, Clock, Activity, MapPin, QrCode } from 'lucide-react';

interface DashboardProps {
  tenant: Tenant;
  records: AttendanceRecord[];
  currentLang: Language;
}

export const Dashboard: React.FC<DashboardProps> = ({ tenant, records, currentLang }) => {
  const t = TRANSLATIONS[currentLang];

  // Aggregation Logic
  const total = records.length || 1; 
  const present = records.filter(r => r.status === 'PRESENT').length;
  const absent = records.filter(r => r.status === 'ABSENT').length;
  const late = records.filter(r => r.status === 'LATE').length;
  const rate = Math.round((present / total) * 100);

  const stats = [
    { label: t.attendanceRate, value: `${rate}%`, icon: UserCheck, color: 'bg-green-100 text-green-600' },
    { label: t.totalUsers, value: '142', icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: t.absent, value: absent, icon: UserX, color: 'bg-red-100 text-red-600' },
    { label: t.late, value: late, icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
  ];

  const chartData = [
    { name: t.present, value: present, color: '#22c55e' },
    { name: t.absent, value: absent, color: '#ef4444' },
    { name: t.late, value: late, color: '#eab308' },
    { name: t.excused, value: records.filter(r => r.status === 'EXCUSED').length, color: '#94a3b8' },
  ];

  // Sort records by most recent for "Live Feed"
  const recentRecords = [...records].reverse().slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96">
          <h3 className="text-lg font-bold text-gray-800 mb-4">{t.attendanceRate}</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Live Activity Feed */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="text-indigo-500" size={20} />
            <h3 className="text-lg font-bold text-gray-800">{t.liveFeed}</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {recentRecords.length === 0 ? (
              <p className="text-gray-400 text-sm text-center mt-10">No recent activity.</p>
            ) : (
              recentRecords.map((rec) => (
                <div key={rec.id} className="flex items-start gap-3 pb-3 border-b last:border-0 border-gray-50">
                   <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                      rec.status === 'PRESENT' ? 'bg-green-500' : 
                      rec.status === 'LATE' ? 'bg-yellow-500' : 'bg-red-500'
                   }`} />
                   <div>
                     <p className="text-sm font-semibold text-gray-900">{rec.userName}</p>
                     <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{rec.checkInTime || 'No time'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          {rec.method === 'GPS' && <MapPin size={10} />}
                          {rec.method === 'QR' && <QrCode size={10} />}
                          {rec.method}
                        </span>
                     </div>
                   </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};