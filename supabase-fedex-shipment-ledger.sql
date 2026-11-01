create table if not exists public.fedex_shipments (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete restrict,
  idempotency_key text not null check (length(idempotency_key) between 16 and 255),
  shipment_reference text not null check (shipment_reference ~ '^[A-Za-z0-9][A-Za-z0-9._-]{2,63}$'),
  status text not null check (status in ('pending', 'submitted', 'unknown')),
  tracking_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_user_id, idempotency_key),
  unique (owner_user_id, shipment_reference)
);

alter table public.fedex_shipments enable row level security;

grant select, insert on public.fedex_shipments to authenticated;
revoke update on public.fedex_shipments from authenticated;
grant update (status, tracking_number, updated_at)
  on public.fedex_shipments to authenticated;

drop policy if exists "Users can read their FedEx shipments" on public.fedex_shipments;
create policy "Users can read their FedEx shipments"
  on public.fedex_shipments for select
  using (auth.uid() = owner_user_id);

drop policy if exists "Users can reserve their own FedEx shipments" on public.fedex_shipments;
create policy "Users can reserve their own FedEx shipments"
  on public.fedex_shipments for insert
  with check (auth.uid() = owner_user_id and status = 'pending');

drop policy if exists "Users can update their own FedEx shipment status" on public.fedex_shipments;
create policy "Users can update their own FedEx shipment status"
  on public.fedex_shipments for update
  using (auth.uid() = owner_user_id)
  with check (auth.uid() = owner_user_id);

create index if not exists fedex_shipments_owner_created_idx
  on public.fedex_shipments (owner_user_id, created_at desc);
