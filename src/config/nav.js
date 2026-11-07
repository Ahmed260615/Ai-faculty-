import { LayoutDashboard, Radiation, Siren, Brain, Orbit, Apple, History } from 'lucide-react';

export const NAV = [
  { to: '/', end: true, en: 'Dashboard', ar: 'الرئيسية', icon: LayoutDashboard },
  { to: '/radiation', en: 'Radiation Test', ar: 'اختبار الإشعاع', icon: Radiation },
  {
    to: '/emergency', en: 'Emergency', ar: 'الطوارئ', icon: Siren,
    children: [
      { to: '/emergency', end: true, en: 'Tests & Measurements' },
      { to: '/emergency/videos', en: 'Emergency Videos' },
    ],
  },
  {
    to: '/psychological', en: 'Psychological Health', ar: 'الصحة النفسية', icon: Brain,
    children: [
      { to: '/psychological', end: true, en: 'Daily Schedule · الجدول اليومي' },
      { to: '/psychological/assessment', en: 'Assessment · الاختبار النفسي' },
      { to: '/psychological/puzzles', en: 'Puzzles · الألغاز' },
    ],
  },
  {
    to: '/gravity', en: 'Gravity Effects', ar: 'تأثيرات الجاذبية', icon: Orbit,
    children: [
      { to: '/gravity', end: true, en: 'Assessment & Decision · الاختبار والقرار' },
      { to: '/gravity/exercises', en: 'Exercise Programs · التمارين' },
    ],
  },
  {
    to: '/nutrition', en: 'Nutrition & Respiration', ar: 'التغذية والتنفس', icon: Apple,
    children: [
      { to: '/nutrition', end: true, en: 'Nutrition · التغذية' },
      { to: '/nutrition/respiration', en: 'Respiration · التنفس' },
    ],
  },
  { to: '/reports', en: 'History & Reports', ar: 'التاريخ والتقارير', icon: History },
];

/** Assessment catalogue used by the dashboard's Medical Assessment Center. */
export const ASSESSMENTS = {
  radiation: { type: 'radiation', name: 'Radiation Assessment', ar: 'اختبار الإشعاع', to: '/radiation', description: 'Radiation dose, white blood cell count and DNA damage biomarkers.', needs: 'Dose (Gy / Sv), CBC white cell differential, γ-H2AX, Comet, Micronucleus' },
  emergency: { type: 'emergency', name: 'Emergency Vitals', ar: 'الطوارئ', to: '/emergency', description: 'Rapid vital-sign check with immediate protocol escalation.', needs: 'HR, BP, SpO₂, RR, temperature, ECG, glucose' },
  psychological: { type: 'psychological', name: 'PHQ-9 Screening', ar: 'الاختبار النفسي', to: '/psychological/assessment', description: 'Validated 9-item depressive symptom screening (last 2 weeks).', needs: '9 questionnaire responses' },
  gravity: { type: 'gravity', name: 'Microgravity Assessment', ar: 'تأثيرات الجاذبية', to: '/gravity', description: 'Bone, muscle and cardiovascular effects of microgravity.', needs: 'BMD, calcium, vitamin D, muscle mass/strength, HR, BP, VO₂' },
  nutrition: { type: 'nutrition', name: 'Nutrition & Immune Assessment', ar: 'التغذية', to: '/nutrition', description: 'Immune efficiency, nutritional status and blood gases.', needs: 'WBC, nutrients, hydration, PaO₂, PaCO₂, SpO₂' },
  respiration: { type: 'respiration', name: 'Respiratory Assessment', ar: 'التنفس', to: '/nutrition/respiration', description: 'Oxygenation and breathing monitoring.', needs: 'SpO₂, respiratory rate, PaO₂, PaCO₂' },
};

export const TYPE_LABEL = {
  radiation: 'Radiation', emergency: 'Emergency', psychological: 'Psychological',
  gravity: 'Gravity & Bone Health', nutrition: 'Nutrition', respiration: 'Respiratory',
};
