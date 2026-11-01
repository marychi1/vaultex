import Link from 'next/link'

export default function LegalDraft({
  title,
  shippingDisclosure = false,
}: {
  title: string
  shippingDisclosure?: boolean
}) {
  return (
    <main className="page">
      <header className="nav">
        <Link className="brand" href="/">VAULT<span>EX</span></Link>
        <nav aria-label="Legal navigation">
          <Link href="/">Home</Link>
          <Link href="/legal">Legal</Link>
        </nav>
      </header>
      <section className="hero">
        <p className="eyebrow">Draft — not operative</p>
        <h1>{title}</h1>
        <p>
          This draft has not been reviewed or approved for a live financial service. VAULTEX
          does not currently offer bank-wire transfers through this application. Do not rely
          on this page as a contract, privacy notice, compliance program, or legal advice.
        </p>
        <p>
          Before launch, this document must be replaced with counsel-approved language
          based on the actual operating entity, supported jurisdictions, Column services,
          fees, customer-data flows, and applicable requirements.
        </p>
        {shippingDisclosure && (
          <p>
            The separate FedEx shipping workspace is sandbox-only. If used, sender and
            recipient names, phone numbers, addresses, and package details are sent to
            FedEx sandbox services to request rates, create test labels, and retrieve
            tracking details. Production shipping is not enabled.
          </p>
        )}
        <Link className="secondary" href="/wire-transfers">Wire service status</Link>
      </section>
    </main>
  )
}
