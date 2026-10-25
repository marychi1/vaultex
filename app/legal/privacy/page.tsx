import Link from 'next/link'

export const metadata = { title: 'Privacy Policy — VAULTEX' }
export default function Privacy() {
  return (
    <div style={{ minHeight:'100vh',background:'#060A12',padding:'60px 24px' }}>
      <div style={{ maxWidth:720,margin:'0 auto' }}>
        <Link href="/" style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:18,letterSpacing:3,color:'#fff',textDecoration:'none',display:'block',marginBottom:10 }}>VAULT<span style={{color:'#00F0FF'}}>EX</span></Link>
        <Link href="/legal" style={{ fontSize:11,color:'#6A7D96',textDecoration:'none',display:'block',marginBottom:32 }}>← Back to Legal</Link>
        <h1 style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:32,color:'#fff',marginBottom:6 }}>Privacy Policy</h1>
        <p style={{ color:'#6A7D96',marginBottom:32,fontSize:12 }}>Last updated: January 1, 2025</p>
        <div style={{ color:'#8A9CB5',lineHeight:1.9,fontSize:13 }}>
          {[
            ['Information We Collect','We collect wallet addresses, transaction history, KYC documents (name, DOB, government ID, selfie), email address, IP address, device information, and usage analytics.'],
            ['How We Use Your Information','We use your information to provide and improve our services, comply with legal obligations (KYC/AML), prevent fraud, send transaction notifications, and personalize your experience.'],
            ['Data Sharing','We do not sell your personal data. We share data with: KYC verification providers (Stripe Identity), email service providers (Resend), analytics providers (Mixpanel), and law enforcement when legally required.'],
            ['Data Retention','We retain KYC documents for 5 years as required by financial regulations. Transaction history is retained indefinitely. Account data is deleted within 30 days of account closure upon request.'],
            ['Your Rights (GDPR)','EU residents have the right to access, rectify, erase, restrict, and port their personal data. To exercise these rights, contact privacy@vaultexwallet.io. We respond within 30 days.'],
            ['Security','We use AES-256 encryption at rest, TLS 1.3 in transit, and SOC 2 Type II certified infrastructure. Private keys never leave your device.'],
            ['Cookies','We use essential cookies for authentication and analytics cookies to improve our service. See our Cookie Policy for details.'],
            ['Contact','For privacy inquiries: privacy@vaultexwallet.io · VAULTEX Inc., 1 Raffles Place, Singapore 048616'],
          ].map(([title,body])=>(
            <div key={title as string}>
              <h2 style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:16,color:'#fff',marginBottom:8,marginTop:24 }}>{title}</h2>
              <p style={{ marginBottom:8 }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
