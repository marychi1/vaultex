import Link from 'next/link'

const LINKS = [
  ['Bank wires', '/wire-transfers'],
  ['Shipping', '/shipping'],
  ['Support', '/support'],
]

export default function Home() {
  return (
    <main className="page premium-customer-home">
      <header className="nav">
        <Link className="brand" href="/" aria-label="VAULTEX home">VAULT<span>EX</span></Link>
        <nav aria-label="Main navigation">
          {LINKS.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}
          <Link className="nav-login" href="/login">Sign in</Link>
        </nav>
      </header>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Financial services, made clearer</p>
          <h1>Move with <span>confidence.</span></h1>
          <p>A simpler place to manage your VAULTEX account, review bank-wire service information, and access connected services.</p>
          <div className="actions">
            <Link className="cta" href="/wire-transfers">EXPLORE BANK WIRES</Link>
            <Link className="secondary" href="/support">CONTACT SUPPORT</Link>
          </div>
          <div className="customer-assurance">
            <span aria-hidden="true">✓</span> Security-led account access
            <span className="assurance-divider" aria-hidden="true" />
            Clear service availability
          </div>
        </div>
        <aside className="overview-panel" aria-label="VAULTEX service overview">
          <div className="overview-heading"><span>YOUR SERVICES</span><span className="overview-mark" aria-hidden="true">V</span></div>
          <div className="overview-item">
            <span className="overview-icon" aria-hidden="true">01</span>
            <div><strong>Bank-wire services</strong><small>Account information and secure account linking</small></div>
            <span className="overview-status">LIMITED</span>
          </div>
          <div className="overview-item">
            <span className="overview-icon shipping-icon" aria-hidden="true">02</span>
            <div><strong>Parcel shipping</strong><small>Separate domestic carrier workspace</small></div>
            <span className="overview-status available">SEPARATE</span>
          </div>
          <div className="overview-note">Each service has its own availability and controls. Shipping does not move money.</div>
        </aside>
      </section>
      <section className="section premium-section" aria-label="VAULTEX services">
        <div className="section-heading">
          <p className="eyebrow">One clear experience</p>
          <h2>Useful services. No guesswork.</h2>
          <p className="section-intro">Know what is available before you take the next step.</p>
        </div>
        <div className="grid">
          <article className="card feature-card">
            <span className="badge" aria-hidden="true">01</span>
            <h2>Bank wires</h2>
            <p>Review current service availability and securely link an existing account. Wire submission and tracking are not currently available in this app.</p>
            <Link href="/wire-transfers" className="text-link">View bank-wire services <span aria-hidden="true">→</span></Link>
          </article>
          <article className="card feature-card">
            <span className="badge shipping-badge" aria-hidden="true">02</span>
            <h2>Parcel shipping</h2>
            <p>Access domestic carrier tools in a separate workspace. Available actions depend on the configured carrier environment.</p>
            <Link href="/shipping" className="text-link">Open shipping workspace <span aria-hidden="true">→</span></Link>
          </article>
        </div>
      </section>
      <section className="home-support">
        <div><p className="eyebrow">Need a hand?</p><h2>We’re here to help.</h2><p>For account access or service questions, contact the VAULTEX support team.</p></div>
        <Link className="secondary" href="/support">VISIT SUPPORT</Link>
      </section>
      <footer className="footer">
        <div className="footer-links">
          <Link href="/legal/terms">Terms</Link><Link href="/legal/privacy">Privacy</Link>
          <Link href="/legal/aml">AML/KYC</Link><Link href="/support">Support</Link>
        </div>
        <span className="footer-brand">VAULTEX <span>·</span> Built around trust.</span>
      </footer>
    </main>
  )
}
