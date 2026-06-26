export default function Home() {
  return (
    <div style={{ minHeight:'100vh',background:'#060A12',color:'#E2EAF5',fontFamily:'DM Sans,sans-serif' }}>
      <nav style={{ padding:'0 24px',height:64,display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid #1C2B42',background:'rgba(6,10,18,0.97)',position:'sticky',top:0,zIndex:100 }}>
        <span style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:20,letterSpacing:3,color:'#fff' }}>VAULT<span style={{color:'#00F0FF'}}>EX</span></span>
        <div style={{ display:'flex',gap:20,alignItems:'center' }}>
          {[['Buy Crypto','/onramp'],['KYC','/kyc'],['Support','/support'],['Legal','/legal'],['Dashboard','/dashboard']].map(([l,h])=>(
            <a key={l} href={h} style={{ fontFamily:'Syne,sans-serif',fontSize:11,fontWeight:700,color: l==='Dashboard'?'#00F0FF':'#6A7D96',textDecoration:'none',letterSpacing:'1px' }}>{l}</a>
          ))}
        </div>
      </nav>
      <div style={{ maxWidth:800,margin:'0 auto',padding:'80px 24px',textAlign:'center' }}>
        <div style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:56,color:'#fff',lineHeight:1.1,marginBottom:16 }}>
          VAULT<span style={{color:'#00F0FF'}}>EX</span>
        </div>
        <div style={{ fontSize:16,color:'#6A7D96',marginBottom:40,lineHeight:1.7 }}>
          Your digital wealth, one smart wallet. Store, swap, and spend crypto anywhere.
        </div>
        <div style={{ display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap' }}>
          <a href="/dashboard" style={{ background:'#00F0FF',color:'#060A12',textDecoration:'none',borderRadius:10,padding:'14px 28px',fontFamily:'Syne,sans-serif',fontSize:12,fontWeight:800,letterSpacing:'1px' }}>OPEN DASHBOARD</a>
          <a href="/onramp"    style={{ background:'transparent',color:'#E2EAF5',textDecoration:'none',border:'1px solid #1C2B42',borderRadius:10,padding:'14px 28px',fontFamily:'Syne,sans-serif',fontSize:12,fontWeight:800,letterSpacing:'1px' }}>BUY CRYPTO</a>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginTop:60 }}>
          {[
            { icon:'🔐',t:'Smart Wallet',   d:'Non-custodial, multi-chain' },
            { icon:'⇄', t:'Token Swap',     d:'200+ tokens, 40+ chains'   },
            { icon:'💳',t:'Virtual Cards',  d:'Spend crypto anywhere'      },
            { icon:'📈',t:'DeFi Yields',    d:'Up to 24.6% APY'           },
          ].map(f=>(
            <div key={f.t} style={{ background:'#0D1624',border:'1px solid #1C2B42',borderRadius:12,padding:20,textAlign:'center' }}>
              <div style={{ fontSize:28,marginBottom:10 }}>{f.icon}</div>
              <div style={{ fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:12,color:'#E2EAF5',marginBottom:4 }}>{f.t}</div>
              <div style={{ fontSize:10,color:'#6A7D96' }}>{f.d}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:48,paddingTop:32,borderTop:'1px solid #1C2B42',display:'flex',justifyContent:'center',gap:24,flexWrap:'wrap' }}>
          {[['Terms','/legal/terms'],['Privacy','/legal/privacy'],['AML Policy','/legal/aml'],['Cookies','/legal/cookies'],['Support','/support']].map(([l,h])=>(
            <a key={l} href={h} style={{ fontSize:11,color:'#3A4A5A',textDecoration:'none' }}>{l}</a>
          ))}
        </div>
      </div>
    </div>
  )
}
