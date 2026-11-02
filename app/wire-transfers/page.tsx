import Link from 'next/link'
import LinkAccountForm from './link-account-form'

export default function WireTransfersPage() {
  return (
    <main className="page premium-wire-page">
      <header className="nav">
        <Link className="brand" href="/">VAULT<span>EX</span></Link>
        <nav aria-label="Main navigation">
          <Link href="/">Home</Link>
          <Link href="/shipping">Shipping</Link>
          <Link href="/support">Support</Link>
        </nav>
      </header>
      <section className="wire-intro">
        <div>
          <p className="eyebrow">Bank wire service</p>
          <h1>Your existing account, <span>securely connected.</span></h1>
          <p>
            Confirm your identity to link an existing VAULTEX bank-wire account. Account
            linking is separate from sending a transfer.
          </p>
        </div>
        <aside className="wire-status-panel">
          <span className="overview-status">CURRENT STATUS</span>
          <strong>Transfers unavailable</strong>
          <p>No customer wire can be submitted or tracked in this app.</p>
        </aside>
      </section>
      <div className="wire-guardrail">
        <span aria-hidden="true">i</span>
        <p>
          Column has confirmed that its outgoing domestic USD wires use
          Fedwire. VAULTEX transfer access and production approval are still
          unverified, and this app does not submit wires. International
          corridors, fees, beneficiary requirements, and limits also remain
          unconfirmed.
        </p>
      </div>
      <section className="link-account-section">
        <div className="link-account-copy">
          <p className="eyebrow">Account access</p>
          <h2>Link an existing account</h2>
          <p>Use your confirmed customer login, the phone number and PIN already on your account, and a one-time phone code.</p>
        </div>
        <LinkAccountForm />
      </section>
      <footer className="footer">
        <div className="footer-links">
          <Link href="/">Home</Link>
          <Link href="/support">Support</Link>
          <Link href="/legal/terms">Terms</Link>
          <Link href="/legal/privacy">Privacy</Link>
        </div>
        <p>Account linking does not enable wire initiation. No live transfer is available here.</p>
      </footer>
    </main>
  )
}
