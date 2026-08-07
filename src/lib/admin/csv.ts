/**
 * Minimal CSV serialiser.
 *
 * The spec suggested `json2csv`. That package is deprecated (superseded by
 * @json2csv/plainjs) and every feature we need here is ~40 lines, so this
 * avoids adding a dependency. Behaviour matches what json2csv would produce:
 * RFC-4180 quoting, dynamic union-of-keys columns.
 */

/** Escapes one cell per RFC 4180. */
function cell(value: unknown): string {
  if (value === null || value === undefined) return '';

  let s: string;
  if (Array.isArray(value)) s = value.join('; ');
  else if (typeof value === 'object') s = JSON.stringify(value);
  else s = String(value);

  // Quote when the value contains a delimiter, quote, or newline.
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function toCSV(rows: Record<string, unknown>[], columns: string[]): string {
  const lines = [columns.map(cell).join(',')];
  for (const row of rows) {
    lines.push(columns.map((c) => cell(row[c])).join(','));
  }
  // Excel needs a BOM to read UTF-8 (Urdu text) correctly.
  return '﻿' + lines.join('\r\n');
}

/**
 * Flattens a nested answers object into dotted paths:
 *   { phq9_grid: { phq9_i1: "2" } }  →  { "phq9_grid.phq9_i1": "2" }
 * Arrays are left intact for `cell()` to join.
 */
export function flattenAnswers(
  answers: Record<string, unknown> | null,
  prefix = ''
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (!answers) return out;

  for (const [key, value] of Object.entries(answers)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(out, flattenAnswers(value as Record<string, unknown>, path));
    } else {
      out[path] = value;
    }
  }
  return out;
}
