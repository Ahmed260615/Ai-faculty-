import { submitAssessment } from './assessment';
import { getLatestByType } from './reports.service';

/** POST /assessments/nutrition → Express → FastAPI. */
export const submit = (payload, opts) => submitAssessment('nutrition', payload, opts);
export const getPrevious = () => getLatestByType('nutrition');
