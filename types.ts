export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  TENANT_ADMIN = 'TENANT_ADMIN',
  TEACHER = 'TEACHER', // or Manager
  STUDENT = 'STUDENT' // or Employee
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  EXCUSED = 'EXCUSED'
}

export enum TenantType {
  SCHOOL = 'SCHOOL',
  WORKPLACE = 'WORKPLACE',
  UNIVERSITY = 'UNIVERSITY'
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  type: TenantType;
  primaryColor: string; // Hex code for theming
  logoUrl: string;
  features: {
    qr: boolean;
    faceRecognition: boolean;
    aiReports: boolean;
    gps: boolean;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
  department?: string; // Class for schools, Dept for workplace
  photoUrl?: string;
}

export interface Session {
  id: string;
  title: string;
  tenantId: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  targetGroup: string; // Matches user department
  type: 'CLASS' | 'SHIFT' | 'MEETING';
  instructorName?: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  sessionId?: string;
  date: string;
  status: AttendanceStatus;
  checkInTime?: string;
  method: 'MANUAL' | 'QR' | 'FACE' | 'GPS';
  location?: { lat: number; lng: number };
}

export interface AIReportData {
  summary: string;
  risks: string[];
  actions: string[];
  confidenceScore: number;
}

export type Language = 'en' | 'so';