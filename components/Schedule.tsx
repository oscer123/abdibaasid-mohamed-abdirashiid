import React from 'react';
import { Tenant, Session, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Calendar, Clock, MapPin, User } from 'lucide-react';

interface ScheduleProps {
  tenant: Tenant;
  sessions: Session[];
  currentLang: Language;
}

export const Schedule: React.FC<ScheduleProps> = ({ tenant, sessions, currentLang }) => {
  const t = TRANSLATIONS[currentLang];
  const tenantSessions = sessions.filter(s => s.tenantId === tenant.id);

  // Group by day (mocking just Today for now)
  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">{t.schedule}</h2>
           <p className="text-gray-500">{today}</p>
        </div>
        <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-semibold text-sm hover:bg-indigo-100">
           + Add Session
        </button>
      </div>

      <div className="grid gap-4">
         {tenantSessions.map(session => (
            <div key={session.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 relative overflow-hidden group hover:shadow-md transition-all">
               <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: tenant.primaryColor }} />
               
               <div className="flex flex-col items-center justify-center min-w-[100px] border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-6">
                  <span className="text-2xl font-bold text-gray-800">{session.startTime.split('T')[1].substr(0,5)}</span>
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Start</span>
               </div>

               <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                     <h3 className="text-lg font-bold text-gray-900">{session.title}</h3>
                     <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase">
                        {session.type}
                     </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                     {session.instructorName && (
                        <div className="flex items-center gap-2">
                           <User size={16} className="text-gray-400" />
                           <span>{session.instructorName}</span>
                        </div>
                     )}
                     <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        <span>Room 304</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        <span>{session.endTime.split('T')[1].substr(0,5)} End</span>
                     </div>
                  </div>
               </div>
               
               <div className="flex items-center">
                   <div className="text-right">
                      <span className="block text-xs text-gray-400 uppercase font-semibold">Group</span>
                      <span className="font-bold text-gray-800">{session.targetGroup}</span>
                   </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};