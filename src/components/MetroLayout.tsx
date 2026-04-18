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
const lc=(n:string,m:string)=>LINE_COLORS[n]??MODE_COLORS[m]??{bg:'#333',fg:'#fff'};

function getMins(w:string){return Math.round((new Date(w).getTime()-Date.now())/60000);}
function fmt(w:string){const m=getMins(w);return m<=0?'NOW':`${m}`;}

interface GRow{key:string;lineName:string;lineMode:string;direction:string;whens:string[];}

function buildGroups(deps:Departure[],hidden:string[]): GRow[] {
  const map=new Map<string,GRow>();
  deps.filter(d=>!hidden.includes(d.line.mode))
    .sort((a,b)=>new Date(a.when).getTime()-new Date(b.when).getTime())
    .forEach(d=>{
      const k=`${d.line.name}||${d.direction}`;
      if(!map.has(k))map.set(k,{key:k,lineName:d.line.name,lineMode:d.line.mode,direction:d.direction,whens:[]});
      const g=map.get(k)!;if(g.whens.length<3)g.whens.push(d.when);
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

export const MetroLayout: React.FC<Props> = ({ weatherState, departuresState, hiddenModes=[] }) => {
  const [now,setNow]=useState(new Date());
  useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t);},[]);

  const groups=buildGroups(departuresState.data?.departures??[],hiddenModes);
  const weather=weatherState.status==='success'?weatherState.data:null;
  const stopName=(departuresState.data?.departures??[]).find(d=>!hiddenModes.includes(d.line.mode))?.stop?.name??'';
  const isLoading=departuresState.status==='idle'||departuresState.status==='loading';

  const numRows=Math.max(1,groups.length);
  const headerVh=14;
  const rowHVh=(100-headerVh)/numRows;
  const rowFontVh=rowHVh*0.82;
  const nextFontVh=rowFontVh*0.52;

  const timeStr=now.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit',hour12:false});
  const dateStr=now.toLocaleDateString('de-DE',{weekday:'short',day:'numeric',month:'short'}).toUpperCase();

  return (
    <div style={{
      width:'100vw',height:'100vh',overflow:'hidden',
      background:'#111318',
      fontFamily:'-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif',
      display:'flex',flexDirection:'column',
    }}>

      {/* Header */}
      <div style={{
        flexShrink:0,
        display:'flex',alignItems:'center',gap:'1.5rem',
        padding:'1.2rem 2rem 1rem',
      }}>
        <div>
          <div style={{
            fontSize:'8vh',fontWeight:100,
            color:'rgba(255,255,255,0.95)',letterSpacing:'-0.05em',lineHeight:0.95,
            fontVariantNumeric:'tabular-nums',
          }}>{timeStr}</div>
          <div style={{fontSize:'3.5vh',fontWeight:600,letterSpacing:'0.2em',color:'rgba(255,255,255,0.22)',marginTop:'0.35rem'}}>
            {dateStr}
          </div>
        </div>

        {weather && (
          <div style={{
            marginLeft:'1rem',
            display:'flex',alignItems:'center',gap:'0.6rem',
            background:'rgba(255,255,255,0.06)',borderRadius:12,
            padding:'0.5rem 1rem',border:'1px solid rgba(255,255,255,0.08)',
          }}>
            <span style={{fontSize:'6vh',fontWeight:200,color:'rgba(255,255,255,0.9)',letterSpacing:'-0.03em',lineHeight:1}}>
              {Math.round(weather.main.temp)}°
            </span>
            <div>
              <div style={{fontSize:'4vh',color:'rgba(255,255,255,0.4)',letterSpacing:'0.05em',textTransform:'capitalize'}}>
                {weather.weather[0]?.description}
              </div>
              <div style={{fontSize:'3vh',color:'rgba(255,255,255,0.22)',marginTop:'0.1rem'}}>
                feels {Math.round(weather.main.feels_like)}°
              </div>
            </div>
          </div>
        )}

        {stopName && <span style={{
          marginLeft:'auto',fontSize:'clamp(0.55rem,1vh,0.78rem)',fontWeight:600,
          letterSpacing:'0.2em',color:'rgba(255,255,255,0.15)',textTransform:'uppercase',
        }}>{stopName}</span>}
      </div>

      {/* Cards */}
      <div style={{flex:1,display:'flex',flexDirection:'column',padding:'0.4rem 1.4rem 1.4rem',gap:'0.5rem',minHeight:0}}>
        {isLoading ? (
          [...Array(5)].map((_,i)=>(
            <div key={i} className="shimmer" style={{flex:1,borderRadius:10,opacity:0.15+i*0.03,background:'rgba(255,255,255,0.06)'}}/>
          ))
        ) : groups.map((g)=>{
          const mins=getMins(g.whens[0]);
          const urgent=mins<=2;
          const soon=mins<=5&&!urgent;
          const col=lc(g.lineName,g.lineMode);
          const countColor=urgent?'#ef4444':soon?'#f59e0b':'rgba(255,255,255,0.92)';

          return (
            <div key={g.key} style={{
              height:`${rowHVh - 1}vh`, display:'flex', alignItems:'stretch',
              background:'rgba(255,255,255,0.04)',
              border:'1px solid rgba(255,255,255,0.07)',
              borderRadius:10, overflow:'hidden', flexShrink:0,
            }}>
              {/* Color strip + line badge */}
              <div style={{
                width:`${rowFontVh * 3.5}vh`,flexShrink:0,
                background:col.bg,
                display:'flex',alignItems:'center',justifyContent:'center',
              }}>
                <span style={{
                  fontSize:`${rowFontVh}vh`,fontWeight:900,
                  color:col.fg,letterSpacing:'0.02em',
                }}>{g.lineName}</span>
              </div>

              {/* Content */}
              <div style={{flex:1,display:'flex',alignItems:'center',padding:'0 1.8rem',gap:'1rem',minWidth:0}}>
                <span style={{
                  flex:1,fontSize:`${rowFontVh}vh`,fontWeight:300,
                  color:'rgba(255,255,255,0.88)',overflow:'hidden',
                  textOverflow:'ellipsis',whiteSpace:'nowrap',
                  letterSpacing:'-0.01em',lineHeight:1,
                }}>{g.direction}</span>

                {/* Countdown */}
                <div style={{flexShrink:0,display:'flex',alignItems:'baseline',gap:'1rem'}}>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end'}}>
                    <span style={{
                      fontSize:`${rowFontVh}vh`,
                      fontWeight:urgent?700:200,
                      color:countColor,letterSpacing:'-0.04em',lineHeight:1,
                      transition:'color 0.4s',
                    }} className={urgent?'live-pulse':undefined}>{fmt(g.whens[0])}</span>
                    {mins>0&&<span style={{fontSize:`${nextFontVh * 0.6}vh`,fontWeight:700,color:countColor,opacity:0.5,letterSpacing:'0.2em'}}>MIN</span>}
                  </div>
                  {g.whens.slice(1).map((w,j)=>(
                    <span key={j} style={{
                      fontSize:`${nextFontVh}vh`,fontWeight:300,
                      color:'rgba(255,255,255,0.22)',letterSpacing:'-0.02em',lineHeight:1,
                    }}>{fmt(w)}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
