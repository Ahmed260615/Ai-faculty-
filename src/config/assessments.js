/**
 * Field definitions for every measurement form.
 * ref      = laboratory reference interval (DEMONSTRATION default, configurable per field)
 * critical = emergency protocol limits (DEMONSTRATION values — replace with the approved spacecraft protocol)
 * Biomarkers without a universally accepted interval deliberately have NO ref.
 */
const num = (key, label, unit, extra = {}) => ({ key, label, unit, type: 'number', step: 'any', ...extra });

export const RADIATION = {
  type: 'radiation',
  groups: [
    {
      id: 'dose', title: 'A. Radiation Dose', ar: 'جرعة الإشعاع',
      note: 'Gray (Gy) measures absorbed energy; Sievert (Sv) weights that energy by radiation type or tissue. They are different quantities — do not convert or substitute one for the other.',
      fields: [
        num('absorbedDose', 'Absorbed Dose', 'Gy', { required: true, min: 0, max: 100 }),
        num('equivalentDose', 'Equivalent Dose', 'Sv', { required: true, min: 0, max: 100 }),
        num('effectiveDose', 'Effective Dose (when available)', 'Sv', { min: 0, max: 100 }),
        { key: 'radiationType', label: 'Radiation Type', type: 'select', required: true, options: ['Galactic cosmic rays (GCR)', 'Solar particle event (SPE)', 'Trapped radiation belt', 'Secondary neutrons', 'Mixed / unknown'] },
        num('exposureHours', 'Exposure Duration', 'hours', { required: true, min: 0, max: 100000 }),
        num('cumulativeDose', 'Cumulative Radiation Exposure', 'Sv', { required: true, min: 0, max: 100 }),
      ],
    },
    {
      id: 'wbc', title: 'B. White Blood Cell Count (CBC)', ar: 'تعداد خلايا الدم البيضاء',
      note: 'Source: complete blood count (CBC). Reference intervals shown are demonstration defaults for a generic adult — use "Edit range" to set your laboratory\'s own interval. Lab results are not AI predictions.',
      fields: [
        num('wbcTotal', 'Total WBC', 'cells/µL', { required: true, min: 0, max: 200000, ref: { low: 4500, high: 11000 } }),
        num('neutrophils', 'Neutrophils', 'cells/µL', { required: true, min: 0, max: 100000, ref: { low: 1800, high: 7700 } }),
        num('lymphocytes', 'Lymphocytes', 'cells/µL', { required: true, min: 0, max: 100000, ref: { low: 1000, high: 4800 } }),
        num('monocytes', 'Monocytes', 'cells/µL', { required: true, min: 0, max: 50000, ref: { low: 200, high: 800 } }),
        num('eosinophils', 'Eosinophils', 'cells/µL', { required: true, min: 0, max: 50000, ref: { low: 0, high: 500 } }),
        num('basophils', 'Basophils', 'cells/µL', { required: true, min: 0, max: 50000, ref: { low: 0, high: 200 } }),
      ],
    },
    {
      id: 'dna', title: 'C. DNA Damage Biomarkers', ar: 'مؤشرات تلف الحمض النووي',
      note: 'γ-H2AX, Comet Assay and Micronucleus Assay are different laboratory methods with different units and scoring. They are not interchangeable and no reference interval is assumed — enter the laboratory\'s own reference if provided.',
      fields: ['gh2ax:γ-H2AX', 'comet:Comet Assay', 'micronucleus:Micronucleus Assay'].flatMap((s) => {
        const [k, name] = s.split(':');
        return [
          num(`${k}Value`, `${name} — Measurement`, '', { required: true, min: 0, max: 1e9, noUnit: true }),
          { key: `${k}Unit`, label: `${name} — Unit / Scoring Method`, type: 'text', required: true, placeholder: 'e.g. foci/cell, % tail DNA, MN/1000 BN cells' },
          { key: `${k}Ref`, label: `${name} — Lab Reference (if provided)`, type: 'text', placeholder: 'As stated by the laboratory' },
          { key: `${k}Date`, label: `${name} — Test Date`, type: 'date', required: true },
          { key: `${k}Lab`, label: `${name} — Laboratory Source`, type: 'text', required: true, placeholder: 'Laboratory / instrument name' },
        ];
      }),
    },
  ],
};

export const EMERGENCY = {
  type: 'emergency',
  groups: [{
    id: 'vitals', title: 'Emergency Vital Signs', ar: 'العلامات الحيوية',
    note: 'Critical values trigger an immediate on-screen alert and protocol instructions — this happens locally and never waits for AI processing.',
    fields: [
      num('heartRate', 'Heart Rate (HR)', 'BPM', { required: true, min: 0, max: 300, ref: { low: 60, high: 100 }, critical: { low: 40, high: 140 }, icon: 'heart' }),
      num('systolic', 'Blood Pressure — Systolic', 'mmHg', { required: true, min: 0, max: 300, ref: { low: 90, high: 130 }, critical: { low: 80, high: 180 }, icon: 'gauge' }),
      num('diastolic', 'Blood Pressure — Diastolic', 'mmHg', { required: true, min: 0, max: 200, ref: { low: 60, high: 85 }, critical: { low: 50, high: 120 }, icon: 'gauge' }),
      num('spo2', 'Oxygen Saturation (SpO₂)', '%', { required: true, min: 0, max: 100, ref: { low: 95, high: 100 }, critical: { low: 90 }, icon: 'wind' }),
      num('respRate', 'Respiratory Rate (RR)', 'breaths/min', { required: true, min: 0, max: 80, ref: { low: 12, high: 20 }, critical: { low: 8, high: 30 }, icon: 'wind' }),
      num('temperature', 'Body Temperature', '°C', { required: true, min: 25, max: 45, ref: { low: 36.1, high: 37.5 }, critical: { low: 35, high: 39.5 }, icon: 'thermo' }),
      { key: 'ecg', label: 'Electrocardiogram (ECG) — Clinical Interpretation', type: 'select', required: true, options: ['Normal sinus rhythm', 'Tachycardia', 'Bradycardia', 'Atrial fibrillation / irregular rhythm', 'ST-segment changes', 'Other abnormality', 'Not recorded'], icon: 'activity' },
      { key: 'ecgNotes', label: 'ECG Notes / Waveform Reference', type: 'text', placeholder: 'Interpretation notes or recording ID' },
      num('glucose', 'Blood Glucose', 'mg/dL', { required: true, min: 0, max: 1000, ref: { low: 70, high: 140 }, critical: { low: 54, high: 400 }, icon: 'drop' }),
    ],
  }],
};

export const GRAVITY = {
  type: 'gravity',
  groups: [
    { id: 'bone', title: 'A. Bone Health', ar: 'صحة العظام', fields: [
      num('bmd', 'Bone Mineral Density (BMD)', 'g/cm²', { required: true, min: 0, max: 3 }),
      num('bmdChange', 'Bone Density Change', '%', { required: true, min: -100, max: 100 }),
      num('calcium', 'Calcium (serum)', 'mg/dL', { required: true, min: 0, max: 30, ref: { low: 8.6, high: 10.2 } }),
      num('vitaminD', 'Vitamin D (25-OH)', 'ng/mL', { required: true, min: 0, max: 300, ref: { low: 30, high: 100 } }),
      num('boneTurnover', 'Bone Turnover Marker — CTX (when available)', 'ng/mL', { min: 0, max: 20 }),
    ] },
    { id: 'muscle', title: 'B. Muscle Health', ar: 'صحة العضلات', fields: [
      num('muscleMass', 'Muscle Mass', 'kg', { required: true, min: 0, max: 100 }),
      num('muscleStrength', 'Muscle Strength (grip dynamometer)', 'kg', { required: true, min: 0, max: 150 }),
      num('muscleLoss', 'Muscle Loss', '%', { required: true, min: 0, max: 100 }),
      num('exerciseMinutes', 'Exercise Duration (daily average)', 'min/day', { required: true, min: 0, max: 600 }),
      num('performanceScore', 'Physical Performance Score', '0–100', { required: true, min: 0, max: 100 }),
    ] },
    { id: 'cardio', title: 'C. Cardiovascular Health', ar: 'صحة القلب والأوعية', fields: [
      num('heartRate', 'Heart Rate (resting)', 'BPM', { required: true, min: 20, max: 250, ref: { low: 60, high: 100 } }),
      num('systolic', 'Blood Pressure — Systolic', 'mmHg', { required: true, min: 40, max: 300, ref: { low: 90, high: 130 } }),
      num('diastolic', 'Blood Pressure — Diastolic', 'mmHg', { required: true, min: 20, max: 200, ref: { low: 60, high: 85 } }),
      num('orthostatic', 'Orthostatic Tolerance (when available)', 'min', { min: 0, max: 60 }),
      num('vo2', 'Cardiovascular Exercise Capacity (VO₂ max)', 'mL/kg/min', { required: true, min: 0, max: 100 }),
    ] },
  ],
};

export const NUTRITION = {
  type: 'nutrition',
  groups: [
    { id: 'immune', title: 'A. Immune System Efficiency', ar: 'كفاءة المناعة', fields: [
      num('wbcTotal', 'White Blood Cell Count', 'cells/µL', { required: true, min: 0, max: 200000, ref: { low: 4500, high: 11000 } }),
      num('neutrophils', 'Neutrophils', 'cells/µL', { required: true, min: 0, max: 100000, ref: { low: 1800, high: 7700 } }),
      num('lymphocytes', 'Lymphocytes', 'cells/µL', { required: true, min: 0, max: 100000, ref: { low: 1000, high: 4800 } }),
      num('crp', 'C-reactive protein (immune biomarker, when available)', 'mg/L', { min: 0, max: 500, ref: { high: 5 } }),
    ] },
    { id: 'nutrition', title: 'B. Nutritional Status', ar: 'الحالة الغذائية', fields: [
      num('protein', 'Protein Intake', 'g/day', { required: true, min: 0, max: 400 }),
      num('calcium', 'Calcium (serum)', 'mg/dL', { required: true, min: 0, max: 30, ref: { low: 8.6, high: 10.2 } }),
      num('vitaminD', 'Vitamin D (25-OH)', 'ng/mL', { required: true, min: 0, max: 300, ref: { low: 30, high: 100 } }),
      num('vitaminK', 'Vitamin K (plasma phylloquinone)', 'ng/mL', { min: 0, max: 50 }),
      num('iron', 'Iron (serum)', 'µg/dL', { required: true, min: 0, max: 500, ref: { low: 60, high: 170 } }),
      num('omega3', 'Omega-3 Index', '%', { min: 0, max: 20 }),
      num('hydration', 'Hydration — Urine Specific Gravity', 'SG', { required: true, min: 1, max: 1.05, step: 0.001, ref: { low: 1.005, high: 1.03 } }),
      num('albumin', 'Nutritional Biomarker — Albumin', 'g/dL', { min: 0, max: 10, ref: { low: 3.5, high: 5.0 } }),
    ] },
    { id: 'gas', title: 'C. Blood Gas Measurements', ar: 'غازات الدم',
      note: 'PaO₂ and PaCO₂ come from an arterial blood gas sample. SpO₂ is a non-invasive pulse-oximetry estimate. They are not interchangeable.',
      fields: [
      num('pao2', 'Blood Oxygen (PaO₂) — arterial', 'mmHg', { required: true, min: 0, max: 700, ref: { low: 75, high: 100 } }),
      num('paco2', 'Carbon Dioxide (PaCO₂) — arterial', 'mmHg', { required: true, min: 0, max: 200, ref: { low: 35, high: 45 } }),
      num('ph', 'Blood pH (when available)', 'pH', { min: 6.5, max: 8, step: 0.01, ref: { low: 7.35, high: 7.45 } }),
      num('spo2', 'Oxygen Saturation (SpO₂) — pulse oximetry', '%', { required: true, min: 0, max: 100, ref: { low: 95, high: 100 } }),
    ] },
  ],
};

export const RESPIRATION = {
  type: 'respiration',
  groups: [{
    id: 'resp', title: 'Respiratory Measurements', ar: 'القياسات التنفسية',
    note: 'Critical respiratory values follow the emergency protocol independently of the AI assessment.',
    fields: [
      num('spo2', 'SpO₂ — pulse oximetry', '%', { required: true, min: 0, max: 100, ref: { low: 95, high: 100 }, critical: { low: 90 } }),
      num('respRate', 'Respiratory Rate', 'breaths/min', { required: true, min: 0, max: 80, ref: { low: 12, high: 20 }, critical: { low: 8, high: 30 } }),
      num('pao2', 'PaO₂ (when available)', 'mmHg', { min: 0, max: 700, ref: { low: 75, high: 100 }, critical: { low: 60 } }),
      num('paco2', 'PaCO₂ (when available)', 'mmHg', { min: 0, max: 200, ref: { low: 35, high: 45 }, critical: { low: 25, high: 60 } }),
    ],
  }],
};

export const flatFields = (cfg) => cfg.groups.flatMap((g) => g.fields);
export const CONFIGS = { radiation: RADIATION, emergency: EMERGENCY, gravity: GRAVITY, nutrition: NUTRITION, respiration: RESPIRATION };

/** Local emergency protocol text — DEMONSTRATION wording; replace with the approved spacecraft protocol. */
export const PROTOCOL_INSTRUCTIONS = [
  'Contact the crew medical officer immediately.',
  'Follow the spacecraft emergency medical protocol.',
  'Do not wait for the AI analysis before acting.',
];
