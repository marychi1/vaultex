'use client'
import { useState } from 'react'

const PROVIDERS = [
  { id:'moonpay',  name:'MoonPay',  logo:'🌙', fee:'1.99%', methods:['Card','Bank','Apple Pay'], speed:'5 min',  countries:160, rating:4.8 },
  { id:'transak',  name:'Transak',  logo:'⚡',  fee:'0.99%', methods:['Card','Bank','UPI'],       speed:'10 min', countries:150, rating:4.7 },
  { id:'ramp',     name:'Ramp',     logo:'🚀',  fee:'1.49%', methods:['Card','Bank'],             speed:'5 min',  countries:130, rating:4.6 },
  { id:'stripe',   name:'Stripe',   logo:'💳',  fee:'1.50%', methods:['Card','Bank'],             speed:'Instant',countries:45,  rating:4.9 },
]

const CRYPTOS = ['BTC','ETH','SOL','USDC','BNB','MATIC','AVAX','LINK']
const FIATS   = ['USD','EUR','GBP','AED','SGD','CAD','AUD']

export default function OnRampPage() {
  const [amount,    setAmount]    = useState('100')
  const [fiat,      setFiat]      = useState('USD')
  const [crypto,    setCrypto]    = useState('ETH')
  const [provider,  setProvider]  = useState('moonpay')
  const [step,      setStep]      = useState<'select'|'kyc'|'pay'>('select')

  const sel = PROVIDERS.find(p => p.id === provider)!
  const fee = parseFloat(amount) * parseFloat(sel.fee) / 100
  const receive = (parseFloat(amount) - fee) / 3841 // mock ETH price

  return (
    <div style={{ minHeight:'100vh', background:'#060A12', padding:'40px 24px' }}>
      <div style={{ maxWidth:560, margin:'0 auto' }}>

        {/* Header */}
        <a href="/" style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none', marginBottom:32 }}>
          <div style={{ width:32,height:32,borderRadius:8,background:'linear-gradient(135deg,#0A1628,#1A0E3A)',border:'1px solid rgba(0,240,255,0.4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16 }}>🔐</div>
          <span style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:18,letterSpacing:3,color:'#fff' }}>VAULT<span style={{color:'#00F0FF'}}>EX</span></span>
        </a>

        <div style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:28,color:'#fff',marginBottom:6 }}>
          Buy Crypto
        </div>
        <div style={{ fontSize:13,color:'#6A7D96',marginBottom:28 }}>
          Purchase crypto instantly with your card or bank account.
        </div>

        {/* Amount input */}
        <div style={{ background:'#0D1624',border:'1px solid #1C2B42',borderRadius:16,padding:20,marginBottom:14 }}>
          <div style={{ fontSize:9,color:'#6A7D96',letterSpacing:'2px',textTransform:'uppercase',marginBottom:10 }}>You Spend</div>
          <div style={{ display:'flex',alignItems:'center',gap:10 }}>
            <input value={amount} onChange={e=>setAmount(e.target.value)} type="number"
              style={{ flex:1,background:'none',border:'none',outline:'none',fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:32,color:'#fff' }}/>
            <select value={fiat} onChange={e=>setFiat(e.target.value)} style={{ background:'rgba(0,240,255,0.1)',border:'1px solid rgba(0,240,255,0.25)',borderRadius:8,padding:'8px 12px',color:'#00F0FF',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:12,outline:'none',cursor:'pointer' }}>
              {FIATS.map(f=><option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>

        <div style={{ textAlign:'center',fontSize:18,color:'#1C2B42',marginBottom:14 }}>⬇</div>

        <div style={{ background:'#0D1624',border:'1px solid #1C2B42',borderRadius:16,padding:20,marginBottom:20 }}>
          <div style={{ fontSize:9,color:'#6A7D96',letterSpacing:'2px',textTransform:'uppercase',marginBottom:10 }}>You Receive</div>
          <div style={{ display:'flex',alignItems:'center',gap:10 }}>
            <div style={{ flex:1,fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:32,color:'#fff' }}>
              ~{receive.toFixed(6)}
            </div>
            <select value={crypto} onChange={e=>setCrypto(e.target.value)} style={{ background:'rgba(0,229,160,0.1)',border:'1px solid rgba(0,229,160,0.25)',borderRadius:8,padding:'8px 12px',color:'#00E5A0',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:12,outline:'none',cursor:'pointer' }}>
              {CRYPTOS.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ fontSize:10,color:'#6A7D96',marginTop:6 }}>Fee: ~${fee.toFixed(2)} · Rate: 1 {crypto} = $3,841</div>
        </div>

        {/* Provider selector */}
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:10,color:'#6A7D96',letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:10,fontFamily:'Syne,sans-serif',fontWeight:700 }}>Choose Provider</div>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
            {PROVIDERS.map(p => (
              <div key={p.id} onClick={()=>setProvider(p.id)} style={{
                background: provider===p.id ? 'rgba(0,240,255,0.08)' : '#0D1624',
                border: `1px solid ${provider===p.id?'rgba(0,240,255,0.4)':'#1C2B42'}`,
                borderRadius:12,padding:14,cursor:'pointer',transition:'all .2s',
              }}>
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8 }}>
                  <div style={{ display:'flex',alignItems:'center',gap:6 }}>
                    <span style={{ fontSize:18 }}>{p.logo}</span>
                    <span style={{ fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:12,color:'#E2EAF5' }}>{p.name}</span>
                  </div>
                  {provider===p.id && <div style={{ width:16,height:16,borderRadius:'50%',background:'#00F0FF',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,color:'#060A12',fontWeight:800 }}>✓</div>}
                </div>
                <div style={{ fontSize:10,color:'#00E5A0',marginBottom:4 }}>Fee: {p.fee}</div>
                <div style={{ fontSize:9,color:'#6A7D96',marginBottom:4 }}>⚡ {p.speed}</div>
                <div style={{ display:'flex',gap:4,flexWrap:'wrap' }}>
                  {p.methods.map(m=>(
                    <span key={m} style={{ fontSize:8,background:'rgba(255,255,255,0.05)',border:'1px solid #1C2B42',borderRadius:3,padding:'2px 6px',color:'#6A7D96' }}>{m}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div style={{ background:'rgba(0,240,255,0.04)',border:'1px solid rgba(0,240,255,0.15)',borderRadius:12,padding:16,marginBottom:20 }}>
          {[
            ['You pay',    `${amount} ${fiat}`],
            ['Fee',        `$${fee.toFixed(2)} (${sel.fee})`],
            ['You receive',`~${receive.toFixed(6)} ${crypto}`],
            ['Provider',   sel.name],
            ['Speed',      sel.speed],
          ].map(([l,v])=>(
            <div key={l} style={{ display:'flex',justifyContent:'space-between',marginBottom:6 }}>
              <span style={{ fontSize:11,color:'#6A7D96' }}>{l}</span>
              <span style={{ fontSize:11,color:'#E2EAF5',fontFamily:'monospace' }}>{v}</span>
            </div>
          ))}
        </div>

        <button onClick={()=>setStep('kyc')} style={{
          width:'100%',background:'#00F0FF',color:'#060A12',border:'none',
          borderRadius:12,padding:'16px',fontFamily:'Syne,sans-serif',
          fontSize:13,fontWeight:800,letterSpacing:'1px',cursor:'pointer',
          transition:'all .2s',marginBottom:12,
        }}
        onMouseEnter={e=>{e.currentTarget.style.background='#00C8D8';e.currentTarget.style.transform='translateY(-2px)'}}
        onMouseLeave={e=>{e.currentTarget.style.background='#00F0FF';e.currentTarget.style.transform='translateY(0)'}}
        >BUY {crypto} WITH {sel.name} →</button>

        <div style={{ fontSize:10,color:'#3A4A5A',textAlign:'center' }}>
          🔐 Secured by {sel.name} · KYC required · Funds sent to your connected wallet
        </div>

        {/* KYC Modal */}
        {step === 'kyc' && (
          <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,padding:20 }}>
            <div style={{ background:'#0D1624',border:'1px solid #1C2B42',borderRadius:20,padding:28,maxWidth:420,width:'100%' }}>
              <div style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:18,color:'#fff',marginBottom:6 }}>Quick Verification</div>
              <div style={{ fontSize:12,color:'#6A7D96',marginBottom:20 }}>Required by law for purchases over $150. Takes 2 minutes.</div>
              {[
                { label:'Full Legal Name',    placeholder:'John Smith',          type:'text'  },
                { label:'Date of Birth',      placeholder:'MM/DD/YYYY',         type:'text'  },
                { label:'Email Address',      placeholder:'john@example.com',   type:'email' },
                { label:'Country of Residence',placeholder:'United States',     type:'text'  },
              ].map(f=>(
                <div key={f.label} style={{ marginBottom:12 }}>
                  <div style={{ fontSize:9,color:'#6A7D96',letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:5 }}>{f.label}</div>
                  <input placeholder={f.placeholder} type={f.type} style={{ width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid #1C2B42',borderRadius:8,padding:'10px 14px',color:'#E2EAF5',fontSize:12,outline:'none' }}/>
                </div>
              ))}
              <div style={{ display:'flex',gap:10,marginTop:8 }}>
                <button onClick={()=>setStep('select')} style={{ flex:1,background:'transparent',border:'1px solid #1C2B42',borderRadius:8,padding:'10px',color:'#6A7D96',fontFamily:'Syne,sans-serif',fontSize:11,fontWeight:700,cursor:'pointer' }}>BACK</button>
                <button onClick={()=>{ setStep('pay'); setTimeout(()=>setStep('select'),3000) }} style={{ flex:2,background:'#00F0FF',border:'none',borderRadius:8,padding:'10px',color:'#060A12',fontFamily:'Syne,sans-serif',fontSize:11,fontWeight:800,cursor:'pointer' }}>VERIFY & CONTINUE →</button>
              </div>
            </div>
          </div>
        )}

        {step === 'pay' && (
          <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200 }}>
            <div style={{ background:'#0D1624',border:'1px solid rgba(0,229,160,0.3)',borderRadius:20,padding:32,textAlign:'center',maxWidth:320 }}>
              <div style={{ fontSize:48,marginBottom:16 }}>✅</div>
              <div style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:18,color:'#fff',marginBottom:8 }}>Order Placed!</div>
              <div style={{ fontSize:12,color:'#6A7D96' }}>{receive.toFixed(6)} {crypto} will arrive in your wallet in {sel.speed}.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
