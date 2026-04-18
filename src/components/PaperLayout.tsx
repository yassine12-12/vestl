import React, { useState, useEffect } from 'react';
import { DataState, WeatherData, DeparturesData, Departure } from '../types';
import { Theme } from '../themes';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const LINE_COLORS: Record<string,{bg:string;fg:string}> = {
  U1:{bg:'#55b947',fg:'#000'},U2:{bg:'#d9222a',fg:'#fff'},U3:{bg:'#16683d',fg:'#fff'},
  U4:{bg:'#ffcf00',fg:'#000'},U5:{bg:'#7e5330',fg:'#fff'},U6:{bg:'#7d4499',fg:'#fff'},
  U7:{bg:'#528dba',fg:'#fff'},U8:{bg:'#224f86',fg:'#fff'},U9:{bg:'#f3791d',fg:'#fff'},
  S1:{bg:'#da5cbc',fg:'#fff'},S2:{bg:'#007734',fg:'#fff'},S3:{bg:'#0065b3',fg:'#fff'},
  S5:{bg:'#f54f2c',fg:'#fff'},S7:{bg:'#716ba6',fg:'#fff'},S8:{bg:'#55b947',fg:'#000'},
  S9:{bg:'#a04f75',fg:'#fff'},
};
const MODE_COLORS:Record<string,{bg:string;fg:string}> = {
  subway:{bg:'#0050a0',fg:'#fff'},suburban:{bg:'#007734',fg:'#fff'},
  tram:{bg:'#cc0000',fg:'#fff'},bus:{bg:'#5c3d8f',fg:'#fff'},
};
const lc=(n:string,m:string)=>LINE_COLORS[n]??MODE_COLORS[m]??{bg:'#444',fg:'#fff'};

function getMins(w:string){ return Math.round((new Date(w).getTime()-Date.now())/60000); }
function fmt(w:string){ const m=getMins(w); if(m<=0)return'sofort'; return`${m} min`; }

interface GRow{key:string;lineName:string;lineMode:string;direction:string;whens:string[];}

function buildGroups(deps:Departure[],hidden:string[]): GRow[] {
  const map=new Map<string,GRow>();
  deps.filter(d=>!hidden.includes(d.line.mode))
    .sort((a,b)=>new Date(a.when).getTime()-new Date(b.when).getTime())
    .forEach(d=>{
      const k=`${d.line.name}||${d.direction}`;
      if(!map.has(k))map.set(k,{key:k,lineName:d.line.name,lineMode:d.line.mode,direction:d.direction,whens:[]});
      const g=map.get(k)!; if(g.whens.length<3)g.whens.push(d.when);
    });
  const groups=Array.from(map.values());
  const earliest=new Map<string,number>();
  groups.forEach(g=>{const t=new Date(g.whens[0]).getTime();if(!earliest.has(g.lineName)||t<earliest.get(g.lineName)!)earliest.set(g.lineName,t);});
  groups.sort((a,b)=>{const la=earliest.get(a.lineName)!,lb=earliest.get(b.lineName)!;return la!==lb?la-lb:new Date(a.whens[0]).getTime()-new Date(b.whens[0]).getTime();});
  const cnt=new Map<string,number>();const out:GRow[]=[];
  for(const g of groups){const c=cnt.get(g.lineName)??0;if(c>=2)continue;cnt.set(g.lineName,c+1);out.push(g);if(out.length===8)break;}
  return out;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props{theme:Theme;weatherState:DataState<WeatherData>;departuresState:DataState<DeparturesData>;hiddenModes?:string[];}

export const PaperLayout: React.FC<Props> = ({ weatherState, departuresState, hiddenModes=[] }) => {
  const [now,setNow]=useState(new Date());
  useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t);},[]);

  const groups=buildGroups(departuresState.data?.departures??[],hiddenModes);
  const weather=weatherState.status==='success'?weatherState.data:null;
  const stopName=(departuresState.data?.departures??[]).find(d=>!hiddenModes.includes(d.line.mode))?.stop?.name??'';
  const isLoading=departuresState.status==='idle'||departuresState.status==='loading';

  const numRows=Math.max(1,groups.length);
  const headerVh=18;
  const rowHVh=(100-headerVh)/numRows;
  const rowFontVh=rowHVh*0.82;
  const nextFontVh=rowFontVh*0.52;

  const timeStr=now.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit',hour12:false});
  const dateStr=now.toLocaleDateString('de-DE',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).toUpperCase();

  const INK   = '#1a1a18';
  const INK3  = '#9a9a92';
  const RULE  = '#d4d0c8';
  const BG    = '#f7f4ec';

  return (
    <div style={{
      width:'100vw',height:'100vh',overflow:'hidden',
      background: BG,
      fontFamily:'-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif',
      display:'flex',flexDirection:'column',
      color: INK,
    }}>

      {/* Header */}
      <div style={{
        flexShrink:0,
        padding:'1.4rem 3rem 1rem',
        borderBottom:`2px solid ${INK}`,
        display:'flex', alignItems:'flex-end', justifyContent:'space-between',
      }}>
        <div>
          <div style={{fontSize:'8vh',fontWeight:700,letterSpacing:'-0.05em',lineHeight:0.9,color:INK,fontVariantNumeric:'tabular-nums'}}>
            {timeStr}
          </div>
          <div style={{fontSize:'3.5vh',fontWeight:600,letterSpacing:'0.18em',color:INK3,marginTop:'0.5rem'}}>
            {dateStr}
          </div>
        </div>

        <div style={{textAlign:'right'}}>
          {weather && <>
            <div style={{fontSize:'6vh',fontWeight:300,color:INK,letterSpacing:'-0.03em',lineHeight:1}}>
              {Math.round(weather.main.temp)}°C
            </div>
            <div style={{fontSize:'4vh',color:INK3,marginTop:'0.25rem',letterSpacing:'0.06em',textTransform:'capitalize'}}>
              {weather.weather[0]?.description}  ·  feels {Math.round(weather.main.feels_like)}°
            </div>
          </>}
          {stopName && <div style={{fontSize:'clamp(0.55rem,1vh,0.75rem)',color:INK3,marginTop:'0.4rem',letterSpacing:'0.12em',textTransform:'uppercase'}}>{stopName}</div>}
        </div>
      </div>

      {/* Column headers */}
      <div style={{
        flexShrink:0,
        display:'grid', gridTemplateColumns:'7rem 1fr 12rem',
        padding:'0.4rem 3rem', borderBottom:`1px solid ${RULE}`,
      }}>
        {['Linie','Richtung','Abfahrt'].map((h,i)=>(
          <span key={h} style={{
            fontSize:'clamp(0.55rem,1.1vh,0.78rem)',fontWeight:700,letterSpacing:'0.14em',
            textTransform:'uppercase',color:INK3,
            textAlign: i===2?'right':'left',
          }}>{h}</span>
        ))}
      </div>

      {/* Rows */}
      <div style={{flex:1,display:'flex',flexDirection:'column',minHeight:0}}>
        {isLoading ? (
          [...Array(5)].map((_,i)=>(
            <div key={i} style={{
              flex:1,borderBottom:`1px solid ${RULE}`,
              background: i%2===0?'transparent':'rgba(0,0,0,0.018)',
            }}/>
          ))
        ) : groups.map((g,i)=>{
          const mins=getMins(g.whens[0]);
          const urgent=mins<=2;
          const col=lc(g.lineName,g.lineMode);
          const isLast=i===groups.length-1;
          const timeColor=urgent?'#cc0000':INK;

          return (
            <div key={g.key} style={{
              height:`${rowHVh}vh`, display:'grid', gridTemplateColumns:'7rem 1fr 12rem',
              alignItems:'center', padding:'0 3rem',
              borderBottom:isLast?'none':`1px solid ${RULE}`,
              background:i%2===1?'rgba(0,0,0,0.022)':'transparent',
              overflow:'hidden',
            }}>
              {/* Line badge */}
              <div>
                <span style={{
                  display:'inline-flex',alignItems:'center',justifyContent:'center',
                  background:col.bg,color:col.fg,
                  fontSize:`${rowFontVh * 0.7}vh`,fontWeight:800,
                  padding:'0.15rem 0.55rem',borderRadius:4,
                  letterSpacing:'0.03em',
                }}>{g.lineName}</span>
              </div>

              {/* Direction */}
              <span style={{
                fontSize:`${rowFontVh}vh`,fontWeight:400,color:INK,
                overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',
                paddingRight:'2rem',lineHeight:1,
              }}>{g.direction}</span>

              {/* Times */}
              <div style={{display:'flex',alignItems:'baseline',gap:'0.8rem',justifyContent:'flex-end'}}>
                <span style={{
                  fontSize:`${rowFontVh}vh`,fontWeight:urgent?700:400,
                  color:timeColor,letterSpacing:'-0.01em',lineHeight:1,
                }} className={urgent?'live-pulse':undefined}>{fmt(g.whens[0])}</span>
                {g.whens.slice(1).map((w,j)=>(
                  <span key={j} style={{fontSize:`${nextFontVh}vh`,color:INK3,lineHeight:1}}>{fmt(w)}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
