'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// ─── Raridades ────────────────────────────────────────────────────────────────
type Rarity = 'comum' | 'incomum' | 'raro' | 'epico' | 'lendario'

const RARITY_CONFIG: Record<Rarity, {
  label: string; color: string; bg: string; glow: string
  glowSize: string; shimmer: boolean; particles: boolean
}> = {
  comum:    { label:'Comum',    color:'rgba(190,190,190,.9)',  bg:'rgba(80,80,80,.35)',      glow:'rgba(180,180,180,.0)',  glowSize:'0px',  shimmer:false, particles:false },
  incomum:  { label:'Incomum',  color:'rgba(100,180,255,1)',   bg:'rgba(30,80,180,.4)',      glow:'rgba(80,160,255,.35)', glowSize:'12px', shimmer:false, particles:false },
  raro:     { label:'Raro',     color:'rgba(200,100,255,1)',   bg:'rgba(100,30,180,.45)',    glow:'rgba(160,60,255,.45)', glowSize:'18px', shimmer:true,  particles:false },
  epico:    { label:'Épico',    color:'rgba(255,210,50,1)',    bg:'rgba(160,100,0,.45)',     glow:'rgba(255,190,30,.55)', glowSize:'24px', shimmer:true,  particles:false },
  lendario: { label:'Lendário', color:'rgba(255,100,200,1)',   bg:'rgba(140,0,80,.5)',       glow:'rgba(248,87,166,.7)', glowSize:'30px', shimmer:true,  particles:true  },
}

// ─── Achievements lookup ──────────────────────────────────────────────────────
const ALL_ACHIEVEMENTS: Record<string, { icon:string; label:string; rarity:Rarity }> = {
  primeira_msg:     {icon:'🟢',label:'Primeira Mensagem',      rarity:'comum'   },
  primeira_risada:  {icon:'😄',label:'Primeira Risada',         rarity:'comum'   },
  primeiro_flert:   {icon:'😏',label:'Primeiro Flert',          rarity:'comum'   },
  madrugada:        {icon:'🌙',label:'Conversa Madrugada',      rarity:'comum'   },
  bom_dia:          {icon:'☀️',label:'Primeiro "Bom dia"',      rarity:'comum'   },
  audio_gigante:    {icon:'🎤',label:'Áudio Gigante',           rarity:'comum'   },
  primeiro_encontro:{icon:'🟡',label:'Primeiro Encontro',       rarity:'comum'   },
  primeiro_abraco:  {icon:'🤗',label:'Primeiro Abraço',         rarity:'comum'   },
  primeiro_beijo:   {icon:'💋',label:'Primeiro Beijo',          rarity:'incomum' },
  primeira_foto:    {icon:'📸',label:'Primeira Foto Juntos',    rarity:'comum'   },
  selfie_casal:     {icon:'🤳',label:'Selfie de Casal',         rarity:'comum'   },
  eu_gosto:         {icon:'💌',label:'"Eu gosto de você"',      rarity:'incomum' },
  cinema:           {icon:'🎬',label:'Cinema Juntos',           rarity:'comum'   },
  jantar:           {icon:'🍕',label:'Jantar Juntos',           rarity:'comum'   },
  delivery:         {icon:'🍔',label:'Delivery Juntos',         rarity:'comum'   },
  cafe:             {icon:'☕',label:'Café Juntos',             rarity:'comum'   },
  sorvete:          {icon:'🍨',label:'Sorvete Compartilhado',   rarity:'incomum' },
  role_aleatorio:   {icon:'📷',label:'Rolê Aleatório',          rarity:'incomum' },
  viagem:           {icon:'🚗',label:'Primeira Viagem',         rarity:'raro'    },
  praia:            {icon:'🏖️',label:'Praia Juntos',            rarity:'raro'    },
  hotel:            {icon:'🏨',label:'Primeiro Hotel',          rarity:'raro'    },
  sem_planejamento: {icon:'🧭',label:'Aventura Sem Plano',      rarity:'incomum' },
  por_do_sol:       {icon:'🌄',label:'Pôr do Sol Juntos',       rarity:'incomum' },
  lugar_novo:       {icon:'🗺️',label:'Lugar Novo',              rarity:'incomum' },
  mercado:          {icon:'🛒',label:'Mercado Juntos',          rarity:'raro'    },
  cozinhar:         {icon:'🍳',label:'Cozinharam Juntos',       rarity:'raro'    },
  dia_inteiro:      {icon:'🛋️',label:'Dia Inteiro Juntos',      rarity:'raro'    },
  tarefa_dom:       {icon:'🧺',label:'Tarefa Doméstica',        rarity:'raro'    },
  noite_juntos:     {icon:'🛏️',label:'Primeira Noite',          rarity:'raro'    },
  pet:              {icon:'🐶',label:'Pet Juntos',              rarity:'raro'    },
  primeiro_choro:   {icon:'😭',label:'Primeiro Choro',          rarity:'raro'    },
  reconciliacao:    {icon:'🤝',label:'Reconciliação',           rarity:'raro'    },
  carta_romantica:  {icon:'💌',label:'Carta Romântica',         rarity:'incomum' },
  print_chat:       {icon:'📱',label:'Print do Chat',           rarity:'incomum' },
  ligacao_longa:    {icon:'📞',label:'Ligação Longa',           rarity:'incomum' },
  familia:          {icon:'👨‍👩‍👧',label:'Conheceu Família',        rarity:'raro'    },
  briga_comida:     {icon:'🍕',label:'Briga por Comida',        rarity:'comum'   },
  maratona_serie:   {icon:'📺',label:'Maratona de Série',       rarity:'incomum' },
  dormiu_filme:     {icon:'😴',label:'Dormiu no Filme',         rarity:'comum'   },
  foto_engracada:   {icon:'📸',label:'Foto Engraçada',          rarity:'comum'   },
  apelido:          {icon:'🧸',label:'Apelido Fofo',            rarity:'comum'   },
  planta:           {icon:'🌱',label:'Primeira Planta',         rarity:'incomum' },
  noivado:          {icon:'💍',label:'Noivado',                 rarity:'epico'   },
  morar_juntos:     {icon:'🏡',label:'Morar Juntos',            rarity:'epico'   },
  adotar_pet:       {icon:'🐕',label:'Adotar Pet',              rarity:'epico'   },
  primeiro_filho:   {icon:'👶',label:'Primeiro Filho',          rarity:'lendario'},
  construir_vida:   {icon:'❤️',label:'Construir uma Vida',      rarity:'lendario'},
  aniversario_surp: {icon:'🎂',label:'Aniversário Surpresa',    rarity:'epico'   },
  // compat antigo
  beijo:            {icon:'💋',label:'Primeiro Beijo',          rarity:'incomum' },
  casa:             {icon:'🏠',label:'Moraram Juntos',          rarity:'epico'   },
  anos1:            {icon:'🎉',label:'1 Ano Juntos',            rarity:'raro'    },
  aniversario:      {icon:'🎂',label:'Aniversário Surpresa',    rarity:'epico'   },
}

// ─── Conquistas de tempo ──────────────────────────────────────────────────────
const TIME_ACHIEVEMENTS = [
  {dias:7,   icon:'🥉',medal:'bronze', name:'Primeiro Checkpoint',    desc:'Vocês sobreviveram à primeira semana sem se cansar um do outro.'},
  {dias:30,  icon:'🥉',medal:'bronze', name:'Modo Tutorial Concluído',desc:'Já sabem o gosto musical, comidas favoritas e algumas manias.'},
  {dias:90,  icon:'🥈',medal:'silver', name:'Crise dos 3',            desc:'Primeiros pequenos conflitos superados. O jogo ficou sério.'},
  {dias:180, icon:'🥈',medal:'silver', name:'Party Formada',          desc:'Vocês já funcionam como um time.'},
  {dias:270, icon:'🥇',medal:'gold',   name:'Bug Descoberto',         desc:'Agora vocês conhecem os defeitos um do outro.'},
  {dias:365, icon:'🏆',medal:'trophy', name:'Primeiro Boss Derrotado',desc:'Um ciclo completo. A relação passou pelo teste do tempo.'},
  {dias:548, icon:'🏆',medal:'trophy', name:'DLC Emocional',          desc:'Já passaram por momentos bons e difíceis juntos.'},
  {dias:730, icon:'🏆',medal:'trophy', name:'Co-op Avançado',         desc:'Já existe rotina, planos e histórias suficientes para um livro.'},
  {dias:1095,icon:'💎',medal:'diamond',name:'Veteranos do Jogo',      desc:'Vocês conhecem as estratégias um do outro.'},
  {dias:1825,icon:'💎',medal:'diamond',name:'Guilda Permanente',      desc:'Já enfrentaram vários bosses da vida juntos.'},
  {dias:3650,icon:'👑',medal:'crown',  name:'Lenda Viva',             desc:'Casal desbloqueado no ranking lendário.'},
]

// ─── Astronomy ────────────────────────────────────────────────────────────────
function getMoonPhase(d:Date){const k=new Date('2000-01-06T18:14:00Z');const diff=(d.getTime()-k.getTime())/86400000;const c=29.530588853;return((diff%c)+c)%c/c}
function moonInfo(p:number){if(p<.03||p>.97)return{emoji:'🌑',name:'Lua Nova'};if(p<.22)return{emoji:'🌒',name:'Lua Crescente'};if(p<.28)return{emoji:'🌓',name:'Quarto Crescente'};if(p<.47)return{emoji:'🌔',name:'Gibosa Crescente'};if(p<.53)return{emoji:'🌕',name:'Lua Cheia'};if(p<.72)return{emoji:'🌖',name:'Gibosa Minguante'};if(p<.78)return{emoji:'🌗',name:'Quarto Minguante'};return{emoji:'🌘',name:'Lua Minguante'}}
function julianDay(d:Date){const y=d.getUTCFullYear(),m=d.getUTCMonth()+1,dd=d.getUTCDate();return 367*y-Math.floor(7*(y+Math.floor((m+9)/12))/4)+Math.floor(275*m/9)+dd+1721013.5}
function localSiderealTime(d:Date,lng:number){const jd=julianDay(d),T=(jd-2451545)/36525;let g=280.46061837+360.98564736629*(jd-2451545)+.000387933*T*T-T*T*T/38710000;return((g+lng)%360+360)%360}
function raDecToAltAz(ra:number,dec:number,lat:number,lst:number){const ha=((lst-ra)%360+360)%360,haR=ha*Math.PI/180,decR=dec*Math.PI/180,latR=lat*Math.PI/180;const sinAlt=Math.sin(decR)*Math.sin(latR)+Math.cos(decR)*Math.cos(latR)*Math.cos(haR);const alt=Math.asin(Math.max(-1,Math.min(1,sinAlt)))*180/Math.PI;const cosAz=(Math.sin(decR)-Math.sin(alt*Math.PI/180)*Math.sin(latR))/(Math.cos(alt*Math.PI/180)*Math.cos(latR));let az=Math.acos(Math.max(-1,Math.min(1,cosAz)))*180/Math.PI;if(Math.sin(haR)>0)az=360-az;return{alt,az}}
function altAzToXY(alt:number,az:number,W:number,H:number){const r=(1-alt/90)*(H*.52),theta=(az-180)*Math.PI/180;return{x:W/2+r*Math.sin(theta),y:H*.4+r*Math.cos(theta),visible:alt>4}}
function pseudoRand(n:number){const x=Math.sin(n+1)*43758.5453;return x-Math.floor(x)}
const STARS:[number,number,number,string][]=[
  [101.287,-16.716,-1.46,'Sírius'],[95.988,-52.696,-0.74,'Canopo'],[219.917,-60.834,-0.29,'Rigil'],
  [213.915,19.182,-0.05,'Arcturus'],[279.235,38.783,0.03,'Vega'],[114.825,5.225,0.12,'Procyon'],
  [88.793,7.407,0.42,'Betelgeuse'],[78.634,-8.201,0.13,'Rigel'],[24.429,-57.237,0.50,'Achernar'],
  [116.329,28.026,0.71,'Pólux'],[297.696,8.868,0.77,'Altair'],[68.980,16.509,0.85,'Aldebaran'],
  [152.093,11.967,1.00,'Régulo'],[344.413,-29.621,1.16,'Fomalhaut'],
]
const CITY_DB:Record<string,{lat:number;lng:number;label:string}>={
  'são paulo':{lat:-23.5,lng:-46.6,label:'São Paulo, Brasil'},'sao paulo':{lat:-23.5,lng:-46.6,label:'São Paulo, Brasil'},
  'rio de janeiro':{lat:-22.9,lng:-43.2,label:'Rio de Janeiro, Brasil'},'rio':{lat:-22.9,lng:-43.2,label:'Rio de Janeiro, Brasil'},
  'curitiba':{lat:-25.4,lng:-49.3,label:'Curitiba, Brasil'},'brasília':{lat:-15.8,lng:-47.9,label:'Brasília, Brasil'},
  'brasilia':{lat:-15.8,lng:-47.9,label:'Brasília, Brasil'},'belo horizonte':{lat:-19.9,lng:-43.9,label:'Belo Horizonte, Brasil'},
  'fortaleza':{lat:-3.7,lng:-38.5,label:'Fortaleza, Brasil'},'salvador':{lat:-12.9,lng:-38.5,label:'Salvador, Brasil'},
  'sorocaba':{lat:-23.5,lng:-47.5,label:'Sorocaba, Brasil'},'porto alegre':{lat:-30.0,lng:-51.2,label:'Porto Alegre, Brasil'},
  'recife':{lat:-8.0,lng:-34.9,label:'Recife, Brasil'},'buenos aires':{lat:-34.6,lng:-58.4,label:'Buenos Aires, Argentina'},
  'santiago':{lat:-33.5,lng:-70.7,label:'Santiago, Chile'},'lisboa':{lat:38.7,lng:-9.1,label:'Lisboa, Portugal'},
  'paris':{lat:48.9,lng:2.3,label:'Paris, França'},'london':{lat:51.5,lng:-0.1,label:'Londres, UK'},
  'new york':{lat:40.7,lng:-74.0,label:'Nova York, EUA'},'miami':{lat:25.8,lng:-80.2,label:'Miami, EUA'},
  'tokyo':{lat:35.7,lng:139.7,label:'Tóquio, Japão'},
}
function getCoords(city:string){const k=city.toLowerCase().trim();if(CITY_DB[k])return CITY_DB[k];for(const key in CITY_DB)if(k.includes(key)||key.includes(k.split(' ')[0]))return CITY_DB[key];return{lat:-23.5,lng:-46.6,label:city+', Brasil'}}
const SEASONS={
  summer:{icon:'☀️',name:'Verão',desc:'Calor, luz e energia. O verão reflete a intensidade do que vocês sentiram desde o primeiro momento.',chips:['☀️ Verão','🌊 Dias quentes','🍦 Sorvete a dois']},
  autumn:{icon:'🍂',name:'Outono',desc:'Transformação e profundidade. O outono representa a beleza das mudanças que o amor traz.',chips:['🍂 Outono','🌬️ Ventos novos','🍵 Chá quentinho']},
  winter:{icon:'❄️',name:'Inverno',desc:'Uma época fria, mas o amor de vocês aqueceu tudo ao redor.',chips:['❄️ Inverno','🧣 Agasalhos','☕ Café quentinho']},
  spring:{icon:'🌸',name:'Primavera',desc:'Florescimento e novos começos. Vocês eram o renascimento um do outro.',chips:['🌸 Primavera','🌼 Flores','🦋 Novos começos']},
}
function getSeason(d:Date):keyof typeof SEASONS{const m=d.getMonth()+1,dd=d.getDate();if((m===12&&dd>=21)||m<=2||(m===3&&dd<20))return'summer';if((m===3&&dd>=20)||m<=5||(m===6&&dd<21))return'autumn';if((m===6&&dd>=21)||m<=8||(m===9&&dd<22))return'winter';return'spring'}

// ─── Sky Canvas ───────────────────────────────────────────────────────────────
function SkyCanvas({date,city}:{date:Date;city:string}){
  const canvasRef=useRef<HTMLCanvasElement>(null);const rafRef=useRef<number>(0)
  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;const ctx=canvas.getContext('2d')!
    const W=canvas.offsetWidth,H=canvas.offsetHeight;canvas.width=W;canvas.height=H
    const coords=getCoords(city);const skyDate=new Date(date);skyDate.setHours(22,0,0)
    const lst=localSiderealTime(skyDate,coords.lng);const seed=skyDate.getTime()
    const starData:any[]=[]
    STARS.forEach(([ra,dec,mag,name])=>{
      const{alt,az}=raDecToAltAz(ra,dec,coords.lat,lst);const{x,y,visible}=altAzToXY(alt,az,W,H)
      const sz=Math.max(.5,4.5-mag*1.1),alpha=Math.max(.3,Math.min(1,1-(mag+1.5)*.14))
      const blue=ra<100||(ra>270&&ra<320),red=(ra>80&&ra<90)||(ra>240&&ra<260)
      starData.push({x,y,vis:visible&&alt>5,sz,alpha,r:red?255:blue?180:240,g:red?160:blue?200:235,b:red?100:blue?255:255,name,freq:.5+pseudoRand(ra)*2,phase:pseudoRand(dec)*Math.PI*2})
    })
    for(let i=0;i<280;i++){
      const ra2=pseudoRand(seed+i*7919)*360,dec2=(pseudoRand(seed+i*6271)-.5)*150
      const{alt,az}=raDecToAltAz(ra2,dec2,coords.lat,lst);const{x,y,visible}=altAzToXY(alt,az,W,H)
      if(!visible||alt<8)continue
      starData.push({x,y,vis:true,sz:.3+pseudoRand(seed+i)*.8,alpha:.2+pseudoRand(seed+i+1)*.45,r:210,g:220,b:255,freq:.3+pseudoRand(seed+i+2)*1.5,phase:pseudoRand(seed+i+3)*Math.PI*2,name:null})
    }
    const phaseVal=getMoonPhase(skyDate);const moonPos={x:W*.73,y:H*.17}
    function draw(t:number){
      ctx.clearRect(0,0,W,H);const grd=ctx.createRadialGradient(W/2,H*.35,0,W/2,H*.35,H*.75)
      grd.addColorStop(0,'#05103a');grd.addColorStop(1,'#020414');ctx.fillStyle=grd;ctx.fillRect(0,0,W,H)
      starData.forEach(s=>{if(!s.vis)return;const tw=.75+.25*Math.sin(t*.001*s.freq+s.phase);const sz=s.sz*tw,a=s.alpha*tw
        if(s.sz>2){const g=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,sz*4);g.addColorStop(0,`rgba(${s.r},${s.g},${s.b},${a*.5})`);g.addColorStop(1,'rgba(0,0,0,0)');ctx.beginPath();ctx.arc(s.x,s.y,sz*4,0,Math.PI*2);ctx.fillStyle=g;ctx.fill()}
        ctx.beginPath();ctx.arc(s.x,s.y,sz,0,Math.PI*2);ctx.fillStyle=`rgba(${s.r},${s.g},${s.b},${a})`;ctx.fill()
        if(s.sz>3.5&&s.name){ctx.fillStyle=`rgba(200,215,255,${a*.5})`;ctx.font='10px DM Sans';ctx.fillText(s.name,s.x+sz+4,s.y+3)}
      })
      const{x,y}=moonPos;const r=22;const mg=ctx.createRadialGradient(x,y,r*.4,x,y,r*4)
      mg.addColorStop(0,'rgba(255,240,180,0.22)');mg.addColorStop(1,'rgba(0,0,0,0)');ctx.beginPath();ctx.arc(x,y,r*4,0,Math.PI*2);ctx.fillStyle=mg;ctx.fill()
      ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.clip();ctx.fillStyle='#f0dea0';ctx.fillRect(x-r,y-r,r*2,r*2)
      if(phaseVal<.47||phaseVal>.53){ctx.fillStyle='rgba(4,7,28,0.9)';const cx=phaseVal<.5?x+r-2*r*phaseVal*2:x-r+2*r*(phaseVal-.5)*2;ctx.beginPath();ctx.arc(cx,y,r*1.1,0,Math.PI*2);ctx.fill()}
      ctx.restore();rafRef.current=requestAnimationFrame(draw)
    }
    rafRef.current=requestAnimationFrame(draw);return()=>cancelAnimationFrame(rafRef.current)
  },[])
  return <canvas ref={canvasRef} style={{position:'absolute',inset:0,width:'100%',height:'100%',display:'block'}}/>
}

// ─── Tipos ────────────────────────────────────────────────────────────────────
type ConquistaItem = { key: string; fotoUrl?: string }
type Dados = {
  nome1:string; nome2:string; data_inicio:string
  cidade:string; mensagem:string
  conquistas: ConquistaItem[] | string[]
  fotos: string[]
  musica?: { videoId: string; title: string } | null
}

const DEFAULT_SLIDE_DUR = 7000
const FOTO_SLIDE_DUR    = 2800   // ms por foto/item no carrossel

// ─── Badge de raridade — no topo da foto ─────────────────────────────────────
function RarityBadge({ rarity, icon, label, mounted }: { rarity: Rarity; icon: string; label: string; mounted: boolean }) {
  const rc = RARITY_CONFIG[rarity]
  return (
    <div style={{
      position:'absolute', top:0, left:0, right:0,
      padding:'52px 1rem .8rem',  // 52px de padding-top para não sobrepor a barra de progresso
      background:`linear-gradient(to bottom, rgba(0,0,0,.85) 0%, rgba(0,0,0,.5) 60%, transparent 100%)`,
      display:'flex', alignItems:'center', gap:'.65rem',
      animation: mounted ? 'badgeIn .4s ease forwards' : 'none',
      zIndex: 3,
    }}>
      {(rarity==='epico'||rarity==='lendario') && (
        <div style={{
          position:'absolute', top:'1rem', left:'1rem',
          width:36, height:36, borderRadius:'50%',
          background: rc.glow,
          filter:`blur(${rc.glowSize})`,
          pointerEvents:'none',
        }}/>
      )}
      <span style={{ fontSize:'1.5rem', position:'relative', zIndex:1,
        filter: rarity==='lendario' ? 'drop-shadow(0 0 8px rgba(248,87,166,.9))' :
                rarity==='epico'    ? 'drop-shadow(0 0 6px rgba(255,200,50,.8))'  :
                rarity==='raro'     ? 'drop-shadow(0 0 4px rgba(180,80,255,.6))'  : 'none',
      }}>{icon}</span>
      <div style={{ position:'relative', zIndex:1 }}>
        <div style={{
          fontSize:'.55rem', letterSpacing:'.2em', textTransform:'uppercase',
          color: rc.color,
          textShadow: rarity!=='comum' ? `0 0 10px ${rc.color}` : 'none',
          marginBottom:'.15rem',
          animation: rc.shimmer && mounted ? 'shimmerText 2s ease-in-out infinite' : 'none',
        }}>
          {rc.label} · conquista desbloqueada
        </div>
        <div style={{
          fontFamily:"'DM Serif Display',serif", fontSize:'.95rem', color:'white', lineHeight:1.2,
          textShadow: rarity==='lendario' ? '0 0 16px rgba(248,87,166,.6)' : 'none',
        }}>{label}</div>
      </div>
      {rarity==='lendario' && mounted && [0,1,2,3,4].map(i => (
        <div key={i} style={{
          position:'absolute',
          left:`${15+i*15}%`, top:`${40+pseudoRand(i*7)*30}%`,
          width:3, height:3, borderRadius:'50%',
          background:'rgba(248,87,166,.9)',
          boxShadow:'0 0 4px rgba(248,87,166,1)',
          animation:`particle ${1.5+pseudoRand(i)*1}s ease-out infinite`,
          animationDelay:`${pseudoRand(i*3)*.8}s`,
          pointerEvents:'none',
        }}/>
      ))}
    </div>
  )
}

// ─── Main Player ──────────────────────────────────────────────────────────────
export default function RetrospectivaPlayer({ dados }: { dados: Dados }) {
  const { nome1, nome2, data_inicio, cidade, mensagem, fotos } = dados
  const musica = dados.musica ?? null

  const conquistasRaw = dados.conquistas ?? []
  const conquistasManual: ConquistaItem[] = conquistasRaw.map((c:any) =>
    typeof c === 'string' ? { key: c } : c
  )

  const startDate = new Date(data_inicio + 'T12:00:00')
  const days = Math.floor((Date.now() - startDate.getTime()) / 86400000)
  const months = Math.floor(days / 30.44)
  const conquistasTempo = TIME_ACHIEVEMENTS.filter(a => days >= a.dias)
  const perc = Math.min(99, Math.floor(Math.log1p(days)/Math.log1p(3650)*100))

  // Carrossel: apenas as fotos gerais, mas com info de conquista se vinculada
  type SlideItem = { src:string; conquista?: { key:string } }
  
  // Monta mapa: fotoUrl → key da conquista
  const fotoParaConquista: Record<string, string> = {}
  conquistasManual.forEach(c => {
    if (c.fotoUrl) fotoParaConquista[c.fotoUrl] = c.key
  })

  const carouselItems: SlideItem[] = fotos.map(src => ({
    src,
    conquista: fotoParaConquista[src] ? { key: fotoParaConquista[src] } : undefined,
  }))

  // Duração do slide S4 = nItens * FOTO_SLIDE_DUR (mínimo DEFAULT_SLIDE_DUR)
  const s4Duration = Math.max(DEFAULT_SLIDE_DUR, carouselItems.length * FOTO_SLIDE_DUR)

  const moonPh = moonInfo(getMoonPhase(startDate))
  const season = SEASONS[getSeason(startDate)]

  const [slide, setSlide] = useState(0)
  const [progKey, setProgKey] = useState(0)
  const [carouselIdx, setCarouselIdx] = useState(0)
  const [achVisible, setAchVisible] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [totalSecs, setTotalSecs] = useState(0)
  const [shareModal, setShareModal] = useState(false)
  const [selectedSlides, setSelectedSlides] = useState<number[]>([])
  const [gerando, setGerando] = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [musicReady, setMusicReady] = useState(false)
  const ytRef = useRef<any>(null)
  const ytContainerRef = useRef<HTMLDivElement>(null)
  const totalSlides = 9

  // Definição dos slides para o modal
  const SLIDE_META = [
    { id:0, icon:'💫', label:'Capa',          desc:`${nome1} & ${nome2}` },
    { id:1, icon:'🌸', label:'Estação',        desc:'A época do primeiro encontro' },
    { id:2, icon:'⏱️', label:'Tempo juntos',   desc:`${Math.floor(days/365.25)} anos, ${Math.floor(days/30.44)%12} meses` },
    { id:3, icon:'🌙', label:'Céu estrelado',  desc:'As estrelas naquela noite' },
    { id:4, icon:'📷', label:'Fotos',          desc:`${fotos.length} memória${fotos.length!==1?'s':''}` },
    { id:5, icon:'📊', label:'Estatísticas',   desc:'Vocês vs outros casais' },
    { id:6, icon:'🏆', label:'Conquistas',     desc:`${conquistasTempo.length + conquistasManual.length} desbloqueadas` },
    { id:7, icon:'💌', label:'Mensagem',       desc:'A carta do coração' },
    { id:8, icon:'❤️', label:'Encerramento',   desc:'Para sempre juntos' },
  ]

  const timerRef    = useRef<NodeJS.Timeout|null>(null)
  const carouselRef = useRef<NodeJS.Timeout|null>(null)

  useEffect(() => {
    setMounted(true)
    setTotalSecs(Math.floor((Date.now()-startDate.getTime())/1000))
  }, [])

  // ─── YouTube IFrame API ───────────────────────────────────────────────────
  useEffect(() => {
    if (!musica?.videoId) return

    function initPlayer() {
      if (!ytContainerRef.current) return
      ytRef.current = new (window as any).YT.Player(ytContainerRef.current, {
        videoId: musica!.videoId,
        playerVars: { autoplay: 1, loop: 1, playlist: musica!.videoId, controls: 0, disablekb: 1, modestbranding: 1, rel: 0 },
        events: {
          onReady: (e: any) => { e.target.setVolume(40); e.target.playVideo(); setMusicReady(true); setMusicPlaying(true) },
          onStateChange: (e: any) => { setMusicPlaying(e.data === 1) },
        }
      })
    }

    if ((window as any).YT?.Player) {
      initPlayer()
    } else {
      // Injeta o script uma única vez
      if (!document.getElementById('yt-api')) {
        const s = document.createElement('script')
        s.id = 'yt-api'
        s.src = 'https://www.youtube.com/iframe_api'
        document.head.appendChild(s)
      }
      ;(window as any).onYouTubeIframeAPIReady = initPlayer
    }

    return () => { try { ytRef.current?.destroy() } catch {} }
  }, [musica?.videoId])

  useEffect(() => {
    if (!mounted || slide !== 2) return
    const t = setInterval(() => setTotalSecs(s => s+1), 1000)
    return () => clearInterval(t)
  }, [mounted, slide])

  const counterSecs  = totalSecs % 60
  const counterMins  = Math.floor(totalSecs/60) % 60
  const counterHours = Math.floor(totalSecs/3600) % 24
  const counterDays  = Math.floor(totalSecs/86400)
  const counterMonths= Math.floor(counterDays/30.44)
  const counterYears = Math.floor(counterDays/365.25)

  const HEARTS = ['❤️','🌸','✨','💕','🌹']
  const heartData = Array.from({length:16},(_,i)=>({
    left:`${(pseudoRand(i*13+1)*100).toFixed(4)}%`,
    top:`${(60+pseudoRand(i*7+3)*40).toFixed(4)}%`,
    fontSize:`${(.8+pseudoRand(i*5+2)*1.1).toFixed(4)}rem`,
    duration:`${(7+pseudoRand(i*11+4)*10).toFixed(4)}s`,
    delay:`${(pseudoRand(i*9+6)*12).toFixed(4)}s`,
    emoji:HEARTS[i%5],
  }))
  const mheartData = Array.from({length:14},(_,i)=>({
    left:`${(pseudoRand(i*17+2)*100).toFixed(4)}%`,
    top:`${(pseudoRand(i*13+5)*100).toFixed(4)}%`,
    fontSize:`${(.8+pseudoRand(i*7+1)).toFixed(4)}rem`,
    duration:`${(7+pseudoRand(i*11+3)*8).toFixed(4)}s`,
    delay:`${(pseudoRand(i*9+7)*10).toFixed(4)}s`,
    emoji:HEARTS[i%5],
  }))

  // duração de cada slide — S4 tem duração dinâmica
  function slideDur(s: number) { return s === 4 ? s4Duration : DEFAULT_SLIDE_DUR }

  const goTo = useCallback((idx:number) => {
    if (idx < 0 || idx >= totalSlides) return
    setSlide(idx); setProgKey(k=>k+1); setAchVisible(false); setStatsVisible(false)
    if (idx===6) setTimeout(()=>setAchVisible(true),400)
    if (idx===5) setTimeout(()=>setStatsVisible(true),400)
    if (idx===4) {
      setCarouselIdx(0); clearInterval(carouselRef.current!)
      if (carouselItems.length>1)
        carouselRef.current = setInterval(()=>setCarouselIdx(i=>(i+1)%carouselItems.length), FOTO_SLIDE_DUR)
    } else {
      clearInterval(carouselRef.current!)
    }
  }, [carouselItems.length])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    const dur = slideDur(slide)
    timerRef.current = setTimeout(() => {
      if (slide + 1 < totalSlides) goTo(slide + 1)
    }, dur)
    return () => { if(timerRef.current) clearTimeout(timerRef.current) }
  }, [slide, progKey])

  // ─── Gerador de PNG 9:16 para Stories ───────────────────────────────────────
  async function gerarPNG(slideId: number): Promise<void> {
    const W = 1080, H = 1920
    const canvas = document.createElement('canvas')
    canvas.width = W; canvas.height = H
    const ctx = canvas.getContext('2d')!

    // Helper: fundo gradiente radial
    function radialBg(cx:number,cy:number,r0:number,r1:number,c0:string,c1:string) {
      const g = ctx.createRadialGradient(cx,cy,r0,cx,cy,r1)
      g.addColorStop(0,c0); g.addColorStop(1,c1)
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H)
    }

    // Helper: carregar imagem cross-origin
    function loadImg(url:string): Promise<HTMLImageElement> {
      return new Promise(res=>{
        const img = new Image(); img.crossOrigin='anonymous'
        img.onload=()=>res(img); img.onerror=()=>res(img)
        img.src=url
      })
    }

    // Helper: texto centrado com quebra automática
    function wrapText(text:string, x:number, y:number, maxW:number, lineH:number, align:'center'|'left'='center') {
      ctx.textAlign = align
      const words = text.split(' ')
      let line = ''
      for (const word of words) {
        const test = line ? line+' '+word : word
        if (ctx.measureText(test).width > maxW && line) {
          ctx.fillText(line, x, y); y+=lineH; line=word
        } else line=test
      }
      if (line) ctx.fillText(line, x, y)
    }

    // Helper: logo Presentim no canto
    function drawLogo() {
      ctx.font='500 32px sans-serif'; ctx.fillStyle='rgba(255,255,255,.25)'; ctx.textAlign='center'
      ctx.fillText('presentim.app', W/2, H-60)
    }

    // Helper: barra de progresso no topo
    function drawProgress(current:number, total:number) {
      const segW = (W - 40 - (total-1)*6) / total
      for (let i=0;i<total;i++) {
        const x = 20 + i*(segW+6)
        ctx.fillStyle = i<current ? 'rgba(255,255,255,.9)' : i===current ? 'rgba(255,255,255,.5)' : 'rgba(255,255,255,.2)'
        ctx.beginPath(); ctx.roundRect(x, 40, segW, 4, 2); ctx.fill()
      }
    }

    const season = SEASONS[getSeason(startDate)]
    const moonPh = moonInfo(getMoonPhase(startDate))
    const startFmtLocal = startDate.toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'})
    const years = Math.floor(days/365.25)
    const monthsVal = Math.floor(days/30.44)

    if (slideId === 0) {
      // Capa
      radialBg(W/2,H*.3,0,H*.8,'#2d0033','#06050f')
      // Corações decorativos
      ctx.font='60px serif'
      for(let i=0;i<12;i++){
        ctx.globalAlpha=.08+pseudoRand(i*7)*.12
        ctx.fillText('❤️',pseudoRand(i*13+1)*W,(pseudoRand(i*7+3)*.6+.4)*H)
      }
      ctx.globalAlpha=1
      // Eyebrow
      ctx.font='500 36px sans-serif'; ctx.fillStyle='rgba(255,255,255,.4)'; ctx.textAlign='center'
      ctx.fillText('UMA HISTÓRIA DE AMOR', W/2, H*.32)
      // Nomes
      ctx.font='bold 120px serif'; ctx.fillStyle='white'
      ctx.fillText(`${nome1} & ${nome2}`, W/2, H*.44)
      // Data
      ctx.font='italic 52px serif'; ctx.fillStyle='rgba(255,255,255,.5)'
      ctx.fillText(`desde ${startFmtLocal}`, W/2, H*.52)
      // Chips
      const chips = [`📍 ${cidade}`, `${moonPh.emoji} ${moonPh.name}`, `⏳ ${days.toLocaleString('pt-BR')} dias`]
      ctx.font='44px sans-serif'; ctx.fillStyle='rgba(255,255,255,.7)'
      chips.forEach((c,i) => ctx.fillText(c, W/2, H*.62 + i*80))

    } else if (slideId === 1) {
      // Estação
      radialBg(W/2,H*.25,0,H*.8,'#1a1200','#06050f')
      ctx.font='180px serif'; ctx.textAlign='center'
      ctx.fillText(season.icon, W/2, H*.35)
      ctx.font='500 38px sans-serif'; ctx.fillStyle='rgba(255,255,255,.4)'
      ctx.fillText('A ESTAÇÃO DE VOCÊS', W/2, H*.44)
      ctx.font='bold 100px serif'; ctx.fillStyle='white'
      ctx.fillText(`${season.name} especial`, W/2, H*.53)
      ctx.font='400 48px sans-serif'; ctx.fillStyle='rgba(255,255,255,.5)'
      wrapText(season.desc, W/2, H*.62, W-160, 68)

    } else if (slideId === 2) {
      // Tempo juntos
      radialBg(W/2,H*.5,0,H*.8,'#0a001a','#03000d')
      ctx.font='500 36px sans-serif'; ctx.fillStyle='rgba(255,255,255,.4)'; ctx.textAlign='center'
      ctx.fillText('CONTANDO CADA SEGUNDO', W/2, H*.2)
      ctx.font='bold 110px serif'; ctx.fillStyle='white'
      ctx.fillText('Tempo juntos', W/2, H*.28)
      // Grid de valores
      const vals = [
        {v:years,l:'anos'},{v:monthsVal%12,l:'meses'},{v:days%30,l:'dias'},
        {v:Math.floor(days*24)%24,l:'horas'},{v:0,l:'min'},{v:0,l:'seg'},
      ]
      const cols=3, rows=2, bW=280, bH=220, gapX=40, gapY=30
      const startX = W/2 - (cols*bW+(cols-1)*gapX)/2
      const startY = H*.38
      vals.forEach(({v,l},i)=>{
        const col=i%cols, row=Math.floor(i/cols)
        const bx=startX+col*(bW+gapX), by=startY+row*(bH+gapY)
        ctx.fillStyle='rgba(255,255,255,.07)'; ctx.beginPath(); ctx.roundRect(bx,by,bW,bH,24); ctx.fill()
        ctx.fillStyle='white'; ctx.font='bold 90px serif'; ctx.textAlign='center'
        ctx.fillText(String(v).padStart(2,'0'), bx+bW/2, by+bH*.65)
        ctx.fillStyle='rgba(255,255,255,.35)'; ctx.font='500 30px sans-serif'
        ctx.fillText(l.toUpperCase(), bx+bW/2, by+bH*.88)
      })

    } else if (slideId === 3) {
      // Céu — fundo escuro com estrelas simples
      radialBg(W/2,H*.35,0,H*.75,'#05103a','#020414')
      ctx.font='500 36px sans-serif'; ctx.fillStyle='rgba(255,255,255,.4)'; ctx.textAlign='center'
      ctx.fillText('O CÉU NAQUELA NOITE', W/2, H*.68)
      ctx.font='bold 90px serif'; ctx.fillStyle='white'
      ctx.fillText('As estrelas testemunharam', W/2, H*.75)
      // Estrelas sintéticas
      for(let i=0;i<180;i++){
        const sx=pseudoRand(i*17)*W, sy=pseudoRand(i*13)*H*.6
        const sr=.5+pseudoRand(i*7)*2.5, sa=.3+pseudoRand(i*11)*.7
        ctx.beginPath(); ctx.arc(sx,sy,sr,0,Math.PI*2)
        ctx.fillStyle=`rgba(220,230,255,${sa})`; ctx.fill()
      }
      // Lua
      ctx.beginPath(); ctx.arc(W*.75,H*.15,55,0,Math.PI*2)
      ctx.fillStyle='#f0dea0'; ctx.fill()
      // Chips
      ctx.font='42px sans-serif'; ctx.fillStyle='rgba(255,255,255,.6)'
      ctx.fillText(`${moonPh.emoji} ${moonPh.name}`, W/2, H*.84)
      ctx.fillText(`📍 ${cidade}`, W/2, H*.88)

    } else if (slideId === 4) {
      // Fotos — usa a primeira foto disponível como fundo
      radialBg(W/2,H*.5,0,H,'#1a0e2e','#080610')
      if (fotos.length > 0) {
        const img = await loadImg(fotos[0])
        if (img.width > 0) {
          const scale = Math.max(W/img.width, H/img.height)
          const sw = img.width*scale, sh = img.height*scale
          ctx.drawImage(img,(W-sw)/2,(H-sh)/2,sw,sh)
          // overlay escuro
          const ov=ctx.createLinearGradient(0,0,0,H)
          ov.addColorStop(0,'rgba(0,0,0,.5)'); ov.addColorStop(.5,'rgba(0,0,0,.1)'); ov.addColorStop(1,'rgba(0,0,0,.7)')
          ctx.fillStyle=ov; ctx.fillRect(0,0,W,H)
        }
      }
      ctx.font='500 36px sans-serif'; ctx.fillStyle='rgba(255,255,255,.6)'; ctx.textAlign='center'
      ctx.fillText('NOSSAS MEMÓRIAS', W/2, H*.75)
      ctx.font='bold 100px serif'; ctx.fillStyle='white'
      ctx.fillText('Momentos nossos', W/2, H*.83)
      ctx.font='400 40px sans-serif'; ctx.fillStyle='rgba(255,255,255,.45)'
      ctx.fillText(`${fotos.length} foto${fotos.length!==1?'s':''}`, W/2, H*.89)

    } else if (slideId === 5) {
      // Stats
      radialBg(W*.4,H*.2,0,H*.8,'#0f1e3a','#06050f')
      ctx.font='500 36px sans-serif'; ctx.fillStyle='rgba(255,255,255,.4)'; ctx.textAlign='center'
      ctx.fillText('VOCÊS EM NÚMEROS', W/2, H*.18)
      ctx.font='bold 90px serif'; ctx.fillStyle='white'
      ctx.fillText('Como vocês se comparam', W/2, H*.26)
      const bars = [
        {label:'Tempo vs outros casais',val:perc,color:'#f857a6',highlight:`Mais que ${perc}% dos casais`},
        {label:'Meses de relacionamento',val:Math.min(100,Math.round(monthsVal/60*100)),color:'#7b68ee',highlight:`${monthsVal} meses juntos`},
        {label:'Intensidade do vínculo',val:Math.min(98,60+Math.floor(days/365.25)*8),color:'#ffa726',highlight:days>730?'Vínculo muito profundo':'Crescendo juntos'},
      ]
      bars.forEach(({label,val,color,highlight},i)=>{
        const by = H*.35+i*320
        ctx.fillStyle='rgba(255,255,255,.06)'; ctx.beginPath(); ctx.roundRect(80,by,W-160,280,24); ctx.fill()
        ctx.font='500 32px sans-serif'; ctx.fillStyle='rgba(255,255,255,.35)'; ctx.textAlign='left'
        ctx.fillText(label.toUpperCase(), 120, by+60)
        // Barra
        ctx.fillStyle='rgba(255,255,255,.08)'; ctx.beginPath(); ctx.roundRect(120,by+80,W-240,16,8); ctx.fill()
        ctx.fillStyle=color; ctx.beginPath(); ctx.roundRect(120,by+80,(W-240)*val/100,16,8); ctx.fill()
        ctx.font='bold 68px serif'; ctx.fillStyle='white'; ctx.textAlign='left'
        ctx.fillText(highlight, 120, by+210)
      })

    } else if (slideId === 6) {
      // Conquistas
      radialBg(W*.3,H*.7,0,H*.9,'#003825','#000d08')
      ctx.font='500 36px sans-serif'; ctx.fillStyle='rgba(255,255,255,.4)'; ctx.textAlign='center'
      ctx.fillText('CONQUISTAS DESBLOQUEADAS', W/2, H*.16)
      ctx.font='bold 90px serif'; ctx.fillStyle='white'
      ctx.fillText('Nossa jornada', W/2, H*.24)
      // Lista top 6
      const ORDER_T: Record<string,number>={crown:0,diamond:1,trophy:2,gold:3,silver:4,bronze:5}
      const ORDER_M: Record<Rarity,number>={lendario:0,epico:1,raro:2,incomum:3,comum:4}
      type MixI = {tipo:'tempo';a:typeof TIME_ACHIEVEMENTS[0];peso:number}|{tipo:'manual';c:ConquistaItem;info:typeof ALL_ACHIEVEMENTS[string];peso:number}
      const pool:MixI[]=[]
      conquistasTempo.forEach(a=>pool.push({tipo:'tempo',a,peso:ORDER_T[a.medal]}))
      conquistasManual.forEach(c=>{const info=ALL_ACHIEVEMENTS[c.key];if(info)pool.push({tipo:'manual',c,info,peso:10+ORDER_M[info.rarity]})})
      const top6=pool.sort((a,b)=>a.peso-b.peso).slice(0,6)
      top6.forEach(({tipo,...rest},i)=>{
        const iy=H*.31+i*220
        ctx.fillStyle='rgba(255,255,255,.06)'; ctx.beginPath(); ctx.roundRect(80,iy,W-160,190,20); ctx.fill()
        if(tipo==='tempo'){
          const {a}=rest as any
          ctx.font='80px serif'; ctx.textAlign='left'; ctx.fillText(a.icon, 120, iy+130)
          ctx.font='bold 52px sans-serif'; ctx.fillStyle='white'; ctx.fillText(a.name, 230, iy+100)
          ctx.font='400 38px sans-serif'; ctx.fillStyle='rgba(255,255,255,.4)'; ctx.fillText(a.desc.slice(0,42)+'…', 230, iy+155)
        } else {
          const {info}=rest as any; const rc=RARITY_CONFIG[info.rarity as Rarity]
          ctx.font='80px serif'; ctx.textAlign='left'; ctx.fillText(info.icon, 120, iy+130)
          ctx.font='bold 52px sans-serif'; ctx.fillStyle=rc.color; ctx.fillText(info.label, 230, iy+100)
          ctx.font='500 36px sans-serif'; ctx.fillStyle=rc.color; ctx.globalAlpha=.6
          ctx.fillText(rc.label.toUpperCase(), 230, iy+150); ctx.globalAlpha=1
        }
      })

    } else if (slideId === 7) {
      // Mensagem
      radialBg(W/2,H*.5,0,H*.8,'#45001e','#180008')
      ctx.font='italic 240px serif'; ctx.fillStyle='rgba(248,87,166,.15)'; ctx.textAlign='left'
      ctx.fillText('"', 40, H*.28)
      ctx.font='italic bold 72px serif'; ctx.fillStyle='white'; ctx.textAlign='center'
      wrapText(`"${mensagem}"`, W/2, H*.38, W-160, 100)
      ctx.font='500 40px sans-serif'; ctx.fillStyle='rgba(248,87,166,.65)'
      ctx.fillText(`— com todo meu amor, ${nome2}`, W/2, H*.78)

    } else if (slideId === 8) {
      // Encerramento
      radialBg(W/2,H*.35,0,H*.8,'#1a1a50','#070714')
      // Círculo gradiente
      const cg=ctx.createRadialGradient(W/2,H*.38,0,W/2,H*.38,180)
      cg.addColorStop(0,'#f857a6'); cg.addColorStop(.5,'#ff5858'); cg.addColorStop(1,'#ffa726')
      ctx.fillStyle=cg; ctx.beginPath(); ctx.arc(W/2,H*.38,180,0,Math.PI*2); ctx.fill()
      ctx.fillStyle='#07071a'; ctx.beginPath(); ctx.arc(W/2,H*.38,155,0,Math.PI*2); ctx.fill()
      ctx.font='120px serif'; ctx.textAlign='center'; ctx.fillText('❤️', W/2, H*.38+45)
      ctx.font='bold 100px serif'; ctx.fillStyle='white'
      ctx.fillText(`Para sempre,`, W/2, H*.58)
      ctx.fillText(`${nome1} & ${nome2}`, W/2, H*.66)
      ctx.font='400 52px sans-serif'; ctx.fillStyle='rgba(255,255,255,.4)'
      wrapText('Que essa história continue sendo escrita todos os dias.', W/2, H*.75, W-160, 72)
    }

    drawProgress(slideId, totalSlides)
    drawLogo()

    // Download
    const a = document.createElement('a')
    a.download = `retrospectiva-${nome1}-${nome2}-slide${slideId+1}.png`
    a.href = canvas.toDataURL('image/png')
    a.click()
  }

  async function gerarTodos() {
    setGerando(true)
    for (const id of selectedSlides.sort((a,b)=>a-b)) {
      await gerarPNG(id)
      await new Promise(r => setTimeout(r, 300))
    }
    setGerando(false)
    setShareModal(false)
  }

  const startFmt = startDate.toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'})

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#000;overscroll-behavior:none}
        .player{position:relative;width:100vw;height:100dvh;max-width:430px;margin:0 auto;overflow:hidden;user-select:none;cursor:pointer;background:#06050f}
        .prog-bar{position:absolute;top:0;left:0;right:0;z-index:30;display:flex;gap:3px;padding:10px 12px}
        .seg{flex:1;height:2.5px;background:rgba(255,255,255,.22);border-radius:2px;overflow:hidden}
        .seg-fill{height:100%;background:white;border-radius:2px}
        .seg-fill.done{width:100%;transition:none}
        .seg-fill.active{width:0;animation:fill var(--dur) linear forwards}
        .seg-fill.pending{width:0}
        @keyframes fill{to{width:100%}}
        .slide{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:72px 28px 44px;opacity:0;pointer-events:none;transition:opacity .45s}
        .slide.active{opacity:1;pointer-events:auto}
        .au{opacity:0;transform:translateY(16px);animation:slideup .6s forwards}
        @keyframes slideup{to{opacity:1;transform:translateY(0)}}
        .s-eyebrow{font-size:.58rem;letter-spacing:.3em;text-transform:uppercase;color:rgba(255,255,255,.45);margin-bottom:.55rem}
        .s-big{font-family:'DM Serif Display',serif;font-size:clamp(2rem,8vw,2.8rem);color:white;text-align:center;line-height:1.12;margin-bottom:.6rem}
        .s-big em{font-style:italic;background:linear-gradient(135deg,#f857a6,#ffa726);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .chip{display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.15);border-radius:50px;padding:.28rem .75rem;font-size:.68rem;color:rgba(255,255,255,.75);margin:3px}
        @keyframes mhup{0%{opacity:0;transform:translateY(0) scale(.8)}20%{opacity:.7}80%{opacity:.4}100%{opacity:0;transform:translateY(-120px) scale(1.1)}}
        @keyframes endpulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
        @keyframes badgeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmerText{0%,100%{opacity:1}50%{opacity:.65}}
        @keyframes particle{0%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-28px) scale(.4)}}
        .time-ach{display:flex;align-items:center;gap:.8rem;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:14px;padding:.7rem 1rem;width:100%}
        .time-ach.crown .time-ach-name{background:linear-gradient(135deg,#ffd700,#ffa726);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .time-ach.diamond .time-ach-name{background:linear-gradient(135deg,#a8edea,#fed6e3);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .time-ach.trophy .time-ach-name{background:linear-gradient(135deg,#f857a6,#ffa726);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .man-ach{display:flex;align-items:center;gap:.6rem;border-radius:12px;padding:.55rem .8rem;position:relative;overflow:hidden}
        .man-ach.raro   {background:rgba(100,30,180,.25);border:1px solid rgba(180,80,255,.3)}
        .man-ach.epico  {background:rgba(140,90,0,.3);border:1px solid rgba(255,190,30,.4)}
        .man-ach.lendario{background:rgba(120,0,60,.35);border:1px solid rgba(248,87,166,.5);box-shadow:0 0 12px rgba(248,87,166,.2)}
        .man-ach.incomum{background:rgba(20,60,160,.25);border:1px solid rgba(80,160,255,.25)}
        .man-ach.comum  {background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08)}
        /* Botões de navegação */
        .nav-btn{position:absolute;top:50%;transform:translateY(-50%);z-index:20;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.18);backdrop-filter:blur(8px);border-radius:50%;width:38px;height:38px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;color:white;font-size:.9rem;user-select:none}
        .nav-btn:hover{background:rgba(255,255,255,.22);border-color:rgba(255,255,255,.35);transform:translateY(-50%) scale(1.08)}
        .nav-btn:active{transform:translateY(-50%) scale(.95)}
        .nav-btn.disabled{opacity:.2;cursor:default;pointer-events:none}
        .nav-btn.left{left:10px}
        .nav-btn.right{right:10px}
        /* Chip de música */
        .music-chip{position:absolute;bottom:20px;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:7px;background:rgba(0,0,0,.55);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.15);border-radius:50px;padding:.35rem .9rem .35rem .5rem;cursor:pointer;transition:all .2s;white-space:nowrap;max-width:calc(100% - 100px)}
        .music-chip:hover{background:rgba(0,0,0,.75);border-color:rgba(255,255,255,.25)}
        .music-chip-icon{width:26px;height:26px;border-radius:50%;background:rgba(255,60,60,.9);display:flex;align-items:center;justify-content:center;font-size:.7rem;flex-shrink:0}
        .music-chip-text{font-size:.65rem;color:rgba(255,255,255,.8);overflow:hidden;text-overflow:ellipsis;max-width:180px}
        .music-chip-note{font-size:.75rem;animation:musicPulse 1.2s ease-in-out infinite}
        @keyframes musicPulse{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.2)}}
        .end-title{color:#ffffff!important}
      `}</style>

      <div className="player">
        {/* Progress bar */}
        <div className="prog-bar">
          {Array.from({length:totalSlides}).map((_,i)=>(
            <div key={i} className="seg">
              <div
                className={`seg-fill ${i<slide?'done':i===slide?'active':'pending'}`}
                style={i===slide?{'--dur':`${slideDur(i)}ms`} as any:{}}
                key={i===slide?progKey:i}
              />
            </div>
          ))}
        </div>

        {/* Botões de navegação */}
        <button className={`nav-btn left ${slide===0?'disabled':''}`} onClick={()=>goTo(slide-1)}>‹</button>
        <button className={`nav-btn right ${slide===totalSlides-1?'disabled':''}`} onClick={()=>goTo(slide+1)}>›</button>

        {/* YouTube player — invisível */}
        {musica && <div ref={ytContainerRef} style={{position:'absolute',width:1,height:1,opacity:0,pointerEvents:'none',zIndex:-1}}/>}

        {/* Chip de música flutuante */}
        {musica && musicReady && (
          <div className="music-chip" onClick={e=>{
            e.stopPropagation()
            if (musicPlaying) { ytRef.current?.pauseVideo() } else { ytRef.current?.playVideo() }
          }}>
            <div className="music-chip-icon">{musicPlaying ? '⏸' : '▶'}</div>
            <span className={`music-chip-note ${musicPlaying?'':''}` }>{musicPlaying ? '♪' : '♩'}</span>
            <a href={`https://www.youtube.com/watch?v=${musica.videoId}`} target="_blank" rel="noopener noreferrer"
              onClick={e=>e.stopPropagation()}
              className="music-chip-text" style={{color:'inherit',textDecoration:'none'}}>
              {musica.title}
            </a>
          </div>
        )}

        {/* S0: Intro */}
        <div className={`slide ${slide===0?'active':''}`} style={{background:'radial-gradient(ellipse at 50% 30%,#2d0033 0%,#0a0010 60%,#06050f 100%)'}}>
          {mounted&&heartData.map((h,i)=><div key={i} style={{position:'absolute',left:h.left,top:h.top,fontSize:h.fontSize,opacity:0,animation:`mhup linear infinite`,animationDuration:h.duration,animationDelay:h.delay,pointerEvents:'none'}}>{h.emoji}</div>)}
          <p className="s-eyebrow au" style={{animationDelay:'.1s'}}>Uma história de amor</p>
          <h1 className="au" style={{fontFamily:"'DM Serif Display',serif",fontSize:'clamp(2.4rem,10vw,3.6rem)',color:'white',textAlign:'center',lineHeight:1.05,marginBottom:'1rem',animationDelay:'.25s'}}>
            {nome1} <em style={{fontStyle:'italic',background:'linear-gradient(135deg,#f857a6,#ffa726)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>&</em> {nome2}
          </h1>
          <p className="au" style={{fontFamily:"'DM Serif Display',serif",fontStyle:'italic',fontSize:'1rem',color:'rgba(255,255,255,.55)',animationDelay:'.4s'}}>desde {startFmt}</p>
          <div className="au" style={{display:'flex',gap:12,marginTop:'2rem',flexWrap:'wrap',justifyContent:'center',animationDelay:'.6s'}}>
            <div className="chip">📍 {cidade}</div>
            <div className="chip">{moonPh.emoji} {moonPh.name}</div>
            <div className="chip">⏳ {days.toLocaleString('pt-BR')} dias</div>
          </div>
          <p className="au" style={{position:'absolute',bottom:'2rem',fontSize:'.65rem',color:'rgba(255,255,255,.2)',letterSpacing:'.18em',textTransform:'uppercase',animationDelay:'1s'}}>toque para avançar</p>
        </div>

        {/* S1: Season */}
        <div className={`slide ${slide===1?'active':''}`} style={{background:'radial-gradient(ellipse at 50% 25%,#1a1200 0%,#0a0800 70%)'}}>
          <div className="au" style={{fontSize:'5rem',marginBottom:'1rem',filter:'drop-shadow(0 0 20px rgba(255,200,0,.4))'}}>{season.icon}</div>
          <p className="s-eyebrow au">A estação de vocês</p>
          <h2 className="s-big au">{season.name} <em>especial</em></h2>
          <p className="au" style={{fontSize:'.9rem',color:'rgba(255,255,255,.5)',textAlign:'center',lineHeight:1.7,maxWidth:280,margin:'.8rem 0 1.8rem',fontWeight:300}}>{season.desc}</p>
          <div className="au" style={{display:'flex',gap:6,flexWrap:'wrap',justifyContent:'center'}}>
            {season.chips.map((c,i)=><span key={i} className="chip">{c}</span>)}
          </div>
        </div>

        {/* S2: Counter */}
        <div className={`slide ${slide===2?'active':''}`} style={{background:'radial-gradient(ellipse at 50% 50%,#0a001a 0%,#03000d 70%)'}}>
          <p className="s-eyebrow au">Contando cada segundo</p>
          <h2 className="s-big au">Tempo <em>juntos</em></h2>
          <div className="au" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,width:'100%',maxWidth:340,marginTop:'1.5rem'}}>
            {[{v:counterYears,l:'anos'},{v:counterMonths%12,l:'meses'},{v:counterDays%30,l:'dias'},{v:counterHours,l:'horas'},{v:counterMins,l:'min'},{v:counterSecs,l:'seg'}].map(({v,l},i)=>(
              <div key={i} style={{background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',borderRadius:18,padding:'1rem .5rem',textAlign:'center'}}>
                <div style={{fontFamily:"'DM Serif Display',serif",fontSize:'2rem',color:'white',lineHeight:1}}>{String(v).padStart(2,'0')}</div>
                <div style={{fontSize:'.6rem',color:'rgba(255,255,255,.35)',textTransform:'uppercase',letterSpacing:'.15em',marginTop:4}}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* S3: Sky */}
        <div className={`slide ${slide===3?'active':''}`} style={{padding:0,overflow:'hidden'}}>
          {slide===3&&<SkyCanvas date={startDate} city={cidade}/>}
          <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-end',padding:'0 28px 56px',zIndex:2,pointerEvents:'none'}}>
            <p className="s-eyebrow au">O céu naquela noite</p>
            <h2 className="s-big au" style={{fontSize:'1.8rem'}}>As estrelas <em>testemunharam</em></h2>
            <div className="au" style={{display:'flex',gap:8,marginTop:'.8rem',flexWrap:'wrap',justifyContent:'center'}}>
              <span className="chip">{moonPh.emoji} {moonPh.name}</span>
              <span className="chip">📍 {getCoords(cidade).label}</span>
            </div>
          </div>
        </div>

        {/* S4: Carrossel — badge no topo, sem duplicar fotos */}
        <div className={`slide ${slide===4?'active':''}`} style={{padding:0,overflow:'hidden'}}>
          {carouselItems.length===0 ? (
            <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'.8rem',background:'radial-gradient(ellipse at 50% 50%,#1a0e2e 0%,#080610 100%)'}}>
              <div style={{fontSize:'3rem',opacity:.3}}>📷</div>
              <div style={{fontSize:'.85rem',color:'rgba(255,255,255,.25)'}}>Nenhuma foto adicionada</div>
            </div>
          ):(
            <>
              <div style={{position:'absolute',inset:0,overflow:'hidden'}}>
                <div style={{display:'flex',height:'100%',transform:`translateX(-${carouselIdx*100}%)`,transition:'transform .7s cubic-bezier(.4,0,.2,1)'}}>
                  {carouselItems.map((item,i)=>{
                    const info = item.conquista ? ALL_ACHIEVEMENTS[item.conquista.key] : null
                    const isActive = mounted && slide===4 && carouselIdx===i
                    return (
                      <div key={i} style={{flex:'0 0 100%',height:'100%',position:'relative',overflow:'hidden'}}>
                        <img src={item.src} alt="" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
                        {/* Gradiente base */}
                        <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(0,0,0,.55) 0%,transparent 35%,transparent 65%,rgba(0,0,0,.4) 100%)'}}/>
                        {/* Badge de conquista no TOPO */}
                        {info && isActive && (
                          <RarityBadge rarity={info.rarity} icon={info.icon} label={info.label} mounted={isActive}/>
                        )}
                        {/* Contador discreto no rodapé para fotos sem conquista */}
                        {!info && (
                          <div style={{position:'absolute',bottom:'.8rem',left:'50%',transform:'translateX(-50%)',fontSize:'.6rem',color:'rgba(255,255,255,.3)',letterSpacing:'.15em',textTransform:'uppercase'}}>
                            {i+1} / {carouselItems.length}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
              {/* Título — só aparece quando a foto atual NÃO tem conquista */}
              {!carouselItems[carouselIdx]?.conquista && (
                <div style={{position:'absolute',bottom:'3.5rem',left:0,right:0,padding:'0 24px',pointerEvents:'none',zIndex:2}}>
                  <div style={{fontFamily:"'DM Serif Display',serif",fontSize:'1.6rem',color:'white',lineHeight:1.1,textShadow:'0 2px 12px rgba(0,0,0,.6)'}}>
                    Momentos <em style={{fontStyle:'italic',background:'linear-gradient(135deg,#f857a6,#ffa726)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>nossos</em>
                  </div>
                </div>
              )}
              {/* Dots — cor da raridade quando é conquista */}
              <div style={{position:'absolute',bottom:'1.2rem',left:0,right:0,display:'flex',gap:5,justifyContent:'center',zIndex:4,pointerEvents:'none'}}>
                {carouselItems.map((item,i)=>{
                  const conqInfo = item.conquista ? ALL_ACHIEVEMENTS[item.conquista.key] : null
                  const dotColor = i===carouselIdx
                    ? (conqInfo ? RARITY_CONFIG[conqInfo.rarity].color : 'white')
                    : 'rgba(255,255,255,.3)'
                  return (
                    <div key={i} style={{
                      width:i===carouselIdx?18:5, height:5, borderRadius:i===carouselIdx?3:50,
                      background: dotColor,
                      boxShadow: i===carouselIdx&&conqInfo ? `0 0 6px ${RARITY_CONFIG[conqInfo.rarity].glow}` : 'none',
                      transition:'all .3s',
                    }}/>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* S5: Stats */}
        <div className={`slide ${slide===5?'active':''}`} style={{background:'radial-gradient(ellipse at 40% 20%,#0f1e3a 0%,#06050f 70%)'}}>
          <p className="s-eyebrow au">Vocês em números</p>
          <h2 className="s-big au" style={{fontSize:'clamp(1.8rem,7vw,2.6rem)'}}>Como vocês se <em>comparam</em></h2>
          <div style={{width:'100%',maxWidth:350,display:'flex',flexDirection:'column',gap:12,marginTop:'1.4rem'}}>
            {[
              {label:'Tempo juntos vs outros casais',bar:perc,color:'linear-gradient(90deg,#f857a6,#ff5858)',highlight:`Mais que ${perc}% dos casais`,sub:`${days.toLocaleString('pt-BR')} dias de história`},
              {label:'Meses de relacionamento',bar:Math.min(100,Math.round(months/60*100)),color:'linear-gradient(90deg,#3a7bd5,#7b68ee)',highlight:`${months} meses juntos`,sub:months<12?'O amor está florescendo 🌱':months<24?'Passaram pelo 1 ano! 🎉':`${Math.floor(months/12)} anos de história`},
              {label:'Intensidade do vínculo',bar:Math.min(98,60+Math.floor(days/365.25)*8),color:'linear-gradient(90deg,#d4a853,#ffa726)',highlight:days>730?'Vínculo muito profundo':'Vínculo em crescimento',sub:days>1825?'Casais assim duram a vida toda 🌟':days>730?'Amor consolidado 🔥':'Ainda na fase da descoberta 💫'},
            ].map((s,i)=>(
              <div key={i} style={{background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.09)',borderRadius:18,padding:'1.1rem 1.2rem',opacity:statsVisible?1:0,transform:statsVisible?'translateY(0)':'translateY(18px)',transition:`all .5s ease ${i*.2}s`}}>
                <div style={{fontSize:'.62rem',letterSpacing:'.18em',textTransform:'uppercase',color:'rgba(255,255,255,.35)',marginBottom:'.5rem'}}>{s.label}</div>
                <div style={{height:6,background:'rgba(255,255,255,.08)',borderRadius:3,overflow:'hidden',marginBottom:'.5rem'}}>
                  <div style={{height:'100%',borderRadius:3,background:s.color,width:statsVisible?`${s.bar}%`:'0%',transition:'width 1.2s cubic-bezier(.4,0,.2,1) .3s'}}/>
                </div>
                <div style={{fontFamily:"'DM Serif Display',serif",fontSize:'1.15rem',color:'white',lineHeight:1.3}}>{s.highlight}</div>
                <div style={{fontSize:'.72rem',color:'rgba(255,255,255,.35)',marginTop:'.2rem'}}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* S6: Conquistas — máx 6, priorizando as mais raras */}
        <div className={`slide ${slide===6?'active':''}`} style={{background:'radial-gradient(ellipse at 30% 70%,#003825 0%,#000d08 70%)',overflowY:'auto',justifyContent:'flex-start',paddingTop:'80px'}}>
          <p className="s-eyebrow au">Conquistas desbloqueadas</p>
          <h2 className="s-big au" style={{fontSize:'2rem',marginBottom:'1.2rem'}}>Nossa <em>jornada</em></h2>

          {(()=>{
            // Converte conquistas de tempo em itens com peso de raridade
            const ORDER_TEMPO: Record<string,number> = {crown:0,diamond:1,trophy:2,gold:3,silver:4,bronze:5}
            const ORDER_MANUAL: Record<Rarity,number> = {lendario:0,epico:1,raro:2,incomum:3,comum:4}

            type MixItem =
              | { tipo:'tempo'; a: typeof TIME_ACHIEVEMENTS[0]; peso:number }
              | { tipo:'manual'; c: ConquistaItem; info: typeof ALL_ACHIEVEMENTS[string]; peso:number }

            const pool: MixItem[] = []

            conquistasTempo.forEach(a => pool.push({ tipo:'tempo', a, peso: ORDER_TEMPO[a.medal] }))
            conquistasManual.forEach(c => {
              const info = ALL_ACHIEVEMENTS[c.key]
              if (info) pool.push({ tipo:'manual', c, info, peso: 10 + ORDER_MANUAL[info.rarity] })
            })

            // Ordena pelo peso (menor = mais raro) e pega os 6 primeiros
            const top6 = pool.sort((a,b) => a.peso - b.peso).slice(0, 6)

            if (top6.length === 0) return (
              <p className="au" style={{fontSize:'.85rem',color:'rgba(255,255,255,.3)',textAlign:'center'}}>Vocês estão no começo da jornada ❤️</p>
            )

            const totalConquistas = conquistasTempo.length + conquistasManual.length
            const hidden = totalConquistas - top6.length

            return (
              <div style={{width:'100%',maxWidth:340,display:'flex',flexDirection:'column',gap:9}}>
                {top6.map((item, i) => {
                  if (item.tipo === 'tempo') {
                    const a = item.a
                    return (
                      <div key={`t-${a.dias}`} className={`time-ach ${a.medal}`} style={{opacity:achVisible?1:0,transform:achVisible?'translateX(0)':'translateX(-20px)',transition:`all .4s ease ${i*.08}s`}}>
                        <span style={{fontSize:'1.6rem',flexShrink:0}}>{a.icon}</span>
                        <div>
                          <div className="time-ach-name" style={{fontSize:'.85rem',fontWeight:600,color:'white'}}>{a.name}</div>
                          <div style={{fontSize:'.68rem',color:'rgba(255,255,255,.35)',marginTop:'.1rem',lineHeight:1.4}}>{a.desc}</div>
                        </div>
                      </div>
                    )
                  } else {
                    const { info, c } = item
                    const rc = RARITY_CONFIG[info.rarity]
                    const isHighlight = info.rarity==='lendario' || info.rarity==='epico'
                    return (
                      <div key={`m-${c.key}`} className={`man-ach ${info.rarity}`} style={{
                        opacity:achVisible?1:0,
                        transform:achVisible?'translateY(0)':'translateY(14px)',
                        transition:`all .35s ease ${i*.08}s`,
                      }}>
                        <span style={{
                          fontSize: isHighlight?'1.4rem':'1.2rem',
                          filter: info.rarity==='lendario'?'drop-shadow(0 0 6px rgba(248,87,166,.8))':
                                  info.rarity==='epico'?'drop-shadow(0 0 4px rgba(255,200,50,.6))':
                                  info.rarity==='raro'?'drop-shadow(0 0 3px rgba(180,80,255,.4))':'none',
                        }}>{info.icon}</span>
                        <div style={{flex:1}}>
                          <div style={{
                            fontSize:'.85rem', fontWeight: isHighlight?600:400,
                            color: isHighlight ? rc.color : 'rgba(255,255,255,.8)',
                            textShadow: info.rarity==='lendario'?`0 0 10px ${rc.color}`:'none',
                          }}>{info.label}</div>
                          {isHighlight && <div style={{fontSize:'.6rem',color:rc.color,opacity:.7,marginTop:2,letterSpacing:'.1em'}}>{rc.label}</div>}
                        </div>
                      </div>
                    )
                  }
                })}
                {hidden > 0 && (
                  <div style={{textAlign:'center',fontSize:'.7rem',color:'rgba(255,255,255,.25)',marginTop:4,opacity:achVisible?1:0,transition:'opacity .4s ease .6s'}}>
                    +{hidden} conquista{hidden!==1?'s':''} desbloqueada{hidden!==1?'s':''}
                  </div>
                )}
              </div>
            )
          })()}
        </div>

        {/* S7: Message */}
        <div className={`slide ${slide===7?'active':''}`} style={{background:'radial-gradient(ellipse at 50% 50%,#45001e 0%,#180008 70%)'}}>
          {mounted&&mheartData.map((h,i)=><div key={i} style={{position:'absolute',left:h.left,top:h.top,fontSize:h.fontSize,opacity:0,animation:'mhup linear infinite',animationDuration:h.duration,animationDelay:h.delay,pointerEvents:'none'}}>{h.emoji}</div>)}
          <div className="au" style={{fontFamily:"'DM Serif Display',serif",fontSize:'7rem',color:'rgba(248,87,166,.22)',lineHeight:.5,alignSelf:'flex-start',marginLeft:-10}}>"</div>
          <p className="au" style={{fontFamily:"'DM Serif Display',serif",fontSize:'clamp(1.2rem,4.5vw,1.65rem)',fontStyle:'italic',color:'white',lineHeight:1.7,textAlign:'center',margin:'.5rem 0 1.8rem'}}>"{mensagem}"</p>
          <p className="au" style={{fontSize:'.72rem',letterSpacing:'.2em',textTransform:'uppercase',color:'rgba(248,87,166,.65)'}}>— com todo meu amor, {nome2}</p>
        </div>

        {/* S8: End */}
        <div className={`slide ${slide===8?'active':''}`} style={{background:'radial-gradient(ellipse at 50% 35%,#1a1a50 0%,#070714 70%)'}}>
          <div className="au" style={{width:130,height:130,borderRadius:'50%',background:'linear-gradient(135deg,#f857a6,#ff5858 50%,#ffa726)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'2rem',animation:'endpulse 2.5s ease-in-out infinite'}}>
            <div style={{width:110,height:110,borderRadius:'50%',background:'#07071a',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'3.2rem'}}>❤️</div>
          </div>
          <h1 className="au end-title" style={{fontFamily:"'DM Serif Display',serif",fontSize:'2rem',textAlign:'center',marginBottom:'.5rem'}}>Para sempre,<br/>{nome1} & {nome2}</h1>
          <p className="au" style={{fontSize:'.85rem',color:'rgba(255,255,255,.4)',textAlign:'center',fontWeight:300,maxWidth:260,lineHeight:1.65,marginBottom:'1.5rem'}}>Que essa história continue sendo escrita todos os dias.</p>
          <div className="au" style={{display:'flex',flexDirection:'column',gap:10,alignItems:'center',width:'100%',maxWidth:280}}>
            {/* Botão principal: compartilhar Stories */}
            <button onClick={e=>{e.stopPropagation();setSelectedSlides([]);setShareModal(true)}} style={{width:'100%',display:'inline-flex',alignItems:'center',justifyContent:'center',gap:'.5rem',background:'linear-gradient(135deg,#f857a6,#ff5858)',border:'none',borderRadius:50,color:'white',fontFamily:"'DM Sans',sans-serif",fontSize:'.9rem',fontWeight:600,padding:'.9rem 2rem',cursor:'pointer',boxShadow:'0 8px 28px rgba(248,87,166,.38)'}}>
              📲 Salvar para Stories
            </button>
            {/* Botão secundário: compartilhar link */}
            <button onClick={e=>{e.stopPropagation();if(navigator.share){navigator.share({title:`${nome1} & ${nome2}`,text:'💕 Veja nossa retrospectiva!',url:window.location.href})}else{navigator.clipboard?.writeText(window.location.href);alert('Link copiado! 💕')}}} style={{width:'100%',display:'inline-flex',alignItems:'center',justifyContent:'center',gap:'.5rem',background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.18)',borderRadius:50,color:'rgba(255,255,255,.8)',fontFamily:"'DM Sans',sans-serif",fontSize:'.85rem',fontWeight:500,padding:'.75rem 2rem',cursor:'pointer'}}>
              🔗 Compartilhar link
            </button>
          </div>
        </div>

        {/* Modal de seleção de slides para Stories */}
        {shareModal && (
          <div onClick={e=>e.stopPropagation()} style={{position:'absolute',inset:0,zIndex:100,display:'flex',flexDirection:'column',background:'rgba(6,5,15,.97)',backdropFilter:'blur(12px)',overflowY:'auto'}}>
            {/* Header */}
            <div style={{padding:'20px 20px 0',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
              <div>
                <div style={{fontFamily:"'DM Serif Display',serif",fontSize:'1.3rem',color:'white'}}>Salvar para Stories</div>
                <div style={{fontSize:'.72rem',color:'rgba(255,255,255,.35)',marginTop:3}}>Escolha quais slides baixar como imagem 9:16</div>
              </div>
              <button onClick={()=>setShareModal(false)} style={{background:'rgba(255,255,255,.1)',border:'none',borderRadius:'50%',width:34,height:34,color:'white',fontSize:'1rem',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
            </div>

            {/* Selecionar todos */}
            <div style={{padding:'12px 20px 8px',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
              <span style={{fontSize:'.75rem',color:'rgba(255,255,255,.4)'}}>
                {selectedSlides.length === 0 ? 'Nenhum selecionado' : `${selectedSlides.length} slide${selectedSlides.length!==1?'s':''} selecionado${selectedSlides.length!==1?'s':''}`}
              </span>
              <button onClick={()=>setSelectedSlides(selectedSlides.length===totalSlides?[]:[...Array(totalSlides).keys()])} style={{background:'none',border:'1px solid rgba(248,87,166,.4)',borderRadius:50,padding:'.25rem .75rem',color:'rgba(248,87,166,.9)',fontSize:'.72rem',cursor:'pointer'}}>
                {selectedSlides.length===totalSlides ? 'Desmarcar tudo' : 'Selecionar tudo'}
              </button>
            </div>

            {/* Grid de slides */}
            <div style={{padding:'0 16px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,flex:1}}>
              {SLIDE_META.map(s=>{
                const sel = selectedSlides.includes(s.id)
                return (
                  <div key={s.id} onClick={()=>setSelectedSlides(prev=>sel?prev.filter(x=>x!==s.id):[...prev,s.id])} style={{background: sel?'rgba(248,87,166,.15)':'rgba(255,255,255,.04)',border:`1.5px solid ${sel?'rgba(248,87,166,.5)':'rgba(255,255,255,.08)'}`,borderRadius:14,padding:'14px 12px',cursor:'pointer',transition:'all .2s',position:'relative'}}>
                    {sel && <div style={{position:'absolute',top:8,right:8,width:18,height:18,borderRadius:'50%',background:'#f857a6',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.6rem',color:'white',fontWeight:700}}>✓</div>}
                    <div style={{fontSize:'1.6rem',marginBottom:6}}>{s.icon}</div>
                    <div style={{fontSize:'.8rem',fontWeight:600,color:sel?'white':'rgba(255,255,255,.7)',marginBottom:2}}>{s.label}</div>
                    <div style={{fontSize:'.65rem',color:'rgba(255,255,255,.3)',lineHeight:1.4}}>{s.desc}</div>
                  </div>
                )
              })}
            </div>

            {/* Botão gerar */}
            <div style={{padding:'16px 20px 28px',flexShrink:0}}>
              <button onClick={gerarTodos} disabled={selectedSlides.length===0||gerando} style={{width:'100%',background: selectedSlides.length===0?'rgba(255,255,255,.08)':'linear-gradient(135deg,#f857a6,#ff5858)',border:'none',borderRadius:50,color: selectedSlides.length===0?'rgba(255,255,255,.3)':'white',fontFamily:"'DM Sans',sans-serif",fontSize:'.95rem',fontWeight:600,padding:'1rem',cursor:selectedSlides.length===0||gerando?'not-allowed':'pointer',transition:'all .2s'}}>
                {gerando ? '⏳ Gerando imagens…' : selectedSlides.length===0 ? 'Selecione ao menos 1 slide' : `⬇️ Baixar ${selectedSlides.length} imagem${selectedSlides.length!==1?'s':''}`}
              </button>
              <p style={{fontSize:'.65rem',color:'rgba(255,255,255,.2)',textAlign:'center',marginTop:10,lineHeight:1.5}}>
                Imagens em formato 9:16 (1080×1920px) prontas para o Instagram Stories
              </p>
            </div>
          </div>
        )}

      </div>
    </>
  )
}