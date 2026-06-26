export const metadata = { title: 'AML/KYC Policy — VAULTEX' }
export default function AML() {
  return (
    <div style={{ minHeight:'100vh',background:'#060A12',padding:'60px 24px' }}>
      <div style={{ maxWidth:720,margin:'0 auto' }}>
        <a href="/" style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:18,letterSpacing:3,color:'#fff',textDecoration:'none',display:'block',marginBottom:10 }}>VAULT<span style={{color:'#00F0FF'}}>EX</span></a>
        <a href="/legal" style={{ fontSize:11,color:'#6A7D96',textDecoration:'none',display:'block',marginBottom:32 }}>← Back to Legal</a>
        <h1 style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:32,color:'#fff',marginBottom:6 }}>AML / KYC Policy</h1>
        <p style={{ color:'#6A7D96',marginBottom:32,fontSize:12 }}>Anti-Money Laundering & Know Your Customer Policy · Last updated: January 1, 2025</p>
        <div style={{ color:'#8A9CB5',lineHeight:1.9,fontSize:13 }}>
          {[
            ['Our Commitment','VAULTEX is committed to preventing money laundering, terrorist financing, and other financial crimes. We comply with applicable AML/CFT laws in all jurisdictions where we operate, including FinCEN (USA), FCA (UK), MAS (Singapore), and MiCA (EU).'],
            ['KYC Requirements','All users must complete identity verification before accessing financial services. We collect: government-issued photo ID, proof of address, selfie/liveness check, source of funds declaration for transactions above $10,000.'],
            ['Transaction Monitoring','We monitor all transactions in real-time using AI-powered systems. Suspicious activities are flagged and reviewed by our compliance team. We report suspicious transactions to relevant financial intelligence units as required by law.'],
            ['Sanctions Screening','We screen all users and transactions against OFAC, EU, UN, and UK sanctions lists. Users from sanctioned countries or matched against sanctions lists will be denied access to our platform.'],
            ['Record Keeping','We maintain KYC records for a minimum of 5 years after account closure, as required by applicable regulations. Transaction records are kept for 7 years.'],
            ['Reporting Obligations','VAULTEX files Suspicious Activity Reports (SARs) and Currency Transaction Reports (CTRs) as required. We cooperate fully with law enforcement investigations.'],
            ['Compliance Officer','Our Chief Compliance Officer oversees AML/KYC programs. For compliance inquiries: compliance@vaultexwallet.io'],
          ].map(([title,body])=>(
            <div key={title as string}>
              <h2 style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:16,color:'#fff',marginBottom:8,marginTop:24 }}>{title}</h2>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
