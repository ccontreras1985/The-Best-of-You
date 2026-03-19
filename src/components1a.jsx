import { useState } from "react";
import { db } from "./supabase.js";

import { useState } from "react";
import { db } from "./supabase.js";
export const GS = () => (
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
export const T = {
  bp:{background:"var(--ac)",color:"#0a0a0b",border:"none",padding:"10px 20px",borderRadius:8,fontWeight:600,fontSize:14},
  bg:{background:"transparent",color:"var(--mu)",border:"1px solid var(--br)",padding:"8px 16px",borderRadius:8,fontSize:13},
  bd:{background:"rgba(255,58,110,0.12)",color:"var(--a3)",border:"1px solid rgba(255,58,110,0.3)",padding:"5px 10px",borderRadius:6,fontSize:12},
  bw:{background:"rgba(255,154,58,0.12)",color:"var(--or)",border:"1px solid rgba(255,154,58,0.3)",padding:"5px 10px",borderRadius:6,fontSize:12},
  card:{background:"var(--sf)",border:"1px solid var(--br)",borderRadius:12,padding:20},
  tag:{display:"inline-block",padding:"3px 9px",borderRadius:20,fontSize:11,fontWeight:600,letterSpacing:".4px",textTransform:"uppercase"},
  ov:{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,padding:16},
};
export const MACHINES = [
  {id:"squat_rack",name:"Squat Rack",muscles:["Cuádriceps","Glúteos","Isquiotibiales"],emoji:"UP",color:"#e8ff3a",group:"Piernas"},
  {id:"smith_machine",name:"Smith Machine",muscles:["Pecho","Hombros","Cuádriceps"],emoji:"*",color:"#3affe8",group:"Multiarticular"},
  {id:"functional_trainer",name:"Functional Trainer (ILUS)",muscles:["Pecho","Espalda","Hombros","Brazos","Core"],emoji:"<>",color:"#ff9a3a",group:"Funcional"},
  {id:"leg_press",name:"Prensa de Piernas",muscles:["Cuádriceps","Glúteos","Isquiotibiales"],emoji:">",color:"#e8ff3a",group:"Piernas"},
  {id:"leg_curl",name:"Leg Curl (ILUS)",muscles:["Isquiotibiales","Gastrocnemios"],emoji:">",color:"#ff3a6e",group:"Piernas"},
  {id:"leg_extension",name:"Leg Extension",muscles:["Cuádriceps"],emoji:">",color:"#e8ff3a",group:"Piernas"},
  {id:"hip_abduction",name:"Abducción/Aducción",muscles:["Glúteo medio","Aductores","Sartorio"],emoji:"o",color:"#ff3aaa",group:"Piernas"},
  {id:"cable_cross",name:"Freemotion Cable Cross",muscles:["Pecho","Hombros","Brazos"],emoji:"R",color:"#3affe8",group:"Funcional"},
  {id:"lat_pulldown",name:"Polea Alta",muscles:["Dorsal","Bíceps","Romboides"],emoji:"v",color:"#3affe8",group:"Espalda"},
  {id:"seated_row",name:"Remo Sentado",muscles:["Dorsal","Trapecio","Bíceps"],emoji:"~",color:"#3affe8",group:"Espalda"},
  {id:"hip_thrust_machine",name:"Hip Thrust (máquina)",muscles:["Glúteos","Isquiotibiales"],emoji:"o",color:"#ff3aaa",group:"Piernas"},
  {id:"incline_press",name:"Press Inclinado",muscles:["Pecho superior","Hombros","Tríceps"],emoji:"+",color:"#ff9a3a",group:"Pecho"},
  {id:"dips",name:"Fondos / Dips",muscles:["Tríceps","Pecho","Hombros"],emoji:"\",color:"#ff3a6e",group:"Pecho"},
  {id:"pull_up_bar",name:"Barra de Dominadas",muscles:["Dorsal","Bíceps","Core"],emoji:"^",color:"#3affe8",group:"Espalda"},
  {id:"barbell_deadlift",name:"Peso Muerto Barra",muscles:["Isquiotibiales","Glúteos","Espalda baja"],emoji:"UP",color:"#e8ff3a",group:"Piernas"},
];
export const MACHINE_GROUPS = {
  "Piernas":     ["squat_rack","leg_press","leg_curl","leg_extension","hip_abduction","hip_thrust_machine","barbell_deadlift"],
  "Pecho":       ["incline_press","dips","cable_cross"],
  "Espalda":     ["lat_pulldown","seated_row","pull_up_bar"],
  "Multiarticular/Funcional": ["smith_machine","functional_trainer"],
};
export const GROUP_ICONS = {"Piernas":">","Pecho":"+","Espalda":"UP","Multiarticular/Funcional":"<>"};
export const GC={Piernas:"#e8ff3a",Pecho:"#ff9a3a",Espalda:"#3affe8",Hombros:"#ff3a6e",Brazos:"#c03aff",Core:"#3aff8a",Funcional:"#ff3aaa",Multiarticular:"#aaffdd"};
export const MONTHS=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
export const DEFAULT_PLANS = [
  {id:"p1",name:"Plan Básico 2x",sessionsPerWeek:2,priceNet:35000},
  {id:"p2",name:"Plan Estándar 3x",sessionsPerWeek:3,priceNet:49000},
  {id:"p3",name:"Plan Avanzado 4x",sessionsPerWeek:4,priceNet:62000},
  {id:"p4",name:"Plan Elite 5x",sessionsPerWeek:5,priceNet:74000},
  {id:"p5",name:"Plan Personalizado",sessionsPerWeek:null,priceNet:null},
];
export const DEFAULT_GYM = {
  name:"Elite Trainer Gym",rut:"76.543.210-K",address:"Av. Principal 1234, San Pedro de la Paz",
  phone:"+56 9 1234 5678",email:"contacto@elitetrainer.cl",bank:"Banco Estado",
  accountType:"Cuenta Corriente",accountNumber:"123-456789-01",accountHolder:"Elite Trainer SpA",accountRut:"76.543.210-K",
};
export const INIT_USERS = [
  {id:"admin1",uid:"ET-001",role:"admin",name:"Administrador",username:"admin",password:"admin123",email:"admin@elitetrainer.cl",active:true},
  {id:"trainer1",uid:"ET-002",role:"trainer",name:"Pablo Ramírez",username:"coach_pablo",password:"coach123",email:"pablo@elitetrainer.cl",active:true,assignedStudents:["student1","student2"],sessionRate:5000},
  {id:"student1",uid:"ET-003",role:"student",name:"Ana Torres",username:"ana_torres",
    password:"ana123",email:"ana@gmail.com",active:true,trainerId:"trainer1",planId:"p2",
    profile:{height:165,weight:62,age:28,gender:"female",goal:"Hipertrofia",activityLevel:"moderado",restrictions:""},
    attendance:["2026-02-10","2026-02-13","2026-02-17","2026-03-03"],
    sessions:[
      {id:"s1",date:"2026-02-10",exercises:[{id:"e1",machineId:"squat_rack",sets:4,reps:10,weight:60},{id:"e2",machineId:"leg_press",sets:3,reps:12,weight:120}]},
      {id:"s2",date:"2026-02-13",exercises:[{id:"e4",machineId:"incline_press",sets:4,reps:10,weight:45},{id:"e5",machineId:"cable_cross",sets:3,reps:12,weight:20}]},
      {id:"s3",date:"2026-03-03",exercises:[{id:"e7",machineId:"lat_pulldown",sets:4,reps:10,weight:55},{id:"e8",machineId:"seated_row",sets:3,reps:12,weight:50}]},
    ]},
  {id:"student2",uid:"ET-004",role:"student",name:"Carlos Vásquez",username:"carlos_v",
    password:"carlos123",email:"carlos@gmail.com",active:true,trainerId:"trainer1",planId:"p4",
    profile:{height:178,weight:80,age:32,gender:"male",goal:"Fuerza",activityLevel:"activo",restrictions:"Dolor lumbar leve"},
    attendance:["2026-02-12","2026-02-15","2026-03-01"],
    sessions:[
      {id:"s1",date:"2026-02-12",exercises:[{id:"e1",machineId:"squat_rack",sets:5,reps:5,weight:100},{id:"e2",machineId:"barbell_deadlift",sets:4,reps:5,weight:120}]},
      {id:"s2",date:"2026-03-01",exercises:[{id:"e3",machineId:"incline_press",sets:5,reps:5,weight:70},{id:"e4",machineId:"dips",sets:3,reps:8,weight:20}]},
    ]},
];
let _uidCount = 4;
export const newUid = () => "ET-"+(String(++_uidCount).padStart(3,"0"))+"";
export const newId  = () => "u_"+(Date.now())+"";
export const getMachine = id => MACHINES.find(m => m.id === id);
export function sessionMuscles(sess){
  const set=new Set();
  sess.exercises.forEach(ex=>{const m=getMachine(ex.machineId);if(m)m.muscles.forEach(mu=>set.add(mu));});
  return [...set];
}
export function sessionGroups(sess){
  const set=new Set();
  sess.exercises.forEach(ex=>{const m=getMachine(ex.machineId);if(m)set.add(m.group);});
  return [...set];
}
export function suggestNext(sessions){
  if(!sessions||!sessions.length) return{machines:MACHINES.slice(0,4),reason:"Primera sesión - comenzamos con lo básico"};
  const last=sessionGroups(sessions[sessions.length-1]);
  const all=[...new Set(MACHINES.map(m=>m.group))];
  const next=all.filter(g=>!last.includes(g)).slice(0,2);
  return{machines:MACHINES.filter(m=>next.includes(m.group)).slice(0,4),reason:"Última: "+(last.join(", "))+" . Siguiente: ${next.join(", ")}"};
}
export function calcNut(p){
  if(!p||!p.height||!p.weight||!p.age) return null;
  const h=+p.height,w=+p.weight,a=+p.age;
  let bmr=p.gender==="male"?88.362+13.397*w+4.799*h-5.677*a:p.gender==="female"?447.593+9.247*w+3.098*h-4.330*a:550+11*w+4*h-5*a;
  const mult={sedentario:1.2,ligero:1.375,moderado:1.55,activo:1.725,"muy activo":1.9}[p.activityLevel]||1.55;
  const adj={"Pérdida de peso":-400,"Definición":-200,"Mantenimiento":0,"Hipertrofia":300,"Fuerza":200,"Rendimiento":150}[p.goal]||0;
  const cal=Math.round(bmr*mult+adj),prot=Math.round((p.goal==="Fuerza"||p.goal==="Hipertrofia")?w*2.2:w*1.8);
  const fat=Math.round(cal*0.25/9),carbs=Math.round((cal-prot*4-fat*9)/4);
  return{calories:cal,protein:prot,carbs,fat};
}
export function weightHist(sessions,mid){
  return sessions.filter(s=>s.exercises.some(e=>e.machineId===mid))
    .map(s=>{const ex=s.exercises.find(e=>e.machineId===mid);return{date:s.date,weight:ex.weight,sets:ex.sets,reps:ex.reps};})
    .sort((a,b)=>a.date.localeCompare(b.date));
}
export function monthCount(att){
  const n=new Date(),ym=""+(n.getFullYear())+"-${String(n.getMonth()+1).padStart(2,"0")}";
  return(att||[]).filter(d=>d.startsWith(ym)).length;
}
export function todayISO(){return new Date().toISOString().slice(0,10);}
export function fmtCLP(n){return n!=null?"$"+n.toLocaleString("es-CL"):"-";}
export function gLbl(g){return{male:"Masculino",female:"Femenino",other:"Prefiero no decir"}[g]||g||"-";}
export function MachineSelect({value, onChange}) {
  return (
    <select value={value} onChange={e=>onChange(e.target.value)}>
      {Object.entries(MACHINE_GROUPS).map(([grp, ids])=>(
        <optgroup key={grp} label={""+(GROUP_ICONS[grp]||"")+" ${grp}"}>
          {ids.map(id=>{const m=MACHINES.find(x=>x.id===id);return m?<option key={id} value={id}>{m.emoji} {m.name}</option>:null;})}
        </optgroup>
      ))}
    </select>
  );
}
export function MiniLine({data,color="#e8ff3a"}){
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
export function MuscleRadar({sessions}){
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
              <div style={{height:"100%",width:((v/mx)*100)+"%",background:GC[g]||"var(--ac)",borderRadius:3}}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export function AttCal({attendance}){
  const now=new Date(),y=now.getFullYear(),mo=now.getMonth();
  const dim=new Date(y,mo+1,0).getDate(),fd=new Date(y,mo,1).getDay(),attSet=new Set(attendance);
  const cells=[];
  for(let i=0;i<fd;i++)cells.push(null);
  for(let d=1;d<=dim;d++){const ds=""+(y)+"-${String(mo+1).padStart(2,"0")}-${String(d).padStart(2,"0")}";cells.push({day:d,att:attSet.has(ds),today:d===now.getDate()});}
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
export function ProfileSetup({userName,onSave}){
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
              <option value="">Seleccionar?</option>
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
          <input value={f.restrictions} onChange={set("restrictions")} placeholder="Ej: dolor lumbar, rodilla?"/>
        </div>
        <button style={{...T.bp,width:"100%",marginTop:20,padding:14,opacity:ok?1:0.4,cursor:ok?"pointer":"not-allowed"}} onClick={()=>ok&&onSave(f)}>Guardar y continuar &rarr;</button>
        <button style={{...T.bg,width:"100%",marginTop:8}} onClick={()=>onSave(null)}>Completar más tarde</button>
      </div>
    </div>
  );
}
export function SessionModal({session,onClose,onSave,canEdit}){
  const[exs,setExs]=useState(session.exercises.map(e=>({...e})));
  const[adding,setAdding]=useState(false);
  const[newEx,setNewEx]=useState({machineId:MACHINES[0].id,sets:3,reps:10,weight:""});
  const[editId,setEditId]=useState(null);
  const[editD,setEditD]=useState({});
  const startEdit=ex=>{setEditId(ex.id);setEditD({...ex});};
  const saveEdit=()=>{setExs(p=>p.map(e=>e.id===editId?{...editD}:e));setEditId(null);};
  const delEx=id=>setExs(p=>p.filter(e=>e.id!==id));
  const addEx=()=>{setExs(p=>[...p,{...newEx,id:"e_"+(Date.now())+"",sets:+newEx.sets,reps:+newEx.reps,weight:+newEx.weight}]);setAdding(false);setNewEx({machineId:MACHINES[0].id,sets:3,reps:10,weight:""});};
  return(
    <div style={T.ov} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="fi" style={{...T.card,width:"100%",maxWidth:560,padding:28,maxHeight:"92vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div><div style={{fontFamily:"var(--fd)",fontSize:24,letterSpacing:2}}>SESIÓN</div>
            <div style={{fontSize:13,color:"var(--mu)"}}>{session.date} . {exs.length} ejercicios</div>
          </div>
          <button style={T.bg} onClick={onClose}>X</button>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:14}}>
          {sessionMuscles({exercises:exs}).map(m=><span key={m} style={{...T.tag,background:"rgba(232,255,58,0.1)",color:"var(--ac)"}}>{m}</span>)}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
          {exs.map(ex=>{
            const mc=getMachine(ex.machineId);
            if(editId===ex.id) return(
              <div key={ex.id} style={{padding:12,background:"var(--sf2)",borderRadius:10,border:"1px solid var(--ac)"}}>
                <div style={{marginBottom:8}}><MachineSelect value={editD.machineId} onChange={v=>setEditD({...editD,machineId:v})}/></div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                  {[["Series","sets"],["Reps","reps"],["Peso kg","weight"]].map(([l,k])=>(
                    <div key={k}><label style={{fontSize:10,color:"var(--mu)",display:"block",marginBottom:3}}>{l}</label>
                      <input type="number" value={editD[k]} step={k==="weight"?"2.5":"1"} onChange={e=>setEditD({...editD,[k]:parseFloat(e.target.value)||0})} style={{padding:"6px 10px",fontSize:13}}/>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:6,marginTop:10}}>
                  <button style={{...T.bp,fontSize:12,padding:"6px 14px"}} onClick={saveEdit}>OK Guardar</button>
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
                  <button style={{background:"var(--br)",border:"none",borderRadius:6,padding:"4px 8px",color:"var(--tx)",fontSize:12}} onClick={()=>startEdit(ex)}>e</button>
                  <button style={T.bd} onClick={()=>delEx(ex.id)}>X</button>
                </div>}
              </div>
            );
          })}
        </div>
        {canEdit&&!adding&&<button style={{width:"100%",padding:10,background:"var(--sf2)",border:"1px dashed var(--br)",borderRadius:10,color:"var(--mu)",fontSize:13}} onClick={()=>setAdding(true)}>+ Agregar ejercicio</button>}
        {adding&&(
          <div className="fi" style={{...T.card,marginTop:8,border:"1px solid rgba(232,255,58,0.3)"}}>
            <div style={{marginBottom:8}}><label style={{fontSize:11,color:"var(--mu)",display:"block",marginBottom:4}}>MÁQUINA</label>
              <MachineSelect value={newEx.machineId} onChange={v=>setNewEx({...newEx,machineId:v})}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
              {[["Series","sets","1"],["Reps","reps","1"],["Peso kg","weight","2.5"]].map(([l,k,st])=>(
                <div key={k}><label style={{fontSize:10,color:"var(--mu)",display:"block",marginBottom:3}}>{l}</label>
                  <input type="number" value={newEx[k]} step={st} placeholder={k==="weight"?"kg":""} onChange={e=>setNewEx({...newEx,[k]:k==="weight"?e.target.value:parseFloat(e.target.value)||0})} style={{padding:"6px 10px",fontSize:13}}/>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:6}}>
              <button style={{...T.bp,fontSize:12,padding:"7px 16px"}} onClick={addEx}>Agregar</button>
              <button style={{...T.bg,fontSize:12}} onClick={()=>setAdding(false)}>Cancelar</button>
            </div>
          </div>
        )}
        {canEdit&&<button style={{...T.bp,width:"100%",marginTop:14,padding:12}} onClick={()=>onSave(exs)}>Guardar cambios &rarr;</button>}
      </div>
    </div>
  );
}
