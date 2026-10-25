import Link from 'next/link'

export default function ComingSoon({
  title,
  text,
}: {
  title: string
  text: string
}) {
  return (
    <main
      style={{
        maxWidth: 560,
        margin: '80px auto',
        padding: 24,
        fontFamily: 'system-ui, sans-serif',
        color: 'var(--text)',
      }}
    >
      <h1>{title}</h1>
      <p>{text}</p>
      <p>
        <Link href="/">← Back to home</Link>
      </p>
    </main>
  )
}
