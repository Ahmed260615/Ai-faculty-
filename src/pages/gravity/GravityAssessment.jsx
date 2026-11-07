import PageHeader from '../../components/ui/PageHeader';
import AssessmentWorkflow from '../../components/medical/AssessmentWorkflow';
import { GRAVITY } from '../../config/assessments';
import { submit } from '../../services/gravity.service';

export default function GravityAssessment() {
  return (
    <>
      <PageHeader hero="gravity" accent="#7A6FB0" title="Gravity Effects" ar="تأثيرات الجاذبية"
        subtitle="Assessment & Decision — evaluate bone, muscle and cardiovascular health during microgravity exposure."
        tabs={[{ to: '/gravity', end: true, label: 'Assessment & Decision · الاختبار والقرار' }, { to: '/gravity/exercises', label: 'Exercise Programs · التمارين' }]} />
      <AssessmentWorkflow config={GRAVITY} submit={submit} />
    </>
  );
}
