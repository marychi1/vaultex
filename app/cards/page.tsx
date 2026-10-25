'use client'
import { useState } from 'react'
import Link from 'next/link'

type Screen = 'list'|'apply'|'issued'|'manage'

export default function CardsPage() {
  const [screen,   setScreen]   = useState<Screen>('list')
  const [loading,  setLoading]  = useState(false)
  const [frozen,   setFrozen]   = useState(false)
  const [limit,    setLimit]    = useState(2500)
  const [online,   setOnline]   = useState(true)
  const [intl,     setIntl]     = useState(false)
  const [contactless,setContactless] = useState(true)
  const [flipped,  setFlipped]  = useState(false)
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', phone:'', line1:'', city:'', state:'', postalCode:'', country:'US' })
  const [issuedCard, setIssuedCard] = useState<{ last4:string; expiry_month:number; expiry_year:number; demo?:boolean }|null>(null)

  const upd = (k: string, v: string) => setForm(f=>({...f,[k]:v}))

  const inp = (label: string, k: string, placeholder: string, type='text', half=false) => (
    <div style={{ marginBottom:12, ...(half?{flex:1}:{}) }}>
      <div style={{ fontSize:9,color:'#6A7D96',letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:5,fontFamily:'Syne,sans-serif',fontWeight:700 }}>{label}</div>
      <input value={form[k as keyof typeof form]} onChange={e=>upd(k,e.target.value)} placeholder={placeholder} type={type}
        style={{ width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid #1C2B42',borderRadius:8,padding:'10px 14px',color:'#E2EAF5',fontSize:12,outline:'none' }}
        onFocus={e=>e.target.style.borderColor='rgba(0,240,255,0.4)'}
        onBlur={e=>e.target.style.borderColor='#1C2B42'}/>
    </div>
  )

  const issueCard = async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/cards/issue', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ walletAddress:'0xdemo', ...form, dailyLimit: limit }) })
      const data = await res.json()
      if (data.success) { setIssuedCard(data.card); setScreen('issued') }
      else alert(data.error ?? 'Card issuance failed')
    } catch { alert('Network error') }
    finally { setLoading(false) }
  }

  const TRANSACTIONS = [
    { icon:'🛒', merchant:'Amazon',         amount:-84.99,  date:'Today, 2:14 PM',   status:'approved' },
    { icon:'☕', merchant:'Starbucks',       amount:-6.50,   date:'Today, 9:30 AM',   status:'approved' },
    { icon:'✈️', merchant:'United Airlines', amount:-342.00, date:'Yesterday',        status:'approved' },
    { icon:'🍕', merchant:'Domino\'s Pizza', amount:-28.40,  date:'Jun 24',           status:'approved' },
    { icon:'💻', merchant:'Netflix',         amount:-15.99,  date:'Jun 22',           status:'approved' },
  ]

  return (
    <div style={{ minHeight:'100vh',background:'#060A12',padding:'40px 24px' }}>
      <div style={{ maxWidth:640,margin:'0 auto' }}>

        {/* Header */}
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:32 }}>
          <Link href="/" style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:18,letterSpacing:3,color:'#fff',textDecoration:'none' }}>VAULT<span style={{color:'#00F0FF'}}>EX</span></Link>
          <Link href="/dashboard" style={{ fontSize:11,color:'#6A7D96',textDecoration:'none' }}>← Dashboard</Link>
        </div>

        {/* LIST SCREEN */}
        {screen === 'list' && (
          <div>
            <h1 style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:28,color:'#fff',marginBottom:6 }}>Virtual Cards</h1>
            <p style={{ color:'#6A7D96',marginBottom:28,fontSize:13 }}>Issue a Visa debit card and spend crypto anywhere in the world.</p>

            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:28 }}>
              {[
                { icon:'⚡', title:'Instant Issuance',   desc:'Card ready in seconds after KYC' },
                { icon:'🌍', title:'180+ Countries',      desc:'Accepted anywhere Visa is' },
                { icon:'💱', title:'Auto-Conversion',     desc:'Crypto converted at checkout' },
                { icon:'🔒', title:'Freeze Anytime',      desc:'Lock your card instantly' },
                { icon:'📊', title:'Spending Controls',   desc:'Set daily & monthly limits' },
                { icon:'📱', title:'Apple & Google Pay',  desc:'Add to your mobile wallet' },
              ].map(f=>(
                <div key={f.title} style={{ background:'#0D1624',border:'1px solid #1C2B42',borderRadius:10,padding:14,display:'flex',gap:10 }}>
                  <span style={{ fontSize:20 }}>{f.icon}</span>
                  <div><div style={{ fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:11,color:'#E2EAF5',marginBottom:2 }}>{f.title}</div><div style={{ fontSize:10,color:'#6A7D96' }}>{f.desc}</div></div>
                </div>
              ))}
            </div>

            <div style={{ background:'linear-gradient(135deg,#0E2040,#1A0E3A)',border:'1px solid rgba(124,58,237,0.3)',borderRadius:16,padding:24,marginBottom:20,textAlign:'center' }}>
              <div style={{ fontSize:48,marginBottom:12 }}>💳</div>
              <div style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:18,color:'#fff',marginBottom:6 }}>VAULTEX Virtual Visa</div>
              <div style={{ fontSize:12,color:'#6A7D96',marginBottom:16,lineHeight:1.7 }}>Free to issue · No annual fee · 1% cashback on all purchases</div>
              <div style={{ display:'flex',justifyContent:'center',gap:16,marginBottom:20 }}>
                {[['$0','Annual Fee'],['1%','Cashback'],['$2,500','Daily Limit'],['180+','Countries']].map(([v,l])=>(
                  <div key={l} style={{ textAlign:'center' }}>
                    <div style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:18,color:'#00F0FF' }}>{v}</div>
                    <div style={{ fontSize:9,color:'#6A7D96',letterSpacing:'1px',textTransform:'uppercase' }}>{l}</div>
                  </div>
                ))}
              </div>
              <button onClick={()=>setScreen('apply')} style={{ background:'#00F0FF',color:'#060A12',border:'none',borderRadius:10,padding:'14px 32px',fontFamily:'Syne,sans-serif',fontSize:12,fontWeight:800,letterSpacing:'1px',cursor:'pointer' }}>
                GET YOUR CARD →
              </button>
            </div>

            <button onClick={()=>setScreen('manage')} style={{ width:'100%',background:'transparent',border:'1px solid #1C2B42',borderRadius:10,padding:'12px',fontFamily:'Syne,sans-serif',fontSize:11,fontWeight:700,color:'#6A7D96',cursor:'pointer',letterSpacing:'1px' }}>
              MANAGE EXISTING CARD
            </button>
          </div>
        )}

        {/* APPLY SCREEN */}
        {screen === 'apply' && (
          <div>
            <button onClick={()=>setScreen('list')} style={{ background:'none',border:'none',color:'#6A7D96',cursor:'pointer',fontSize:12,marginBottom:20,padding:0 }}>← Back</button>
            <h1 style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:24,color:'#fff',marginBottom:6 }}>Apply for Virtual Card</h1>
            <p style={{ color:'#6A7D96',marginBottom:24,fontSize:12 }}>Takes 2 minutes. KYC verification required.</p>

            <div style={{ display:'flex',gap:0 }}>
              <div style={{ flex:1,paddingRight:8 }}>{inp('First Name','firstName','John',    'text', true)}</div>
              <div style={{ flex:1,paddingLeft:8  }}>{inp('Last Name', 'lastName', 'Smith',   'text', true)}</div>
            </div>
            {inp('Email Address','email','john@example.com','email')}
            {inp('Phone Number','phone','+1 (555) 000-0000','tel')}
            {inp('Street Address','line1','123 Main Street')}
            <div style={{ display:'flex',gap:0 }}>
              <div style={{ flex:2,paddingRight:8 }}>{inp('City','city','New York','text',true)}</div>
              <div style={{ flex:1,paddingLeft:8  }}>{inp('State','state','NY','text',true)}</div>
            </div>
            <div style={{ display:'flex',gap:0 }}>
              <div style={{ flex:1,paddingRight:8 }}>{inp('ZIP Code','postalCode','10001','text',true)}</div>
              <div style={{ flex:1,paddingLeft:8  }}>{inp('Country','country','US','text',true)}</div>
            </div>

            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:9,color:'#6A7D96',letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:8,fontFamily:'Syne,sans-serif',fontWeight:700 }}>Daily Spending Limit</div>
              <div style={{ display:'flex',gap:8 }}>
                {[500,1000,2500,5000].map(v=>(
                  <button key={v} onClick={()=>setLimit(v)} style={{
                    flex:1,background: limit===v?'rgba(0,240,255,0.1)':'rgba(255,255,255,0.03)',
                    border:`1px solid ${limit===v?'rgba(0,240,255,0.4)':'#1C2B42'}`,
                    borderRadius:8,padding:'8px',color: limit===v?'#00F0FF':'#6A7D96',
                    fontFamily:'Syne,sans-serif',fontSize:10,fontWeight:700,cursor:'pointer',
                  }}>${v.toLocaleString()}</button>
                ))}
              </div>
            </div>

            <div style={{ background:'rgba(0,240,255,0.04)',border:'1px solid rgba(0,240,255,0.15)',borderRadius:10,padding:14,marginBottom:16,fontSize:11,color:'#6A7D96',lineHeight:1.7 }}>
              By applying you agree to the VAULTEX <a href="/legal/terms" style={{color:'#00F0FF'}}>Terms of Service</a> and <a href="/legal/privacy" style={{color:'#00F0FF'}}>Privacy Policy</a>. Card issued by VAULTEX in partnership with Stripe.
            </div>

            <button onClick={issueCard} disabled={loading} style={{ width:'100%',background: loading?'#1C2B42':'#00F0FF',color: loading?'#6A7D96':'#060A12',border:'none',borderRadius:12,padding:'16px',fontFamily:'Syne,sans-serif',fontSize:13,fontWeight:800,letterSpacing:'1px',cursor: loading?'not-allowed':'pointer' }}>
              {loading ? 'ISSUING CARD...' : 'ISSUE MY CARD →'}
            </button>
          </div>
        )}

        {/* ISSUED SUCCESS SCREEN */}
        {screen === 'issued' && issuedCard && (
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:64,marginBottom:16 }}>🎉</div>
            <div style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:24,color:'#00E5A0',marginBottom:8 }}>Card Issued!</div>
            <div style={{ fontSize:13,color:'#6A7D96',marginBottom:28 }}>Your virtual Visa card is ready to use.{issuedCard.demo?' (Demo mode — add STRIPE_SECRET_KEY for real cards)':''}</div>

            {/* Card visual */}
            <div style={{ perspective:1000,marginBottom:24 }}>
              <div onClick={()=>setFlipped(!flipped)} style={{ width:340,margin:'0 auto',height:200,position:'relative',transformStyle:'preserve-3d',transition:'transform .6s',transform: flipped?'rotateY(180deg)':'rotateY(0)',cursor:'pointer' }}>
                <div style={{ position:'absolute',inset:0,background:'linear-gradient(135deg,#1A0E3A,#0E2040)',border:'1px solid rgba(124,58,237,0.4)',borderRadius:18,padding:24,backfaceVisibility:'hidden' }}>
                  <div style={{ display:'flex',justifyContent:'space-between',marginBottom:20 }}>
                    <div style={{ width:36,height:28,background:'linear-gradient(135deg,#F5C518,#C8A000)',borderRadius:5 }}/>
                    <span style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:14,color:'rgba(255,255,255,0.5)',letterSpacing:2 }}>VISA</span>
                  </div>
                  <div style={{ fontFamily:'monospace',fontSize:18,color:'#C0CCD8',letterSpacing:3,marginBottom:16 }}>•••• •••• •••• {issuedCard.last4}</div>
                  <div style={{ display:'flex',justifyContent:'space-between' }}>
                    <div><div style={{ fontSize:8,color:'#6A7D96',letterSpacing:2,textTransform:'uppercase',marginBottom:2 }}>Card Holder</div><div style={{ fontFamily:'monospace',fontSize:11,color:'#E2EAF5' }}>{form.firstName.toUpperCase()||'YOUR'} {form.lastName.toUpperCase()||'NAME'}</div></div>
                    <div style={{ textAlign:'right' }}><div style={{ fontSize:8,color:'#6A7D96',letterSpacing:2,textTransform:'uppercase',marginBottom:2 }}>Expires</div><div style={{ fontFamily:'monospace',fontSize:11,color:'#E2EAF5' }}>{String(issuedCard.expiry_month).padStart(2,'0')}/{String(issuedCard.expiry_year).slice(-2)}</div></div>
                  </div>
                  <div style={{ position:'absolute',bottom:10,right:16,fontSize:9,color:'rgba(255,255,255,0.3)',fontFamily:'monospace' }}>Tap to flip</div>
                </div>
                <div style={{ position:'absolute',inset:0,background:'linear-gradient(135deg,#0E2040,#1A0E3A)',border:'1px solid rgba(124,58,237,0.4)',borderRadius:18,backfaceVisibility:'hidden',transform:'rotateY(180deg)' }}>
                  <div style={{ height:44,background:'#060A12',margin:'24px 0 16px' }}/>
                  <div style={{ padding:'0 20px' }}>
                    <div style={{ background:'rgba(255,255,255,0.08)',borderRadius:4,padding:'8px 12px',display:'flex',justifyContent:'flex-end' }}>
                      <div style={{ fontFamily:'monospace',fontSize:14,color:'#E2EAF5',letterSpacing:3 }}>•••</div>
                    </div>
                    <div style={{ fontSize:9,color:'#6A7D96',marginTop:8,lineHeight:1.6 }}>This card is issued by VAULTEX Inc. in partnership with Stripe. For support: support@vaultexwallet.io</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display:'flex',gap:10,justifyContent:'center' }}>
              <button onClick={()=>setScreen('manage')} style={{ background:'#00F0FF',color:'#060A12',border:'none',borderRadius:10,padding:'12px 24px',fontFamily:'Syne,sans-serif',fontSize:11,fontWeight:800,letterSpacing:'1px',cursor:'pointer' }}>MANAGE CARD</button>
              <a href="/dashboard" style={{ background:'transparent',border:'1px solid #1C2B42',borderRadius:10,padding:'12px 24px',fontFamily:'Syne,sans-serif',fontSize:11,fontWeight:700,color:'#6A7D96',textDecoration:'none',display:'inline-block' }}>DASHBOARD</a>
            </div>
          </div>
        )}

        {/* MANAGE SCREEN */}
        {screen === 'manage' && (
          <div>
            <button onClick={()=>setScreen('list')} style={{ background:'none',border:'none',color:'#6A7D96',cursor:'pointer',fontSize:12,marginBottom:20,padding:0 }}>← Back</button>
            <h1 style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:24,color:'#fff',marginBottom:20 }}>Manage Card</h1>

            {/* Card */}
            <div onClick={()=>setFlipped(!flipped)} style={{ background:'linear-gradient(135deg,#1A0E3A,#0E2040)',border:'1px solid rgba(124,58,237,0.4)',borderRadius:16,padding:24,marginBottom:20,cursor:'pointer' }}>
              <div style={{ display:'flex',justifyContent:'space-between',marginBottom:16 }}>
                <div style={{ width:32,height:26,background:'linear-gradient(135deg,#F5C518,#C8A000)',borderRadius:4 }}/>
                <div style={{ display:'flex',alignItems:'center',gap:8 }}>
                  <div style={{ width:8,height:8,borderRadius:'50%',background: frozen?'#FF3B5C':'#00E5A0' }}/>
                  <span style={{ fontSize:10,color: frozen?'#FF3B5C':'#00E5A0',fontFamily:'Syne,sans-serif',fontWeight:700 }}>{frozen?'FROZEN':'ACTIVE'}</span>
                </div>
              </div>
              <div style={{ fontFamily:'monospace',fontSize:16,color:'#C0CCD8',letterSpacing:3,marginBottom:14 }}>4829  ••••  ••••  7312</div>
              <div style={{ display:'flex',justifyContent:'space-between' }}>
                <span style={{ fontSize:10,color:'#6A7D96',fontFamily:'monospace' }}>ALEX MERCER</span>
                <span style={{ fontSize:10,color:'#6A7D96',fontFamily:'monospace' }}>09/28</span>
              </div>
            </div>

            {/* Spending limits */}
            <div style={{ background:'#0D1624',border:'1px solid #1C2B42',borderRadius:12,padding:16,marginBottom:12 }}>
              <div style={{ fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:12,color:'#fff',marginBottom:12 }}>Spending Limits</div>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:12 }}>
                {[{l:'Daily Limit',v:`$${limit.toLocaleString()}`,c:'#E2EAF5'},{l:'Spent Today',v:'$348',c:'#F5C518'},{l:'Available',v:`$${(limit-348).toLocaleString()}`,c:'#00E5A0'}].map(s=>(
                  <div key={s.l} style={{ background:'rgba(255,255,255,0.03)',borderRadius:8,padding:'10px 12px',textAlign:'center' }}>
                    <div style={{ fontSize:9,color:'#6A7D96',marginBottom:3 }}>{s.l}</div>
                    <div style={{ fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:14,color:s.c }}>{s.v}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:10,color:'#6A7D96',marginBottom:8 }}>Adjust daily limit:</div>
              <div style={{ display:'flex',gap:6 }}>
                {[500,1000,2500,5000].map(v=>(
                  <button key={v} onClick={()=>setLimit(v)} style={{ flex:1,background: limit===v?'rgba(0,240,255,0.1)':'rgba(255,255,255,0.03)',border:`1px solid ${limit===v?'rgba(0,240,255,0.3)':'#1C2B42'}`,borderRadius:6,padding:'6px',color: limit===v?'#00F0FF':'#6A7D96',fontFamily:'Syne,sans-serif',fontSize:9,fontWeight:700,cursor:'pointer' }}>${v>=1000?v/1000+'k':v}</button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div style={{ background:'#0D1624',border:'1px solid #1C2B42',borderRadius:12,padding:16,marginBottom:12 }}>
              <div style={{ fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:12,color:'#fff',marginBottom:12 }}>Card Controls</div>
              {[
                { label:'Online Transactions',  sub:'E-commerce & subscriptions', val:online,      set:setOnline      },
                { label:'International Payments',sub:'Pay in foreign currencies',  val:intl,        set:setIntl        },
                { label:'Contactless Payments',  sub:'Apple Pay & Google Pay',     val:contactless, set:setContactless },
              ].map(t=>(
                <div key={t.label} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  <div><div style={{ fontSize:12,color:'#C0CCD8',fontWeight:600 }}>{t.label}</div><div style={{ fontSize:10,color:'#6A7D96' }}>{t.sub}</div></div>
                  <div onClick={()=>t.set(!t.val)} style={{ width:40,height:22,borderRadius:11,background: t.val?'#00E5A0':'#1C2B42',position:'relative',cursor:'pointer',transition:'background .2s',flexShrink:0 }}>
                    <div style={{ position:'absolute',width:16,height:16,borderRadius:'50%',background:'#fff',top:3,left: t.val?21:3,transition:'left .2s' }}/>
                  </div>
                </div>
              ))}
            </div>

            {/* Freeze button */}
            <button onClick={()=>setFrozen(!frozen)} style={{
              width:'100%',background: frozen?'rgba(0,229,160,0.1)':'rgba(255,59,92,0.1)',
              border:`1px solid ${frozen?'rgba(0,229,160,0.3)':'rgba(255,59,92,0.3)'}`,
              borderRadius:10,padding:'12px',fontFamily:'Syne,sans-serif',fontSize:11,
              fontWeight:800,letterSpacing:'1px',color: frozen?'#00E5A0':'#FF3B5C',
              cursor:'pointer',marginBottom:12,
            }}>
              {frozen ? '✓ UNFREEZE CARD' : '🔒 FREEZE CARD'}
            </button>

            {/* Recent transactions */}
            <div style={{ background:'#0D1624',border:'1px solid #1C2B42',borderRadius:12,padding:16 }}>
              <div style={{ fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:12,color:'#fff',marginBottom:12 }}>Recent Transactions</div>
              {TRANSACTIONS.map((t,i)=>(
                <div key={i} style={{ display:'flex',alignItems:'center',gap:12,padding:'8px 0',borderBottom: i<TRANSACTIONS.length-1?'1px solid rgba(255,255,255,0.04)':'none' }}>
                  <div style={{ width:34,height:34,borderRadius:'50%',background:'rgba(255,255,255,0.05)',border:'1px solid #1C2B42',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,flexShrink:0 }}>{t.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12,fontWeight:600,color:'#E2EAF5' }}>{t.merchant}</div>
                    <div style={{ fontSize:10,color:'#6A7D96' }}>{t.date}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontFamily:'monospace',fontSize:12,color:'#FF3B5C',fontWeight:600 }}>${Math.abs(t.amount).toFixed(2)}</div>
                    <div style={{ fontSize:9,color:'#00E5A0' }}>{t.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
