# VAULTEX customer app

VAULTEX is being narrowed to domestic and international bank wires. This Next.js app currently provides product-scope and service-status information only. It is not connected to an authenticated Column wire workflow; no transfer can be initiated or tracked here.

Crypto, wallets, blockchain features, cards, and onramps are not offered. Old data/schema is not automatically deleted as part of this UI conversion.

## Current limitations

- The customer app uses Supabase email-link authentication; it is not integrated with the separate Vaultexw backend identity.
- The backend currently models USD wires. International countries, currencies, beneficiary requirements, fees, FX, and delivery times have not been confirmed with Column.
- The legal and compliance pages are drafts, not operative policies or agreements. Qualified review and approved customer disclosures are required before launch.
- Do not use this app to submit payment instructions, identity documents, or sensitive account details.
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

## Checks

```powershell
npm run lint
npm run typecheck
npm run build
```

Do not deploy as a functioning wire-transfer product until Column capabilities and the authenticated customer-to-backend identity design are confirmed, tested, and reviewed. Existing database records are intentionally not deleted or reclassified by this UI change.
