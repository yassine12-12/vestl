import React, { useState, useEffect } from 'react';
import { DataState, WeatherData, DeparturesData, Departure } from '../types';
import { Theme } from '../themes';

// ─── Shared helpers ───────────────────────────────────────────────────────────

const LINE_COLORS: Record<string, string> = {
  U1:'#55b947',U2:'#d9222a',U3:'#16683d',U4:'#ffcf00',U5:'#7e5330',
  U6:'#7d4499',U7:'#528dba',U8:'#224f86',U9:'#f3791d',
  S1:'#da5cbc',S2:'#007734',S3:'#0065b3',S5:'#f54f2c',
  S7:'#716ba6',S8:'#55b947',S9:'#a04f75',
};
const MODE_COLORS: Record<string,string> = {
  subway:'#0050a0',suburban:'#007734',tram:'#cc0000',bus:'#5c3d8f',
};
const lc = (n:string,m:string) => LINE_COLORS[n] ?? MODE_COLORS[m] ?? '#444';

function getMins(w:string){ return Math.round((new Date(w).getTime()-Date.now())/60000); }
function fmt(w:string){ const m=getMins(w); return m<=0?'NOW':`${m}`; }

interface GRow { key:string; lineName:string; lineMode:string; direction:string; whens:string[]; }

function buildGroups(deps:Departure[], hidden:string[]): GRow[] {
  const map = new Map<string,GRow>();
  deps.filter(d=>!hidden.includes(d.line.mode))
    .sort((a,b)=>new Date(a.when).getTime()-new Date(b.when).getTime())
    .forEach(d=>{
      const k=`${d.line.name}||${d.direction}`;
      if(!map.has(k)) map.set(k,{key:k,lineName:d.line.name,lineMode:d.line.mode,direction:d.direction,whens:[]});
      const g=map.get(k)!; if(g.whens.length<3) g.whens.push(d.when);
    });
  const groups=Array.from(map.values());
  const earliest=new Map<string,number>();
  groups.forEach(g=>{ const t=new Date(g.whens[0]).getTime(); if(!earliest.has(g.lineName)||t<earliest.get(g.lineName)!) earliest.set(g.lineName,t); });
  groups.sort((a,b)=>{ const la=earliest.get(a.lineName)!,lb=earliest.get(b.lineName)!; return la!==lb?la-lb:new Date(a.whens[0]).getTime()-new Date(b.whens[0]).getTime(); });
  const cnt=new Map<string,number>(); const out:GRow[]=[];
  for(const g of groups){ const c=cnt.get(g.lineName)??0; if(c>=2)continue; cnt.set(g.lineName,c+1); out.push(g); if(out.length===6)break; }
  return out;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props { theme:Theme; weatherState:DataState<WeatherData>; departuresState:DataState<DeparturesData>; hiddenModes?:string[]; }

export const NovaLayout: React.FC<Props> = ({ weatherState, departuresState, hiddenModes=[] }) => {
  const [now,setNow]=useState(new Date());
  useEffect(()=>{ const t=setInterval(()=>setNow(new Date()),1000); return ()=>clearInterval(t); },[]);

  const groups = buildGroups(departuresState.data?.departures??[], hiddenModes);
  const weather = weatherState.status==='success'?weatherState.data:null;
  const stopName = (departuresState.data?.departures??[]).find(d=>!hiddenModes.includes(d.line.mode))?.stop?.name??'';
  const isLoading = departuresState.status==='idle'||departuresState.status==='loading';

  const timeStr = now.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit',hour12:false});

  return (
    <div style={{
      width:'100vw',height:'100vh',overflow:'hidden',
      background:'#050510',
      fontFamily:'-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif',
      display:'flex',flexDirection:'column',
    }}>
      {/* Subtle top gradient bar */}
      <div style={{ height:2, background:'linear-gradient(90deg,#ff0080,#00d4ff,#ff0080)', flexShrink:0 }} />

      {/* Header */}
      <div style={{
        flexShrink:0, display:'flex', alignItems:'center', gap:'2rem',
        padding:'1rem 2.5rem',
        borderBottom:'1px solid rgba(0,212,255,0.12)',
      }}>
        <span style={{
          fontSize:'clamp(2.5rem,6vh,5rem)', fontWeight:100, color:'#00d4ff',
          letterSpacing:'-0.04em', lineHeight:1, fontVariantNumeric:'tabular-nums',
        }}>{timeStr}</span>

        {weather && <>
          <span style={{fontSize:'clamp(1rem,2.4vh,2rem)',fontWeight:300,color:'rgba(0,212,255,0.55)',letterSpacing:'-0.02em'}}>
            {Math.round(weather.main.temp)}°
          </span>
          <span style={{fontSize:'clamp(0.75rem,1.6vh,1.3rem)',fontWeight:300,color:'rgba(255,255,255,0.22)',letterSpacing:'0.04em'}}>
            {weather.weather[0]?.description}
          </span>
        </>}

        {stopName && <span style={{
          marginLeft:'auto',fontSize:'clamp(0.6rem,1.2vh,0.9rem)',fontWeight:600,
          letterSpacing:'0.22em',color:'rgba(255,255,255,0.18)',textTransform:'uppercase',
        }}>{stopName}</span>}
      </div>

      {/* Board */}
      <div style={{flex:1,display:'flex',flexDirection:'column',padding:'0.4rem 0',minHeight:0}}>
        {isLoading ? (
          <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <span style={{color:'rgba(0,212,255,0.25)',fontSize:'0.75rem',letterSpacing:'0.3em'}}>LOADING</span>
          </div>
        ) : groups.map((g,i)=>{
          const mins=getMins(g.whens[0]);
          const urgent=mins<=2;
          const soon=mins<=5&&!urgent;
          const timeColor = urgent?'#ff2d78':soon?'#ffb200':'#ffffff';
          const bg = lc(g.lineName, g.lineMode);

          return (
            <div key={g.key} style={{
              flex:1, display:'flex', alignItems:'center',
              padding:'0 2.5rem', gap:'1.6rem', minHeight:0,
              borderBottom: i<groups.length-1?'1px solid rgba(255,255,255,0.04)':'none',
            }}>
              {/* Line badge */}
              <div style={{
                display:'flex',alignItems:'center',justifyContent:'center',
                minWidth:'4rem', height:'2rem', borderRadius:6,
                background:bg, flexShrink:0,
                fontSize:'clamp(0.85rem,2vh,1.1rem)', fontWeight:800, color:'#fff',
                letterSpacing:'0.02em',
                boxShadow:`0 0 12px ${bg}60`,
              }}>{g.lineName}</div>

              {/* Direction */}
              <span style={{
                flex:1, fontSize:'clamp(1rem,2.6vh,2.1rem)', fontWeight:300,
                color:'rgba(255,255,255,0.88)', overflow:'hidden',
                textOverflow:'ellipsis', whiteSpace:'nowrap',
                letterSpacing:'-0.01em', lineHeight:1,
              }}>{g.direction}</span>

              {/* Times */}
              <div style={{display:'flex',alignItems:'baseline',gap:'1rem',flexShrink:0}}>
                <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end'}}>
                  <span style={{
                    fontSize: mins===0?'clamp(1.2rem,3vh,2.4rem)':'clamp(1.6rem,4vh,3.2rem)',
                    fontWeight: urgent?700:200,
                    color:timeColor, letterSpacing:'-0.04em', lineHeight:1,
                    textShadow: urgent?`0 0 16px ${timeColor}90`:'none',
                  }} className={urgent?'live-pulse':undefined}>{fmt(g.whens[0])}</span>
                  {mins>0 && <span style={{fontSize:'0.55rem',fontWeight:600,color:timeColor,opacity:0.5,letterSpacing:'0.18em'}}>MIN</span>}
                </div>
                {g.whens.slice(1).map((w,j)=>(
                  <span key={j} style={{
                    fontSize:'clamp(0.85rem,2vh,1.5rem)',fontWeight:300,
                    color:'rgba(255,255,255,0.25)',letterSpacing:'-0.02em',lineHeight:1,
                  }}>{fmt(w)}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom gradient line */}
      <div style={{height:1,background:'linear-gradient(90deg,transparent,rgba(0,212,255,0.2),transparent)',flexShrink:0}} />
    </div>
  );
};
