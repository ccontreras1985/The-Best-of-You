import { useState } from "react";

const GS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;700&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --bg:#0a0a0b;--sf:#111114;--sf2:#18181d;--br:#252530;
      --ac:#e8ff3a;--a2:#3affe8;--a3:#ff3a6e;--gr:#3aff8a;--or:#ff9a3a;
      --tx:#f0f0f5;--mu:#6b6b80;
      --fd:'Bebas Neue',sans-serif;--fb:'DM Sans',sans-serif;--fm:'JetBrains Mono',monospace;
    }
    body{background:var(--bg);color:var(--tx);font-family:var(--fb);overflow-x:hidden}
    ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:var(--bg)}
    ::-webkit-scrollbar-thumb{background:var(--br);border-radius:2px}
    .fi{animation:fi .3s ease forwards}
    @keyframes fi{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
    input,select{background:var(--sf2);border:1px solid var(--br);color:var(--tx);font-family:var(--fb);
      font-size:14px;border-radius:8px;padding:10px 14px;outline:none;transition:border-color .2s;width:100%}
    input:focus,select:focus{border-color:var(--ac)}
    input::placeholder{color:var(--mu)}select option{background:var(--sf2)}
    button{cursor:pointer;font-family:var(--fb)}
    table{width:100%;border-collapse:collapse}
    th{text-align:left;padding:9px 12px;font-size:10px;font-weight:700;letter-spacing:.5px;color:var(--mu);border-bottom:1px solid var(--br)}
    td{padding:10px 12px;border-bottom:1px solid var(--br);font-size:13px;vertical-align:middle}
    tr:last-child td{border-bottom:none}
    @media print{.no-print{display:none!important}body{background:#fff!important;color:#000!important}}
  `}</style>
);

const T = {
  bp:{background:"var(--ac)",color:"#0a0a0b",border:"none",padding:"10px 20px",borderRadius:8,fontWeight:600,fontSize:14},
  bg:{background:"transparent",color:"var(--mu)",border:"1px solid var(--br)",padding:"8px 16px",borderRadius:8,fontSize:13},
  bd:{background:"rgba(255,58,110,0.12)",color:"var(--a3)",border:"1px solid rgba(255,58,110,0.3)",padding:"5px 10px",borderRadius:6,fontSize:12},
  bw:{background:"rgba(255,154,58,0.12)",color:"var(--or)",border:"1px solid rgba(255,154,58,0.3)",padding:"5px 10px",borderRadius:6,fontSize:12},
  card:{background:"var(--sf)",border:"1px solid var(--br)",borderRadius:12,padding:20},
  tag:{display:"inline-block",padding:"3px 9px",borderRadius:20,fontSize:11,fontWeight:600,letterSpacing:".4px",textTransform:"uppercase"},
  ov:{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,padding:16},
};

const MACHINES = [
  {id:"squat_rack",name:"Squat Rack",muscles:["Cuádriceps","Glúteos","Isquiotibiales"],emoji:"🏋️",color:"#e8ff3a",group:"Piernas"},
  {id:"smith_machine",name:"Smith Machine",muscles:["Pecho","Hombros","Cuádriceps"],emoji:"⚡",color:"#3affe8",group:"Multiarticular"},
  {id:"functional_trainer",name:"Functional Trainer (ILUS)",muscles:["Pecho","Espalda","Hombros","Brazos","Core"],emoji:"🔀",color:"#ff9a3a",group:"Funcional"},
  {id:"leg_press",name:"Prensa de Piernas",muscles:["Cuádriceps","Glúteos","Isquiotibiales"],emoji:"🦵",color:"#e8ff3a",group:"Piernas"},
  {id:"leg_curl",name:"Leg Curl (ILUS)",muscles:["Isquiotibiales","Gastrocnemios"],emoji:"🦵",color:"#ff3a6e",group:"Piernas"},
  {id:"leg_extension",name:"Leg Extension",muscles:["Cuádriceps"],emoji:"🦵",color:"#e8ff3a",group:"Piernas"},
  {id:"hip_abduction",name:"Abducción/Aducción",muscles:["Glúteo medio","Aductores","Sartorio"],emoji:"🍑",color:"#ff3aaa",group:"Piernas"},
  {id:"cable_cross",name:"Freemotion Cable Cross",muscles:["Pecho","Hombros","Brazos"],emoji:"🔄",color:"#3affe8",group:"Funcional"},
  {id:"lat_pulldown",name:"Polea Alta",muscles:["Dorsal","Bíceps","Romboides"],emoji:"⬇️",color:"#3affe8",group:"Espalda"},
  {id:"seated_row",name:"Remo Sentado",muscles:["Dorsal","Trapecio","Bíceps"],emoji:"🚣",color:"#3affe8",group:"Espalda"},
  {id:"hip_thrust_machine",name:"Hip Thrust (máquina)",muscles:["Glúteos","Isquiotibiales"],emoji:"🍑",color:"#ff3aaa",group:"Piernas"},
  {id:"incline_press",name:"Press Inclinado",muscles:["Pecho superior","Hombros","Tríceps"],emoji:"💪",color:"#ff9a3a",group:"Pecho"},
  {id:"dips",name:"Fondos / Dips",muscles:["Tríceps","Pecho","Hombros"],emoji:"↘️",color:"#ff3a6e",group:"Pecho"},
  {id:"pull_up_bar",name:"Barra de Dominadas",muscles:["Dorsal","Bíceps","Core"],emoji:"🔝",color:"#3affe8",group:"Espalda"},
  {id:"barbell_deadlift",name:"Peso Muerto Barra",muscles:["Isquiotibiales","Glúteos","Espalda baja"],emoji:"🏋️",color:"#e8ff3a",group:"Piernas"},
];
const GC={Piernas:"#e8ff3a",Pecho:"#ff9a3a",Espalda:"#3affe8",Hombros:"#ff3a6e",Brazos:"#c03aff",Core:"#3aff8a",Funcional:"#ff3aaa",Multiarticular:"#aaffdd"};
const MONTHS=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

const DEFAULT_PLANS = [
  {id:"p1",name:"Plan Básico 2x",sessionsPerWeek:2,priceNet:35000},
  {id:"p2",name:"Plan Estándar 3x",sessionsPerWeek:3,priceNet:49000},
  {id:"p3",name:"Plan Avanzado 4x",sessionsPerWeek:4,priceNet:62000},
  {id:"p4",name:"Plan Elite 5x",sessionsPerWeek:5,priceNet:74000},
  {id:"p5",name:"Plan Personalizado",sessionsPerWeek:null,priceNet:null},
];

const DEFAULT_GYM = {
  name:"Elite Trainer Gym",rut:"76.543.210-K",address:"Av. Principal 1234, San Pedro de la Paz",
  phone:"+56 9 1234 5678",email:"contacto@elitetrainer.cl",bank:"Banco Estado",
  accountType:"Cuenta Corriente",accountNumber:"123-456789-01",accountHolder:"Elite Trainer SpA",accountRut:"76.543.210-K",
};

const INIT_USERS = [
  {id:"admin1",uid:"ET-001",role:"admin",name:"Administrador",username:"admin",password:"admin123",email:"admin@elitetrainer.cl",active:true},
  {id:"trainer1",uid:"ET-002",role:"trainer",name:"Pablo Ramírez",username:"coach_pablo",password:"coach123",email:"pablo@elitetrainer.cl",active:true,assignedStudents:["student1","student2"]},
  {id:"student1",uid:"ET-003",role:"student",name:"Ana Torres",username:"ana_torres",password:"ana123",email:"ana@gmail.com",active:true,trainerId:"trainer1",planId:"p2",
    profile:{height:165,weight:62,age:28,gender:"female",goal:"Hipertrofia",activityLevel:"moderado",restrictions:""},
    attendance:["2026-02-10","2026-02-13","2026-02-17","2026-02-20","2026-02-24","2026-02-27","2026-03-03"],
    sessions:[
      {id:"s1",date:"2026-02-10",exercises:[{id:"e1",machineId:"squat_rack",sets:4,reps:10,weight:60},{id:"e2",machineId:"leg_press",sets:3,reps:12,weight:120},{id:"e3",machineId:"leg_curl",sets:3,reps:12,weight:40}]},
      {id:"s2",date:"2026-02-13",exercises:[{id:"e4",machineId:"incline_press",sets:4,reps:10,weight:45},{id:"e5",machineId:"cable_cross",sets:3,reps:12,weight:20},{id:"e6",machineId:"dips",sets:3,reps:10,weight:0}]},
      {id:"s3",date:"2026-02-17",exercises:[{id:"e7",machineId:"lat_pulldown",sets:4,reps:10,weight:55},{id:"e8",machineId:"seated_row",sets:3,reps:12,weight:50},{id:"e9",machineId:"pull_up_bar",sets:3,reps:8,weight:0}]},
      {id:"s4",date:"2026-02-20",exercises:[{id:"e10",machineId:"squat_rack",sets:4,reps:10,weight:65},{id:"e11",machineId:"leg_press",sets:3,reps:12,weight:130},{id:"e12",machineId:"hip_abduction",sets:3,reps:15,weight:35}]},
      {id:"s5",date:"2026-02-24",exercises:[{id:"e13",machineId:"incline_press",sets:4,reps:10,weight:47.5},{id:"e14",machineId:"functional_trainer",sets:3,reps:12,weight:25},{id:"e15",machineId:"dips",sets:3,reps:12,weight:0}]},
      {id:"s6",date:"2026-02-27",exercises:[{id:"e16",machineId:"lat_pulldown",sets:4,reps:10,weight:57.5},{id:"e17",machineId:"seated_row",sets:3,reps:12,weight:52.5},{id:"e18",machineId:"barbell_deadlift",sets:3,reps:8,weight:70}]},
    ]},
  {id:"student2",uid:"ET-004",role:"student",name:"Carlos Vásquez",username:"carlos_v",password:"carlos123",email:"carlos@gmail.com",active:true,trainerId:"trainer1",planId:"p4",
    profile:{height:178,weight:80,age:32,gender:"male",goal:"Fuerza",activityLevel:"activo",restrictions:"Dolor lumbar leve"},
    attendance:["2026-02-12","2026-02-15","2026-02-19","2026-02-22","2026-02-26","2026-03-01"],
    sessions:[
      {id:"s1",date:"2026-02-12",exercises:[{id:"e1",machineId:"squat_rack",sets:5,reps:5,weight:100},{id:"e2",machineId:"barbell_deadlift",sets:4,reps:5,weight:120}]},
      {id:"s2",date:"2026-02-15",exercises:[{id:"e3",machineId:"incline_press",sets:5,reps:5,weight:70},{id:"e4",machineId:"dips",sets:3,reps:8,weight:20}]},
      {id:"s3",date:"2026-02-19",exercises:[{id:"e5",machineId:"squat_rack",sets:5,reps:5,weight:105},{id:"e6",machineId:"barbell_deadlift",sets:4,reps:5,weight:125}]},
    ]},
];

let _uidCount = 4;
const newUid = () => `ET-${String(++_uidCount).padStart(3,"0")}`;
const newId  = () => `u_${Date.now()}`;

const getMachine = id => MACHINES.find(m => m.id === id);

function sessionMuscles(sess){
  const set=new Set();
  sess.exercises.forEach(ex=>{const m=getMachine(ex.machineId);if(m)m.muscles.forEach(mu=>set.add(mu));});
  return [...set];
}
function sessionGroups(sess){
  const set=new Set();
  sess.exercises.forEach(ex=>{const m=getMachine(ex.machineId);if(m)set.add(m.group);});
  return [...set];
}
function suggestNext(sessions){
  if(!sessions||!sessions.length) return{machines:MACHINES.slice(0,4),reason:"Primera sesión — comenzamos con lo básico"};
  const last=sessionGroups(sessions[sessions.length-1]);
  const all=[...new Set(MACHINES.map(m=>m.group))];
  const next=all.filter(g=>!last.includes(g)).slice(0,2);
  return{machines:MACHINES.filter(m=>next.includes(m.group)).slice(0,4),reason:`Última: ${last.join(", ")} · Siguiente: ${next.join(", ")}`};
}
function calcNut(p){
  if(!p||!p.height||!p.weight||!p.age) return null;
  const h=+p.height,w=+p.weight,a=+p.age;
  let bmr=p.gender==="male"?88.362+13.397*w+4.799*h-5.677*a:p.gender==="female"?447.593+9.247*w+3.098*h-4.330*a:550+11*w+4*h-5*a;
  const mult={sedentario:1.2,ligero:1.375,moderado:1.55,activo:1.725,"muy activo":1.9}[p.activityLevel]||1.55;
  const adj={"Pérdida de peso":-400,"Definición":-200,"Mantenimiento":0,"Hipertrofia":300,"Fuerza":200,"Rendimiento":150}[p.goal]||0;
  const cal=Math.round(bmr*mult+adj),prot=Math.round((p.goal==="Fuerza"||p.goal==="Hipertrofia")?w*2.2:w*1.8);
  const fat=Math.round(cal*0.25/9),carbs=Math.round((cal-prot*4-fat*9)/4);
  return{calories:cal,protein:prot,carbs,fat};
}
function weightHist(sessions,mid){
  return sessions.filter(s=>s.exercises.some(e=>e.machineId===mid))
    .map(s=>{const ex=s.exercises.find(e=>e.machineId===mid);return{date:s.date,weight:ex.weight,sets:ex.sets,reps:ex.reps};})
    .sort((a,b)=>a.date.localeCompare(b.date));
}
function monthCount(att){
  const n=new Date(),ym=`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`;
  return(att||[]).filter(d=>d.startsWith(ym)).length;
}
function todayISO(){return new Date().toISOString().slice(0,10);}
function fmtCLP(n){return n!=null?`$${n.toLocaleString("es-CL")}`:"—";}
function gLbl(g){return{male:"Masculino",female:"Femenino",other:"Prefiero no decir"}[g]||g||"—";}

// ── MINI LINE CHART ───────────────────────────────────────────────────────────
function MiniLine({data,color="#e8ff3a"}){
  if(!data||!data.length) return <div style={{color:"var(--mu)",fontSize:12,padding:"16px 0"}}>Sin registros</div>;
  const vals=data.map(d=>d.weight),mn=Math.min(...vals),mx=Math.max(...vals),rng=mx-mn||1;
  const W=220,H=58,P=8;
  const pt=(v,i)=>[P+(i/Math.max(vals.length-1,1))*(W-P*2),H-P-((v-mn)/rng)*(H-P*2)];
  return(
    <div>
      <svg width={W} height={H} style={{overflow:"visible"}}>
        <polyline points={vals.map((v,i)=>pt(v,i).join(",")).join(" ")} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        {vals.map((v,i)=>{const[x,y]=pt(v,i);return<circle key={i} cx={x} cy={y} r="3.5" fill={color}/>;}) }
      </svg>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"var(--mu)",marginTop:2}}>
        <span>{data[0].date.slice(5)}</span>
        <span style={{color,fontWeight:700,fontFamily:"var(--fm)"}}>{vals[vals.length-1]} kg</span>
        <span>{data[data.length-1].date.slice(5)}</span>
      </div>
    </div>
  );
}

// ── MUSCLE RADAR ──────────────────────────────────────────────────────────────
function MuscleRadar({sessions}){
  const gs={};
  sessions.forEach(s=>s.exercises.forEach(ex=>{const m=getMachine(ex.machineId);if(m)gs[m.group]=(gs[m.group]||0)+ex.sets;}));
  const ent=Object.entries(gs).sort((a,b)=>b[1]-a[1]);
  if(!ent.length) return <div style={{color:"var(--mu)",fontSize:13,padding:40,textAlign:"center"}}>Registra sesiones para ver la carga muscular.</div>;
  const mx=Math.max(...ent.map(e=>e[1])),n=ent.length,CX=130,CY=130,R=95;
  const pts=ent.map(([g,v],i)=>{const a=(i/n)*2*Math.PI-Math.PI/2,r=(v/mx)*R;return[CX+Math.cos(a)*r,CY+Math.sin(a)*r];});
  return(
    <div style={{display:"flex",alignItems:"flex-start",gap:28,flexWrap:"wrap"}}>
      <svg width={260} height={260}>
        {[.25,.5,.75,1].map(r=><circle key={r} cx={CX} cy={CY} r={R*r} fill="none" stroke="var(--br)" strokeWidth="1"/>)}
        {ent.map((_,i)=>{const a=(i/n)*2*Math.PI-Math.PI/2;return<line key={i} x1={CX} y1={CY} x2={CX+Math.cos(a)*R} y2={CY+Math.sin(a)*R} stroke="var(--br)" strokeWidth="1"/>;}) }
        {n>=3&&<polygon points={pts.map(p=>p.join(",")).join(" ")} fill="rgba(232,255,58,0.12)" stroke="var(--ac)" strokeWidth="2"/>}
        {pts.map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r="4" fill={GC[ent[i][0]]||"var(--ac)"}/>)}
        {ent.map(([g],i)=>{const a=(i/n)*2*Math.PI-Math.PI/2;return<text key={g} x={CX+Math.cos(a)*(R+20)} y={CY+Math.sin(a)*(R+20)} textAnchor="middle" dominantBaseline="middle" fill={GC[g]||"var(--mu)"} fontSize="9" fontFamily="DM Sans,sans-serif" fontWeight="700">{g.toUpperCase()}</text>;})}
      </svg>
      <div style={{flex:1,minWidth:180}}>
        <div style={{fontSize:11,color:"var(--mu)",fontWeight:700,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>Series por grupo muscular</div>
        {ent.map(([g,v])=>(
          <div key={g} style={{marginBottom:9}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
              <span style={{fontSize:12,color:GC[g]||"var(--tx)"}}>{g}</span>
              <span style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--mu)"}}>{v} series</span>
            </div>
            <div style={{height:5,background:"var(--sf2)",borderRadius:3,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${(v/mx)*100}%`,background:GC[g]||"var(--ac)",borderRadius:3}}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CALENDAR ──────────────────────────────────────────────────────────────────
function AttCal({attendance}){
  const now=new Date(),y=now.getFullYear(),mo=now.getMonth();
  const dim=new Date(y,mo+1,0).getDate(),fd=new Date(y,mo,1).getDay(),attSet=new Set(attendance);
  const cells=[];
  for(let i=0;i<fd;i++)cells.push(null);
  for(let d=1;d<=dim;d++){const ds=`${y}-${String(mo+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;cells.push({day:d,att:attSet.has(ds),today:d===now.getDate()});}
  return(
    <div>
      <div style={{fontSize:12,fontWeight:600,color:"var(--mu)",marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>{MONTHS[mo]} {y}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
        {["D","L","M","X","J","V","S"].map(d=><div key={d} style={{fontSize:9,color:"var(--mu)",textAlign:"center",paddingBottom:3}}>{d}</div>)}
        {cells.map((c,i)=>(
          <div key={i} style={{aspectRatio:"1",borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",
            background:!c?"transparent":c.att?"var(--ac)":"var(--sf2)",
            border:!c?"none":c.today?"1px solid var(--ac)":"1px solid var(--br)",
            fontSize:10,fontWeight:c&&c.att?700:400,
            color:!c?"transparent":c.att?"#000":c.today?"var(--ac)":"var(--mu)"}}>
            {c?c.day:""}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PROFILE SETUP ─────────────────────────────────────────────────────────────
function ProfileSetup({userName,onSave}){
  const[f,setF]=useState({height:"",weight:"",age:"",gender:"",goal:"Hipertrofia",activityLevel:"moderado",restrictions:""});
  const set=k=>e=>setF(p=>({...p,[k]:e.target.value}));
  const ok=f.height&&f.weight&&f.age&&f.gender;
  return(
    <div style={T.ov}>
      <div className="fi" style={{...T.card,width:"100%",maxWidth:500,padding:32,border:"1px solid rgba(232,255,58,0.4)",maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{fontFamily:"var(--fd)",fontSize:26,letterSpacing:2,marginBottom:6}}>COMPLETA TU PERFIL</div>
        <div style={{fontSize:13,color:"var(--mu)",marginBottom:22}}>Hola <strong style={{color:"var(--tx)"}}>{userName}</strong>, ingresa tus datos para recibir sugerencias personalizadas.</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[["Altura (cm)","height","170"],["Peso (kg)","weight","70"],["Edad","age","25"]].map(([l,k,ph])=>(
            <div key={k}><label style={{fontSize:11,color:"var(--mu)",display:"block",marginBottom:5}}>{l.toUpperCase()}</label><input type="number" value={f[k]} onChange={set(k)} placeholder={ph}/></div>
          ))}
          <div><label style={{fontSize:11,color:"var(--mu)",display:"block",marginBottom:5}}>GÉNERO</label>
            <select value={f.gender} onChange={set("gender")}>
              <option value="">Seleccionar…</option>
              <option value="male">Masculino</option><option value="female">Femenino</option><option value="other">Prefiero no decir</option>
            </select>
          </div>
          <div><label style={{fontSize:11,color:"var(--mu)",display:"block",marginBottom:5}}>OBJETIVO</label>
            <select value={f.goal} onChange={set("goal")}>
              {["Pérdida de peso","Definición","Mantenimiento","Hipertrofia","Fuerza","Rendimiento"].map(g=><option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div><label style={{fontSize:11,color:"var(--mu)",display:"block",marginBottom:5}}>NIVEL DE ACTIVIDAD</label>
            <select value={f.activityLevel} onChange={set("activityLevel")}>
              {["sedentario","ligero","moderado","activo","muy activo"].map(l=><option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>
        <div style={{marginTop:12}}><label style={{fontSize:11,color:"var(--mu)",display:"block",marginBottom:5}}>RESTRICCIONES (opcional)</label>
          <input value={f.restrictions} onChange={set("restrictions")} placeholder="Ej: dolor lumbar, rodilla…"/>
        </div>
        <button style={{...T.bp,width:"100%",marginTop:20,padding:14,opacity:ok?1:0.4,cursor:ok?"pointer":"not-allowed"}} onClick={()=>ok&&onSave(f)}>Guardar y continuar →</button>
        <button style={{...T.bg,width:"100%",marginTop:8}} onClick={()=>onSave(null)}>Completar más tarde</button>
      </div>
    </div>
  );
}

// ── SESSION MODAL ─────────────────────────────────────────────────────────────
function SessionModal({session,onClose,onSave,canEdit}){
  const[exs,setExs]=useState(session.exercises.map(e=>({...e})));
  const[adding,setAdding]=useState(false);
  const[newEx,setNewEx]=useState({machineId:MACHINES[0].id,sets:3,reps:10,weight:0});
  const[editId,setEditId]=useState(null);
  const[editD,setEditD]=useState({});
  const startEdit=ex=>{setEditId(ex.id);setEditD({...ex});};
  const saveEdit=()=>{setExs(p=>p.map(e=>e.id===editId?{...editD}:e));setEditId(null);};
  const delEx=id=>setExs(p=>p.filter(e=>e.id!==id));
  const addEx=()=>{setExs(p=>[...p,{...newEx,id:`e_${Date.now()}`,sets:+newEx.sets,reps:+newEx.reps,weight:+newEx.weight}]);setAdding(false);setNewEx({machineId:MACHINES[0].id,sets:3,reps:10,weight:0});};
  return(
    <div style={T.ov} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="fi" style={{...T.card,width:"100%",maxWidth:560,padding:28,maxHeight:"92vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div><div style={{fontFamily:"var(--fd)",fontSize:24,letterSpacing:2}}>SESIÓN</div>
            <div style={{fontSize:13,color:"var(--mu)"}}>{session.date} · {exs.length} ejercicios</div>
          </div>
          <button style={T.bg} onClick={onClose}>✕</button>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:14}}>
          {sessionMuscles({exercises:exs}).map(m=><span key={m} style={{...T.tag,background:"rgba(232,255,58,0.1)",color:"var(--ac)"}}>{m}</span>)}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
          {exs.map(ex=>{
            const mc=getMachine(ex.machineId);
            if(editId===ex.id) return(
              <div key={ex.id} style={{padding:12,background:"var(--sf2)",borderRadius:10,border:"1px solid var(--ac)"}}>
                <div style={{marginBottom:8}}><select value={editD.machineId} onChange={e=>setEditD({...editD,machineId:e.target.value})}>{MACHINES.map(m=><option key={m.id} value={m.id}>{m.emoji} {m.name}</option>)}</select></div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                  {[["Series","sets"],["Reps","reps"],["Peso kg","weight"]].map(([l,k])=>(
                    <div key={k}><label style={{fontSize:10,color:"var(--mu)",display:"block",marginBottom:3}}>{l}</label>
                      <input type="number" value={editD[k]} step={k==="weight"?"2.5":"1"} onChange={e=>setEditD({...editD,[k]:parseFloat(e.target.value)||0})} style={{padding:"6px 10px",fontSize:13}}/>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:6,marginTop:10}}>
                  <button style={{...T.bp,fontSize:12,padding:"6px 14px"}} onClick={saveEdit}>✓ Guardar</button>
                  <button style={{...T.bg,fontSize:12}} onClick={()=>setEditId(null)}>Cancelar</button>
                </div>
              </div>
            );
            return(
              <div key={ex.id} style={{padding:12,background:"var(--sf2)",borderRadius:10,border:"1px solid var(--br)",display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:20}}>{mc?mc.emoji:"?"}</span>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{mc?mc.name:ex.machineId}</div><div style={{fontSize:10,color:"var(--mu)"}}>{mc?mc.muscles.slice(0,2).join(", "):""}</div></div>
                <span style={{fontFamily:"var(--fm)",fontSize:13,color:"var(--ac)"}}>{ex.sets}×{ex.reps}</span>
                <span style={{fontFamily:"var(--fm)",fontSize:13,color:"var(--a2)",minWidth:56,textAlign:"right"}}>{ex.weight} kg</span>
                {canEdit&&<div style={{display:"flex",gap:4}}>
                  <button style={{background:"var(--br)",border:"none",borderRadius:6,padding:"4px 8px",color:"var(--tx)",fontSize:12}} onClick={()=>startEdit(ex)}>✏️</button>
                  <button style={T.bd} onClick={()=>delEx(ex.id)}>🗑</button>
                </div>}
              </div>
            );
          })}
        </div>
        {canEdit&&!adding&&<button style={{width:"100%",padding:10,background:"var(--sf2)",border:"1px dashed var(--br)",borderRadius:10,color:"var(--mu)",fontSize:13}} onClick={()=>setAdding(true)}>+ Agregar ejercicio</button>}
        {adding&&(
          <div className="fi" style={{...T.card,marginTop:8,border:"1px solid rgba(232,255,58,0.3)"}}>
            <div style={{marginBottom:8}}><label style={{fontSize:11,color:"var(--mu)",display:"block",marginBottom:4}}>MÁQUINA</label>
              <select value={newEx.machineId} onChange={e=>setNewEx({...newEx,machineId:e.target.value})}>{MACHINES.map(m=><option key={m.id} value={m.id}>{m.emoji} {m.name}</option>)}</select>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
              {[["Series","sets","1"],["Reps","reps","1"],["Peso kg","weight","2.5"]].map(([l,k,st])=>(
                <div key={k}><label style={{fontSize:10,color:"var(--mu)",display:"block",marginBottom:3}}>{l}</label>
                  <input type="number" value={newEx[k]} step={st} onChange={e=>setNewEx({...newEx,[k]:parseFloat(e.target.value)||0})} style={{padding:"6px 10px",fontSize:13}}/>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:6}}>
              <button style={{...T.bp,fontSize:12,padding:"7px 16px"}} onClick={addEx}>Agregar</button>
              <button style={{...T.bg,fontSize:12}} onClick={()=>setAdding(false)}>Cancelar</button>
            </div>
          </div>
        )}
        {canEdit&&<button style={{...T.bp,width:"100%",marginTop:14,padding:12}} onClick={()=>onSave(exs)}>Guardar cambios →</button>}
      </div>
    </div>
  );
}

// ── SESSIONS TAB ──────────────────────────────────────────────────────────────
function SessionsTab({user,onUpdateUser,canEdit}){
  const[viewId,setViewId]=useState(null);
  const[newOpen,setNewOpen]=useState(false);
  const[newDate,setNewDate]=useState(todayISO());
  const sessions=user.sessions||[];
  function save(sid,exs){onUpdateUser({...user,sessions:sessions.map(s=>s.id===sid?{...s,exercises:exs}:s)});setViewId(null);}
  function del(id){const s=sessions.find(x=>x.id===id);onUpdateUser({...user,sessions:sessions.filter(x=>x.id!==id),attendance:(user.attendance||[]).filter(d=>d!==(s?s.date:""))});}
  function create(){const ns={id:`s_${Date.now()}`,date:newDate,exercises:[]};const na=(user.attendance||[]).includes(newDate)?user.attendance:[...(user.attendance||[]),newDate];onUpdateUser({...user,sessions:[...sessions,ns],attendance:na});setNewOpen(false);setViewId(ns.id);}
  const viewSess=viewId?sessions.find(s=>s.id===viewId):null;
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{fontSize:14,fontWeight:600}}>{sessions.length} sesiones registradas</div>
        {canEdit&&<button style={{...T.bp,fontSize:13}} onClick={()=>setNewOpen(true)}>+ Nueva sesión</button>}
      </div>
      {newOpen&&(
        <div className="fi" style={{...T.card,marginBottom:14,border:"1px solid rgba(232,255,58,0.3)"}}>
          <div style={{fontFamily:"var(--fd)",fontSize:18,letterSpacing:2,marginBottom:10}}>NUEVA SESIÓN</div>
          <div style={{marginBottom:10}}><label style={{fontSize:11,color:"var(--mu)",display:"block",marginBottom:5}}>FECHA</label>
            <input type="date" value={newDate} onChange={e=>setNewDate(e.target.value)} style={{maxWidth:200}}/>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button style={T.bg} onClick={()=>setNewOpen(false)}>Cancelar</button>
            <button style={T.bp} onClick={create}>Crear y agregar ejercicios →</button>
          </div>
        </div>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {sessions.length===0&&<div style={{textAlign:"center",padding:60,color:"var(--mu)"}}>Sin sesiones.{canEdit&&<span style={{color:"var(--ac)",cursor:"pointer"}} onClick={()=>setNewOpen(true)}> + Crear primera sesión</span>}</div>}
        {[...sessions].reverse().map(s=>{
          const groups=sessionGroups(s);
          return(
            <div key={s.id} style={{padding:16,background:"var(--sf)",border:"1px solid var(--br)",borderRadius:12,cursor:"pointer"}} onClick={()=>setViewId(s.id)}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontFamily:"var(--fm)",fontSize:13,color:"var(--ac)"}}>{s.date}</span>
                  <span style={{fontSize:12,color:"var(--mu)"}}>{s.exercises.length} ejercicios</span>
                </div>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  {canEdit&&<button style={{...T.bd,fontSize:11,padding:"4px 8px"}} onClick={e=>{e.stopPropagation();del(s.id);}}>🗑</button>}
                  <span style={{fontSize:12,color:"var(--mu)"}}>Ver →</span>
                </div>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:6}}>
                {groups.map(g=><span key={g} style={{...T.tag,background:`${GC[g]||"#555"}22`,color:GC[g]||"var(--mu)",fontSize:10}}>{g}</span>)}
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {s.exercises.length===0&&<span style={{fontSize:12,color:"var(--mu)"}}>Sin ejercicios — haz click para agregar</span>}
                {s.exercises.map(ex=>{const m=getMachine(ex.machineId);return(
                  <div key={ex.id} style={{fontSize:12,background:"var(--sf2)",padding:"4px 9px",borderRadius:8,display:"flex",gap:5,alignItems:"center"}}>
                    <span>{m?m.emoji:"?"}</span><span style={{color:"var(--mu)"}}>{m?m.name:ex.machineId}</span>
                    <span style={{fontFamily:"var(--fm)",color:"var(--ac)",fontSize:11}}>{ex.sets}×{ex.reps}</span>
                    <span style={{fontFamily:"var(--fm)",color:"var(--a2)",fontSize:11}}>{ex.weight}kg</span>
                  </div>
                );})}
              </div>
            </div>
          );
        })}
      </div>
      {viewSess&&<SessionModal session={viewSess} onClose={()=>setViewId(null)} canEdit={canEdit} onSave={exs=>save(viewId,exs)}/>}
    </div>
  );
}

// ── PROFORMA ──────────────────────────────────────────────────────────────────
function ProformaModal({student,allUsers,plans,gymInfo,onClose}){
  const plan=plans.find(p=>p.id===student.planId);
  const trainer=allUsers.find(u=>u.id===student.trainerId);
  const now=new Date();
  const sessMonth=monthCount(student.attendance||[]);
  const proNum=`ET-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,"0")}-${student.uid||"000"}`;
  const net=plan&&plan.priceNet?+plan.priceNet:null;
  const iva=net?Math.round(net*0.19):null;
  const total=net?net+iva:null;
  return(
    <div style={T.ov} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="fi" style={{width:"100%",maxWidth:660,maxHeight:"92vh",overflowY:"auto",borderRadius:12,background:"#fff",color:"#111"}}>
        <div className="no-print" style={{padding:"12px 20px",background:"#f4f4f4",borderBottom:"1px solid #ddd",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:13,fontWeight:700,color:"#333"}}>PROFORMA · {student.name}</span>
          <div style={{display:"flex",gap:8}}>
            <button style={{...T.bp,fontSize:12,padding:"7px 14px"}} onClick={()=>window.print()}>🖨 Imprimir / PDF</button>
            <button style={{background:"#ddd",border:"none",borderRadius:8,padding:"7px 14px",fontSize:12}} onClick={onClose}>✕ Cerrar</button>
          </div>
        </div>
        <div style={{padding:36}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,paddingBottom:18,borderBottom:"3px solid #111"}}>
            <div>
              <div style={{fontFamily:"var(--fd)",fontSize:34,letterSpacing:3,color:"#111",lineHeight:1}}>{gymInfo.name}</div>
              <div style={{fontSize:12,color:"#666",marginTop:6}}>{gymInfo.address}</div>
              <div style={{fontSize:12,color:"#666"}}>{gymInfo.phone} · {gymInfo.email}</div>
              <div style={{fontSize:12,color:"#666"}}>RUT: {gymInfo.rut}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{background:"#111",color:"#e8ff3a",padding:"6px 14px",borderRadius:6,fontFamily:"var(--fd)",fontSize:20,letterSpacing:2,marginBottom:6}}>PROFORMA</div>
              <div style={{fontSize:12,color:"#666"}}>N° {proNum}</div>
              <div style={{fontSize:12,color:"#666"}}>Fecha: {todayISO()}</div>
              <div style={{fontSize:12,color:"#666"}}>Período: {MONTHS[now.getMonth()]} {now.getFullYear()}</div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}}>
            <div style={{padding:14,background:"#f8f8f8",borderRadius:8,border:"1px solid #eee"}}>
              <div style={{fontSize:10,color:"#999",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Facturar a</div>
              <div style={{fontSize:16,fontWeight:700,marginBottom:3}}>{student.name}</div>
              <div style={{fontSize:12,color:"#555"}}>ID: {student.uid}</div>
              <div style={{fontSize:12,color:"#555"}}>Email: {student.email||"—"}</div>
              <div style={{fontSize:12,color:"#555"}}>Entrenador: {trainer?trainer.name:"Sin asignar"}</div>
            </div>
            <div style={{padding:14,background:"#f8f8f8",borderRadius:8,border:"1px solid #eee"}}>
              <div style={{fontSize:10,color:"#999",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Resumen del mes</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[["Plan",plan?plan.name:"Sin plan"],["Ses/semana",plan&&plan.sessionsPerWeek?`${plan.sessionsPerWeek}x`:"—"],["Asistencias",`${sessMonth} días`],["Sesiones totales",`${(student.sessions||[]).length}`]].map(([k,v])=>(
                  <div key={k}><div style={{fontSize:10,color:"#999"}}>{k}</div><div style={{fontSize:13,fontWeight:600}}>{v}</div></div>
                ))}
              </div>
            </div>
          </div>
          <table style={{marginBottom:20,fontSize:13}}>
            <thead><tr style={{background:"#111",color:"#fff"}}>
              <th style={{padding:"10px 14px",fontWeight:600}}>Descripción</th>
              <th style={{padding:"10px 14px",textAlign:"center",fontWeight:600}}>Ses/sem</th>
              <th style={{padding:"10px 14px",textAlign:"center",fontWeight:600}}>Asistidas</th>
              <th style={{padding:"10px 14px",textAlign:"right",fontWeight:600}}>Valor neto</th>
            </tr></thead>
            <tbody><tr style={{borderBottom:"1px solid #eee"}}>
              <td style={{padding:"12px 14px"}}>
                <div style={{fontWeight:600}}>{plan?plan.name:"Plan no asignado"}</div>
                <div style={{fontSize:11,color:"#888"}}>Entrenamiento personal · {MONTHS[now.getMonth()]} {now.getFullYear()}</div>
              </td>
              <td style={{padding:"12px 14px",textAlign:"center"}}>{plan&&plan.sessionsPerWeek?`${plan.sessionsPerWeek}x`:"—"}</td>
              <td style={{padding:"12px 14px",textAlign:"center"}}>{sessMonth}</td>
              <td style={{padding:"12px 14px",textAlign:"right",fontWeight:700}}>{net?fmtCLP(net):"A convenir"}</td>
            </tr></tbody>
          </table>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:24}}>
            <div style={{minWidth:240}}>
              {[["Subtotal neto",net?fmtCLP(net):"—"],["IVA (19%)",iva?fmtCLP(iva):"—"]].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #eee",fontSize:13}}><span style={{color:"#555"}}>{k}</span><span>{v}</span></div>
              ))}
              <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0",fontSize:18,fontWeight:700,borderBottom:"3px solid #111"}}><span>TOTAL</span><span>{total?fmtCLP(total):"A convenir"}</span></div>
            </div>
          </div>
          <div style={{padding:16,background:"#f8f8f8",borderRadius:8,border:"1px solid #eee",marginBottom:18}}>
            <div style={{fontSize:10,color:"#999",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Datos para transferencia bancaria</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:13}}>
              {[["Banco",gymInfo.bank],["Tipo cuenta",gymInfo.accountType],["N° cuenta",gymInfo.accountNumber],["Titular",gymInfo.accountHolder],["RUT titular",gymInfo.accountRut],["Email",gymInfo.email]].map(([k,v])=>(
                <div key={k}><div style={{fontSize:10,color:"#aaa",marginBottom:2}}>{k.toUpperCase()}</div><div style={{fontWeight:600}}>{v}</div></div>
              ))}
            </div>
          </div>
          <div style={{fontSize:11,color:"#aaa",textAlign:"center",lineHeight:1.7}}>
            Documento sin valor tributario · N° {proNum} · {MONTHS[now.getMonth()]} {now.getFullYear()}<br/>
            Al transferir enviar comprobante a {gymInfo.email}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── STUDENT DASHBOARD ─────────────────────────────────────────────────────────
function StudentDash({user,allUsers,plans,onUpdate,isEmbedded=false}){
  const[tab,setTab]=useState("overview");
  const sessions=user.sessions||[],att=user.attendance||[],prof=user.profile||{};
  const nut=calcNut(prof),sugg=suggestNext(sessions),tm=monthCount(att);
  const trainer=allUsers.find(u=>u.id===user.trainerId);
  const plan=plans.find(p=>p.id===user.planId);
  const machinesWithData=MACHINES.filter(m=>weightHist(sessions,m.id).length>0);
  const TABS=[{id:"overview",l:"Resumen",i:"📊"},{id:"sessions",l:"Sesiones",i:"📋"},{id:"load",l:"Carga Muscular",i:"💪"},{id:"progress",l:"Progreso",i:"📈"},{id:"nutrition",l:"Nutrición",i:"🥗"},{id:"calendar",l:"Asistencia",i:"📅"}];
  return(
    <div style={{minHeight:isEmbedded?"auto":"100vh",background:"var(--bg)"}}>
      {!isEmbedded&&(
        <div style={{background:"var(--sf)",borderBottom:"1px solid var(--br)",padding:"14px 24px",display:"flex",alignItems:"center",gap:14}}>
          <div style={{fontFamily:"var(--fd)",fontSize:22,letterSpacing:2,color:"var(--ac)"}}>ELITE TRAINER</div>
          <div style={{width:1,height:22,background:"var(--br)"}}/>
          <div>
            <div style={{fontSize:14,fontWeight:600}}>{user.name} <span style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--mu)",marginLeft:6}}>{user.uid}</span></div>
            <div style={{fontSize:11,color:"var(--mu)"}}>Alumno{trainer?` · Coach: ${trainer.name}`:""}{plan?` · ${plan.name}`:""}</div>
          </div>
        </div>
      )}
      <div style={{borderBottom:"1px solid var(--br)",padding:"0 24px",display:"flex",overflowX:"auto",background:isEmbedded?"transparent":"var(--sf)"}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{background:"none",border:"none",padding:"13px 14px",fontSize:13,fontWeight:500,cursor:"pointer",whiteSpace:"nowrap",color:tab===t.id?"var(--ac)":"var(--mu)",borderBottom:`2px solid ${tab===t.id?"var(--ac)":"transparent"}`,transition:"all .2s"}}>{t.i} {t.l}</button>
        ))}
      </div>
      <div style={{padding:24,maxWidth:1080,margin:"0 auto"}} className="fi" key={tab}>

        {tab==="overview"&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14}}>
            {[{l:"Sesiones totales",v:sessions.length,i:"🏋️",c:"var(--ac)"},{l:"Días este mes",v:tm,i:"📅",c:"var(--a2)"},{l:"Total asistencias",v:att.length,i:"✅",c:"var(--gr)"},{l:"Plan activo",v:plan?plan.name:"—",i:"⭐",c:"var(--or)"}].map(x=>(
              <div key={x.l} style={{...T.card,display:"flex",alignItems:"center",gap:12}}>
                <div style={{fontSize:26}}>{x.i}</div>
                <div><div style={{fontFamily:"var(--fd)",fontSize:26,color:x.c,lineHeight:1}}>{x.v}</div><div style={{fontSize:12,color:"var(--mu)"}}>{x.l}</div></div>
              </div>
            ))}
            <div style={{...T.card,gridColumn:"span 2",border:"1px solid rgba(232,255,58,0.2)"}}>
              <div style={{fontSize:11,color:"var(--ac)",fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>⚡ Próxima sesión sugerida</div>
              <div style={{fontSize:12,color:"var(--mu)",marginBottom:10}}>{sugg.reason}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {sugg.machines.map(m=>(
                  <div key={m.id} style={{padding:"7px 12px",background:"var(--sf2)",borderRadius:8,border:"1px solid var(--br)",display:"flex",gap:8,alignItems:"center"}}>
                    <span style={{fontSize:18}}>{m.emoji}</span>
                    <div><div style={{fontSize:12,fontWeight:600}}>{m.name}</div><div style={{fontSize:10,color:"var(--mu)"}}>{m.muscles.slice(0,2).join(", ")}</div></div>
                  </div>
                ))}
              </div>
            </div>
            {sessions.length>0&&(
              <div style={{...T.card,gridColumn:"span 2"}}>
                <div style={{fontSize:11,color:"var(--mu)",fontWeight:700,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>Última sesión — {sessions[sessions.length-1].date}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>
                  {sessionMuscles(sessions[sessions.length-1]).map(m=><span key={m} style={{...T.tag,background:"rgba(58,255,232,0.1)",color:"var(--a2)"}}>{m}</span>)}
                </div>
                {sessions[sessions.length-1].exercises.map((ex,i)=>{const m=getMachine(ex.machineId);return(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 10px",background:"var(--sf2)",borderRadius:8,marginBottom:4}}>
                    <span style={{fontSize:18}}>{m?m.emoji:"?"}</span><span style={{flex:1,fontSize:13}}>{m?m.name:ex.machineId}</span>
                    <span style={{fontFamily:"var(--fm)",fontSize:12,color:"var(--ac)"}}>{ex.sets}×{ex.reps}</span>
                    <span style={{fontFamily:"var(--fm)",fontSize:12,color:"var(--a2)"}}>{ex.weight} kg</span>
                  </div>
                );})}
              </div>
            )}
          </div>
        )}

        {tab==="sessions"&&<SessionsTab user={user} onUpdateUser={onUpdate} canEdit={true}/>}

        {tab==="load"&&(
          <div>
            <div style={{marginBottom:18}}>
              <div style={{fontFamily:"var(--fd)",fontSize:20,letterSpacing:2,marginBottom:4}}>CARGA POR GRUPO MUSCULAR</div>
              <div style={{fontSize:13,color:"var(--mu)"}}>Distribución acumulada de series en todo el historial</div>
            </div>
            <div style={T.card}><MuscleRadar sessions={sessions}/></div>
            {sessions.length>0&&(
              <div style={{...T.card,marginTop:14}}>
                <div style={{fontSize:11,color:"var(--mu)",fontWeight:700,marginBottom:12,textTransform:"uppercase",letterSpacing:1}}>Últimas 6 sesiones</div>
                {sessions.slice(-6).reverse().map(s=>(
                  <div key={s.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid var(--br)"}}>
                    <span style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--mu)",minWidth:80}}>{s.date}</span>
                    <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                      {sessionGroups(s).map(g=><span key={g} style={{...T.tag,background:`${GC[g]||"#555"}20`,color:GC[g]||"var(--mu)",fontSize:10}}>{g}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab==="progress"&&(
          <div>
            <div style={{fontFamily:"var(--fd)",fontSize:20,letterSpacing:2,marginBottom:14,color:"var(--mu)"}}>EVOLUCIÓN DE PESOS POR MÁQUINA</div>
            {machinesWithData.length===0&&<div style={{textAlign:"center",padding:60,color:"var(--mu)"}}>Registra sesiones para ver tu progreso.</div>}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14}}>
              {machinesWithData.map(m=>{
                const h=weightHist(sessions,m.id),pct=h[0].weight>0?Math.round((h[h.length-1].weight-h[0].weight)/h[0].weight*100):0;
                return(
                  <div key={m.id} style={T.card}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                      <span style={{fontSize:22}}>{m.emoji}</span>
                      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{m.name}</div><div style={{fontSize:10,color:"var(--mu)"}}>{h.length} registros</div></div>
                      <div style={{fontFamily:"var(--fm)",fontSize:13,color:pct>=0?"var(--gr)":"var(--a3)"}}>{pct>=0?"+":""}{pct}%</div>
                    </div>
                    <MiniLine data={h} color={m.color}/>
                    <div style={{marginTop:8}}>
                      {h.slice(-3).reverse().map((r,i)=>(
                        <div key={i} style={{display:"flex",gap:10,padding:"5px 0",borderBottom:"1px solid var(--br)",fontSize:12}}>
                          <span style={{color:"var(--mu)",flex:1}}>{r.date}</span>
                          <span style={{fontFamily:"var(--fm)",color:m.color}}>{r.weight} kg</span>
                          <span style={{color:"var(--mu)"}}>{r.sets}×{r.reps}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab==="nutrition"&&(
          <div style={{maxWidth:760}}>
            <div style={{...T.card,marginBottom:14}}>
              <div style={{fontSize:11,color:"var(--mu)",fontWeight:700,marginBottom:12,textTransform:"uppercase",letterSpacing:1}}>Tu perfil</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                {[["Altura",`${prof.height||"—"} cm`],["Peso",`${prof.weight||"—"} kg`],["Edad",`${prof.age||"—"} años`],["Género",gLbl(prof.gender)],["Objetivo",prof.goal||"—"],["Actividad",prof.activityLevel||"—"]].map(([k,v])=>(
                  <div key={k} style={{padding:10,background:"var(--sf2)",borderRadius:8}}><div style={{fontSize:10,color:"var(--mu)",marginBottom:3}}>{k.toUpperCase()}</div><div style={{fontSize:14,fontWeight:600}}>{v}</div></div>
                ))}
              </div>
              {prof.restrictions&&<div style={{marginTop:10,padding:10,background:"rgba(255,154,58,0.1)",borderRadius:8,fontSize:13,color:"var(--or)"}}>⚠️ {prof.restrictions}</div>}
            </div>
            {nut?(
              <div style={{...T.card,border:"1px solid rgba(232,255,58,0.2)"}}>
                <div style={{fontSize:11,color:"var(--ac)",fontWeight:700,marginBottom:12,textTransform:"uppercase",letterSpacing:1}}>🥗 Recomendación nutricional diaria</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
                  {[{l:"Calorías",v:nut.calories,u:"kcal",c:"var(--ac)",i:"🔥"},{l:"Proteínas",v:nut.protein,u:"g/día",c:"var(--a3)",i:"🥩"},{l:"Carbohidratos",v:nut.carbs,u:"g/día",c:"var(--a2)",i:"🍚"},{l:"Grasas",v:nut.fat,u:"g/día",c:"var(--or)",i:"🥑"}].map(n=>(
                    <div key={n.l} style={{padding:14,background:"var(--sf2)",borderRadius:10,textAlign:"center"}}>
                      <div style={{fontSize:22,marginBottom:5}}>{n.i}</div>
                      <div style={{fontFamily:"var(--fd)",fontSize:30,color:n.c,lineHeight:1}}>{n.v}</div>
                      <div style={{fontSize:11,color:"var(--mu)",marginTop:2}}>{n.u}</div>
                      <div style={{fontSize:10,color:"var(--mu)",marginTop:2}}>{n.l}</div>
                    </div>
                  ))}
                </div>
                <div style={{fontSize:12,color:"var(--mu)",padding:10,background:"var(--sf2)",borderRadius:8,lineHeight:1.6}}>* Harris-Benedict · actividad <strong style={{color:"var(--tx)"}}>{prof.activityLevel}</strong> · objetivo <strong style={{color:"var(--ac)"}}>{prof.goal}</strong>. Consulta a un nutricionista.</div>
              </div>
            ):<div style={{...T.card,textAlign:"center",padding:40,color:"var(--mu)"}}>Completa tu perfil para ver sugerencias nutricionales.</div>}
          </div>
        )}

        {tab==="calendar"&&(
          <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:16,maxWidth:800}}>
            <div style={{...T.card,minWidth:240}}>
              <AttCal attendance={att}/>
              <div style={{marginTop:12,borderTop:"1px solid var(--br)",paddingTop:12}}>
                {[["Este mes",tm,"var(--ac)"],["Total acumulado",att.length,"var(--a2)"]].map(([l,v,c])=>(
                  <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:13,color:"var(--mu)"}}>{l}</span><span style={{fontFamily:"var(--fm)",color:c}}>{v} días</span></div>
                ))}
              </div>
            </div>
            <div style={T.card}>
              <div style={{fontSize:11,color:"var(--mu)",fontWeight:700,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>Historial</div>
              {[...sessions].reverse().map(s=>(
                <div key={s.id} style={{padding:"9px 0",borderBottom:"1px solid var(--br)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontFamily:"var(--fm)",fontSize:12}}>{s.date}</span><span style={{fontSize:11,color:"var(--mu)"}}>{s.exercises.length} ejercicios</span></div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:3}}>{sessionMuscles(s).map(m=><span key={m} style={{...T.tag,background:"var(--sf2)",color:"var(--mu)",fontSize:10}}>{m}</span>)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── TRAINER DASHBOARD ─────────────────────────────────────────────────────────
function TrainerDash({user,allUsers,plans,onUpdate}){
  const[selId,setSelId]=useState(null);
  const students=allUsers.filter(u=>(user.assignedStudents||[]).includes(u.id)&&u.active!==false);
  const today=todayISO(),todaySt=students.filter(s=>(s.attendance||[]).includes(today));
  const sel=selId?allUsers.find(u=>u.id===selId):null;
  function handleUpd(upd){onUpdate(upd);setSelId(null);setTimeout(()=>setSelId(upd.id),10);}
  return(
    <div style={{minHeight:"100vh",background:"var(--bg)"}}>
      <div style={{background:"var(--sf)",borderBottom:"1px solid var(--br)",padding:"14px 24px",display:"flex",alignItems:"center",gap:14}}>
        <div style={{fontFamily:"var(--fd)",fontSize:22,letterSpacing:2,color:"var(--ac)"}}>ELITE TRAINER</div>
        <div style={{width:1,height:22,background:"var(--br)"}}/>
        <div><div style={{fontSize:14,fontWeight:600}}>{user.name} <span style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--mu)",marginLeft:6}}>{user.uid}</span></div>
          <div style={{fontSize:11,color:"var(--mu)"}}>Entrenador Personal · {students.length} alumnos</div>
        </div>
      </div>
      <div style={{padding:24,maxWidth:1080,margin:"0 auto"}}>
        {!sel?(
          <div className="fi">
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
              {[{l:"Alumnos asignados",v:students.length,c:"var(--ac)",i:"👥"},{l:"Atendidos hoy",v:todaySt.length,c:"var(--a2)",i:"✅"},{l:"Sin asistir hoy",v:students.length-todaySt.length,c:"var(--a3)",i:"⏳"}].map(x=>(
                <div key={x.l} style={{...T.card,display:"flex",alignItems:"center",gap:12}}>
                  <div style={{fontSize:26}}>{x.i}</div>
                  <div><div style={{fontFamily:"var(--fd)",fontSize:32,color:x.c,lineHeight:1}}>{x.v}</div><div style={{fontSize:12,color:"var(--mu)"}}>{x.l}</div></div>
                </div>
              ))}
            </div>
            {todaySt.length>0&&(
              <div style={{...T.card,marginBottom:14,border:"1px solid rgba(58,255,232,0.2)"}}>
                <div style={{fontSize:11,color:"var(--a2)",fontWeight:700,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>Hoy en el gym — {today}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {todaySt.map(s=><div key={s.id} style={{padding:"6px 14px",background:"rgba(58,255,232,0.1)",borderRadius:8,border:"1px solid rgba(58,255,232,0.2)",fontSize:13,color:"var(--a2)"}}>{s.name}</div>)}
                </div>
              </div>
            )}
            <div style={{fontFamily:"var(--fd)",fontSize:18,letterSpacing:2,color:"var(--mu)",marginBottom:12}}>MIS ALUMNOS</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:12}}>
              {students.map(s=>{
                const tm=monthCount(s.attendance||[]),last=(s.sessions||[]).slice(-1)[0];
                const att=(s.attendance||[]).includes(today),sg=suggestNext(s.sessions||[]);
                const plan=plans.find(p=>p.id===s.planId);
                return(
                  <div key={s.id} style={{...T.card,cursor:"pointer",border:`1px solid ${att?"rgba(58,255,232,0.3)":"var(--br)"}`}} onClick={()=>setSelId(s.id)}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                      <div><div style={{fontSize:15,fontWeight:700}}>{s.name}</div><div style={{fontSize:11,color:"var(--mu)"}}>{s.uid} · @{s.username}</div></div>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                        <span style={{...T.tag,background:"rgba(58,255,232,0.12)",color:"var(--a2)"}}>{plan?plan.name:"Sin plan"}</span>
                        {att&&<span style={{...T.tag,background:"rgba(58,255,138,0.2)",color:"var(--gr)"}}>✅ Hoy</span>}
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:8}}>
                      {[["Sesiones",(s.sessions||[]).length],["Este mes",tm],["Total días",(s.attendance||[]).length]].map(([k,v])=>(
                        <div key={k} style={{padding:"6px 0",textAlign:"center",background:"var(--sf2)",borderRadius:8}}>
                          <div style={{fontFamily:"var(--fm)",fontSize:18,color:"var(--ac)"}}>{v}</div>
                          <div style={{fontSize:9,color:"var(--mu)"}}>{k.toUpperCase()}</div>
                        </div>
                      ))}
                    </div>
                    {last&&<div style={{fontSize:12,color:"var(--mu)",marginBottom:3}}>Última: <span style={{color:"var(--tx)"}}>{last.date}</span></div>}
                    <div style={{fontSize:11,color:"var(--ac)",opacity:.8}}>⚡ Próxima: {sg.machines.slice(0,2).map(m=>m.name).join(" + ")}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ):sel&&(
          <div className="fi">
            <button style={{...T.bg,marginBottom:14}} onClick={()=>setSelId(null)}>← Volver</button>
            <div style={{...T.card,marginBottom:14,display:"flex",alignItems:"center",gap:12}}>
              <div style={{fontSize:24}}>👤</div>
              <div><div style={{fontSize:15,fontWeight:700}}>{sel.name} <span style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--mu)"}}>{sel.uid}</span></div>
                <div style={{fontSize:12,color:"var(--mu)"}}>Vista del entrenador · edición habilitada</div>
              </div>
            </div>
            <StudentDash user={sel} allUsers={allUsers} plans={plans} onUpdate={handleUpd} isEmbedded={true}/>
          </div>
        )}
      </div>
    </div>
  );
}

// ── ADMIN DASHBOARD ───────────────────────────────────────────────────────────
function AdminDash({users,onUpdate}){
  const[tab,setTab]=useState("users");
  const[showNew,setShowNew]=useState(false);
  const[profUser,setProfUser]=useState(null);
  const[editUser,setEditUser]=useState(null);
  const[proformaStudent,setProformaStudent]=useState(null);
  const[viewStudentId,setViewStudentId]=useState(null);
  const[plans,setPlans]=useState(DEFAULT_PLANS.map(p=>({...p})));
  const[gymInfo,setGymInfo]=useState({...DEFAULT_GYM});
  const[editingPlanId,setEditingPlanId]=useState(null);
  const[planDraft,setPlanDraft]=useState({});
  const[editingGym,setEditingGym]=useState(false);
  const[gymDraft,setGymDraft]=useState({});
  const[nu,setNu]=useState({username:"",password:"",name:"",email:"",role:"student",trainerId:"",planId:""});

  const trainers=users.filter(u=>u.role==="trainer"&&u.active!==false);
  const students=users.filter(u=>u.role==="student");
  const today=todayISO();

  function addUser(){
    if(!nu.username||!nu.password||!nu.name) return;
    const uid=newUid(),id=newId();
    const added={...nu,id,uid,active:true,sessions:[],attendance:[],profile:{}};
    let upd=[...users,added];
    if(added.role==="student"&&added.trainerId) upd=upd.map(u=>u.id===added.trainerId?{...u,assignedStudents:[...(u.assignedStudents||[]),id]}:u);
    onUpdate(upd);setShowNew(false);
    if(added.role==="student") setProfUser(added);
    setNu({username:"",password:"",name:"",email:"",role:"student",trainerId:"",planId:""});
  }

  function saveEdit(){
    if(!editUser) return;
    let upd=users.map(u=>u.id===editUser.id?editUser:u);
    // re-sync trainer assignedStudents
    upd=upd.map(u=>{
      if(u.role!=="trainer") return u;
      const mine=upd.filter(x=>x.role==="student"&&x.trainerId===u.id).map(x=>x.id);
      return{...u,assignedStudents:mine};
    });
    onUpdate(upd);setEditUser(null);
  }

  function toggleActive(id){onUpdate(users.map(u=>u.id===id?{...u,active:!u.active}:u));}
  function deleteUser(id){
    const u=users.find(x=>x.id===id);
    let upd=users.filter(x=>x.id!==id);
    if(u&&u.role==="student") upd=upd.map(x=>x.role==="trainer"?{...x,assignedStudents:(x.assignedStudents||[]).filter(s=>s!==id)}:x);
    onUpdate(upd);
  }

  function startEditPlan(p){setEditingPlanId(p.id);setPlanDraft({...p,priceNet:p.priceNet!=null?String(p.priceNet):"",sessionsPerWeek:p.sessionsPerWeek!=null?String(p.sessionsPerWeek):""});}
  function savePlan(){setPlans(p=>p.map(x=>x.id===planDraft.id?{...planDraft,priceNet:planDraft.priceNet?+planDraft.priceNet:null,sessionsPerWeek:planDraft.sessionsPerWeek?+planDraft.sessionsPerWeek:null}:x));setEditingPlanId(null);}

  // Finance
  const now=new Date();
  const financeRows=students.map(s=>{
    const plan=plans.find(p=>p.id===s.planId);
    const sessM=monthCount(s.attendance||[]);
    const net=plan&&plan.priceNet?+plan.priceNet:null;
    return{s,plan,sessM,net,iva:net?Math.round(net*.19):null,total:net?Math.round(net*1.19):null};
  });
  const totalNet=financeRows.reduce((a,x)=>a+(x.net||0),0);
  const totalBruto=Math.round(totalNet*1.19);

  const viewStudent=viewStudentId?users.find(u=>u.id===viewStudentId):null;
  const TABS=[{id:"users",l:"Usuarios",i:"👥"},{id:"view",l:"Ver Alumnos",i:"🔍"},{id:"plans",l:"Planes",i:"📋"},{id:"finance",l:"Finanzas",i:"💰"}];

  return(
    <div style={{minHeight:"100vh",background:"var(--bg)"}}>
      <div style={{background:"var(--sf)",borderBottom:"1px solid var(--br)",padding:"14px 24px",display:"flex",alignItems:"center",gap:14}}>
        <div style={{fontFamily:"var(--fd)",fontSize:22,letterSpacing:2,color:"var(--a3)"}}>ELITE TRAINER</div>
        <div style={{width:1,height:22,background:"var(--br)"}}/>
        <div style={{fontSize:14,fontWeight:600}}>Panel de Administración</div>
      </div>
      <div style={{borderBottom:"1px solid var(--br)",padding:"0 24px",display:"flex",overflowX:"auto",background:"var(--sf)"}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>{setTab(t.id);setViewStudentId(null);}} style={{background:"none",border:"none",padding:"13px 14px",fontSize:13,fontWeight:500,cursor:"pointer",whiteSpace:"nowrap",color:tab===t.id?"var(--ac)":"var(--mu)",borderBottom:`2px solid ${tab===t.id?"var(--ac)":"transparent"}`,transition:"all .2s"}}>{t.i} {t.l}</button>
        ))}
      </div>
      <div style={{padding:24,maxWidth:1100,margin:"0 auto"}} className="fi" key={tab}>

        {/* ── USERS ── */}
        {tab==="users"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:22}}>
              {[{l:"Total usuarios",v:users.length,c:"var(--ac)"},{l:"Entrenadores",v:trainers.length,c:"var(--a2)"},{l:"Alumnos",v:students.length,c:"var(--gr)"},{l:"Sesiones totales",v:students.reduce((a,s)=>a+(s.sessions||[]).length,0),c:"var(--a3)"}].map(x=>(
                <div key={x.l} style={{...T.card,textAlign:"center"}}><div style={{fontFamily:"var(--fd)",fontSize:36,color:x.c}}>{x.v}</div><div style={{fontSize:12,color:"var(--mu)"}}>{x.l}</div></div>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontFamily:"var(--fd)",fontSize:18,letterSpacing:2,color:"var(--mu)"}}>GESTIÓN DE USUARIOS</div>
              <button style={T.bp} onClick={()=>setShowNew(true)}>+ Nuevo usuario</button>
            </div>
            {showNew&&(
              <div className="fi" style={{...T.card,marginBottom:16,border:"1px solid rgba(232,255,58,0.3)"}}>
                <div style={{fontFamily:"var(--fd)",fontSize:18,letterSpacing:2,marginBottom:12}}>NUEVO USUARIO</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  {[["Nombre completo","name","text"],["Usuario","username","text"],["Contraseña","password","password"],["Email","email","email"]].map(([l,k,t])=>(
                    <div key={k}><label style={{fontSize:11,color:"var(--mu)",display:"block",marginBottom:4}}>{l.toUpperCase()}</label><input type={t} value={nu[k]||""} onChange={e=>setNu({...nu,[k]:e.target.value})} placeholder={l}/></div>
                  ))}
                  <div><label style={{fontSize:11,color:"var(--mu)",display:"block",marginBottom:4}}>ROL</label>
                    <select value={nu.role} onChange={e=>setNu({...nu,role:e.target.value,trainerId:"",planId:""})}>
                      <option value="student">Alumno</option><option value="trainer">Entrenador</option>
                    </select>
                  </div>
                  {nu.role==="student"&&<>
                    <div><label style={{fontSize:11,color:"var(--mu)",display:"block",marginBottom:4}}>ENTRENADOR</label>
                      <select value={nu.trainerId} onChange={e=>setNu({...nu,trainerId:e.target.value})}>
                        <option value="">Sin asignar</option>{trainers.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </div>
                    <div><label style={{fontSize:11,color:"var(--mu)",display:"block",marginBottom:4}}>PLAN</label>
                      <select value={nu.planId} onChange={e=>setNu({...nu,planId:e.target.value})}>
                        <option value="">Sin plan</option>{plans.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                  </>}
                </div>
                <div style={{display:"flex",gap:8,marginTop:12}}>
                  <button style={T.bg} onClick={()=>setShowNew(false)}>Cancelar</button>
                  <button style={T.bp} onClick={addUser}>Crear usuario →</button>
                </div>
              </div>
            )}
            {/* Edit modal */}
            {editUser&&(
              <div style={T.ov} onClick={e=>e.target===e.currentTarget&&setEditUser(null)}>
                <div className="fi" style={{...T.card,width:"100%",maxWidth:520,padding:28,maxHeight:"90vh",overflowY:"auto"}}>
                  <div style={{fontFamily:"var(--fd)",fontSize:22,letterSpacing:2,marginBottom:16}}>EDITAR USUARIO</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    {[["Nombre","name","text"],["Usuario","username","text"],["Contraseña","password","password"],["Email","email","email"]].map(([l,k,t])=>(
                      <div key={k}><label style={{fontSize:11,color:"var(--mu)",display:"block",marginBottom:4}}>{l.toUpperCase()}</label>
                        <input type={t} value={editUser[k]||""} onChange={e=>setEditUser({...editUser,[k]:e.target.value})} placeholder={l}/>
                      </div>
                    ))}
                    {editUser.role==="student"&&<>
                      <div><label style={{fontSize:11,color:"var(--mu)",display:"block",marginBottom:4}}>ENTRENADOR</label>
                        <select value={editUser.trainerId||""} onChange={e=>setEditUser({...editUser,trainerId:e.target.value})}>
                          <option value="">Sin asignar</option>{trainers.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                      </div>
                      <div><label style={{fontSize:11,color:"var(--mu)",display:"block",marginBottom:4}}>PLAN</label>
                        <select value={editUser.planId||""} onChange={e=>setEditUser({...editUser,planId:e.target.value})}>
                          <option value="">Sin plan</option>{plans.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </div>
                    </>}
                  </div>
                  <div style={{display:"flex",gap:8,marginTop:16}}>
                    <button style={T.bg} onClick={()=>setEditUser(null)}>Cancelar</button>
                    <button style={T.bp} onClick={saveEdit}>Guardar cambios →</button>
                  </div>
                </div>
              </div>
            )}
            <div style={T.card}>
              <div style={{overflowX:"auto"}}>
                <table style={{minWidth:900}}>
                  <thead><tr>{["ID","Nombre","Usuario","Email","Rol","Coach / Plan","Estado","Ses.","Acciones"].map(h=><th key={h}>{h}</th>)}</tr></thead>
                  <tbody>
                    {users.filter(u=>u.role!=="admin").map(u=>{
                      const isActive=u.active!==false;
                      const trainer=u.role==="student"?users.find(t=>t.id===u.trainerId):null;
                      const plan=u.role==="student"?plans.find(p=>p.id===u.planId):null;
                      return(
                        <tr key={u.id} style={{opacity:isActive?1:0.45}}>
                          <td><span style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--ac)"}}>{u.uid}</span></td>
                          <td style={{fontWeight:600}}>{u.name}</td>
                          <td style={{fontFamily:"var(--fm)",color:"var(--mu)",fontSize:12}}>@{u.username}</td>
                          <td style={{fontSize:12,color:"var(--mu)"}}>{u.email||"—"}</td>
                          <td><span style={{...T.tag,background:u.role==="trainer"?"rgba(58,255,232,0.12)":"rgba(232,255,58,0.12)",color:u.role==="trainer"?"var(--a2)":"var(--ac)"}}>{u.role==="trainer"?"Entrenador":"Alumno"}</span></td>
                          <td style={{fontSize:12,color:"var(--mu)"}}>{u.role==="trainer"?`${(u.assignedStudents||[]).length} alumnos`:`${trainer?trainer.name:"Sin coach"} · ${plan?plan.name:"Sin plan"}`}</td>
                          <td><span style={{...T.tag,background:isActive?"rgba(58,255,138,0.12)":"rgba(255,58,110,0.12)",color:isActive?"var(--gr)":"var(--a3)"}}>{isActive?"Activo":"Inactivo"}</span></td>
                          <td style={{fontFamily:"var(--fm)",color:"var(--ac)"}}>{(u.sessions||[]).length}</td>
                          <td><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                            <button style={{...T.bw,fontSize:11,padding:"4px 8px"}} onClick={()=>setEditUser({...u})}>✏️</button>
                            <button style={{...T.bg,fontSize:11,padding:"4px 8px",color:isActive?"var(--a3)":"var(--gr)",border:`1px solid ${isActive?"rgba(255,58,110,0.3)":"rgba(58,255,138,0.3)"}`}} onClick={()=>toggleActive(u.id)}>{isActive?"🔒":"🔓"}</button>
                            <button style={{...T.bd,fontSize:11,padding:"4px 8px"}} onClick={()=>{if(window.confirm(`¿Eliminar a ${u.name}?`))deleteUser(u.id);}}>🗑</button>
                          </div></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── VIEW STUDENTS ── */}
        {tab==="view"&&(
          <div>
            {!viewStudent?(
              <div>
                <div style={{fontFamily:"var(--fd)",fontSize:18,letterSpacing:2,color:"var(--mu)",marginBottom:14}}>VISTA COMPLETA DE ALUMNOS</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
                  {students.map(s=>{
                    const plan=plans.find(p=>p.id===s.planId),trainer=users.find(u=>u.id===s.trainerId);
                    const tm=monthCount(s.attendance||[]),att=(s.attendance||[]).includes(today);
                    return(
                      <div key={s.id} style={{...T.card,cursor:"pointer",border:`1px solid ${att?"rgba(58,255,232,0.3)":"var(--br)"}`}} onClick={()=>setViewStudentId(s.id)}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                          <div><div style={{fontSize:15,fontWeight:700}}>{s.name}</div><div style={{fontSize:11,color:"var(--mu)"}}>{s.uid} · @{s.username}</div></div>
                          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                            <span style={{...T.tag,background:"rgba(58,255,232,0.12)",color:"var(--a2)"}}>{plan?plan.name:"Sin plan"}</span>
                            {att&&<span style={{...T.tag,background:"rgba(58,255,138,0.2)",color:"var(--gr)"}}>✅ Hoy</span>}
                          </div>
                        </div>
                        <div style={{fontSize:12,color:"var(--mu)",marginBottom:8}}>Coach: {trainer?trainer.name:"Sin asignar"}</div>
                        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
                          {[["Sesiones",(s.sessions||[]).length],["Este mes",tm],["Total días",(s.attendance||[]).length]].map(([k,v])=>(
                            <div key={k} style={{padding:"6px 0",textAlign:"center",background:"var(--sf2)",borderRadius:8}}>
                              <div style={{fontFamily:"var(--fm)",fontSize:16,color:"var(--ac)"}}>{v}</div>
                              <div style={{fontSize:9,color:"var(--mu)"}}>{k.toUpperCase()}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ):(
              <div className="fi">
                <button style={{...T.bg,marginBottom:14}} onClick={()=>setViewStudentId(null)}>← Volver</button>
                <div style={{...T.card,marginBottom:14,display:"flex",alignItems:"center",gap:12,border:"1px solid rgba(255,154,58,0.3)"}}>
                  <div style={{fontSize:24}}>🛡️</div>
                  <div><div style={{fontSize:15,fontWeight:700}}>{viewStudent.name} <span style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--mu)"}}>{viewStudent.uid}</span></div>
                    <div style={{fontSize:12,color:"var(--or)"}}>Vista Administrador — acceso completo</div>
                  </div>
                </div>
                <StudentDash user={viewStudent} allUsers={users} plans={plans} onUpdate={u=>{onUpdate(users.map(x=>x.id===u.id?u:x));setViewStudentId(null);setTimeout(()=>setViewStudentId(u.id),10);}} isEmbedded={true}/>
              </div>
            )}
          </div>
        )}

        {/* ── PLANS ── */}
        {tab==="plans"&&(
          <div>
            <div style={{fontFamily:"var(--fd)",fontSize:18,letterSpacing:2,color:"var(--mu)",marginBottom:16}}>CONFIGURACIÓN DE PLANES</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14,marginBottom:28}}>
              {plans.map(p=>(
                <div key={p.id} style={{...T.card,border:editingPlanId===p.id?"1px solid var(--ac)":"1px solid var(--br)"}}>
                  {editingPlanId===p.id?(
                    <div>
                      <div style={{marginBottom:8}}><label style={{fontSize:11,color:"var(--mu)",display:"block",marginBottom:4}}>NOMBRE</label><input value={planDraft.name||""} onChange={e=>setPlanDraft({...planDraft,name:e.target.value})}/></div>
                      <div style={{marginBottom:8}}><label style={{fontSize:11,color:"var(--mu)",display:"block",marginBottom:4}}>SESIONES POR SEMANA</label><input type="number" value={planDraft.sessionsPerWeek||""} placeholder="Ej: 3" onChange={e=>setPlanDraft({...planDraft,sessionsPerWeek:e.target.value})}/></div>
                      <div style={{marginBottom:12}}><label style={{fontSize:11,color:"var(--mu)",display:"block",marginBottom:4}}>PRECIO NETO (CLP)</label><input type="number" value={planDraft.priceNet||""} placeholder="Ej: 49000" onChange={e=>setPlanDraft({...planDraft,priceNet:e.target.value})}/></div>
                      <div style={{display:"flex",gap:6}}>
                        <button style={{...T.bp,fontSize:12,padding:"7px 14px"}} onClick={savePlan}>✓ Guardar</button>
                        <button style={{...T.bg,fontSize:12}} onClick={()=>setEditingPlanId(null)}>Cancelar</button>
                      </div>
                    </div>
                  ):(
                    <div>
                      <div style={{fontSize:11,color:"var(--mu)",marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>{p.id}</div>
                      <div style={{fontSize:16,fontWeight:700,marginBottom:6}}>{p.name}</div>
                      <div style={{fontFamily:"var(--fm)",fontSize:26,color:"var(--ac)",marginBottom:4}}>{p.priceNet?fmtCLP(p.priceNet):"A convenir"}</div>
                      <div style={{fontSize:12,color:"var(--mu)",marginBottom:12}}>{p.sessionsPerWeek?`${p.sessionsPerWeek} sesiones/semana`:"Flexible"}</div>
                      <div style={{fontSize:12,color:"var(--mu)",marginBottom:12}}>Con IVA: <strong style={{color:"var(--tx)"}}>{p.priceNet?fmtCLP(Math.round(p.priceNet*1.19)):"—"}</strong></div>
                      <div style={{fontSize:11,color:"var(--mu)",marginBottom:12}}>Alumnos: <strong style={{color:"var(--a2)"}}>{students.filter(s=>s.planId===p.id).length}</strong></div>
                      <button style={{...T.bw,fontSize:12,padding:"6px 14px"}} onClick={()=>startEditPlan(p)}>✏️ Editar plan</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Gym info */}
            <div style={{fontFamily:"var(--fd)",fontSize:18,letterSpacing:2,color:"var(--mu)",marginBottom:14}}>DATOS DEL GYM (PROFORMA)</div>
            <div style={T.card}>
              {editingGym?(
                <div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                    {[["Nombre del gym","name"],["RUT","rut"],["Dirección","address"],["Teléfono","phone"],["Email","email"],["Banco","bank"],["Tipo de cuenta","accountType"],["N° de cuenta","accountNumber"],["Titular cuenta","accountHolder"],["RUT titular","accountRut"]].map(([l,k])=>(
                      <div key={k}><label style={{fontSize:11,color:"var(--mu)",display:"block",marginBottom:4}}>{l.toUpperCase()}</label><input value={gymDraft[k]||""} onChange={e=>setGymDraft({...gymDraft,[k]:e.target.value})}/></div>
                    ))}
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button style={T.bg} onClick={()=>setEditingGym(false)}>Cancelar</button>
                    <button style={T.bp} onClick={()=>{setGymInfo({...gymDraft});setEditingGym(false);}}>Guardar →</button>
                  </div>
                </div>
              ):(
                <div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
                    {[["Nombre",gymInfo.name],["RUT",gymInfo.rut],["Dirección",gymInfo.address],["Teléfono",gymInfo.phone],["Email",gymInfo.email],["Banco",gymInfo.bank],["Tipo cuenta",gymInfo.accountType],["N° cuenta",gymInfo.accountNumber],["Titular",gymInfo.accountHolder],["RUT titular",gymInfo.accountRut]].map(([k,v])=>(
                      <div key={k} style={{padding:"8px 12px",background:"var(--sf2)",borderRadius:8}}><div style={{fontSize:10,color:"var(--mu)",marginBottom:2}}>{k.toUpperCase()}</div><div style={{fontSize:13,fontWeight:600}}>{v}</div></div>
                    ))}
                  </div>
                  <button style={{...T.bw,fontSize:12}} onClick={()=>{setGymDraft({...gymInfo});setEditingGym(true);}}>✏️ Editar datos del gym</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── FINANCE ── */}
        {tab==="finance"&&(
          <div>
            <div style={{fontFamily:"var(--fd)",fontSize:18,letterSpacing:2,color:"var(--mu)",marginBottom:16}}>RESUMEN FINANCIERO — {MONTHS[now.getMonth()]} {now.getFullYear()}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:22}}>
              {[{l:"Ingresos netos",v:fmtCLP(totalNet),c:"var(--ac)",i:"💵"},{l:"IVA total (19%)",v:fmtCLP(Math.round(totalNet*.19)),c:"var(--or)",i:"📋"},{l:"Total bruto",v:fmtCLP(totalBruto),c:"var(--gr)",i:"🏦"}].map(x=>(
                <div key={x.l} style={{...T.card,display:"flex",alignItems:"center",gap:12,border:`1px solid ${x.c}33`}}>
                  <div style={{fontSize:28}}>{x.i}</div>
                  <div><div style={{fontFamily:"var(--fd)",fontSize:22,color:x.c,lineHeight:1}}>{x.v}</div><div style={{fontSize:12,color:"var(--mu)"}}>{x.l}</div></div>
                </div>
              ))}
            </div>
            <div style={T.card}>
              <div style={{overflowX:"auto"}}>
                <table style={{minWidth:800}}>
                  <thead><tr>{["ID","Alumno","Entrenador","Plan","Ses/sem","Asistencias mes","Neto","IVA","Total","Proforma"].map(h=><th key={h}>{h}</th>)}</tr></thead>
                  <tbody>
                    {financeRows.map(({s,plan,sessM,net,iva,total})=>{
                      const trainer=users.find(u=>u.id===s.trainerId);
                      return(
                        <tr key={s.id}>
                          <td><span style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--ac)"}}>{s.uid}</span></td>
                          <td style={{fontWeight:600}}>{s.name}</td>
                          <td style={{fontSize:12,color:"var(--mu)"}}>{trainer?trainer.name:"—"}</td>
                          <td style={{fontSize:12}}>{plan?plan.name:<span style={{color:"var(--mu)"}}>Sin plan</span>}</td>
                          <td style={{textAlign:"center",fontFamily:"var(--fm)"}}>{plan&&plan.sessionsPerWeek?`${plan.sessionsPerWeek}x`:"—"}</td>
                          <td style={{textAlign:"center",fontFamily:"var(--fm)",color:"var(--a2)"}}>{sessM}</td>
                          <td style={{fontFamily:"var(--fm)",color:"var(--ac)"}}>{net?fmtCLP(net):"—"}</td>
                          <td style={{fontFamily:"var(--fm)",color:"var(--or)"}}>{iva?fmtCLP(iva):"—"}</td>
                          <td style={{fontFamily:"var(--fm)",color:"var(--gr)",fontWeight:700}}>{total?fmtCLP(total):"—"}</td>
                          <td><button style={{...T.bp,fontSize:11,padding:"5px 10px"}} onClick={()=>setProformaStudent(s)}>📄 Emitir</button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
      {profUser&&<ProfileSetup userName={profUser.name} onSave={p=>{if(p)onUpdate(users.map(u=>u.id===profUser.id?{...u,profile:p}:u));setProfUser(null);}}/>}
      {proformaStudent&&<ProformaModal student={proformaStudent} allUsers={users} plans={plans} gymInfo={gymInfo} onClose={()=>setProformaStudent(null)}/>}
    </div>
  );
}

// ── LOGIN ──────────────────────────────────────────────────────────────────────
function Login({users,onLogin}){
  const[username,setUsername]=useState("");
  const[password,setPassword]=useState("");
  const[error,setError]=useState("");
  function handle(){
    const u=users.find(u=>u.username===username&&u.password===password&&u.active!==false);
    if(u)onLogin(u);else setError("Usuario o contraseña incorrectos");
  }
  return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--bg)",backgroundImage:"radial-gradient(ellipse at 20% 50%, rgba(232,255,58,0.05) 0%, transparent 60%)"}}>
      <div className="fi" style={{width:380,padding:"0 20px"}}>
        <div style={{textAlign:"center",marginBottom:38}}>
          <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:64,height:64,borderRadius:16,background:"var(--ac)",marginBottom:12}}><span style={{fontSize:32}}>⚡</span></div>
          <div style={{fontFamily:"var(--fd)",fontSize:36,letterSpacing:3}}>ELITE TRAINER</div>
          <div style={{fontSize:13,color:"var(--mu)",marginTop:4}}>Sistema de entrenamiento inteligente</div>
        </div>
        <div style={{...T.card,padding:30}}>
          <div style={{marginBottom:14}}><label style={{fontSize:11,color:"var(--mu)",display:"block",marginBottom:5}}>USUARIO</label><input value={username} onChange={e=>setUsername(e.target.value)} placeholder="tu_usuario" onKeyDown={e=>e.key==="Enter"&&handle()}/></div>
          <div style={{marginBottom:16}}><label style={{fontSize:11,color:"var(--mu)",display:"block",marginBottom:5}}>CONTRASEÑA</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&handle()}/></div>
          {error&&<div style={{color:"var(--a3)",fontSize:13,marginBottom:12,background:"rgba(255,58,110,0.1)",padding:"8px 12px",borderRadius:8}}>{error}</div>}
          <button style={{...T.bp,width:"100%",padding:12}} onClick={handle}>Ingresar →</button>
        </div>
        <div style={{marginTop:14,padding:12,background:"var(--sf)",borderRadius:8,border:"1px solid var(--br)"}}>
          <div style={{fontSize:11,color:"var(--mu)",marginBottom:6,fontWeight:600}}>USUARIOS DEMO</div>
          {[["admin","admin123","Admin"],["coach_pablo","coach123","Entrenador"],["ana_torres","ana123","Alumno"],["carlos_v","carlos123","Alumno"]].map(([u,p,r])=>(
            <div key={u} style={{fontSize:11,color:"var(--mu)",marginBottom:3}}>
              <span style={{color:"var(--ac)",fontFamily:"var(--fm)"}}>{u}</span> / {p} <span style={{background:"var(--br)",padding:"1px 6px",borderRadius:4}}>{r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── APP ROOT ───────────────────────────────────────────────────────────────────
export default function App(){
  const[users,setUsers]=useState(INIT_USERS);
  const[currentUser,setCurrentUser]=useState(null);
  function updateUser(updated){
    setUsers(prev=>prev.map(u=>u.id===updated.id?updated:u));
    if(currentUser&&currentUser.id===updated.id)setCurrentUser(updated);
  }
  function updateUsers(newUsers){setUsers(newUsers);}
  const synced=currentUser?users.find(u=>u.id===currentUser.id)||currentUser:null;
  if(!synced) return(<><GS/><Login users={users} onLogin={u=>setCurrentUser(u)}/></>);
  return(
    <>
      <GS/>
      <div style={{position:"fixed",top:10,right:16,zIndex:400}} className="no-print">
        <button style={{...T.bg,fontSize:12}} onClick={()=>setCurrentUser(null)}>Cerrar sesión</button>
      </div>
      {synced.role==="admin"&&<AdminDash users={users} onUpdate={updateUsers}/>}
      {synced.role==="trainer"&&<TrainerDash user={synced} allUsers={users} plans={DEFAULT_PLANS} onUpdate={updateUser}/>}
      {synced.role==="student"&&<StudentDash user={synced} allUsers={users} plans={DEFAULT_PLANS} onUpdate={updateUser} isEmbedded={false}/>}
    </>
  );
}
