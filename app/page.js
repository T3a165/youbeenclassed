"use client";
import { useState } from "react";

const TYPES = [
  { key: "business", label: "Business Idea" },
  { key: "resume", label: "Résumé" },
  { key: "website", label: "Website" },
  { key: "tweet", label: "Tweet / Post" },
  { key: "product", label: "Product" },
  { key: "text", label: "Relationship Text" },
  { key: "anything", label: "Anything" },
];

const PLACEHOLDERS = {
  business: "Describe your business idea. What does it do? Who is it for? How does it make money?",
  resume: "Paste your résumé or describe your experience, skills, and career trajectory.",
  website: "Paste the URL or describe the website — what it does, its design, its purpose.",
  tweet: "Paste the tweet, post, or social media content you want classified.",
  product: "Describe the product — what it is, who buys it, how it works, what it costs.",
  text: "Paste the relationship text message(s) you want classified.",
  anything: "Paste or describe literally anything. We'll class it.",
};

const CLASS_COLORS = { A: "#2e7d32", B: "#1565c0", C: "#b8860b", D: "#c62828" };

export default function Home() {
  const [selectedType, setSelectedType] = useState("business");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function classify() {
    if (!input.trim()) return setError("Nothing to classify. Enter something.");
    if (input.trim().length < 10) return setError("Give us more to work with. At least a sentence.");
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: selectedType, input: input.trim() }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Classification failed.");
      }
      setResult(await res.json());
    } catch (err) {
      setError(err.message || "Classification failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setInput("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const color = result ? CLASS_COLORS[result.class] || "#888" : "#888";

  return (
    <>
      <style jsx global>{`
        *{margin:0;padding:0;box-sizing:border-box}
        body{background:#0a0a0a;color:#f5f5f0;font-family:'JetBrains Mono',monospace;min-height:100vh;overflow-x:hidden}
        body::before{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");pointer-events:none;z-index:9999}
        body::after{content:'';position:fixed;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px);pointer-events:none;z-index:9998}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:0.4}50%{opacity:1}}
        @keyframes loadSlide{0%{left:-50%}100%{left:100%}}
      `}</style>

      <div style={{maxWidth:800,margin:'0 auto',padding:'40px 24px',minHeight:'100vh',display:'flex',flexDirection:'column'}}>

        <header style={{textAlign:'center',padding:'60px 0 20px',borderBottom:'1px solid rgba(245,245,240,0.08)',marginBottom:50,animation:'fadeUp 0.8s ease'}}>
          <p style={{fontSize:11,letterSpacing:6,textTransform:'uppercase',color:'#888',marginBottom:20}}>Classification Engine v1.0</p>
          <h1 style={{fontFamily:"'Archivo Black',sans-serif",fontSize:'clamp(42px,10vw,80px)',lineHeight:0.95,letterSpacing:-2,textTransform:'uppercase'}}>
            You Been<br/>Classed<span style={{fontSize:'0.3em',verticalAlign:'super',color:'#888'}}>™</span>
            <span style={{display:'block',fontFamily:"'Instrument Serif',serif",fontStyle:'italic',fontSize:'0.5em',letterSpacing:2,color:'#888',textTransform:'none',marginTop:8}}>Enter anything. We&apos;ll class it.</span>
          </h1>
        </header>

        {!result && !loading && (
          <section style={{marginBottom:40,animation:'fadeUp 0.8s ease'}}>
            <div style={{fontSize:11,letterSpacing:4,textTransform:'uppercase',color:'#888',marginBottom:16}}>
              <span style={{color:'#f5f5f0',fontWeight:'bold'}}>{'>'}</span> Select Classification Type
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:20}}>
              {TYPES.map(t=>(
                <button key={t.key} onClick={()=>setSelectedType(t.key)} style={{
                  background:selectedType===t.key?'#f5f5f0':'transparent',
                  color:selectedType===t.key?'#0a0a0a':'#888',
                  border:`1px solid ${selectedType===t.key?'#f5f5f0':'rgba(245,245,240,0.15)'}`,
                  fontFamily:"'JetBrains Mono',monospace",fontSize:11,padding:'8px 16px',
                  cursor:'pointer',letterSpacing:1,textTransform:'uppercase',transition:'all 0.2s'
                }}>{t.label}</button>
              ))}
            </div>
            <div style={{fontSize:11,letterSpacing:4,textTransform:'uppercase',color:'#888',marginBottom:16}}>
              <span style={{color:'#f5f5f0',fontWeight:'bold'}}>{'>'}</span> Submit for Classification
            </div>
            <div style={{position:'relative'}}>
              <textarea value={input} onChange={e=>setInput(e.target.value)} maxLength={3000}
                placeholder={PLACEHOLDERS[selectedType]}
                style={{width:'100%',minHeight:140,background:'rgba(245,245,240,0.03)',border:'1px solid rgba(245,245,240,0.12)',
                  color:'#f5f5f0',fontFamily:"'JetBrains Mono',monospace",fontSize:14,padding:20,resize:'vertical',outline:'none',lineHeight:1.6}}
              />
              <span style={{position:'absolute',bottom:12,right:16,fontSize:10,color:'#888',opacity:0.5}}>{input.length}/3000</span>
            </div>
            <button onClick={classify} style={{width:'100%',padding:18,marginTop:16,background:'#f5f5f0',color:'#0a0a0a',border:'none',
              fontFamily:"'Archivo Black',sans-serif",fontSize:15,letterSpacing:4,textTransform:'uppercase',cursor:'pointer'}}>
              Class It
            </button>
            {error && <div style={{background:'rgba(198,40,40,0.1)',border:'1px solid rgba(198,40,40,0.3)',color:'#c62828',padding:'16px 20px',fontSize:12,marginTop:16}}>{error}</div>}
          </section>
        )}

        {loading && (
          <div style={{textAlign:'center',padding:'60px 0'}}>
            <p style={{fontSize:12,letterSpacing:4,textTransform:'uppercase',color:'#888',animation:'pulse 1.5s ease infinite'}}>Classifying submission...</p>
            <div style={{width:200,height:2,background:'rgba(245,245,240,0.08)',margin:'24px auto 0',position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',left:'-50%',width:'50%',height:'100%',background:'#f5f5f0',animation:'loadSlide 1.2s ease infinite'}}/>
            </div>
          </div>
        )}

        {result && (
          <section style={{animation:'fadeUp 0.6s ease'}}>
            <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:40}}>
              <div style={{flex:1,height:1,background:'rgba(245,245,240,0.12)'}}/>
              <span style={{fontSize:10,letterSpacing:6,textTransform:'uppercase',color:'#888'}}>Verdict</span>
              <div style={{flex:1,height:1,background:'rgba(245,245,240,0.12)'}}/>
            </div>

            <div style={{border:'1px solid rgba(245,245,240,0.12)',padding:'clamp(24px,5vw,40px)',marginBottom:32,background:'rgba(245,245,240,0.02)',borderLeft:`4px solid ${color}`}}>
              <div style={{fontSize:10,letterSpacing:6,textTransform:'uppercase',color:'#888',marginBottom:12}}>Official Classification</div>
              <div style={{fontFamily:"'Archivo Black',sans-serif",fontSize:'clamp(32px,8vw,56px)',letterSpacing:-1,textTransform:'uppercase',lineHeight:1.1,marginBottom:4,color}}>
                Class {result.class}: {result.class_label}
              </div>
              <div style={{fontFamily:"'Instrument Serif',serif",fontStyle:'italic',fontSize:20,color:'#888',marginBottom:24}}>{result.subtitle}</div>
              <div style={{fontSize:14,lineHeight:1.8,color:'rgba(245,245,240,0.75)'}}>{result.summary}</div>
            </div>

            <div style={{marginBottom:32}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:10}}>
                <span style={{fontSize:10,letterSpacing:3,textTransform:'uppercase',color:'#888'}}>Viability Index</span>
                <span style={{fontFamily:"'Archivo Black',sans-serif",fontSize:24,color}}>{result.score}/100</span>
              </div>
              <div style={{width:'100%',height:4,background:'rgba(245,245,240,0.08)'}}>
                <div style={{height:'100%',width:`${result.score}%`,background:color,transition:'width 1.5s cubic-bezier(0.16,1,0.3,1)'}}/>
              </div>
            </div>

            <div style={{display:'grid',gap:2,marginBottom:32}}>
              {[
                {label:'Strength',value:result.strength},
                {label:'Weakness',value:result.weakness},
                {label:'Monetization',value:result.monetization},
                {label:'Strategic Leverage',value:result.leverage},
                {label:'Blind Spot',value:result.blind_spot},
              ].map(item=>(
                <div key={item.label} style={{display:'grid',gridTemplateColumns:'clamp(120px,25vw,180px) 1fr',background:'rgba(245,245,240,0.02)',border:'1px solid rgba(245,245,240,0.06)'}}>
                  <div style={{padding:'16px 20px',fontSize:10,letterSpacing:3,textTransform:'uppercase',color:'#888',background:'rgba(245,245,240,0.03)',borderRight:'1px solid rgba(245,245,240,0.06)'}}>{item.label}</div>
                  <div style={{padding:'16px 20px',fontSize:13,lineHeight:1.7,color:'rgba(245,245,240,0.8)'}}>{item.value}</div>
                </div>
              ))}
            </div>

            <div style={{textAlign:'center',padding:'40px 0',borderTop:'1px solid rgba(245,245,240,0.08)'}}>
              <p style={{fontFamily:"'Instrument Serif',serif",fontStyle:'italic',fontSize:18,color:'#888'}}>&ldquo;{result.final_quote}&rdquo;</p>
              <span style={{fontFamily:"'Archivo Black',sans-serif",fontSize:12,letterSpacing:6,textTransform:'uppercase',color:'rgba(245,245,240,0.25)',marginTop:16,display:'block'}}>You Been Classed™ — youbeenclassed.org</span>
            </div>

            <button onClick={reset} style={{background:'transparent',border:'1px solid rgba(245,245,240,0.12)',color:'#888',
              fontFamily:"'JetBrains Mono',monospace",fontSize:11,letterSpacing:3,textTransform:'uppercase',
              padding:'14px 32px',cursor:'pointer',display:'block',margin:'20px auto 0'}}>
              Class Something Else
            </button>
          </section>
        )}

        <footer style={{marginTop:'auto',paddingTop:60,textAlign:'center'}}>
          <p style={{fontSize:10,letterSpacing:3,textTransform:'uppercase',color:'rgba(245,245,240,0.15)'}}>youbeenclassed.org — Verdict Engine — Est. 2025</p>
        </footer>
      </div>
    </>
  );
}
