
export enum UserRole {
  ADMIN = 'ADMIN',
  ENGINEER = 'ENGINEER',
  COORDINATOR = 'COORDINATOR',
  QA = 'QA',
  SUPERVISOR = 'SUPERVISOR'
}

export enum AssetStatus {
  OPERATIONAL = 'OPERATIONAL',
  CALIBRATION_DUE = 'CALIBRATION_DUE',
  MAINTENANCE = 'MAINTENANCE',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE'
}

export enum JobStatus {
  PLANNED = 'PLANNED',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE'
}

export enum CalibrationType {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Instrument {
  id: string;
  code: string;
  name: string;
  location: string;
  department: string;
  specs: string;
  range: string;
  tolerance: string;
  status: AssetStatus;
  lastCalibration: string;
  nextCalibration: string;
  // Field tambahan untuk Jadwal Kalibrasi
  parameter: string;
  brand: string;
  serialNumber: string;
  capacity: string;
  calibrationType: CalibrationType;
}

export interface CalibrationRecord {
  id: string;
  instrumentId: string;
  date: string;
  engineerId: string;
  asFound: number;
  asLeft: number;
  deviation: number;
  result: 'PASS' | 'FAIL';
  status: JobStatus;
  notes: string;
  approvedBy?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}
