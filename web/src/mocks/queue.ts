import { QueuePatientCard } from '@/types';

export const mockQueue: QueuePatientCard[] = [
  {
    encounter_id: 'e1-uuid',
    opd_id: 'OPD-2026-1040',
    patient_name: 'Rajesh Kumar',
    patient_age: 45,
    patient_sex: 'Male',
    chief_complaint: 'Severe abdominal pain',
    triage_level: 'EMERGENCY',
    status: 'READY_FOR_DOCTOR',
    wait_minutes: 12,
    unresolved_conflicts: 0,
    red_flag_count: 1,
    created_at: new Date().toISOString()
  },
  {
    encounter_id: 'e2-uuid',
    opd_id: 'OPD-2026-1041',
    patient_name: 'Sunita Sharma',
    patient_age: 38,
    patient_sex: 'Female',
    chief_complaint: 'Persistent high fever',
    triage_level: 'URGENT',
    status: 'READY_FOR_DOCTOR',
    wait_minutes: 24,
    unresolved_conflicts: 1,
    red_flag_count: 1,
    created_at: new Date().toISOString()
  },
  {
    encounter_id: 'e3-uuid',
    opd_id: 'OPD-2026-1042',
    patient_name: 'Amit Patel',
    patient_age: 62,
    patient_sex: 'Male',
    chief_complaint: 'Joint pain and stiffness',
    triage_level: 'ROUTINE',
    status: 'READY_FOR_DOCTOR',
    wait_minutes: 45,
    unresolved_conflicts: 0,
    red_flag_count: 0,
    created_at: new Date().toISOString()
  }
];
