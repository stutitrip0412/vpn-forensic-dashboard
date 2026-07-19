/**
 * Minimal, dependency-free CSV serializer. Good enough for export use
 * cases here (flat rows, no nested structures) without pulling in a
 * library for something this small.
 */
function escapeCsvField(value) {
  const str = String(value ?? '');
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsv(rows, columns) {
  const header = columns.join(',');
  const lines = rows.map((row) => columns.map((col) => escapeCsvField(row[col])).join(','));
  return [header, ...lines].join('\n');
}

module.exports = { toCsv, escapeCsvField };
