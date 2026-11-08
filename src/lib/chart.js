import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler);
ChartJS.defaults.font.family = 'Cairo, system-ui, sans-serif';
ChartJS.defaults.font.size = 14;
ChartJS.defaults.plugins.legend.labels.usePointStyle = true;
ChartJS.defaults.plugins.legend.labels.boxWidth = 10;
ChartJS.defaults.plugins.legend.labels.padding = 16;
ChartJS.defaults.plugins.tooltip.padding = 12;
ChartJS.defaults.plugins.tooltip.titleFont = { size: 15, weight: '600' };
ChartJS.defaults.plugins.tooltip.bodyFont = { size: 15 };
ChartJS.defaults.plugins.tooltip.backgroundColor = 'rgba(8,12,18,.95)';
ChartJS.defaults.plugins.tooltip.borderColor = 'rgba(255,255,255,.14)';
ChartJS.defaults.plugins.tooltip.borderWidth = 1;

/** Motion: one calm 700ms entrance; disabled entirely for reduced-motion users. */
const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
ChartJS.defaults.animation = reduce ? false : { duration: 700, easing: 'easeOutQuart' };

/** Theme-aware series colours + chrome. Mutated by applyChartTheme() before each render. */
export const C = {};
/* Series use green + two grays (differentiated by dash/marker too). Amber/red only for status. */
const PALETTE = {
  light: { primary: '#14A35B', secondary: '#7B827D', accent: '#4C534F', ok: '#14A35B', warn: '#D9A441', crit: '#D75C5C', violet: '#9AA19C', grid: '#E3E7E4', text: '#0F1210', surface: '#FFFFFF' },
  dark: { primary: '#34D382', secondary: '#9AA19C', accent: '#CDD3CE', ok: '#34D382', warn: '#E8B554', crit: '#E86464', violet: '#6E756F', grid: 'rgba(255,255,255,.08)', text: '#EEF1EF', surface: '#0E0F0E' },
};
export function applyChartTheme(theme) {
  Object.assign(C, PALETTE[theme] || PALETTE.dark);
  ChartJS.defaults.color = C.text;
  ChartJS.defaults.borderColor = C.grid;
}
applyChartTheme(document.documentElement.dataset.theme || 'dark');

export const baseOptions = (extra = {}) => ({
  responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
  plugins: { legend: { position: 'bottom' } },
  scales: { x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 8 } }, y: { grid: { color: C.grid }, ...(extra.y || {}) } },
  ...extra.root,
});
