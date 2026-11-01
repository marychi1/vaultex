# VAULTEX customer app

VAULTEX provides bank-wire service information and a separate FedEx parcel-shipping workspace. Shipping is not part of the bank-wire workflow. This app is not connected to an authenticated Column wire workflow; no bank transfer can be initiated or tracked here.

Crypto, wallets, blockchain features, cards, and onramps are not offered. Old data/schema is not automatically deleted as part of this UI conversion.

## Current limitations

- The customer app uses Supabase email-link authentication; it is not integrated with the separate Vaultexw backend identity.
- FedEx shipping supports US domestic rate quotes, single-package labels, and tracking lookups. Sandbox is the default; production API access and billable labels are separately gated.
- FedEx sandbox credentials must be stored as server-side environment variables. Never use a `NEXT_PUBLIC_` prefix for FedEx credentials or commit them to the repository.
- The backend currently models USD wires. International countries, currencies, beneficiary requirements, fees, FX, and delivery times have not been confirmed with Column.
- The legal and compliance pages are drafts, not operative policies or agreements. Qualified review and approved customer disclosures are required before launch.
- Do not enter payment instructions, identity documents, or bank account details. Shipping addresses and phone numbers submitted in the FedEx workspace are sent to the FedEx sandbox.
- Previous receipt records, if present, represent provider-recorded card or crypto activity—not Column bank wires—and are not displayed as wire history.

## Local development

Requirements: Node.js 22+ and npm.

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in
`.env.local` only when testing email-link authentication. Never commit
`.env.local`, production credentials, or a Supabase service-role key.

To test the separate FedEx workspace, set `FEDEX_ENV=sandbox`,
`FEDEX_API_KEY`, `FEDEX_SECRET_KEY`, and `FEDEX_ACCOUNT_NUMBER` in the
server-side `.env.local`. Obtain sandbox credentials through the FedEx
Developer Portal; do not paste them into chat or expose them to the browser.
Sign in and open `/shipping` to request US domestic test rates, create a
sandbox label, or look up a tracking number. Sandbox calls use
`https://apis-sandbox.fedex.com`.

Production calls use `https://apis.fedex.com` only when `FEDEX_ENV=production`
and `FEDEX_PRODUCTION_ENABLED=true`. Production label creation has an additional
gate: apply `supabase-fedex-shipment-ledger.sql`, set
`FEDEX_PRODUCTION_LABELS_ENABLED=true`, and configure
`FEDEX_PRODUCTION_ALLOWED_USER_IDS` with only explicitly authorized Supabase
user UUIDs. Use separate FedEx credentials in each hosting environment. The
user must enter a unique shipment reference and type `CREATE LABEL`; a durable
per-user ledger prevents reusing an idempotency key or shipment reference.
If the upstream result is uncertain, reconcile it with FedEx before attempting
another label.

The app does not set declared value or arrange insurance. Do not use it to
create a $50,000 shipment label until FedEx confirms service eligibility,
declared-value limits, packaging rules, and coverage requirements. A declared
value is not insurance.

## Checks

```powershell
npm run lint
npm run typecheck
npm run build
```

Do not deploy as a functioning wire-transfer product until Column capabilities and the authenticated customer-to-backend identity design are confirmed, tested, and reviewed. Existing database records are intentionally not deleted or reclassified by this UI change. FedEx shipping is separate and does not enable bank wires. Keep the production flags disabled until production credentials, the shipment ledger, and authorized-user controls have been independently verified.
