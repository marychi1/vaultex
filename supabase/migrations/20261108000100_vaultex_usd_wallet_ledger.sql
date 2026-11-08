-- Vaultex USD wallet ledger foundation (sandbox/planning migration)
-- Apply only after DB review and in a non-production environment first.
-- This migration creates ledger primitives only; it does NOT connect a bank/provider,
-- create customer accounts, or authorize any real-money movement.

begin;

create table if not exists public.vaultex_usd_wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  currency text not null default 'USD' check (currency = 'USD'),
  status text not null default 'pending_kyc'
    check (status in ('pending_kyc','active','restricted','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, currency)
);

create table if not exists public.vaultex_ledger_accounts (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid references public.vaultex_usd_wallets(id) on delete restrict,
  account_code text not null,
  account_type text not null check (account_type in ('customer_liability','provider_clearing','fee_revenue','suspense','system')),
  currency text not null default 'USD' check (currency = 'USD'),
  is_system boolean not null default false,
  created_at timestamptz not null default now(),
  unique (wallet_id, account_code)
);

create table if not exists public.vaultex_ledger_transactions (
  id uuid primary key default gen_random_uuid(),
  transaction_type text not null check (transaction_type in ('wallet_funding','wallet_transfer','bank_withdrawal','provider_settlement','fee','reversal','adjustment')),
  status text not null default 'pending'
    check (status in ('pending','posted','failed','reversed')),
  currency text not null default 'USD' check (currency = 'USD'),
  amount_minor bigint not null check (amount_minor > 0),
  idempotency_key text not null unique,
  external_reference text,
  initiated_by uuid references auth.users(id) on delete restrict,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  posted_at timestamptz
);

create table if not exists public.vaultex_ledger_entries (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references public.vaultex_ledger_transactions(id) on delete restrict,
  account_id uuid not null references public.vaultex_ledger_accounts(id) on delete restrict,
  entry_side text not null check (entry_side in ('debit','credit')),
  amount_minor bigint not null check (amount_minor > 0),
  currency text not null default 'USD' check (currency = 'USD'),
  created_at timestamptz not null default now()
);

create table if not exists public.vaultex_usd_payment_intents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  wallet_id uuid not null references public.vaultex_usd_wallets(id) on delete restrict,
  direction text not null check (direction in ('inbound','outbound','internal')),
  rail text not null check (rail in ('partner_funding','bank_transfer','internal_transfer','international')),
  amount_minor bigint not null check (amount_minor > 0),
  currency text not null default 'USD' check (currency = 'USD'),
  fee_minor bigint not null default 0 check (fee_minor >= 0),
  status text not null default 'created'
    check (status in ('created','requires_review','pending_provider','processing','completed','failed','cancelled','returned','reversed','on_hold','recipient_posting_confirmation_pending')),
  idempotency_key text not null unique,
  provider_name text,
  provider_reference text,
  beneficiary_token text,
  status_detail text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vaultex_provider_events (
  id uuid primary key default gen_random_uuid(),
  provider_name text not null,
  provider_event_id text not null,
  event_type text not null,
  payment_intent_id uuid references public.vaultex_usd_payment_intents(id) on delete restrict,
  payload jsonb not null default '{}'::jsonb,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  processing_error text,
  unique (provider_name, provider_event_id)
);

create table if not exists public.vaultex_usd_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete restrict,
  action text not null,
  target_type text not null,
  target_id uuid,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists vaultex_usd_wallets_user_idx on public.vaultex_usd_wallets(user_id);
create index if not exists vaultex_payment_intents_user_created_idx on public.vaultex_usd_payment_intents(user_id, created_at desc);
create index if not exists vaultex_payment_intents_wallet_created_idx on public.vaultex_usd_payment_intents(wallet_id, created_at desc);
create index if not exists vaultex_ledger_entries_transaction_idx on public.vaultex_ledger_entries(transaction_id);
create index if not exists vaultex_ledger_entries_account_idx on public.vaultex_ledger_entries(account_id);
create index if not exists vaultex_provider_events_unprocessed_idx on public.vaultex_provider_events(received_at) where processed_at is null;

alter table public.vaultex_usd_wallets enable row level security;
alter table public.vaultex_ledger_accounts enable row level security;
alter table public.vaultex_ledger_transactions enable row level security;
alter table public.vaultex_ledger_entries enable row level security;
alter table public.vaultex_usd_payment_intents enable row level security;
alter table public.vaultex_provider_events enable row level security;
alter table public.vaultex_usd_audit_log enable row level security;

-- Customers may read only their own wallet metadata and payment intents.
create policy vaultex_usd_wallets_select_own
  on public.vaultex_usd_wallets for select to authenticated
  using (user_id = (select auth.uid()));

create policy vaultex_payment_intents_select_own
  on public.vaultex_usd_payment_intents for select to authenticated
  using (user_id = (select auth.uid()));

-- No customer policies for ledger, provider event, or audit tables.
-- Writes and privileged reads must go through a trusted server with service credentials.
revoke all on public.vaultex_usd_wallets from anon, authenticated;
revoke all on public.vaultex_ledger_accounts from anon, authenticated;
revoke all on public.vaultex_ledger_transactions from anon, authenticated;
revoke all on public.vaultex_ledger_entries from anon, authenticated;
revoke all on public.vaultex_usd_payment_intents from anon, authenticated;
revoke all on public.vaultex_provider_events from anon, authenticated;
revoke all on public.vaultex_usd_audit_log from anon, authenticated;

grant select on public.vaultex_usd_wallets to authenticated;
grant select on public.vaultex_usd_payment_intents to authenticated;

commit;
