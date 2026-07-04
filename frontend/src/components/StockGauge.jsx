// ==========================================================
// STOCK GAUGE
// ==========================================================
// A small visual "fuel gauge" that appears anywhere we show
// stock: green when comfortably above minimum, orange when
// close to minimum, red when at/below minimum. This same
// component will be reused on the Dashboard and Low Stock
// modules later so the whole app reads stock health the same way.
// ==========================================================

export function getStockStatus(current, minimum) {
  if (current <= minimum) return 'bad';
  if (current <= minimum * 1.5) return 'warn';
  return 'good';
}

const LABELS = { good: 'Safe', warn: 'Low', bad: current => (current <= 0 ? 'Out of stock' : 'At minimum') };

export default function StockGauge({ current, minimum, unit }) {
  const status = getStockStatus(current, minimum);
  const max = Math.max(current, minimum * 2, 1);
  const pct = Math.min(100, Math.round((current / max) * 100));

  const colorVar = status === 'good' ? 'var(--good)' : status === 'warn' ? 'var(--warn)' : 'var(--bad)';

  return (
    <div className="gauge-cell">
      <div className="gauge-track">
        <div className="gauge-fill" style={{ width: `${pct}%`, background: colorVar }} />
      </div>
      <div className="gauge-numbers">
        {current} <span style={{ color: 'var(--muted-2)' }}>/ {minimum} min</span>
      </div>
    </div>
  );
}

export function StatusPill({ current, minimum }) {
  const status = getStockStatus(current, minimum);
  const label = status === 'bad' ? (current <= 0 ? 'Out of stock' : 'At minimum') : LABELS[status];
  return (
    <span className={`status-pill status-${status}`}>
      <span className="status-dot" />
      {label}
    </span>
  );
}
