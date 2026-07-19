/**
 * Small shared primitives so every page doesn't reinvent button/card/badge
 * styling. Deliberately minimal — this app's visual identity lives in the
 * design tokens (tailwind.config.js) and CustodySeal, not in a heavy
 * component library.
 */

const VARIANT_CLASSES = {
  primary: 'bg-accent text-bg hover:bg-accent-dim border-transparent',
  ghost: 'bg-transparent text-text-hi hover:bg-surface-alt border-border',
  danger: 'bg-transparent text-critical hover:bg-critical/10 border-critical/40',
};

export function Button({ variant = 'primary', className = '', children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded border px-3 py-1.5 font-mono text-xs font-medium tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({ className = '', children, ...props }) {
  return (
    <div className={`rounded border border-border bg-surface ${className}`} {...props}>
      {children}
    </div>
  );
}

const SEVERITY_CLASSES = {
  critical: 'bg-critical/15 text-critical border-critical/40',
  high: 'bg-gold/15 text-gold border-gold/40',
  medium: 'bg-accent/15 text-accent border-accent/40',
  low: 'bg-text-lo/15 text-text-lo border-text-lo/30',
};

export function SeverityBadge({ severity }) {
  const cls = SEVERITY_CLASSES[severity] || SEVERITY_CLASSES.low;
  return (
    <span className={`inline-block rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${cls}`}>
      {severity}
    </span>
  );
}

const STATUS_CLASSES = {
  open: 'text-text-lo',
  reviewed: 'text-accent',
  confirmed: 'text-critical',
  false_positive: 'text-verified',
};

export function StatusLabel({ status }) {
  return (
    <span className={`font-mono text-[10px] uppercase tracking-wider ${STATUS_CLASSES[status] || 'text-text-lo'}`}>
      {status?.replace('_', ' ')}
    </span>
  );
}

export function TextInput({ label, error, className = '', ...props }) {
  return (
    <label className="flex flex-col gap-1">
      {label && <span className="font-mono text-[11px] uppercase tracking-wider text-text-lo">{label}</span>}
      <input
        className={`rounded border border-border bg-surface-alt px-3 py-2 text-sm text-text-hi placeholder:text-text-lo/50 focus:border-accent ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-critical">{error}</span>}
    </label>
  );
}
