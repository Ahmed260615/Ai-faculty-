import PhotoStrip from '../../components/ui/PhotoStrip';
import PageHeader from '../../components/ui/PageHeader';
import AssessmentWorkflow from '../../components/medical/AssessmentWorkflow';
import { RADIATION } from '../../config/assessments';
import { submit } from '../../services/radiation.service';

export default function RadiationPage() {
  return (
    <>
      <PageHeader eyebrow="Radiation test" counter="02 / 07" hero="radiation" accent="#B8742F" title="Radiation Test" ar="اختبار الإشعاع"
        subtitle="Assess radiation-related health risk from absorbed and equivalent dose, white blood cell count and DNA damage biomarkers. Laboratory results and AI risk predictions are reported separately." />
      <PhotoStrip items={['sun-flare', 'aurora', 'earth-limb']} />
      <AssessmentWorkflow config={RADIATION} submit={submit} />
    </>
  );
}
