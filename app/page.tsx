import Link from 'next/link'

const LINKS = [
  ['Bank wires', '/wire-transfers'],
  ['Support', '/support'],
  ['Legal', '/legal'],
  ['Dashboard', '/dashboard'],
]

export default function Home() {
  return (
    <main className="page">
      <header className="nav">
        <Link className="brand" href="/" aria-label="VAULTEX home">
          VAULT<span>EX</span>
        </Link>
        <nav aria-label="Main navigation">
          {LINKS.map(([label, href]) => (
            <Link key={label} href={href}>{label}</Link>
          ))}
        </nav>
      </header>

      <section className="hero">
        <p className="eyebrow">Bank wire transfers</p>
        <h1>Focused on domestic and international bank wires.</h1>
        <p>
          VAULTEX is being narrowed to bank transfers only. The customer app is not yet
          connected to a live, customer-authorized wire workflow. Do not use it to initiate
          or rely on a transfer.
        </p>
        <p>Crypto, wallets, cards, and blockchain services are not offered.</p>
        <div className="actions">
          <Link className="cta" href="/wire-transfers">VIEW SERVICE STATUS</Link>
          <Link className="secondary" href="/support">SUPPORT</Link>
        </div>
      </section>

      <section className="section grid" aria-label="Wire service status">
        <article className="card feature-card">
          <span className="badge" aria-hidden="true">01</span>
          <h2>Domestic wires</h2>
          <p>Not enabled in this customer app. No transfer can be sent from here.</p>
          <span className="tag">Unavailable</span>
        </article>
        <article className="card feature-card">
          <span className="badge" aria-hidden="true">02</span>
          <h2>International wires</h2>
          <p>
            Availability, countries, currencies, required beneficiary details, fees, and
            delivery times still need confirmation from Column.
          </p>
          <span className="tag">Not confirmed</span>
        </article>
      </section>

      <footer className="footer">
        <div className="footer-links">
          <Link href="/legal/terms">Terms</Link>
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/legal/aml">AML/KYC</Link>
          <Link href="/support">Support</Link>
        </div>
        <p>VAULTEX is not currently offering live bank-wire transfers through this application.</p>
      </footer>
    </main>
  )
}
