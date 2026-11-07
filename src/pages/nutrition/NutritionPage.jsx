import PageHeader from '../../components/ui/PageHeader';
import AssessmentWorkflow from '../../components/medical/AssessmentWorkflow';
import { NUTRITION } from '../../config/assessments';
import { submit } from '../../services/nutrition.service';

export const NUTRITION_TABS = [{ to: '/nutrition', end: true, label: 'Nutrition · التغذية' }, { to: '/nutrition/respiration', label: 'Respiration · التنفس' }];

export default function NutritionPage() {
  return (
    <>
      <PageHeader hero="nutrition" accent="#2E8F7A" title="Nutrition & Respiration" ar="التغذية والتنفس"
        subtitle="Nutrition assessment — monitor immune efficiency, nutritional status and blood gases." tabs={NUTRITION_TABS} />
      <AssessmentWorkflow config={NUTRITION} submit={submit} />
    </>
  );
}
