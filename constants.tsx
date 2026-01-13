
import { UserRole, Instrument, AssetStatus, CalibrationType } from './types';

export const MOCK_USERS = [
  { id: '1', name: 'Juan', role: UserRole.ENGINEER },
  { id: '2', name: 'Naila', role: UserRole.ENGINEER },
  { id: '3', name: 'Ade', role: UserRole.COORDINATOR },
  { id: '4', name: 'Samsul', role: UserRole.SUPERVISOR },
  { id: '5', name: 'QA Admin', role: UserRole.QA },
  { id: '6', name: 'System Admin', role: UserRole.ADMIN },
];

export const INITIAL_INSTRUMENTS: Instrument[] = [
  {
    id: 'INS-001',
    code: 'TEMP-01',
    name: 'Digital Thermometer',
    location: 'Lab Mikrobiologi',
    department: 'Manufacturing',
    specs: '0-100°C High Precision',
    range: '0 - 100°C',
    tolerance: '±0.5°C',
    status: AssetStatus.OPERATIONAL,
    lastCalibration: '2023-10-15',
    nextCalibration: '2024-04-15',
    parameter: 'Suhu',
    brand: 'Fluke',
    serialNumber: 'SN-788221',
    capacity: '100°C',
    calibrationType: CalibrationType.EXTERNAL
  },
  {
    id: 'INS-002',
    code: 'PRES-05',
    name: 'Pressure Gauge',
    location: 'Area Boiler 1',
    department: 'Utility',
    specs: '0-500 PSI Industrial',
    range: '0 - 500 PSI',
    tolerance: '±1%',
    status: AssetStatus.CALIBRATION_DUE,
    lastCalibration: '2023-08-20',
    nextCalibration: '2024-02-20',
    parameter: 'Tekanan',
    brand: 'Wika',
    serialNumber: 'WK-99011',
    capacity: '500 PSI',
    calibrationType: CalibrationType.INTERNAL
  },
  {
    id: 'INS-003',
    code: 'WGH-12',
    name: 'Analytical Balance',
    location: 'Lab Kimia',
    department: 'QC',
    specs: 'Max 220g / 0.1mg',
    range: '0 - 220g',
    tolerance: '±0.001g',
    status: AssetStatus.OPERATIONAL,
    lastCalibration: '2023-12-01',
    nextCalibration: '2024-06-01',
    parameter: 'Massa',
    brand: 'Mettler Toledo',
    serialNumber: 'MT-55432',
    capacity: '220g',
    calibrationType: CalibrationType.EXTERNAL
  }
];
