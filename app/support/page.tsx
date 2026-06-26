'use client'
'use client'
import { useState } from 'react'

const FAQS = [
  { q:'How do I connect my wallet?', a:'Click "Connect Wallet" in the top navigation. We support MetaMask, Coinbase Wallet, Rainbow, Trust Wallet, and 20+ others via WalletConnect.' },
  { q:'How do I buy crypto with a card?', a:'Go to Buy Crypto in the dashboard, enter your amount, select your token and preferred payment provider. You\'ll need to complete a quick KYC verification first.' },
  { q:'How long do swaps take?', a:'Most swaps confirm in under 30 seconds on Ethereum. Other chains like Polygon and Base are near-instant. Cross-chain swaps take 2-5 minutes.' },
  { q:'How do I get a virtual card?', a:'Complete KYC verification first, then go to the Cards tab in your dashboard. Cards are issued instantly after approval.' },
  { q:'What are the swap fees?', a:'VAULTEX charges 0.1-0.3% on swaps depending on the token pair. Network gas fees are additional and vary by blockchain.' },
  { q:'Is VAULTEX safe?', a:'Yes. VAULTEX is non-custodial — we never hold your private keys. We\'re SOC 2 certified, use AES-256 encryption, and carry $500M in insurance.' },
  { q:'Which blockchains are supported?', a:'We support 40+ chains including Ethereum, Polygon, Arbitrum, Optimism, Base, BNB Chain, Solana, Avalanche, and more.' },
  { q:'How do I earn yield?', a:'Go to the Earn tab in your dashboard. Select a yield strategy, review the APY and risk rating, and click Deposit. Earnings are auto-compounded daily.' },
]

export default function SupportPage() {
  const [open,    setOpen]    = useState<number|null>(null)
  const [chatOpen,setChatOpen]= useState(false)
  const [msg,     setMsg]     = useState('')
  const [msgs,    setMsgs]    = useState([{ from:'bot', text:'Hi! 👋 I\'m the VAULTEX support bot. How can I help you today?' }])
  const [ticket,  setTicket]  = useState({ email:'', subject:'', message:'' })
  const [sent,    setSent]    = useState(false)

  const sendMsg = () => {
    if (!msg.trim()) return
    const newMsgs = [...msgs, { from:'user', text:msg }]
    setMsgs(newMsgs)
    setMsg('')
    setTimeout(() => {
      setMsgs(m => [...m, { from:'bot', text:'Thanks for reaching out! A support agent will follow up within 2 hours. In the meantime, check our FAQ below for quick answers.' }])
    }, 1000)
  }

  return (
    <div style={{ minHeight:'100vh',background:'#060A12',padding:'40px 24px' }}>
      <div style={{ maxWidth:800,margin:'0 auto' }}>
        <a href="/" style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:18,letterSpacing:3,color:'#fff',textDecoration:'none',display:'block',marginBottom:10 }}>VAULT<span style={{color:'#00F0FF'}}>EX</span></a>
        <div style={{ fontSize:11,color:'#6A7D96',marginBottom:40 }}>Support Center</div>

        <h1 style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:32,color:'#fff',marginBottom:8 }}>How can we help?</h1>
        <p style={{ color:'#6A7D96',marginBottom:40 }}>Search our FAQ, start a live chat, or submit a support ticket.</p>

        {/* Quick links */}
        <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:48 }}>
          {[
            { icon:'🔐', title:'Wallet Issues',   href:'#faq' },
            { icon:'💳', title:'Card Support',    href:'#faq' },
            { icon:'⇄',  title:'Swap Problems',  href:'#faq' },
            { icon:'📋', title:'KYC Help',        href:'/kyc' },
          ].map(c=>(
            <a key={c.title} href={c.href} style={{ background:'#0D1624',border:'1px solid #1C2B42',borderRadius:12,padding:'18px 14px',textAlign:'center',textDecoration:'none',transition:'border .2s',display:'block' }}
            onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(0,240,255,0.3)'}
            onMouseLeave={e=>e.currentTarget.style.borderColor='#1C2B42'}
            >
              <div style={{ fontSize:28,marginBottom:8 }}>{c.icon}</div>
              <div style={{ fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:11,color:'#E2EAF5' }}>{c.title}</div>
            </a>
          ))}
        </div>

        {/* FAQ */}
        <div id="faq" style={{ marginBottom:48 }}>
          <h2 style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:20,color:'#fff',marginBottom:16 }}>Frequently Asked Questions</h2>
          {FAQS.map((faq,i)=>(
            <div key={i} style={{ background:'#0D1624',border:'1px solid #1C2B42',borderRadius:10,marginBottom:8,overflow:'hidden' }}>
              <button onClick={()=>setOpen(open===i?null:i)} style={{ width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 18px',background:'none',border:'none',cursor:'pointer',textAlign:'left' }}>
                <span style={{ fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:12,color:'#E2EAF5' }}>{faq.q}</span>
                <span style={{ color:'#00F0FF',fontSize:16,flexShrink:0,marginLeft:12 }}>{open===i?'−':'+'}</span>
              </button>
              {open===i && <div style={{ padding:'0 18px 14px',fontSize:12,color:'#8A9CB5',lineHeight:1.7 }}>{faq.a}</div>}
            </div>
          ))}
        </div>

        {/* Submit ticket */}
        <div style={{ background:'#0D1624',border:'1px solid #1C2B42',borderRadius:16,padding:24 }}>
          <h2 style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:18,color:'#fff',marginBottom:6 }}>Submit a Ticket</h2>
          <p style={{ fontSize:12,color:'#6A7D96',marginBottom:20 }}>We respond within 2-4 hours during business hours.</p>
          {sent ? (
            <div style={{ textAlign:'center',padding:24 }}>
              <div style={{ fontSize:40,marginBottom:12 }}>✅</div>
              <div style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:16,color:'#fff',marginBottom:6 }}>Ticket Submitted!</div>
              <div style={{ fontSize:12,color:'#6A7D96' }}>We'll reply to {ticket.email} within 2-4 hours.</div>
            </div>
          ) : (
            <>
              {[{l:'Email',k:'email',p:'your@email.com',t:'email'},{l:'Subject',k:'subject',p:'Describe your issue briefly',t:'text'}].map(f=>(
                <div key={f.k} style={{ marginBottom:12 }}>
                  <div style={{ fontSize:9,color:'#6A7D96',letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:5,fontFamily:'Syne,sans-serif',fontWeight:700 }}>{f.l}</div>
                  <input value={ticket[f.k as keyof typeof ticket]} onChange={e=>setTicket(t=>({...t,[f.k]:e.target.value}))} placeholder={f.p} type={f.t}
                    style={{ width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid #1C2B42',borderRadius:8,padding:'10px 14px',color:'#E2EAF5',fontSize:12,outline:'none' }}/>
                </div>
              ))}
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:9,color:'#6A7D96',letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:5,fontFamily:'Syne,sans-serif',fontWeight:700 }}>Message</div>
                <textarea value={ticket.message} onChange={e=>setTicket(t=>({...t,message:e.target.value}))} placeholder="Describe your issue in detail..." rows={4}
                  style={{ width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid #1C2B42',borderRadius:8,padding:'10px 14px',color:'#E2EAF5',fontSize:12,outline:'none',resize:'vertical' }}/>
              </div>
              <button onClick={()=>setSent(true)} style={{ background:'#00F0FF',color:'#060A12',border:'none',borderRadius:8,padding:'12px 24px',fontFamily:'Syne,sans-serif',fontSize:11,fontWeight:800,letterSpacing:'1px',cursor:'pointer' }}>
                SEND TICKET
              </button>
            </>
          )}
        </div>
      </div>

      {/* Live chat bubble */}
      <div style={{ position:'fixed',bottom:24,right:24,zIndex:200 }}>
        {chatOpen && (
          <div style={{ position:'absolute',bottom:60,right:0,width:320,background:'#0D1624',border:'1px solid #1C2B42',borderRadius:16,overflow:'hidden',boxShadow:'0 24px 60px rgba(0,0,0,0.7)' }}>
            <div style={{ background:'#101726',padding:'14px 16px',borderBottom:'1px solid #1C2B42',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
              <div style={{ display:'flex',alignItems:'center',gap:8 }}>
                <div style={{ width:8,height:8,borderRadius:'50%',background:'#00E5A0' }}/>
                <span style={{ fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:12,color:'#fff' }}>VAULTEX Support</span>
              </div>
              <span style={{ fontSize:9,color:'#00E5A0' }}>Online</span>
            </div>
            <div style={{ height:240,overflowY:'auto',padding:14,display:'flex',flexDirection:'column',gap:10 }}>
              {msgs.map((m,i)=>(
                <div key={i} style={{ display:'flex',justifyContent: m.from==='user'?'flex-end':'flex-start' }}>
                  <div style={{ maxWidth:'80%',background: m.from==='user'?'#00F0FF':'rgba(255,255,255,0.06)',borderRadius:10,padding:'8px 12px',color: m.from==='user'?'#060A12':'#C0CCD8',fontSize:11,lineHeight:1.5 }}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding:'10px 12px',borderTop:'1px solid #1C2B42',display:'flex',gap:8 }}>
              <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMsg()} placeholder="Type a message..."
                style={{ flex:1,background:'rgba(255,255,255,0.05)',border:'1px solid #1C2B42',borderRadius:8,padding:'8px 12px',color:'#E2EAF5',fontSize:11,outline:'none' }}/>
              <button onClick={sendMsg} style={{ background:'#00F0FF',color:'#060A12',border:'none',borderRadius:8,padding:'8px 12px',fontFamily:'Syne,sans-serif',fontSize:11,fontWeight:700,cursor:'pointer' }}>→</button>
            </div>
          </div>
        )}
        <button onClick={()=>setChatOpen(!chatOpen)} style={{ width:52,height:52,borderRadius:'50%',background:'#00F0FF',border:'none',fontSize:22,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 8px 24px rgba(0,240,255,0.4)' }}>
          {chatOpen ? '✕' : '💬'}
        </button>
      </div>
    </div>
  )
}
