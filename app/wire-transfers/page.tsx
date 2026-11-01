import Link from 'next/link'

export default function WireTransfersPage() {
  return (
    <main className="page">
      <header className="nav">
        <Link className="brand" href="/">VAULT<span>EX</span></Link>
        <nav aria-label="Main navigation">
          <Link href="/">Home</Link>
          <Link href="/support">Support</Link>
        </nav>
      </header>
      <section className="hero">
        <p className="eyebrow">Bank wire service</p>
        <h1>Transfers are not enabled.</h1>
        <p>
          This customer app is not connected to the bank-wire backend or a verified customer
          identity. Do not submit payment instructions here. No wire can be initiated or
          tracked in this app.
        </p>
        <p>
          The current backend is USD-only. International wire availability, supported
          countries and currencies, beneficiary requirements, fees, and delivery times
          must be confirmed with Column before they can be offered.
        </p>
        <Link className="secondary" href="/support">Support</Link>
      </section>
    </main>
  )
}
