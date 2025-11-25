import { Tenant, TenantType, User, UserRole, Session } from './types';

// Mock Tenants
export const MOCK_TENANTS: Tenant[] = [
  {
    id: 't1',
    name: 'Greenwood High School',
    slug: 'school',
    type: TenantType.SCHOOL,
    primaryColor: '#16a34a', // Green-600
    logoUrl: 'https://picsum.photos/id/20/200/200',
    features: { qr: true, faceRecognition: false, aiReports: true, gps: false }
  },
  {
    id: 't2',
    name: 'TechCorp Innovations',
    slug: 'work',
    type: TenantType.WORKPLACE,
    primaryColor: '#2563eb', // Blue-600
    logoUrl: 'https://picsum.photos/id/4/200/200',
    features: { qr: true, faceRecognition: true, aiReports: true, gps: true }
  }
];

// Mock Users
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Ahmed Ali', email: 'ahmed@school.com', role: UserRole.TENANT_ADMIN, tenantId: 't1', photoUrl: 'https://i.pravatar.cc/150?u=u1' },
  { id: 'u2', name: 'Sarah Johnson', email: 'sarah@school.com', role: UserRole.TEACHER, tenantId: 't1', department: 'Class 10A', photoUrl: 'https://i.pravatar.cc/150?u=u2' },
  { id: 'u3', name: 'Mohamed Farah', email: 'mohamed@student.com', role: UserRole.STUDENT, tenantId: 't1', department: 'Class 10A', photoUrl: 'https://i.pravatar.cc/150?u=u3' },
  { id: 'u4', name: 'Asha Abdi', email: 'asha@student.com', role: UserRole.STUDENT, tenantId: 't1', department: 'Class 10A', photoUrl: 'https://i.pravatar.cc/150?u=u4' },
  { id: 'u7', name: 'Bilal Osman', email: 'bilal@student.com', role: UserRole.STUDENT, tenantId: 't1', department: 'Class 10A', photoUrl: 'https://i.pravatar.cc/150?u=u7' },
  
  { id: 'u5', name: 'John Doe', email: 'john@techcorp.com', role: UserRole.TENANT_ADMIN, tenantId: 't2', photoUrl: 'https://i.pravatar.cc/150?u=u5' },
  { id: 'u6', name: 'Emily Blunt', email: 'emily@techcorp.com', role: UserRole.STUDENT, tenantId: 't2', department: 'Engineering', photoUrl: 'https://i.pravatar.cc/150?u=u6' },
  { id: 'u8', name: 'Michael Chen', email: 'michael@techcorp.com', role: UserRole.STUDENT, tenantId: 't2', department: 'Engineering', photoUrl: 'https://i.pravatar.cc/150?u=u8' },
];

// Mock Sessions
const today = new Date().toISOString().split('T')[0];
export const MOCK_SESSIONS: Session[] = [
  // School Sessions
  { id: 's1', title: 'Mathematics 101', tenantId: 't1', startTime: `${today}T08:00:00`, endTime: `${today}T09:30:00`, targetGroup: 'Class 10A', type: 'CLASS', instructorName: 'Sarah Johnson' },
  { id: 's2', title: 'History & Culture', tenantId: 't1', startTime: `${today}T10:00:00`, endTime: `${today}T11:30:00`, targetGroup: 'Class 10A', type: 'CLASS', instructorName: 'Ahmed Ali' },
  // Workplace Sessions
  { id: 's3', title: 'Morning Shift', tenantId: 't2', startTime: `${today}T09:00:00`, endTime: `${today}T17:00:00`, targetGroup: 'Engineering', type: 'SHIFT' },
  { id: 's4', title: 'Sprint Planning', tenantId: 't2', startTime: `${today}T11:00:00`, endTime: `${today}T12:00:00`, targetGroup: 'Engineering', type: 'MEETING' },
];

// Translations
export const TRANSLATIONS = {
  en: {
    dashboard: 'Dashboard',
    attendance: 'Attendance',
    reports: 'AI Reports',
    schedule: 'Schedule',
    users: 'Users',
    settings: 'Settings',
    logout: 'Logout',
    welcome: 'Welcome back',
    present: 'Present',
    absent: 'Absent',
    late: 'Late',
    excused: 'Excused',
    markAttendance: 'Mark Attendance',
    generateInsight: 'Generate AI Insight',
    loading: 'Thinking...',
    loginTitle: 'Sign in to your account',
    selectTenant: 'Select Tenant Demo',
    totalUsers: 'Total Users',
    attendanceRate: 'Attendance Rate',
    recentActivity: 'Recent Activity',
    simulateQR: 'Simulate QR Scan',
    simulateGPS: 'GPS Check-In',
    manual: 'Manual',
    qrMode: 'QR Mode',
    aiSummary: 'Executive Summary',
    risks: 'Identified Risks',
    recommendations: 'Recommendations',
    noData: 'No data available for analysis.',
    loginBtn: 'Login',
    markAllPresent: 'Mark All Present',
    selectSession: 'Select Session',
    exportCSV: 'Export CSV',
    usersList: 'User Management',
    role: 'Role',
    department: 'Dept/Class',
    addUser: 'Add User',
    upcomingSessions: 'Upcoming Sessions',
    liveFeed: 'Live Check-ins',
    gpsSuccess: 'Location verified within geofence.'
  },
  so: {
    dashboard: 'Dashboodh',
    attendance: 'Ka Qaybgalka',
    reports: 'Warbixinta AI',
    schedule: 'Jadwalka',
    users: 'Isticmaalayaasha',
    settings: 'Dejinta',
    logout: 'Ka Bax',
    welcome: 'Kusoo dhawow',
    present: 'Jooga',
    absent: 'Maqan',
    late: 'Daahay',
    excused: 'Cudurdaar',
    markAttendance: 'Calaamadee Ka Qaybgalka',
    generateInsight: 'Abuur Falanqaynta AI',
    loading: 'Wuu fakarayaa...',
    loginTitle: 'Soo gal akoonkaaga',
    selectTenant: 'Dooro Demo Tenant',
    totalUsers: 'Wadarta Isticmaalayaasha',
    attendanceRate: 'Heerka Ka Qaybgalka',
    recentActivity: 'Dhaqdhaqaaqii ugu dambeeyay',
    simulateQR: 'Iska yeel QR Scan',
    simulateGPS: 'GPS Check-In',
    manual: 'Gacanta',
    qrMode: 'Habka QR',
    aiSummary: 'Soo Koobid Fulineed',
    risks: 'Khataraha La Aqoonsaday',
    recommendations: 'Talooyinka',
    noData: 'Xog looma hayo falanqaynta.',
    loginBtn: 'Soo gal',
    markAllPresent: 'Dhammaan Jooga',
    selectSession: 'Dooro Fasad/Shift',
    exportCSV: 'Dhoofinta CSV',
    usersList: 'Maamulka Dadka',
    role: 'Doorka',
    department: 'Qaybta',
    addUser: 'Kudar Qof',
    upcomingSessions: 'Fasadaha Soo Socda',
    liveFeed: 'Jeeg-gareynta Tooska ah',
    gpsSuccess: 'Goobta waa la xaqiijiyay.'
  }
};