-- Apply in the Supabase SQL Editor before deploying customer transaction history.
-- Transaction writes must come from trusted server-side provider webhooks.

create table if not exists public.transactions (
  id                 uuid primary key default gen_random_uuid(),
  reference          text not null default (
    'VTX-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 16))
  ),
  user_id            uuid not null references auth.users(id) on delete cascade,
  type               text not null check (type in ('swap', 'send', 'receive', 'earn', 'card_spend')),
  from_token         text not null,
  to_token           text,
  from_amount        numeric not null,
  to_amount          numeric,
  usd_value          numeric,
  tx_hash            text,
  provider_event_id  text,
  merchant_name      text,
  status             text not null check (status in ('pending', 'confirmed', 'failed')),
  created_at         timestamptz not null default now(),
  chain              text not null,
  fee_usd            numeric
);

alter table public.transactions
  add column if not exists reference text,
  add column if not exists provider_event_id text,
  add column if not exists merchant_name text;

update public.transactions
set reference = 'VTX-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 16))
where reference is null;

alter table public.transactions
  alter column reference set default (
    'VTX-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 16))
  ),
  alter column reference set not null;

create unique index if not exists idx_transactions_reference
  on public.transactions(reference);
create unique index if not exists idx_transactions_provider_event
  on public.transactions(provider_event_id);
create index if not exists idx_transactions_user_created
  on public.transactions(user_id, created_at desc);

alter table public.transactions enable row level security;

do $$
declare
  policy_row record;
begin
  for policy_row in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'transactions'
  loop
    execute format('drop policy if exists %I on public.transactions', policy_row.policyname);
  end loop;
end
$$;

create policy "Users read own transactions" on public.transactions
  for select to authenticated using (user_id = (select auth.uid()));

revoke all on table public.transactions from anon, authenticated;
grant select on table public.transactions to authenticated;
grant all on table public.transactions to service_role;
