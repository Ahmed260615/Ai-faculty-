/** PHQ-9 — standard item wording and scoring (Kroenke, Spitzer & Williams, 2001). Do not edit the wording. */
export const PHQ9_STEM = 'Over the last 2 weeks, how often have you been bothered by any of the following problems?';
export const PHQ9_ITEMS = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
  'Trouble concentrating on things, such as reading the newspaper or watching television',
  'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual',
  'Thoughts that you would be better off dead, or of hurting yourself in some way',
];
export const PHQ9_ANSWERS = [
  { v: 0, label: 'Not at all' }, { v: 1, label: 'Several days' }, { v: 2, label: 'More than half the days' }, { v: 3, label: 'Nearly every day' },
];
export const PHQ9_DIFFICULTY = ['Not difficult at all', 'Somewhat difficult', 'Very difficult', 'Extremely difficult'];
export const PHQ9_DIFFICULTY_Q = 'If you checked off any problems, how difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?';

export function severityOf(total) {
  if (total <= 4) return 'Minimal';
  if (total <= 9) return 'Mild';
  if (total <= 14) return 'Moderate';
  if (total <= 19) return 'Moderately Severe';
  return 'Severe';
}
export const SEVERITY_STATUS = { Minimal: 'NORMAL', Mild: 'WARNING', Moderate: 'WARNING', 'Moderately Severe': 'CRITICAL', Severe: 'CRITICAL' };
export const score = (answers) => answers.reduce((a, b) => a + (b ?? 0), 0);
