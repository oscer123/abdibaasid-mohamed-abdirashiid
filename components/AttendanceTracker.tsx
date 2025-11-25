import React, { useState, useEffect } from 'react';
import { Tenant, User, AttendanceRecord, AttendanceStatus, Language, Session } from '../types';
import { TRANSLATIONS } from '../constants';
import { QrCode, MapPin, CheckCircle, XCircle, Clock, CheckSquare, ListFilter, Users } from 'lucide-react';

interface AttendanceTrackerProps {
  tenant: Tenant;
  users: User[];
  sessions: Session[];
  records: AttendanceRecord[];
  setRecords: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
  currentLang: Language;
}

export const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({
  tenant,
  users,
  sessions,
  records,
  setRecords,
  currentLang
}) => {
  const t = TRANSLATIONS[currentLang];
  const [mode, setMode] = useState<'MANUAL' | 'QR'>('MANUAL');
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [lastQrScan, setLastQrScan] = useState<string | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsMessage, setGpsMessage] = useState('');

  // Default to first active session for the tenant
  useEffect(() => {
    const tenantSessions = sessions.filter(s => s.tenantId === tenant.id);
    if (tenantSessions.length > 0 && !selectedSessionId) {
      setSelectedSessionId(tenantSessions[0].id);
    }
  }, [sessions, tenant.id]);

  const currentSession = sessions.find(s => s.id === selectedSessionId);
  
  // Filter users relevant to the session (by department/group)
  const sessionUsers = currentSession 
    ? users.filter(u => u.role === 'STUDENT' && u.department === currentSession.targetGroup)
    : [];

  const updateStatus = (userId: string, status: AttendanceStatus, method: 'MANUAL' | 'QR' | 'GPS') => {
    const today = new Date().toISOString().split('T')[0];
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const newRecord: AttendanceRecord = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      userName: user.name,
      sessionId: selectedSessionId,
      date: today,
      status,
      checkInTime: new Date().toLocaleTimeString(),
      method
    };

    // Remove existing record for this user/session combination
    setRecords(prev => [
        ...prev.filter(r => !(r.userId === userId && r.date === today && r.sessionId === selectedSessionId)), 
        newRecord
    ]);
  };

  const handleMarkAllPresent = () => {
    sessionUsers.forEach(user => {
      // Only mark if not already marked
      const existing = records.find(r => r.userId === user.id && r.sessionId === selectedSessionId);
      if (!existing) {
        updateStatus(user.id, AttendanceStatus.PRESENT, 'MANUAL');
      }
    });
  };

  const simulateQRScan = () => {
    const unchecked = sessionUsers.filter(s => !records.find(r => r.userId === s.id && r.sessionId === selectedSessionId));
    if (unchecked.length === 0) {
      setLastQrScan("All students accounted for!");
      return;
    }
    const randomStudent = unchecked[Math.floor(Math.random() * unchecked.length)];
    updateStatus(randomStudent.id, AttendanceStatus.PRESENT, 'QR');
    setLastQrScan(`Scanned: ${randomStudent.name}`);
    setTimeout(() => setLastQrScan(null), 3000);
  };

  const simulateGPSCheckIn = () => {
     setGpsLoading(true);
     setGpsMessage('');
     setTimeout(() => {
        // Find a user to simulate "self" checkin (e.g. the first unchecked one)
        const unchecked = sessionUsers.filter(s => !records.find(r => r.userId === s.id));
        if (unchecked.length > 0) {
            updateStatus(unchecked[0].id, AttendanceStatus.PRESENT, 'GPS');
            setGpsMessage(`${t.gpsSuccess} (${unchecked[0].name})`);
        } else {
            setGpsMessage("No eligible user found to simulate check-in.");
        }
        setGpsLoading(false);
     }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{t.markAttendance}</h2>
              <p className="text-gray-500 text-sm flex items-center gap-2">
                 {new Date().toLocaleDateString()} • {sessionUsers.length} Students Enrolled
              </p>
            </div>
            
            <div className="flex gap-2">
                <button
                    onClick={() => setMode('MANUAL')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                        mode === 'MANUAL' 
                        ? `bg-gray-900 text-white border-gray-900` 
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    {t.manual}
                </button>
                {tenant.features.qr && (
                    <button
                        onClick={() => setMode('QR')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                            mode === 'QR' 
                            ? `bg-gray-900 text-white border-gray-900` 
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        {t.qrMode}
                    </button>
                )}
            </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
           <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{t.selectSession}</label>
              <select 
                 className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                 value={selectedSessionId}
                 onChange={(e) => setSelectedSessionId(e.target.value)}
              >
                  {sessions.filter(s => s.tenantId === tenant.id).map(s => (
                      <option key={s.id} value={s.id}>{s.title} ({s.startTime.split('T')[1].substr(0,5)})</option>
                  ))}
              </select>
           </div>
           <div className="flex items-end">
              <button 
                onClick={handleMarkAllPresent}
                className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-bold border border-green-200 hover:bg-green-100 transition-colors"
              >
                <CheckCircle size={16} />
                {t.markAllPresent}
              </button>
           </div>
           {tenant.features.gps && (
               <div className="flex items-end">
                  <button 
                    onClick={simulateGPSCheckIn}
                    disabled={gpsLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold border border-blue-200 hover:bg-blue-100 transition-colors disabled:opacity-50"
                  >
                    <MapPin size={16} />
                    {gpsLoading ? t.loading : t.simulateGPS}
                  </button>
               </div>
           )}
        </div>
        {gpsMessage && <div className="text-xs text-blue-600 font-medium">{gpsMessage}</div>}
      </div>

      {mode === 'QR' ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-6">
           <div className="w-48 h-48 bg-gray-900 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg ring-4 ring-gray-100">
              <QrCode size={100} />
           </div>
           <h3 className="text-lg font-bold">Scan Student QR Code</h3>
           <p className="text-gray-500 max-w-md">
             Use the companion mobile app to scan, or use the simulation button below for testing.
           </p>
           
           <button 
             onClick={simulateQRScan}
             className="px-6 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-md hover:bg-indigo-700 transition-transform active:scale-95"
           >
             {t.simulateQR}
           </button>

           {lastQrScan && (
             <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200 animate-pulse font-medium">
               {lastQrScan}
             </div>
           )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
           <table className="w-full text-left border-collapse">
             <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold border-b">
               <tr>
                 <th className="px-6 py-4">Student</th>
                 <th className="px-6 py-4">Status</th>
                 <th className="px-6 py-4 text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
               {sessionUsers.length > 0 ? (
                   sessionUsers.map(student => {
                     const record = records.find(r => r.userId === student.id && r.sessionId === selectedSessionId);
                     return (
                       <tr key={student.id} className="hover:bg-gray-50 transition-colors group">
                         <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-200">
                               {student.photoUrl ? (
                                   <img src={student.photoUrl} alt={student.name} className="w-full h-full object-cover" />
                               ) : (
                                   <span className="font-bold text-gray-500 text-sm">{student.name.charAt(0)}</span>
                               )}
                             </div>
                             <div>
                                <p className="font-medium text-gray-900">{student.name}</p>
                                <p className="text-xs text-gray-400">{student.email}</p>
                             </div>
                           </div>
                         </td>
                         <td className="px-6 py-4">
                           {record ? (
                             <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border
                               ${record.status === 'PRESENT' ? 'bg-green-100 text-green-700 border-green-200' : 
                                 record.status === 'ABSENT' ? 'bg-red-100 text-red-700 border-red-200' : 
                                 record.status === 'LATE' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-gray-100 text-gray-700 border-gray-200'}
                             `}>
                               {record.method === 'QR' && <QrCode size={12} />}
                               {record.method === 'GPS' && <MapPin size={12} />}
                               {t[record.status.toLowerCase() as keyof typeof t]}
                             </span>
                           ) : (
                             <span className="text-gray-400 text-sm italic flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                                Not marked
                             </span>
                           )}
                         </td>
                         <td className="px-6 py-4 text-right">
                           <div className="flex justify-end gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                             <button 
                                onClick={() => updateStatus(student.id, AttendanceStatus.PRESENT, 'MANUAL')}
                                title={t.present}
                                className="p-2 rounded-lg text-green-600 hover:bg-green-100 transition-colors"
                             >
                               <CheckCircle size={18} />
                             </button>
                             <button 
                                onClick={() => updateStatus(student.id, AttendanceStatus.LATE, 'MANUAL')}
                                title={t.late}
                                className="p-2 rounded-lg text-yellow-600 hover:bg-yellow-100 transition-colors"
                             >
                               <Clock size={18} />
                             </button>
                             <button 
                                onClick={() => updateStatus(student.id, AttendanceStatus.ABSENT, 'MANUAL')}
                                title={t.absent}
                                className="p-2 rounded-lg text-red-600 hover:bg-red-100 transition-colors"
                             >
                               <XCircle size={18} />
                             </button>
                           </div>
                         </td>
                       </tr>
                     );
                   })
               ) : (
                 <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-gray-400">
                        <Users className="mx-auto mb-2 opacity-50" size={32} />
                        No students found for this session group.
                    </td>
                 </tr>
               )}
             </tbody>
           </table>
        </div>
      )}
    </div>
  );
};