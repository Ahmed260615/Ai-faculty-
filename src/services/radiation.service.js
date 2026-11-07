import { submitAssessment } from './assessment';
import { getLatestByType } from './reports.service';

/** POST /assessments/radiation → Express → FastAPI. */
export const submit = (payload, opts) => submitAssessment('radiation', payload, opts);
export const getPrevious = () => getLatestByType('radiation');
