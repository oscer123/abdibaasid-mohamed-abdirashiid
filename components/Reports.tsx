import React, { useState } from 'react';
import { Tenant, AttendanceRecord, Language, AIReportData } from '../types';
import { generateAttendanceReport } from '../services/geminiService';
import { TRANSLATIONS } from '../constants';
import { Sparkles, AlertTriangle, Lightbulb, FileText, RefreshCw, Download, Calendar } from 'lucide-react';

interface ReportsProps {
  tenant: Tenant;
  records: AttendanceRecord[];
  currentLang: Language;
}

export const Reports: React.FC<ReportsProps> = ({ tenant, records, currentLang }) => {
  const t = TRANSLATIONS[currentLang];
  const [report, setReport] = useState<AIReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('This Week');

  const handleGenerate = async () => {
    setLoading(true);
    // Simulate slight delay for UI feel if API is super fast or mocked
    const data = await generateAttendanceReport(records, tenant.type, dateRange);
    setReport(data);
    setLoading(false);
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "User,Date,Status,Time,Method\n"
        + records.map(r => `${r.userName},${r.date},${r.status},${r.checkInTime || ''},${r.method}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
             <Calendar size={16} />
             <select 
               className="bg-transparent outline-none font-medium" 
               value={dateRange} 
               onChange={(e) => setDateRange(e.target.value)}
             >
                <option>This Week</option>
                <option>Last Week</option>
                <option>This Month</option>
                <option>Last Month</option>
             </select>
          </div>

          <button
             onClick={handleExport}
             className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-semibold transition-colors"
          >
             <Download size={16} />
             {t.exportCSV}
          </button>
      </div>

      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
             <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm shadow-inner">
                <Sparkles size={32} className="text-yellow-300" />
             </div>
             <div>
               <h2 className="text-2xl font-bold mb-2">AI Smart Analytics</h2>
               <p className="text-indigo-100 max-w-md">
                 {tenant.name} uses advanced Gemini AI to analyze attendance patterns, predict trends, and suggest interventions.
               </p>
             </div>
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-6 py-3 bg-white text-indigo-600 rounded-full font-bold shadow-lg hover:bg-indigo-50 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"
          >
            {loading ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />}
            {loading ? t.loading : t.generateInsight}
          </button>
        </div>
      </div>

      {report && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
          {/* Executive Summary */}
          <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <div className="flex items-center gap-2 mb-4">
               <FileText className="text-blue-500" />
               <h3 className="text-lg font-bold text-gray-800">{t.aiSummary}</h3>
             </div>
             <p className="text-gray-600 leading-relaxed">{report.summary}</p>
             <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
               <span>AI Confidence Score:</span>
               <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-500 rounded-full" style={{ width: `${report.confidenceScore * 100}%` }}></div>
               </div>
               <span className="font-bold text-gray-600">{Math.round(report.confidenceScore * 100)}%</span>
             </div>
          </div>

          {/* Risks */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="text-red-500" />
              <h3 className="text-lg font-bold text-gray-800">{t.risks}</h3>
            </div>
            <ul className="space-y-3">
              {report.risks.map((risk, i) => (
                <li key={i} className="flex gap-3 text-gray-600 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></span>
                  {risk}
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="text-green-500" />
              <h3 className="text-lg font-bold text-gray-800">{t.recommendations}</h3>
            </div>
             <ul className="space-y-3">
              {report.actions.map((action, i) => (
                <li key={i} className="flex gap-3 text-gray-600 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 shrink-0"></span>
                  {action}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {!report && !loading && (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
          <p className="text-gray-400">{t.noData}</p>
        </div>
      )}
    </div>
  );
};