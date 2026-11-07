# Vaultex USD Wallet — Implementation Plan

**Entity:** Vaultex Technologies Inc.  
**Model:** Partner-powered  
**Market:** United States  
**Clients:** Web + mobile  
**Currency:** USD  
**Features:** Receive money, send money, bank withdrawals, wallet-to-wallet transfers, international transfers

## Launch gate

This plan is not proof of sponsor-bank, Column, payment-provider, or regulatory approval. Do not accept, hold, move, or represent real customer funds as available until qualified counsel and the provider approve the funds-flow, partner contract, licensing/exemption analysis, controls, and production access.

International transfers are a later release and require separate approval of supported countries/currencies, FX, payout partners, disclosures, sanctions screening, recipient verification, limits, and local legal requirements.

## Architecture

- Next.js responsive web client; mobile app later (React Native/Expo) using the same API.
- Server-side backend is the trusted boundary for wallet/payment commands.
- Supabase Auth + PostgreSQL for identity linkage, app data, ledger, workflow, and audit.
- Provider adapter (Column or another approved partner) keeps product logic provider-independent.
- Double-entry ledger is authoritative for wallet liabilities; provider statements/balances are separately reconciled.
- Signed webhooks, idempotency, event deduplication, retries, and reconciliation.
- Provider secrets and Supabase service-role keys stay server-side.

## MVP scope

1. Onboarding, email/phone verification, KYC/KYB status, risk/account restrictions.
2. USD wallet record creation only after eligibility checks.
3. Balance view with available, pending, and transaction history.
4. Receive money through provider-approved account/funding instructions only.
5. Send/withdraw: recipient review, fee/limit disclosure, step-up auth, provider submission and status tracking.
6. Internal wallet transfer: atomic ledger debit/credit, recipient validation, limits, fraud checks.
7. International transfer feature remains disabled until provider and compliance approval.
8. Admin/support: transaction search, risk review, reconciliation exceptions, audited approvals. No silent balance edits.

## Ledger rules

- Store amounts as integer USD cents, never floating point.
- Each posted transaction has equal debits and credits.
- Ledger entries are append-only; corrections use compensating entries.
- Separate pending, available, reserved, and settled funds.
- Prevent overdrafts atomically with database locking/constraints.
- Idempotency required for every money-moving request.
- Clients cannot directly write ledger entries or modify balances.
- Customer balance is derived from ledger state, not webhook payloads alone.
- Reconcile daily and on provider events; differences enter an exception queue.

## Target data model (not yet applied)

- wallet_accounts: user, currency, lifecycle status, partner reference (server-only).
- ledger_accounts: customer liability, provider clearing, fees, suspense.
- ledger_transactions: transaction header, type/status, idempotency key, external reference.
- ledger_entries: account, debit/credit, amount_minor, currency.
- payment_intents: wallet, beneficiary, amount, fee, provider, status.
- beneficiaries: verified recipient info; sensitive fields encrypted/tokenized.
- provider_events: deduplicated event ID, provider/type, payload reference, timestamps.
- reconciliation_runs/items: provider-to-ledger comparisons and exceptions.
- risk_reviews and audit_log: review decision, actor, action, target, timestamps.

All exposed tables require RLS. Privileged payment operations run server-side with authentication, authorization, and audit. Never expose service-role credentials in the browser/mobile app.

## Status model

CREATED -> REQUIRES_REVIEW or PENDING_PROVIDER -> PROCESSING -> COMPLETED

Exception states: FAILED, CANCELLED, RETURNED, REVERSED, ON_HOLD, RECIPIENT_POSTING_CONFIRMATION_PENDING.

Provider acceptance is not automatically proof of beneficiary-bank posting. Customer-facing completion semantics must match rail/provider evidence and disclosures.

## Compliance and security gates

- Counsel-approved funds-flow diagram and U.S. state licensing/registration analysis.
- Partner approval of custody/safeguarding/FBO structure (where applicable), settlement, returns, disputes, reconciliation, and customer responsibilities.
- BSA/AML, sanctions, transaction monitoring, escalation/reporting, record retention, and compliance officer.
- KYC/KYB vendor and identity verification.
- Fraud controls: velocity, limits, device/account risk, new-beneficiary controls, holds, step-up auth.
- Counsel/provider-approved terms, privacy, fees, disclosures, complaints and error-resolution processes.
- Security review, penetration testing, incident response, access reviews, backups, disaster recovery.
- PCI scope review before adding card funding; do not store card data directly.

## Phased delivery

### Phase 0 — Partner and product validation
Confirm partner/sponsor bank, supported rails, legal entity, customer eligibility, account structure, funding/withdrawal flow, fees, limits, timing, returns, and operational ownership. Confirm Column contract/product supports the proposed wallet; wire APIs do not inherently provide wallet custody or internal transfers.

### Phase 1 — Safe foundation
Create a separate USD schema/migration (do not reuse crypto tables). Implement sandbox/demo wallet creation, server-only ledger, RLS, audit logs, feature flags, and tests for balance integrity, idempotency, concurrency, reversals, and overdraft prevention.

### Phase 2 — UI
Wallet dashboard, activity, funding instructions, beneficiaries, transfer review, status/receipt, support, and restricted-account states. Web and mobile share authenticated API.

### Phase 3 — Provider sandbox
Provider adapter, webhook signature validation, event deduplication, status mapping, sandbox flows for success/failure/return/duplicate/delay/out-of-order events, and reconciliation.

### Phase 4 — Readiness
Complete KYC/KYB, AML/sanctions, monitoring, risk, support/admin workflows, policies, partner review, and security review.

### Phase 5 — Controlled pilot
Only with written partner/counsel approval and production credentials. Limit pilot users and transaction amounts, reconcile daily, monitor, and define rollback/incident response.

### Phase 6 — International transfers
Separate launch gate for provider country/currency coverage, FX disclosures, local payout partner, screening, recipient verification, limits, and country-specific legal analysis.

## Minimum acceptance tests

- Ineligible/unverified customers cannot create active wallets.
- Clients cannot modify balances.
- Debits equal credits for every posted ledger transaction.
- Duplicate API requests/webhooks do not double-post.
- Concurrent sends cannot overspend.
- Returns/reversals create correct compensating ledger entries.
- Provider success does not falsely prove recipient posting.
- RLS blocks cross-customer data access.
- Admin actions are least-privilege and audited.
- Reconciliation detects mismatches.
- Feature flags prevent unauthorized production money movement.

## Status

- [x] Existing Vaultex repository and Supabase schema inspected.
- [x] Crypto wallet schema identified as separate from proposed USD wallet.
- [x] Product architecture and implementation phases documented.
- [ ] Partner funds-flow approval and legal/licensing analysis.
- [ ] USD ledger schema review.
- [ ] Wallet backend and UI.
- [ ] Provider sandbox/webhook validation.
- [ ] Production approval and pilot.
