import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { AttendanceTracker } from './components/AttendanceTracker';
import { Reports } from './components/Reports';
import { Schedule } from './components/Schedule';
import { UserList } from './components/UserList';
import { MOCK_TENANTS, MOCK_USERS, MOCK_SESSIONS, TRANSLATIONS } from './constants';
import { Tenant, User, AttendanceRecord, AttendanceStatus, Language } from './types';
import { Building2, School, LogIn } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [language, setLanguage] = useState<Language>('en');
  
  // Mock Database for Attendance
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    { id: '1', userId: 'u3', userName: 'Mohamed Farah', sessionId: 's1', date: new Date().toISOString().split('T')[0], status: AttendanceStatus.PRESENT, method: 'MANUAL', checkInTime: '08:05 AM' },
    { id: '2', userId: 'u4', userName: 'Asha Abdi', sessionId: 's1', date: new Date().toISOString().split('T')[0], status: AttendanceStatus.LATE, checkInTime: '08:45 AM', method: 'QR' }
  ]);

  const handleLogin = (tenantId: string) => {
    const tenant = MOCK_TENANTS.find(t => t.id === tenantId);
    const user = MOCK_USERS.find(u => u.tenantId === tenantId && u.role === 'TENANT_ADMIN'); // Login as Admin for demo
    if (tenant && user) {
      setCurrentTenant(tenant);
      setCurrentUser(user);
      setLanguage(tenant.id === 't1' ? 'so' : 'en'); // Auto-set lang based on tenant for demo
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentTenant(null);
  };

  if (!currentUser || !currentTenant) {
    // Login Screen
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-green-500"></div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-900 rounded-xl mx-auto flex items-center justify-center text-white mb-4 shadow-lg transform rotate-3">
              <School size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Attendify</h1>
            <p className="text-gray-500 mt-2 font-medium">Multi-Tenant SaaS Platform</p>
          </div>

          <div className="space-y-4">
            <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest">Select Demo Environment</p>
            
            <button
              onClick={() => handleLogin('t1')}
              className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-lg group-hover:bg-green-200 transition-colors">
                  <School size={24} />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900">Greenwood High School</h3>
                  <p className="text-xs text-gray-500">Education • Somali/English</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleLogin('t2')}
              className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group shadow-sm hover:shadow-md"
            >
               <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Building2 size={24} />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900">TechCorp Innovations</h3>
                  <p className="text-xs text-gray-500">Workplace • English</p>
                </div>
              </div>
            </button>
          </div>
          
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-2">Powered by Google Gemini 2.0 Flash</p>
            <div className="flex justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter users for the current tenant
  const tenantUsers = MOCK_USERS.filter(u => u.tenantId === currentTenant.id);

  return (
    <Layout
      tenant={currentTenant}
      user={currentUser}
      currentLang={language}
      setLanguage={setLanguage}
      onLogout={handleLogout}
      currentView={currentView}
      setCurrentView={setCurrentView}
    >
      {currentView === 'dashboard' && (
        <Dashboard 
          tenant={currentTenant} 
          records={attendanceRecords}
          currentLang={language}
        />
      )}
      {currentView === 'schedule' && (
        <Schedule 
           tenant={currentTenant}
           sessions={MOCK_SESSIONS}
           currentLang={language}
        />
      )}
      {currentView === 'attendance' && (
        <AttendanceTracker 
          tenant={currentTenant}
          users={tenantUsers}
          sessions={MOCK_SESSIONS}
          records={attendanceRecords}
          setRecords={setAttendanceRecords}
          currentLang={language}
        />
      )}
      {currentView === 'users' && (
         <UserList
           tenant={currentTenant}
           users={tenantUsers}
           currentLang={language}
         />
      )}
      {currentView === 'reports' && (
         <Reports 
           tenant={currentTenant}
           records={attendanceRecords}
           currentLang={language}
         />
      )}
      {currentView === 'settings' && (
        <div className="flex flex-col items-center justify-center h-96 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-white m-4">
          <p className="font-medium text-lg">Settings Module</p>
          <p className="text-sm">Configure tenant preferences, billing, and roles here.</p>
        </div>
      )}
    </Layout>
  );
}