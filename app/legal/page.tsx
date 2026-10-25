'use client'
import Link from 'next/link'
export default function LegalIndex() {
  return (
    <div style={{ minHeight:'100vh',background:'#060A12',padding:'60px 24px' }}>
      <div style={{ maxWidth:600,margin:'0 auto' }}>
        <Link href="/" style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:20,letterSpacing:3,color:'#fff',textDecoration:'none',display:'block',marginBottom:40 }}>VAULT<span style={{color:'#00F0FF'}}>EX</span></Link>
        <h1 style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:32,color:'#fff',marginBottom:8 }}>Legal</h1>
        <p style={{ color:'#6A7D96',marginBottom:32 }}>Our policies and terms governing use of the VAULTEX platform.</p>
        <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
          {[
            { href:'/legal/terms',    title:'Terms of Service',  desc:'Rules governing your use of VAULTEX' },
            { href:'/legal/privacy',  title:'Privacy Policy',    desc:'How we collect and use your data' },
            { href:'/legal/cookies',  title:'Cookie Policy',     desc:'How we use cookies on our platform' },
            { href:'/legal/aml',      title:'AML/KYC Policy',    desc:'Anti-money laundering compliance' },
          ].map(l=>(
            <Link key={l.href} href={l.href} style={{ background:'#0D1624',border:'1px solid #1C2B42',borderRadius:12,padding:'18px 20px',textDecoration:'none',display:'flex',justifyContent:'space-between',alignItems:'center',transition:'border .2s' }}
            onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(0,240,255,0.3)'}
            onMouseLeave={e=>e.currentTarget.style.borderColor='#1C2B42'}
            >
              <div>
                <div style={{ fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:13,color:'#E2EAF5',marginBottom:3 }}>{l.title}</div>
                <div style={{ fontSize:11,color:'#6A7D96' }}>{l.desc}</div>
              </div>
              <span style={{ color:'#00F0FF',fontSize:14 }}>→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
