import Link from 'next/link'

export default function KycPage() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Identity verification</p>
        <h1>Verification is not available.</h1>
        <p>
          VAULTEX does not currently provide an identity-verification workflow. Do not
          upload identity documents or enter sensitive personal information here.
        </p>
        <Link className="secondary" href="/wire-transfers">Bank wire service status</Link>
      </section>
    </main>
  )
}
