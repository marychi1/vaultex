import Link from 'next/link'
import LinkAccountForm from './link-account-form'

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
        <h1>Link your existing account.</h1>
        <p>
          Verify your existing bank-wire account using your confirmed customer login,
          phone code, and backend PIN. Account linking does not initiate a transfer.
        </p>
        <LinkAccountForm />
        <p>
          Wire initiation remains unavailable until the Column sandbox endpoint, account
          ownership, counterparties, supported rail, and limits are confirmed and tested.
          This integration does not directly connect to Fedwire.
        </p>
        <Link className="secondary" href="/support">Support</Link>
      </section>
    </main>
  )
}
