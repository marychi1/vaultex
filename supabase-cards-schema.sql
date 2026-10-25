-- Run in the Supabase SQL Editor for a new installation.
-- Existing installations should run supabase-security-migration.sql instead.

create table if not exists public.issued_cards (
  id                    uuid default gen_random_uuid() primary key,
  owner_user_id         uuid not null references auth.users(id) on delete cascade,
  wallet_address        text not null,
  stripe_cardholder_id  text not null,
  stripe_card_id        text not null unique,
  last4                 text not null,
  expiry_month          int not null,
  expiry_year           int not null,
  network               text default 'visa',
  daily_limit           numeric default 2500,
  spent_today           numeric default 0,
  status                text default 'active' check (status in ('active','frozen','cancelled')),
  online_enabled        boolean default true,
  intl_enabled          boolean default false,
  created_at            timestamptz default now()
);

create table if not exists public.push_subscriptions (
  id             uuid default gen_random_uuid() primary key,
  owner_user_id  uuid not null unique references auth.users(id) on delete cascade,
  wallet_address text unique,
  subscription   text not null,
  updated_at     timestamptz default now()
);

create index if not exists idx_cards_owner_user on public.issued_cards(owner_user_id);

alter table public.issued_cards enable row level security;
alter table public.push_subscriptions enable row level security;

drop policy if exists "Users manage own cards" on public.issued_cards;
drop policy if exists "Users manage own push" on public.push_subscriptions;
drop policy if exists "Users read own cards" on public.issued_cards;
drop policy if exists "Users manage own push subscription" on public.push_subscriptions;

create policy "Users read own cards" on public.issued_cards
  for select to authenticated using (owner_user_id = (select auth.uid()));

create policy "Users manage own push subscription" on public.push_subscriptions
  for all to authenticated
  using (owner_user_id = (select auth.uid()))
  with check (owner_user_id = (select auth.uid()));
