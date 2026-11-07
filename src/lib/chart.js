import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler);
ChartJS.defaults.font.family = '"IBM Plex Sans", system-ui, sans-serif';
ChartJS.defaults.font.size = 14;
ChartJS.defaults.color = '#203040';
ChartJS.defaults.plugins.legend.labels.usePointStyle = true;
ChartJS.defaults.plugins.legend.labels.boxWidth = 10;
ChartJS.defaults.plugins.legend.labels.padding = 16;
ChartJS.defaults.plugins.tooltip.padding = 12;
ChartJS.defaults.plugins.tooltip.titleFont = { size: 15, weight: '600' };
ChartJS.defaults.plugins.tooltip.bodyFont = { size: 15 };

/** Consistent series colours (each also differs in dash/point style so colour is never the only cue). */
export const C = { primary: '#3C7896', secondary: '#7FA9B9', accent: '#6F9A8F', ok: '#2E9D78', warn: '#D9A441', crit: '#D75C5C', ink: '#203040', grid: '#E3E9EF', violet: '#7A6FB0' };

export const baseOptions = (extra = {}) => ({
  responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
  plugins: { legend: { position: 'bottom' } },
  scales: { x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 8 } }, y: { grid: { color: C.grid }, ...(extra.y || {}) } },
  ...extra.root,
});
