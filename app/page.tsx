'use client'
import { useState } from 'react'

export default function Home() {
  const [notifShown, setNotifShown] = useState(false)

  const requestNotifs = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission()
      if (perm === 'granted') { setNotifShown(true); new Notification('VAULTEX', { body: 'Push notifications enabled! 🎉', icon: '/icons/icon.svg' }) }
    }
  }

  const NAV = [
    ['Buy Crypto','/onramp'],['Cards','/cards'],['KYC','/kyc'],
    ['Support','/support'],['Legal','/legal'],['Dashboard','/dashboard'],
  ]
  const FEATURES = [
    { icon:'🔐', t:'Smart Wallet',    d:'Non-custodial, 40+ chains',     href:'/dashboard' },
    { icon:'⇄',  t:'Token Swap',     d:'200+ tokens, best rates',        href:'/dashboard' },
    { icon:'💳', t:'Virtual Cards',  d:'Spend crypto anywhere',          href:'/cards'     },
    { icon:'📈', t:'DeFi Yields',    d:'Up to 24.6% APY',               href:'/dashboard' },
    { icon:'💵', t:'Buy Crypto',     d:'Card, bank, Apple Pay',          href:'/onramp'    },
    { icon:'🛡️', t:'KYC Verified',  d:'Identity verification',          href:'/kyc'       },
  ]
  const STATS = [['$4.2B+','Assets Managed'],['2.1M+','Active Users'],['150+','Countries'],['40+','Blockchains']]

  return (
    <div style={{ minHeight:'100vh',background:'#060A12',color:'#E2EAF5',fontFamily:'DM Sans,sans-serif' }}>

      {/* Nav */}
      <nav style={{ padding:'0 24px',height:64,display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid #1C2B42',background:'rgba(6,10,18,0.97)',position:'sticky',top:0,zIndex:100,backdropFilter:'blur(20px)' }}>
        <span style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:20,letterSpacing:3,color:'#fff' }}>VAULT<span style={{color:'#00F0FF'}}>EX</span></span>
        <div style={{ display:'flex',gap:20,alignItems:'center',flexWrap:'wrap' }}>
          {NAV.map(([l,h])=>(
            <a key={l} href={h} style={{ fontFamily:'Syne,sans-serif',fontSize:11,fontWeight:700,color: l==='Dashboard'?'#00F0FF':'#6A7D96',textDecoration:'none',letterSpacing:'1px',transition:'color .2s' }}
            onMouseEnter={e=>e.currentTarget.style.color='#00F0FF'}
            onMouseLeave={e=>e.currentTarget.style.color= l==='Dashboard'?'#00F0FF':'#6A7D96'}
            >{l}</a>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth:900,margin:'0 auto',padding:'80px 24px 60px',textAlign:'center',position:'relative' }}>
        <div style={{ position:'absolute',width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(0,240,255,0.06) 0%,transparent 70%)',top:-100,left:'50%',transform:'translateX(-50%)',pointerEvents:'none' }}/>
        <div style={{ display:'inline-flex',alignItems:'center',gap:6,background:'rgba(0,240,255,0.08)',border:'1px solid rgba(0,240,255,0.2)',borderRadius:20,padding:'5px 14px',marginBottom:20,fontFamily:'monospace',fontSize:10,color:'#00F0FF',letterSpacing:'1px' }}>
          <div style={{ width:5,height:5,borderRadius:'50%',background:'#00E5A0' }}/>
          LIVE · vaultexwallet.io
        </div>
        <h1 style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:52,color:'#fff',lineHeight:1.1,marginBottom:16,position:'relative' }}>
          Your <span style={{ background:'linear-gradient(135deg,#00F0FF,#7C3AED)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text' }}>Digital Wealth</span>,<br/>
          One <span style={{ background:'linear-gradient(135deg,#F5C518,#FF8C42)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text' }}>Smart Wallet</span>.
        </h1>
        <p style={{ fontSize:15,color:'#6A7D96',marginBottom:36,lineHeight:1.8,maxWidth:560,margin:'0 auto 36px' }}>
          Store, swap, and spend crypto from a single platform. Non-custodial wallets, virtual Visa cards, DeFi yields, and instant fiat on-ramp.
        </p>
        <div style={{ display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',marginBottom:48 }}>
          <a href="/dashboard" style={{ background:'#00F0FF',color:'#060A12',textDecoration:'none',borderRadius:10,padding:'14px 28px',fontFamily:'Syne,sans-serif',fontSize:12,fontWeight:800,letterSpacing:'1px' }}>OPEN DASHBOARD</a>
          <a href="/onramp"    style={{ background:'transparent',color:'#E2EAF5',textDecoration:'none',border:'1px solid #1C2B42',borderRadius:10,padding:'14px 28px',fontFamily:'Syne,sans-serif',fontSize:12,fontWeight:800,letterSpacing:'1px' }}>BUY CRYPTO</a>
          <button onClick={requestNotifs} style={{ background:'transparent',color: notifShown?'#00E5A0':'#6A7D96',border:'1px solid #1C2B42',borderRadius:10,padding:'14px 20px',fontFamily:'Syne,sans-serif',fontSize:12,fontWeight:800,letterSpacing:'1px',cursor:'pointer' }}>
            {notifShown ? '🔔 ENABLED' : '🔔 NOTIFICATIONS'}
          </button>
        </div>

        {/* Stats */}
        <div style={{ display:'flex',justifyContent:'center',gap:40,paddingTop:28,borderTop:'1px solid #1C2B42',flexWrap:'wrap' }}>
          {STATS.map(([n,l])=>(
            <div key={l} style={{ textAlign:'center' }}>
              <div style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:22,color:'#00F0FF' }}>{n}</div>
              <div style={{ fontSize:10,color:'#6A7D96',letterSpacing:'1px',textTransform:'uppercase' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features grid */}
      <div style={{ maxWidth:900,margin:'0 auto',padding:'0 24px 60px' }}>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14 }}>
          {FEATURES.map(f=>(
            <a key={f.t} href={f.href} style={{ background:'#0D1624',border:'1px solid #1C2B42',borderRadius:14,padding:22,textDecoration:'none',display:'block',transition:'all .2s' }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(0,240,255,0.3)';e.currentTarget.style.transform='translateY(-3px)'}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='#1C2B42';e.currentTarget.style.transform='translateY(0)'}}
            >
              <div style={{ fontSize:32,marginBottom:12 }}>{f.icon}</div>
              <div style={{ fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:13,color:'#E2EAF5',marginBottom:4 }}>{f.t}</div>
              <div style={{ fontSize:11,color:'#6A7D96' }}>{f.d}</div>
            </a>
          ))}
        </div>
      </div>

      {/* PWA install prompt */}
      <div style={{ maxWidth:900,margin:'0 auto',padding:'0 24px 60px' }}>
        <div style={{ background:'linear-gradient(135deg,#08102A,#100830)',border:'1px solid rgba(0,240,255,0.15)',borderRadius:16,padding:24,display:'flex',alignItems:'center',justifyContent:'space-between',gap:20,flexWrap:'wrap' }}>
          <div>
            <div style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:16,color:'#fff',marginBottom:4 }}>📱 Install VAULTEX App</div>
            <div style={{ fontSize:12,color:'#6A7D96' }}>Add to your home screen for instant access. Works offline. No app store needed.</div>
          </div>
          <div style={{ display:'flex',gap:10 }}>
            <a href="/manifest.json" style={{ background:'#00F0FF',color:'#060A12',textDecoration:'none',borderRadius:8,padding:'10px 20px',fontFamily:'Syne,sans-serif',fontSize:11,fontWeight:800,letterSpacing:'1px' }}>INSTALL APP</a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop:'1px solid #1C2B42',padding:'24px',textAlign:'center' }}>
        <div style={{ display:'flex',justifyContent:'center',gap:20,flexWrap:'wrap',marginBottom:12 }}>
          {[['Terms','/legal/terms'],['Privacy','/legal/privacy'],['AML Policy','/legal/aml'],['Cookies','/legal/cookies'],['Support','/support'],['Legal','/legal']].map(([l,h])=>(
            <a key={l} href={h} style={{ fontSize:11,color:'#3A4A5A',textDecoration:'none',transition:'color .2s' }}
            onMouseEnter={e=>e.currentTarget.style.color='#6A7D96'}
            onMouseLeave={e=>e.currentTarget.style.color='#3A4A5A'}
            >{l}</a>
          ))}
        </div>
        <div style={{ fontSize:10,color:'#3A4A5A' }}>© 2025 VAULTEX Inc. · Singapore · Not financial advice · Crypto carries risk</div>
      </footer>
    </div>
  )
}
