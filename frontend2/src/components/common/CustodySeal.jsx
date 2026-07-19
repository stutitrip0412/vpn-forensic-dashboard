/**
 * The one deliberately memorable visual element in this app (per the
 * design brief: spend the boldness in one place). Every evidence file's
 * SHA-256 hash is rendered as a unique radial "seal" — 32 bars, one per
 * byte of the hash, length proportional to that byte's value — so two
 * different files never produce the same seal, and the same file always
 * produces the same one. It's not decoration: it's a visual expression of
 * the tool's actual core promise (verifiable, tamper-evident hashing),
 * not a generic status icon that could belong to any dashboard.
 *
 * Color communicates verification status, not the hash itself:
 *   - 'match'    → verified green  (hash re-checked, matches original)
 *   - 'mismatch' → critical red    (hash re-checked, does NOT match — tampering/corruption signal)
 *   - 'pending'  → gold            (never verified yet — needs attention, not an error)
 */

const STATUS_COLOR = {
  match: '#4F9D69',
  mismatch: '#C1443C',
  pending: '#C98A3B',
};

const STATUS_LABEL = {
  match: 'Hash verified — matches original',
  mismatch: 'HASH MISMATCH — file differs from original',
  pending: 'Not yet verified',
};

function hashToBars(hash) {
  // 64 hex chars = 32 bytes for SHA-256. Fall back gracefully for any
  // shorter/malformed string rather than throwing in a UI component.
  const clean = (hash || '').replace(/[^0-9a-f]/gi, '').padEnd(64, '0').slice(0, 64);
  const bars = [];
  for (let i = 0; i < 32; i++) {
    const byte = parseInt(clean.slice(i * 2, i * 2 + 2), 16) || 0;
    bars.push(byte / 255);
  }
  return bars;
}

export function CustodySeal({ hash, status = 'pending', size = 40, title }) {
  const bars = hashToBars(hash);
  const color = STATUS_COLOR[status] || STATUS_COLOR.pending;
  const label = title || STATUS_LABEL[status] || STATUS_LABEL.pending;

  const center = 50;
  const innerR = 17;
  const maxOuterR = 46;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={label}
      className="shrink-0"
    >
      <title>{label}</title>
      <circle cx={center} cy={center} r={maxOuterR + 2} fill="none" stroke="#37404B" strokeWidth="1" />
      {bars.map((value, i) => {
        const angle = (i / bars.length) * Math.PI * 2 - Math.PI / 2;
        const outerR = innerR + value * (maxOuterR - innerR);
        const x1 = center + innerR * Math.cos(angle);
        const y1 = center + innerR * Math.sin(angle);
        const x2 = center + outerR * Math.cos(angle);
        const y2 = center + outerR * Math.sin(angle);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={color}
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity={0.5 + value * 0.5}
          />
        );
      })}
      <circle cx={center} cy={center} r={innerR - 4} fill={color} opacity="0.15" />
      <circle cx={center} cy={center} r="3" fill={color} />
    </svg>
  );
}
