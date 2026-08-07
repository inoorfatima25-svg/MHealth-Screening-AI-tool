-- ─────────────────────────────────────────────────────────────────────────────
-- Mental Health Screening — database schema
--
-- Safe to re-run: every statement is idempotent.
--
-- WRITE MODEL: append-only.
-- The survey INSERTs a fresh snapshot of all answers so far on every save,
-- tagged with a stable `session_id`. It never updates. The admin panel keeps
-- the newest row per session (see src/lib/admin/supabase-admin.ts).
--
-- Why: `anon` has INSERT and nothing else. The anon key ships in the browser
-- bundle, so anything it can do, any participant can do to anyone's data.
-- Granting SELECT would expose every response — including contact details and
-- PHQ-9 item 9 (suicidal ideation) — to anyone who opens devtools.
--
-- Without SELECT, three common Postgres/PostgREST operations are impossible,
-- and this is the trap that makes the design non-obvious:
--   * Prefer: return=representation  → returning the row needs SELECT  → 42501
--   * upsert / ON CONFLICT           → conflict lookup needs SELECT    → 42501
--   * UPDATE ... WHERE id = ...      → the WHERE needs SELECT          → silently
--                                      returns 204 with 0 rows affected
-- The last one is the dangerous one: it looks like success and drops the write.
-- Hence append-only. Do not add an UPDATE policy without also solving the read.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists responses (
  id uuid primary key default gen_random_uuid(),
  -- Groups the append-only snapshots belonging to one participant's session.
  -- Null on rows written before the append-only migration.
  session_id uuid,
  created_at timestamptz default now(),
  consent_name text not null,
  consent_date date not null,
  answers jsonb not null,
  gad7_score int,
  phq9_score int,
  phq9_item9_flag boolean default false,
  safety_followup text,
  completion_status text default 'in_progress',
  -- How far the wizard advanced. NOT proof of answers: set to
  -- TOTAL_SECTIONS + 1 on submit even if sections were skipped. The admin panel
  -- derives real coverage by counting stored answers instead.
  last_section int,
  device_info text,
  duration_seconds int,
  -- Soft delete. Set on every snapshot in a session when an admin removes it.
  -- Rows are never destroyed here, so a mistaken delete is always recoverable;
  -- only the service role can write this (participants have INSERT only).
  deleted_at timestamptz
);

-- For existing databases created before these columns were introduced.
alter table responses add column if not exists session_id uuid;
alter table responses add column if not exists deleted_at timestamptz;

-- Admin reads are ordered by created_at within a session.
create index if not exists responses_session_idx
  on responses (session_id, created_at desc);

create index if not exists responses_deleted_idx on responses (deleted_at);

alter table responses enable row level security;

-- ── Policies ────────────────────────────────────────────────────────────────
-- Drop every existing policy first so re-running this file cannot leave a
-- stale permissive policy behind (dropping by name misses renamed ones).
do $$
declare p record;
begin
  for p in select policyname from pg_policies
           where schemaname = 'public' and tablename = 'responses'
  loop
    execute format('drop policy %I on responses', p.policyname);
  end loop;
end $$;

-- RLS filters rows; the role still needs table-level privileges. Revoke first
-- so a re-run tightens an over-granted table rather than leaving it open.
revoke all on public.responses from anon;
grant usage on schema public to anon;
grant insert on public.responses to anon;

-- The only thing participants may do. No SELECT, no UPDATE, no DELETE.
create policy "anon_insert" on responses
  for insert to anon with check (true);

-- The admin panel reads with the service_role key, which bypasses RLS entirely
-- (src/lib/admin/supabase-admin.ts). No SELECT policy is defined on purpose.

-- ── Verify ──────────────────────────────────────────────────────────────────
-- Expect exactly one row: anon_insert | INSERT | {anon}
select policyname, cmd, roles, permissive
from pg_policies
where tablename = 'responses';
