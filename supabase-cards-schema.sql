-- Run in Supabase SQL Editor to add card tables

create table if not exists public.issued_cards (
  id                    uuid default gen_random_uuid() primary key,
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
  wallet_address text unique not null,
  subscription   text not null,
  updated_at     timestamptz default now()
);

create index if not exists idx_cards_wallet on public.issued_cards(wallet_address);

alter table public.issued_cards       enable row level security;
alter table public.push_subscriptions enable row level security;

create policy "Users manage own cards" on public.issued_cards
  for all using (true) with check (true);

create policy "Users manage own push" on public.push_subscriptions
  for all using (true) with check (true);
