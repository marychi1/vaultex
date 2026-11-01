import Link from 'next/link'

export default function SupportPage() {
  return (
    <main className="page">
      <header className="nav">
        <Link className="brand" href="/">VAULT<span>EX</span></Link>
        <nav aria-label="Main navigation">
          <Link href="/">Home</Link>
          <Link href="/wire-transfers">Bank wires</Link>
        </nav>
      </header>
      <section className="hero">
        <p className="eyebrow">Support</p>
        <h1>Bank wires are not available in this app.</h1>
        <p>
          Do not submit payment instructions, identity documents, or account details here.
          If you already initiated a transfer, check directly with your bank and Column
          through their official channels. Do not retry a transfer until its status is confirmed.
        </p>
        <Link className="cta" href="/wire-transfers">VIEW SERVICE STATUS</Link>
      </section>
    </main>
  )
}
