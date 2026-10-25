import Link from 'next/link'

export const metadata = { title: 'Cookie Policy — VAULTEX' }
export default function Cookies() {
  return (
    <div style={{ minHeight:'100vh',background:'#060A12',padding:'60px 24px' }}>
      <div style={{ maxWidth:720,margin:'0 auto' }}>
        <Link href="/" style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:18,letterSpacing:3,color:'#fff',textDecoration:'none',display:'block',marginBottom:10 }}>VAULT<span style={{color:'#00F0FF'}}>EX</span></Link>
        <Link href="/legal" style={{ fontSize:11,color:'#6A7D96',textDecoration:'none',display:'block',marginBottom:32 }}>← Back to Legal</Link>
        <h1 style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:32,color:'#fff',marginBottom:6 }}>Cookie Policy</h1>
        <p style={{ color:'#6A7D96',marginBottom:32,fontSize:12 }}>Last updated: January 1, 2025</p>
        <div style={{ color:'#8A9CB5',lineHeight:1.9,fontSize:13 }}>
          <div style={{ background:'#0D1624',border:'1px solid #1C2B42',borderRadius:12,overflow:'hidden',marginBottom:24 }}>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',padding:'10px 16px',background:'#101726',borderBottom:'1px solid #1C2B42' }}>
              {['Cookie','Type','Purpose','Duration'].map(h=><div key={h} style={{ fontSize:9,color:'#6A7D96',letterSpacing:'1.5px',textTransform:'uppercase',fontFamily:'Syne,sans-serif',fontWeight:700 }}>{h}</div>)}
            </div>
            {[
              ['session_id','Essential','User authentication','Session'],
              ['wallet_pref','Essential','Remember wallet preference','1 year'],
              ['_ga','Analytics','Google Analytics','2 years'],
              ['_mixpanel','Analytics','Usage analytics','1 year'],
              ['theme','Preference','UI theme setting','1 year'],
            ].map(row=>(
              <div key={row[0]} style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',padding:'10px 16px',borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                {row.map((c,i)=><div key={i} style={{ fontSize:11,color: i===1?(c==='Essential'?'#00E5A0':'#F5C518'):'#8A9CB5',fontFamily: i===0?'monospace':'inherit' }}>{c}</div>)}
              </div>
            ))}
          </div>
          <p>You can control cookies through your browser settings. Disabling essential cookies may affect platform functionality. To opt out of analytics, visit your browser settings or use our cookie preference center.</p>
        </div>
      </div>
    </div>
  )
}
