import { submitAssessment } from './assessment';
import { getLatestByType } from './reports.service';

/** POST /assessments/gravity → Express → FastAPI. */
export const submit = (payload, opts) => submitAssessment('gravity', payload, opts);
export const getPrevious = () => getLatestByType('gravity');
