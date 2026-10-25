import Link from 'next/link'

export const metadata = { title: 'Terms of Service — VAULTEX' }
const s = () => ({ fontFamily:'Syne,sans-serif',fontWeight:800 as const,fontSize:16,color:'#fff',marginBottom:10,marginTop:28 } as const)
export default function Terms() {
  return (
    <div style={{ minHeight:'100vh',background:'#060A12',padding:'60px 24px' }}>
      <div style={{ maxWidth:720,margin:'0 auto' }}>
        <Link href="/" style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:18,letterSpacing:3,color:'#fff',textDecoration:'none',display:'block',marginBottom:10 }}>VAULT<span style={{color:'#00F0FF'}}>EX</span></Link>
        <Link href="/legal" style={{ fontSize:11,color:'#6A7D96',textDecoration:'none',display:'block',marginBottom:32 }}>← Back to Legal</Link>
        <h1 style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:32,color:'#fff',marginBottom:6 }}>Terms of Service</h1>
        <p style={{ color:'#6A7D96',marginBottom:32,fontSize:12 }}>Last updated: January 1, 2025 · Effective: January 1, 2025</p>
        <div style={{ color:'#8A9CB5',lineHeight:1.9,fontSize:13 }}>
          <p style={{ marginBottom:16 }}>Welcome to VAULTEX. By accessing or using our platform, you agree to be bound by these Terms of Service. Please read them carefully.</p>
          {[
            ['1. Acceptance of Terms','By creating a VAULTEX account or using any of our services, you confirm that you are at least 18 years old, have the legal capacity to enter into these terms, and agree to comply with all applicable laws and regulations in your jurisdiction.'],
            ['2. Description of Services','VAULTEX provides a non-custodial digital asset management platform including cryptocurrency storage, token swaps, virtual debit card issuance, and DeFi yield products. All services are provided "as is" and subject to availability.'],
            ['3. Non-Custodial Nature','VAULTEX is a non-custodial platform. We do not hold, control, or have access to your private keys or digital assets. You are solely responsible for the security of your wallet credentials, private keys, and seed phrases. Loss of these credentials may result in permanent loss of access to your assets.'],
            ['4. Prohibited Activities','You may not use VAULTEX for money laundering, terrorist financing, fraud, market manipulation, sanctions violations, or any other illegal activity. Violation may result in immediate account termination and reporting to relevant authorities.'],
            ['5. Fees','VAULTEX charges fees for certain services including token swaps (0.1-0.3%), virtual card transactions, and yield products. Fee schedules are displayed before each transaction. We reserve the right to modify fees with reasonable notice.'],
            ['6. Risk Disclosure','Digital assets are highly volatile. You may lose some or all of your investment. Past performance is not indicative of future results. DeFi products carry smart contract risk. VAULTEX is not responsible for losses arising from market movements, smart contract bugs, or protocol failures.'],
            ['7. Limitation of Liability','To the maximum extent permitted by law, VAULTEX shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform, including loss of profits, data, or digital assets.'],
            ['8. Governing Law','These terms are governed by the laws of Singapore. Any disputes shall be resolved through binding arbitration in Singapore under SIAC rules.'],
            ['9. Changes to Terms','We may update these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms. Material changes will be communicated via email.'],
            ['10. Contact','For questions about these terms, contact us at legal@vaultexwallet.io'],
          ].map(([title,body])=>(
            <div key={title as string}>
              <h2 style={s()}>{title}</h2>
              <p style={{ marginBottom:8 }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
