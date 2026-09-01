import { NextResponse } from 'next/server';
import { flattenAnswers, toCSV } from '@/lib/admin/csv';
import { scoreRow } from '@/lib/admin/scoring';
import { fetchAllResponses } from '@/lib/admin/supabase-admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/** Fixed columns that always lead the export, in order. */
const META_COLUMNS = [
  'response_id',
  'created_at',
  'completion_status',
  'completed',
  'last_section',
  'sections_reached',
  'sections_answered',
  'questions_answered',
  'duration_seconds',
  'phq9_score',
  'phq9_complete',
  'phq9_severity',
  'gad7_score',
  'gad7_complete',
  'gad7_severity',
  'safety_flag',
  'phq9_item9',
  'safety_followup',
  'contact_email',
  'contact_phone',
  'device_info',
] as const;

/**
 * GET /api/admin/export → survey-export.csv
 *
 * Data flow: service-role fetch → per row, compute scores and flatten the
 * nested `answers` jsonb into dotted columns (`phq9_grid.phq9_i1`) → union all
 * answer keys so every row shares the same header → serialise.
 *
 * Unauthenticated by request. This returns every participant's raw answers plus
 * any contact details they provided.
 */
export async function GET() {
  const result = await fetchAllResponses();

  if (!result.ok) {
    return NextResponse.json(
      { error: result.message },
      { status: result.reason === 'unconfigured' ? 503 : 500 }
    );
  }

  const answerKeys = new Set<string>();

  const records = result.data.map((row) => {
    const scored = scoreRow(row);
    const answers = flattenAnswers(row.answers ?? null);
    Object.keys(answers).forEach((k) => answerKeys.add(k));

    return {
      response_id: row.id,
      created_at: row.created_at ?? '',
      completion_status: scored.completionStatus,
      completed: scored.isCompleted,
      last_section: row.last_section ?? '',
      sections_reached: scored.sectionsCompleted,
      sections_answered: scored.answeredSectionCount,
      questions_answered: scored.answerCount,
      duration_seconds: row.duration_seconds ?? '',

      phq9_score: scored.phq9?.score ?? '',
      phq9_complete: scored.phq9 ? scored.phq9.complete : '',
      phq9_severity: scored.phq9?.severity ?? '',
      gad7_score: scored.gad7?.score ?? '',
      gad7_complete: scored.gad7 ? scored.gad7.complete : '',
      gad7_severity: scored.gad7?.severity ?? '',

      safety_flag: scored.safetyFlag,
      phq9_item9: scored.phq9Item9 ?? '',
      safety_followup: scored.safetyFollowUp ?? '',

      contact_email: scored.contact.email ?? '',
      contact_phone: scored.contact.phone ?? '',
      device_info: row.device_info ?? '',

      ...answers,
    } as Record<string, unknown>;
  });

  // Meta columns first, then every answer key found across all rows (sorted so
  // the header order is stable between exports).
  const columns = [...META_COLUMNS, ...Array.from(answerKeys).sort()];
  const csv = toCSV(records, columns);

  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="survey-export-${stamp}.csv"`,
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
