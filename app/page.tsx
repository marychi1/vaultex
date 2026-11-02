import Link from 'next/link'

const LINKS = [
  ['Bank wires', '/wire-transfers'],
  ['FedEx shipping', '/shipping'],
  ['Support', '/support'],
  ['Legal', '/legal'],
  ['Dashboard', '/dashboard'],
]

export default function Home() {
  return (
    <main className="page premium-customer-home">
      <header className="nav">
        <Link className="brand" href="/" aria-label="VAULTEX home">
          V<span>AULTEX</span>
        </Link>
        <nav aria-label="Main navigation">
          {LINKS.map(([label, href]) => (
            <Link key={label} href={href}>{label}</Link>
          ))}
          <Link className="nav-login" href="/login">Sign in</Link>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">A more considered customer experience</p>
          <h1>Clarity at every step.</h1>
          <p>
            Explore VAULTEX bank-wire service information and connect an existing account.
            Transfers are not enabled in this customer app.
          </p>
          <div className="actions">
            <Link className="cta" href="/wire-transfers">EXPLORE BANK WIRES</Link>
            <Link className="secondary" href="/support">CONTACT SUPPORT</Link>
          </div>
          <div className="customer-assurance">
            <span aria-hidden="true">✓</span> Account security first
            <span className="assurance-divider" aria-hidden="true" />
            No live transfers
          </div>
        </div>
        <aside className="overview-panel" aria-label="VAULTEX service overview">
          <div className="overview-heading">
            <span>YOUR SERVICES</span>
            <span className="overview-mark" aria-hidden="true">V</span>
          </div>
          <div className="overview-item">
            <span className="overview-icon" aria-hidden="true">01</span>
            <div><strong>Bank wire service</strong><small>Account linking only · transfers unavailable</small></div>
            <span className="overview-status">LIMITED</span>
          </div>
          <div className="overview-item">
            <span className="overview-icon shipping-icon" aria-hidden="true">02</span>
            <div><strong>FedEx shipping</strong><small>Separate domestic sandbox workspace</small></div>
            <span className="overview-status available">SANDBOX</span>
          </div>
          <div className="overview-note">
            Different services, separate workflows. Shipping does not move money.
          </div>
        </aside>
      </section>

      <section className="section premium-section" aria-label="VAULTEX services">
        <div className="section-heading">
          <p className="eyebrow">Designed with intention</p>
          <h2>Essential services. Clear boundaries.</h2>
        </div>
        <div className="grid">
          <article className="card feature-card">
            <span className="badge" aria-hidden="true">01</span>
            <h2>Bank wires</h2>
            <p>Review service information and securely link an existing account. Customer-initiated transfers are not available here.</p>
            <Link href="/wire-transfers" className="text-link">View wire service <span aria-hidden="true">→</span></Link>
          </article>
          <article className="card feature-card">
            <span className="badge shipping-badge" aria-hidden="true">02</span>
            <h2>Parcel shipping</h2>
            <p>Request domestic test rates, create sandbox labels, and look up tracking in a separate FedEx workspace.</p>
            <Link href="/shipping" className="text-link">Explore shipping <span aria-hidden="true">→</span></Link>
          </article>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-links">
          <Link href="/legal/terms">Terms</Link>
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/legal/aml">AML/KYC</Link>
          <Link href="/support">Support</Link>
        </div>
        <span className="footer-brand">VAULTEX <span>·</span> Built around trust.</span>
      </footer>
    </main>
  )
}
