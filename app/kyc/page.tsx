'use client'
import { useState } from 'react'

type Step = 'intro'|'personal'|'address'|'document'|'selfie'|'review'|'pending'|'approved'

export default function KYCPage() {
  const [step,     setStep]     = useState<Step>('intro')
  const [docType,  setDocType]  = useState<'passport'|'license'|'id'>('passport')
  const [form,     setForm]     = useState({ firstName:'',lastName:'',dob:'',nationality:'',email:'',phone:'',address:'',city:'',zip:'',country:'' })

  const update = (k: string, v: string) => setForm(f=>({...f,[k]:v}))

  const STEPS_MAP: Step[] = ['intro','personal','address','document','selfie','review','pending','approved']
  const stepIdx = STEPS_MAP.indexOf(step)

  const inp = (label: string, key: string, placeholder: string, type='text') => (
    <div style={{ marginBottom:14 }}>
      <div style={{ fontSize:9,color:'#6A7D96',letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:5,fontFamily:'Syne,sans-serif',fontWeight:700 }}>{label}</div>
      <input value={form[key as keyof typeof form]} onChange={e=>update(key,e.target.value)}
        placeholder={placeholder} type={type}
        style={{ width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid #1C2B42',borderRadius:8,padding:'11px 14px',color:'#E2EAF5',fontSize:12,outline:'none',transition:'border .2s' }}
        onFocus={e=>e.target.style.borderColor='rgba(0,240,255,0.4)'}
        onBlur={e=>e.target.style.borderColor='#1C2B42'}
      />
    </div>
  )

  return (
    <div style={{ minHeight:'100vh',background:'#060A12',padding:'40px 24px' }}>
      <div style={{ maxWidth:520,margin:'0 auto' }}>

        {/* Logo */}
        <a href="/" style={{ display:'flex',alignItems:'center',gap:8,textDecoration:'none',marginBottom:32 }}>
          <div style={{ width:32,height:32,borderRadius:8,background:'linear-gradient(135deg,#0A1628,#1A0E3A)',border:'1px solid rgba(0,240,255,0.4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16 }}>🔐</div>
          <span style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:18,letterSpacing:3,color:'#fff' }}>VAULT<span style={{color:'#00F0FF'}}>EX</span></span>
        </a>

        {/* Progress bar */}
        {step !== 'intro' && step !== 'pending' && step !== 'approved' && (
          <div style={{ marginBottom:28 }}>
            <div style={{ display:'flex',justifyContent:'space-between',marginBottom:6 }}>
              {['Personal','Address','Document','Selfie','Review'].map((s,i)=>(
                <div key={s} style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:4 }}>
                  <div style={{ width:28,height:28,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',
                    background: stepIdx > i+1 ? '#00E5A0' : stepIdx === i+1 ? '#00F0FF' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${stepIdx >= i+1 ? 'transparent' : '#1C2B42'}`,
                    fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:10,
                    color: stepIdx >= i+1 ? '#060A12' : '#6A7D96',
                  }}>{stepIdx > i+1 ? '✓' : i+1}</div>
                  <span style={{ fontSize:8,color: stepIdx >= i+1 ? '#00F0FF':'#6A7D96',letterSpacing:'1px' }}>{s.toUpperCase()}</span>
                </div>
              ))}
            </div>
            <div style={{ background:'rgba(255,255,255,0.04)',borderRadius:3,height:4 }}>
              <div style={{ height:4,borderRadius:3,background:'linear-gradient(90deg,#00F0FF,#7C3AED)',width:`${(stepIdx-1)/5*100}%`,transition:'width .4s ease' }}/>
            </div>
          </div>
        )}

        {/* INTRO */}
        {step === 'intro' && (
          <div>
            <div style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:28,color:'#fff',marginBottom:8 }}>Identity Verification</div>
            <div style={{ fontSize:13,color:'#6A7D96',marginBottom:28,lineHeight:1.7 }}>Required to comply with financial regulations and unlock full platform features including virtual cards and high-value swaps.</div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:28 }}>
              {[
                { icon:'💳', title:'Virtual Cards',    desc:'Issue real Visa/Mastercard debit cards' },
                { icon:'💸', title:'High-Value Swaps', desc:'Unlimited swap amounts' },
                { icon:'🏦', title:'Bank Transfers',   desc:'Link bank account for fiat deposits' },
                { icon:'🌍', title:'Global Payments',  desc:'Send money to 150+ countries' },
              ].map(f=>(
                <div key={f.title} style={{ background:'#0D1624',border:'1px solid #1C2B42',borderRadius:10,padding:14 }}>
                  <div style={{ fontSize:20,marginBottom:6 }}>{f.icon}</div>
                  <div style={{ fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:11,color:'#E2EAF5',marginBottom:3 }}>{f.title}</div>
                  <div style={{ fontSize:10,color:'#6A7D96' }}>{f.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ background:'rgba(0,240,255,0.04)',border:'1px solid rgba(0,240,255,0.15)',borderRadius:10,padding:14,marginBottom:20 }}>
              <div style={{ fontSize:11,color:'#6A7D96',lineHeight:1.7 }}>
                📋 <strong style={{color:'#E2EAF5'}}>What you'll need:</strong> Government-issued ID (passport, driver's license, or national ID) and a selfie. Takes about 3 minutes.
              </div>
            </div>
            <button onClick={()=>setStep('personal')} style={{ width:'100%',background:'#00F0FF',color:'#060A12',border:'none',borderRadius:12,padding:'16px',fontFamily:'Syne,sans-serif',fontSize:13,fontWeight:800,letterSpacing:'1px',cursor:'pointer' }}>
              START VERIFICATION →
            </button>
          </div>
        )}

        {/* PERSONAL */}
        {step === 'personal' && (
          <div>
            <div style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:22,color:'#fff',marginBottom:20 }}>Personal Information</div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:0 }}>
              <div style={{ paddingRight:8 }}>{inp('First Name','firstName','John')}</div>
              <div style={{ paddingLeft:8 }}>{inp('Last Name','lastName','Smith')}</div>
            </div>
            {inp('Date of Birth','dob','MM/DD/YYYY')}
            {inp('Nationality','nationality','United States')}
            {inp('Email Address','email','john@example.com','email')}
            {inp('Phone Number','phone','+1 (555) 000-0000','tel')}
            <button onClick={()=>setStep('address')} style={{ width:'100%',background:'#00F0FF',color:'#060A12',border:'none',borderRadius:12,padding:'14px',fontFamily:'Syne,sans-serif',fontSize:12,fontWeight:800,letterSpacing:'1px',cursor:'pointer',marginTop:8 }}>CONTINUE →</button>
          </div>
        )}

        {/* ADDRESS */}
        {step === 'address' && (
          <div>
            <div style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:22,color:'#fff',marginBottom:20 }}>Residential Address</div>
            {inp('Street Address','address','123 Main Street')}
            <div style={{ display:'grid',gridTemplateColumns:'2fr 1fr',gap:0 }}>
              <div style={{ paddingRight:8 }}>{inp('City','city','New York')}</div>
              <div style={{ paddingLeft:8 }}>{inp('ZIP / Postal','zip','10001')}</div>
            </div>
            {inp('Country','country','United States')}
            <button onClick={()=>setStep('document')} style={{ width:'100%',background:'#00F0FF',color:'#060A12',border:'none',borderRadius:12,padding:'14px',fontFamily:'Syne,sans-serif',fontSize:12,fontWeight:800,letterSpacing:'1px',cursor:'pointer',marginTop:8 }}>CONTINUE →</button>
          </div>
        )}

        {/* DOCUMENT */}
        {step === 'document' && (
          <div>
            <div style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:22,color:'#fff',marginBottom:20 }}>Upload ID Document</div>
            <div style={{ display:'flex',gap:10,marginBottom:20 }}>
              {(['passport','license','id'] as const).map(d=>(
                <button key={d} onClick={()=>setDocType(d)} style={{
                  flex:1,background: docType===d ? 'rgba(0,240,255,0.1)':'rgba(255,255,255,0.03)',
                  border:`1px solid ${docType===d?'rgba(0,240,255,0.4)':'#1C2B42'}`,
                  borderRadius:8,padding:'10px 6px',color: docType===d?'#00F0FF':'#6A7D96',
                  fontFamily:'Syne,sans-serif',fontSize:10,fontWeight:700,cursor:'pointer',
                }}>
                  {d==='passport'?'🛂 Passport':d==='license'?'🪪 Driver\'s License':'🪪 National ID'}
                </button>
              ))}
            </div>
            {['Front Side','Back Side'].map((side,i)=>(
              <div key={side} style={{ background:'rgba(255,255,255,0.02)',border:'2px dashed #1C2B42',borderRadius:12,padding:28,textAlign:'center',marginBottom:12,cursor:'pointer',transition:'all .2s' }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(0,240,255,0.3)';e.currentTarget.style.background='rgba(0,240,255,0.03)'}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='#1C2B42';e.currentTarget.style.background='rgba(255,255,255,0.02)'}}
              >
                <div style={{ fontSize:32,marginBottom:8 }}>{i===0?'📄':'🔄'}</div>
                <div style={{ fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:12,color:'#E2EAF5',marginBottom:4 }}>Upload {side}</div>
                <div style={{ fontSize:10,color:'#6A7D96' }}>JPG, PNG or PDF · Max 10MB</div>
              </div>
            ))}
            <button onClick={()=>setStep('selfie')} style={{ width:'100%',background:'#00F0FF',color:'#060A12',border:'none',borderRadius:12,padding:'14px',fontFamily:'Syne,sans-serif',fontSize:12,fontWeight:800,letterSpacing:'1px',cursor:'pointer',marginTop:8 }}>CONTINUE →</button>
          </div>
        )}

        {/* SELFIE */}
        {step === 'selfie' && (
          <div>
            <div style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:22,color:'#fff',marginBottom:8 }}>Take a Selfie</div>
            <div style={{ fontSize:12,color:'#6A7D96',marginBottom:20 }}>We need to verify your face matches your ID document.</div>
            <div style={{ background:'rgba(255,255,255,0.02)',border:'2px dashed #1C2B42',borderRadius:16,padding:40,textAlign:'center',marginBottom:20 }}>
              <div style={{ fontSize:60,marginBottom:12 }}>🤳</div>
              <div style={{ fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:14,color:'#E2EAF5',marginBottom:6 }}>Take or Upload Selfie</div>
              <div style={{ fontSize:11,color:'#6A7D96',marginBottom:16,lineHeight:1.6 }}>
                Look directly at the camera · Good lighting · No glasses or hats
              </div>
              <button style={{ background:'rgba(0,240,255,0.1)',border:'1px solid rgba(0,240,255,0.3)',borderRadius:8,padding:'10px 20px',color:'#00F0FF',fontFamily:'Syne,sans-serif',fontSize:11,fontWeight:700,cursor:'pointer' }}>
                📷 OPEN CAMERA
              </button>
            </div>
            <button onClick={()=>setStep('review')} style={{ width:'100%',background:'#00F0FF',color:'#060A12',border:'none',borderRadius:12,padding:'14px',fontFamily:'Syne,sans-serif',fontSize:12,fontWeight:800,letterSpacing:'1px',cursor:'pointer' }}>CONTINUE →</button>
          </div>
        )}

        {/* REVIEW */}
        {step === 'review' && (
          <div>
            <div style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:22,color:'#fff',marginBottom:20 }}>Review & Submit</div>
            <div style={{ background:'#0D1624',border:'1px solid #1C2B42',borderRadius:12,padding:18,marginBottom:16 }}>
              <div style={{ fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:10,color:'#6A7D96',letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:12 }}>Personal Details</div>
              {[['Name', `${form.firstName||'John'} ${form.lastName||'Smith'}`],['DOB',form.dob||'01/15/1990'],['Email',form.email||'john@example.com'],['Country',form.country||'United States']].map(([l,v])=>(
                <div key={l} style={{ display:'flex',justifyContent:'space-between',marginBottom:7 }}>
                  <span style={{ fontSize:11,color:'#6A7D96' }}>{l}</span>
                  <span style={{ fontSize:11,color:'#E2EAF5' }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ background:'rgba(0,240,255,0.04)',border:'1px solid rgba(0,240,255,0.15)',borderRadius:10,padding:14,marginBottom:20,fontSize:11,color:'#6A7D96',lineHeight:1.7 }}>
              By submitting, you agree to our <span style={{color:'#00F0FF',cursor:'pointer'}}>Terms of Service</span> and <span style={{color:'#00F0FF',cursor:'pointer'}}>Privacy Policy</span>. Your data is encrypted and processed in compliance with GDPR.
            </div>
            <button onClick={()=>setStep('pending')} style={{ width:'100%',background:'#00F0FF',color:'#060A12',border:'none',borderRadius:12,padding:'16px',fontFamily:'Syne,sans-serif',fontSize:13,fontWeight:800,letterSpacing:'1px',cursor:'pointer' }}>
              SUBMIT FOR VERIFICATION →
            </button>
          </div>
        )}

        {/* PENDING */}
        {step === 'pending' && (
          <div style={{ textAlign:'center',paddingTop:40 }}>
            <div style={{ fontSize:64,marginBottom:20 }}>⏳</div>
            <div style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:26,color:'#fff',marginBottom:10 }}>Under Review</div>
            <div style={{ fontSize:13,color:'#6A7D96',lineHeight:1.8,marginBottom:28,maxWidth:360,margin:'0 auto 28px' }}>
              Your documents are being verified. This usually takes 2-5 minutes. We'll email you once approved.
            </div>
            <div style={{ display:'flex',flexDirection:'column',gap:10,maxWidth:300,margin:'0 auto' }}>
              {['Documents received ✓','Identity check in progress...','Address verification pending','Final approval pending'].map((s,i)=>(
                <div key={s} style={{ display:'flex',alignItems:'center',gap:10,background:'#0D1624',border:'1px solid #1C2B42',borderRadius:8,padding:'10px 14px' }}>
                  <div style={{ width:8,height:8,borderRadius:'50%',background: i===0?'#00E5A0':i===1?'#F5C518':'#1C2B42',flexShrink:0 }}/>
                  <span style={{ fontSize:11,color: i===0?'#E2EAF5':i===1?'#F5C518':'#3A4A5A' }}>{s}</span>
                </div>
              ))}
            </div>
            <button onClick={()=>setStep('approved')} style={{ marginTop:28,background:'transparent',border:'1px solid #1C2B42',borderRadius:8,padding:'10px 20px',color:'#6A7D96',fontFamily:'Syne,sans-serif',fontSize:11,cursor:'pointer' }}>
              Simulate Approval →
            </button>
          </div>
        )}

        {/* APPROVED */}
        {step === 'approved' && (
          <div style={{ textAlign:'center',paddingTop:40 }}>
            <div style={{ fontSize:64,marginBottom:20 }}>🎉</div>
            <div style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:26,color:'#00E5A0',marginBottom:10 }}>Verified!</div>
            <div style={{ fontSize:13,color:'#6A7D96',lineHeight:1.8,marginBottom:28 }}>Your identity has been verified. All platform features are now unlocked.</div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:28 }}>
              {[{icon:'💳',t:'Virtual Cards',s:'Now available'},{icon:'💸',t:'Unlimited Swaps',s:'No limits'},{icon:'🏦',t:'Bank Transfer',s:'Enabled'},{icon:'🌍',t:'Global Send',s:'150+ countries'}].map(f=>(
                <div key={f.t} style={{ background:'#0D1624',border:'1px solid rgba(0,229,160,0.2)',borderRadius:10,padding:14,textAlign:'center' }}>
                  <div style={{ fontSize:24,marginBottom:6 }}>{f.icon}</div>
                  <div style={{ fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:11,color:'#E2EAF5',marginBottom:2 }}>{f.t}</div>
                  <div style={{ fontSize:10,color:'#00E5A0' }}>{f.s}</div>
                </div>
              ))}
            </div>
            <a href="/dashboard" style={{ display:'block',width:'100%',background:'#00F0FF',color:'#060A12',textDecoration:'none',borderRadius:12,padding:'16px',fontFamily:'Syne,sans-serif',fontSize:13,fontWeight:800,letterSpacing:'1px',textAlign:'center' }}>
              GO TO DASHBOARD →
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
