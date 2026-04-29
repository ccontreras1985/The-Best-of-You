export * from "./components1a.jsx";
import { useState, useEffect } from "react";
import { db } from "./supabase.js";
import { T, MACHINES, getMachine, sessionGroups, sessionMuscles, calcNut, weightHist, monthCount, todayISO, GC, fmtCLP, MONTHS, suggestNext, AttCal, MuscleRadar, MiniLine, SessionModal, MachineSelect, calcSessionStats, getSessionPRs, QRCard, gLbl } from "./components1a.jsx";

export function SessionsTab({user,onUpdateUser,canEdit,canDeleteEx,allUsers=[]}){
  const[viewId,setViewId]=useState(null);
  const[newOpen,setNewOpen]=useState(false);
  const[newDate,setNewDate]=useState(todayISO());
  const[tplOpen,setTplOpen]=useState(false);
  const sessions=user.sessions||[];
  const trainer=allUsers.find(u=>u.id===user.trainerId);
  const templates=(trainer&&trainer.templates)||[];
  function save(sid,exs){onUpdateUser({...user,sessions:sessions.map(s=>s.id===sid?{...s,exercises:exs}:s)});setViewId(null);}
  function del(id){const s=sessions.find(x=>x.id===id);onUpdateUser({...user,sessions:sessions.filter(x=>x.id!==id),attendance:(user.attendance||[]).filter(d=>d!==(s?s.date:""))});}
  function create(){const ns={id:"s_"+(Date.now())+"",date:newDate,exercises:[]};const na=(user.attendance||[]).includes(newDate)?user.attendance:[...(user.attendance||[]),newDate];onUpdateUser({...user,sessions:[...sessions,ns],attendance:na});setNewOpen(false);setViewId(ns.id);}
  function createFromTemplate(tpl){const today=todayISO();const ns={id:"s_"+(Date.now()),date:today,exercises:tpl.exercises.map((ex,i)=>({...ex,id:"e_"+(Date.now())+"_"+i,weight:""}))};const na=(user.attendance||[]).includes(today)?user.attendance:[...(user.attendance||[]),today];onUpdateUser({...user,sessions:[...sessions,ns],attendance:na});setTplOpen(false);setViewId(ns.id);}
  const viewSess=viewId?sessions.find(s=>s.id===viewId):null;
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
        <div style={{fontSize:14,fontWeight:600}}>{sessions.length} sesiones registradas</div>
        <div style={{display:"flex",gap:8}}>
          {canEdit&&templates.length>0&&<button style={{...T.bg,fontSize:13}} onClick={()=>setTplOpen(p=>!p)}>* Usar plantilla</button>}
          {canEdit&&<button style={{...T.bp,fontSize:13}} onClick={()=>setNewOpen(true)}>+ Nueva sesión</button>}
        </div>
      </div>
      {tplOpen&&templates.length>0&&(
        <div style={{...T.card,marginBottom:14,border:"1px solid rgba(58,255,232,0.3)"}}>
          <div style={{fontSize:11,color:"var(--a2)",fontWeight:700,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>Elegir plantilla del coach</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {templates.map(t=>(
              <div key={t.id} style={{padding:12,background:"var(--sf2)",borderRadius:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:13,fontWeight:600}}>{t.name}</div>
                  <div style={{fontSize:11,color:"var(--mu)"}}>{t.exercises.length} ejercicios: {t.exercises.slice(0,3).map(ex=>{const m=getMachine(ex.machineId);return m?m.name:ex.machineId;}).join(", ")}{t.exercises.length>3?"...":""}</div>
                </div>
                <button style={{...T.bp,fontSize:12,padding:"6px 14px"}} onClick={()=>createFromTemplate(t)}>Usar hoy &rarr;</button>
              </div>
            ))}
          </div>
          <button style={{...T.bg,fontSize:12,marginTop:8}} onClick={()=>setTplOpen(false)}>Cerrar</button>
        </div>
      )}
      {newOpen&&(
        <div className="fi" style={{...T.card,marginBottom:14,border:"1px solid rgba(232,255,58,0.3)"}}>
          <div style={{fontFamily:"var(--fd)",fontSize:18,letterSpacing:2,marginBottom:10}}>NUEVA SESIÓN</div>
          <div style={{marginBottom:10}}><label style={{fontSize:11,color:"var(--mu)",display:"block",marginBottom:5}}>FECHA</label>
            <input type="date" value={newDate} onChange={e=>setNewDate(e.target.value)} style={{maxWidth:200}}/>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button style={T.bg} onClick={()=>setNewOpen(false)}>Cancelar</button>
            <button style={T.bp} onClick={create}>Crear y agregar ejercicios &rarr;</button>
          </div>
        </div>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {sessions.length===0&&<div style={{textAlign:"center",padding:60,color:"var(--mu)"}}>Sin sesiones.{canEdit&&<span style={{color:"var(--ac)",cursor:"pointer"}} onClick={()=>setNewOpen(true)}> + Crear primera sesión</span>}</div>}
        {[...sessions].reverse().map(s=>{
          const groups=sessionGroups(s);
          const stats=calcSessionStats(s);
          const prs=getSessionPRs(s,sessions);
          return(
            <div key={s.id} style={{padding:16,background:"var(--sf)",border:"1px solid "+(prs.size>0?"rgba(232,255,58,0.35)":"var(--br)"),borderRadius:12,cursor:"pointer"}} onClick={()=>setViewId(s.id)}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                  <span style={{fontFamily:"var(--fm)",fontSize:13,color:"var(--ac)"}}>{s.date}</span>
                  <span style={{fontSize:12,color:"var(--mu)"}}>{s.exercises.length} ejercicios</span>
                  {stats.tonnage>0&&<span style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--or)"}}>{stats.tonnage.toLocaleString("es-CL")} kg vol.</span>}
                  {prs.size>0&&<span style={{...T.tag,background:"rgba(232,255,58,0.15)",color:"var(--ac)",fontSize:10}}>★ {prs.size} PR</span>}
                </div>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  {canEdit&&<button style={{...T.bd,fontSize:11,padding:"4px 8px"}} onClick={e=>{e.stopPropagation();del(s.id);}}>X</button>}
                  <span style={{fontSize:12,color:"var(--mu)"}}>Ver &rarr;</span>
                </div>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:6}}>
                {groups.map(g=><span key={g} style={{...T.tag,background:(GC[g]||"#555")+"22",color:GC[g]||"var(--mu)",fontSize:10}}>{g}</span>)}
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {s.exercises.length===0&&<span style={{fontSize:12,color:"var(--mu)"}}>Sin ejercicios - haz click para agregar</span>}
                {s.exercises.map(ex=>{const m=getMachine(ex.machineId);const sd=ex.setData&&ex.setData.length?ex.setData:[];const nSets=sd.length||+ex.sets||0;const maxW=sd.length?Math.max(...sd.map(s=>+s.weight||0),0):+ex.weight||0;return(
                  <div key={ex.id} style={{fontSize:12,background:"var(--sf2)",padding:"4px 9px",borderRadius:8,display:"flex",gap:5,alignItems:"center"}}>
                    <span>{m?m.emoji:"?"}</span><span style={{color:"var(--mu)"}}>{m?m.name:ex.machineId}</span>
                    <span style={{fontFamily:"var(--fm)",color:"var(--ac)",fontSize:11}}>{nSets}s</span>
                    {maxW>0&&<span style={{fontFamily:"var(--fm)",color:"var(--a2)",fontSize:11}}>{maxW}kg</span>}
                  </div>
                );})}
              </div>
            </div>
          );
        })}
      </div>
      {viewSess&&<SessionModal session={viewSess} onClose={()=>setViewId(null)} canEdit={canEdit} canDeleteEx={canDeleteEx} allSessions={sessions} onSave={exs=>save(viewId,exs)}/>}
    </div>
  );
}
export function ProformaModal({student,allUsers,plans,gymInfo,onClose}){
  const plan=plans.find(p=>p.id===student.planId);
  const trainer=allUsers.find(u=>u.id===student.trainerId);
  const now=new Date();
  const defaultStart=now.getFullYear()+"-"+String(now.getMonth()+1).padStart(2,"0")+"-01";
  const lastDay=new Date(now.getFullYear(),now.getMonth()+1,0).getDate();
  const defaultEnd=now.getFullYear()+"-"+String(now.getMonth()+1).padStart(2,"0")+"-"+String(lastDay).padStart(2,"0");
  const[startDate,setStartDate]=useState(defaultStart);
  const[endDate,setEndDate]=useState(defaultEnd);
  const sessInRange=(student.attendance||[]).filter(d=>d>=startDate&&d<=endDate).length;
  const pricePerSess=plan&&plan.priceNet&&plan.sessionsPerWeek?Math.round(plan.priceNet/(plan.sessionsPerWeek*4)):null;
  const netCalc=pricePerSess?pricePerSess*sessInRange:plan&&plan.priceNet?+plan.priceNet:null;
  const proNum="ET-"+now.getFullYear()+"-"+String(now.getMonth()+1).padStart(2,"0")+"-"+(student.uid||"000");
  const net=netCalc;
  const iva=net?Math.round(net*0.19):null;
  const total=net?net+iva:null;
  return(
    <div style={T.ov} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="fi" style={{width:"100%",maxWidth:660,maxHeight:"92vh",overflowY:"auto",borderRadius:12,background:"#fff",color:"#111",position:"relative"}}>
        <div className="no-print" style={{padding:"12px 20px",background:"#f4f4f4",borderBottom:"1px solid #ddd",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:13,fontWeight:700,color:"#333"}}>PROFORMA . {student.name}</span>
          <div style={{display:"flex",gap:8}}>
            <button style={{...T.bp,fontSize:12,padding:"7px 14px"}} onClick={()=>window.print()}>P Imprimir / PDF</button>
            <button style={{background:"#ddd",border:"none",borderRadius:8,padding:"7px 14px",fontSize:12}} onClick={onClose}>X Cerrar</button>
          </div>
        </div>
        <div style={{padding:36}}>
                    <div className="no-print" style={{display:"flex",gap:16,marginBottom:20,padding:14,background:"#f4f4f4",borderRadius:8,alignItems:"flex-end"}}>
            <div><div style={{fontSize:10,color:"#999",marginBottom:4}}>FECHA INICIO</div><input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} style={{background:"#fff",border:"1px solid #ddd",color:"#111",fontSize:13,padding:"6px 10px",borderRadius:6,width:"auto"}}/></div>
            <div><div style={{fontSize:10,color:"#999",marginBottom:4}}>FECHA TÉRMINO</div><input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} style={{background:"#fff",border:"1px solid #ddd",color:"#111",fontSize:13,padding:"6px 10px",borderRadius:6,width:"auto"}}/></div>
            <div style={{fontSize:12,color:"#555",paddingBottom:8}}>{sessInRange} sesiones en el período{pricePerSess?" . "+(fmtCLP(pricePerSess))+"/sesión":""}</div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,paddingBottom:18,borderBottom:"3px solid #111"}}>
            <div>
              <div style={{fontFamily:"var(--fd)",fontSize:34,letterSpacing:3,color:"#111",lineHeight:1}}>{gymInfo.name}</div>
              <div style={{fontSize:12,color:"#666",marginTop:6}}>{gymInfo.address}</div>
              <div style={{fontSize:12,color:"#666"}}>{gymInfo.phone} . {gymInfo.email}</div>
              <div style={{fontSize:12,color:"#666"}}>RUT: {gymInfo.rut}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{background:"#111",color:"#e8ff3a",padding:"6px 14px",borderRadius:6,fontFamily:"var(--fd)",fontSize:20,letterSpacing:2,marginBottom:6}}>PROFORMA</div>
              <div style={{fontSize:12,color:"#666"}}>N {proNum}</div>
              <div style={{fontSize:12,color:"#666"}}>Fecha: {todayISO()}</div>
              <div style={{fontSize:12,color:"#666"}}>Período: {MONTHS[now.getMonth()]} {now.getFullYear()}</div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}}>
            <div style={{padding:14,background:"#f8f8f8",borderRadius:8,border:"1px solid #eee"}}>
              <div style={{fontSize:10,color:"#999",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Facturar a</div>
              <div style={{fontSize:16,fontWeight:700,marginBottom:3}}>{student.name}</div>
              <div style={{fontSize:12,color:"#555"}}>ID: {student.uid}</div>
              <div style={{fontSize:12,color:"#555"}}>Email: {student.email||"-"}</div>
              <div style={{fontSize:12,color:"#555"}}>Entrenador: {trainer?trainer.name:"Sin asignar"}</div>
            </div>
            <div style={{padding:14,background:"#f8f8f8",borderRadius:8,border:"1px solid #eee"}}>
              <div style={{fontSize:10,color:"#999",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Resumen del mes</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[["Plan",plan?plan.name:"Sin plan"],["Ses/semana",plan&&plan.sessionsPerWeek?""+(plan.sessionsPerWeek)+"x":"-"],["Asistencias",""+(sessInRange)+" días"],["Sesiones totales",""+((student.sessions||[]).length)+""]].map(([k,v])=>(
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
                <div style={{fontSize:11,color:"#888"}}>Entrenamiento personal . {startDate} al {endDate}</div>
                {pricePerSess&&<div style={{fontSize:11,color:"#888"}}>{fmtCLP(pricePerSess)} por sesión × {sessInRange} sesiones</div>}
              </td>
              <td style={{padding:"12px 14px",textAlign:"center"}}>{plan&&plan.sessionsPerWeek?""+(plan.sessionsPerWeek)+"x":"-"}</td>
              <td style={{padding:"12px 14px",textAlign:"center"}}>{sessInRange}</td>
              <td style={{padding:"12px 14px",textAlign:"right",fontWeight:700}}>{net?fmtCLP(net):"A convenir"}</td>
            </tr></tbody>
          </table>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:24}}>
            <div style={{minWidth:240}}>
              {[["Subtotal neto",net?fmtCLP(net):"-"],["IVA (19%)",iva?fmtCLP(iva):"-"]].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #eee",fontSize:13}}><span style={{color:"#555"}}>{k}</span><span>{v}</span></div>
              ))}
              <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0",fontSize:18,fontWeight:700,borderBottom:"3px solid #111"}}><span>TOTAL</span><span>{total?fmtCLP(total):"A convenir"}</span></div>
            </div>
          </div>
          <div style={{padding:16,background:"#f8f8f8",borderRadius:8,border:"1px solid #eee",marginBottom:18}}>
            <div style={{fontSize:10,color:"#999",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Datos para transferencia bancaria</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:13}}>
              {[["Banco",gymInfo.bank],["Tipo cuenta",gymInfo.accountType],["N cuenta",gymInfo.accountNumber],["Titular",gymInfo.accountHolder],["RUT titular",gymInfo.accountRut],["Email",gymInfo.email]].map(([k,v])=>(
                <div key={k}><div style={{fontSize:10,color:"#aaa",marginBottom:2}}>{k.toUpperCase()}</div><div style={{fontWeight:600}}>{v}</div></div>
              ))}
            </div>
          </div>
          <div style={{fontSize:11,color:"#aaa",textAlign:"center",lineHeight:1.7}}>
            Documento sin valor tributario . N {proNum} . {MONTHS[now.getMonth()]} {now.getFullYear()}<br/>
            Al transferir enviar comprobante a {gymInfo.email}
          </div>
        </div>
      </div>
    </div>
  );
}
export function StudentDash({user,allUsers,plans,onUpdate,isEmbedded=false}){
  const[tab,setTab]=useState("overview");
  const sessions=user.sessions||[],att=user.attendance||[],prof=user.profile||{};
  const nut=calcNut(prof),sugg=suggestNext(sessions),tm=monthCount(att);
  const trainer=allUsers.find(u=>u.id===user.trainerId);
  const plan=plans.find(p=>p.id===user.planId);
  const machinesWithData=MACHINES.filter(m=>weightHist(sessions,m.id).length>0);
  const TABS=[{id:"overview",l:"Resumen",i:"?"},{id:"sessions",l:"Sesiones",i:"="},{id:"load",l:"Carga Muscular",i:"+"},{id:"progress",l:"Progreso",i:"^"},{id:"nutrition",l:"Nutrición",i:"?"},{id:"calendar",l:"Asistencia",i:"?"},{id:"qr",l:"Mi QR",i:"[QR]"}];
  return(
    <div style={{minHeight:isEmbedded?"auto":"100vh",background:"var(--bg)"}}>
      {!isEmbedded&&(
        <div style={{background:"var(--sf)",borderBottom:"1px solid var(--br)",padding:"14px 24px",display:"flex",alignItems:"center",gap:14}}>
          <div style={{fontFamily:"var(--fd)",fontSize:22,letterSpacing:2,color:"var(--ac)"}}>ELITE TRAINER</div>
          <div style={{width:1,height:22,background:"var(--br)"}}/>
          <div>
            <div style={{fontSize:14,fontWeight:600}}>{user.name} <span style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--mu)",marginLeft:6}}>{user.uid}</span></div>
            <div style={{fontSize:11,color:"var(--mu)"}}>Alumno{trainer?" . Coach: "+(trainer.name)+"":""}{plan?" . "+(plan.name)+"":""}</div>
          </div>
        </div>
      )}
      <div style={{borderBottom:"1px solid var(--br)",padding:"0 24px",display:"flex",overflowX:"auto",background:isEmbedded?"transparent":"var(--sf)"}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{background:"none",border:"none",padding:"13px 14px",fontSize:13,fontWeight:500,cursor:"pointer",whiteSpace:"nowrap",color:tab===t.id?"var(--ac)":"var(--mu)",borderBottom:"2px solid "+(tab===t.id?"var(--ac)":"transparent")+"",transition:"all .2s"}}>{t.i} {t.l}</button>
        ))}
      </div>
      <div style={{padding:24,maxWidth:1080,margin:"0 auto"}} className="fi" key={tab}>
        {tab==="overview"&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14}}>
            {(()=>{
              const planSess=plan&&plan.sessionsPerWeek?plan.sessionsPerWeek*4:null;
              const attPct=planSess?Math.round((tm/planSess)*100):null;
              return [{l:"Sesiones totales",v:sessions.length,i:"UP",c:"var(--ac)"},{l:"Días este mes",v:tm,i:"?",c:"var(--a2)"},{l:"Asistencia mes",v:attPct!=null?""+(attPct)+"%":""+(tm)+" días",i:"?",c:attPct>=80?"var(--gr)":attPct>=50?"var(--or)":"var(--a3)"},{l:"Plan activo",v:plan?plan.name:"-",i:"*",c:"var(--or)"}];
            })().map(x=>(
              <div key={x.l} style={{...T.card,display:"flex",alignItems:"center",gap:12}}>
                <div style={{fontSize:26}}>{x.i}</div>
                <div><div style={{fontFamily:"var(--fd)",fontSize:26,color:x.c,lineHeight:1}}>{x.v}</div><div style={{fontSize:12,color:"var(--mu)"}}>{x.l}</div></div>
              </div>
            ))}
            <div style={{...T.card,gridColumn:"span 2",border:"1px solid rgba(232,255,58,0.2)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <div style={{fontSize:11,color:"var(--ac)",fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>* Próxima sesión sugerida</div>
                <button style={{...T.bp,fontSize:12,padding:"6px 14px"}} onClick={()=>{
                  const ns={id:"s_"+(Date.now()),date:todayISO(),exercises:sugg.machines.map((m,i)=>({id:"e_"+(Date.now())+"_"+i,machineId:m.id,sets:3,reps:10,weight:""}))};
                  const na=(user.attendance||[]).includes(todayISO())?user.attendance:[...(user.attendance||[]),todayISO()];
                  onUpdate({...user,sessions:[...(user.sessions||[]),ns],attendance:na});
                }}>+ Crear esta sesión</button>
              </div>
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
                <div style={{fontSize:11,color:"var(--mu)",fontWeight:700,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>Última sesión - {sessions[sessions.length-1].date}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>
                  {sessionMuscles(sessions[sessions.length-1]).map(m=><span key={m} style={{...T.tag,background:"rgba(58,255,232,0.1)",color:"var(--a2)"}}>{m}</span>)}
                </div>
                {sessions[sessions.length-1].exercises.map((ex,i)=>{const m=getMachine(ex.machineId);const sd=ex.setData&&ex.setData.length?ex.setData:[];const nSets=sd.length||+ex.sets||0;const maxW=sd.length?Math.max(...sd.map(s=>+s.weight||0),0):+ex.weight||0;return(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 10px",background:"var(--sf2)",borderRadius:8,marginBottom:4}}>
                    <span style={{fontSize:18}}>{m?m.emoji:"?"}</span><span style={{flex:1,fontSize:13}}>{m?m.name:ex.machineId}</span>
                    <span style={{fontFamily:"var(--fm)",fontSize:12,color:"var(--ac)"}}>{nSets} series</span>
                    {maxW>0&&<span style={{fontFamily:"var(--fm)",fontSize:12,color:"var(--a2)"}}>{maxW} kg</span>}
                  </div>
                );})}
              </div>
            )}
          </div>
        )}
        {tab==="sessions"&&<SessionsTab user={user} onUpdateUser={onUpdate} canEdit={true} canDeleteEx={isEmbedded} allUsers={allUsers}/>}
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
                      {sessionGroups(s).map(g=><span key={g} style={{...T.tag,background:(GC[g]||"#555")+"20",color:GC[g]||"var(--mu)",fontSize:10}}>{g}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {tab==="progress"&&(
          <div>
            <div style={{fontFamily:"var(--fd)",fontSize:20,letterSpacing:2,marginBottom:4,color:"var(--mu)"}}>EVOLUCIÓN SEMANAL</div>
            <div style={{fontSize:13,color:"var(--mu)",marginBottom:16}}>Filas = ejercicios . Columnas = semanas . Color: ? subió . ? igual . ? bajó</div>
            {machinesWithData.length===0&&<div style={{textAlign:"center",padding:60,color:"var(--mu)"}}>Registra sesiones para ver tu progreso.</div>}
            {machinesWithData.length>0&&(()=>{
              // Build weekly buckets
              const sorted=[...sessions].sort((a,b)=>a.date.localeCompare(b.date));
              const weekOf=d=>{const dt=new Date(d),day=dt.getDay(),diff=dt.getDate()-day+(day===0?-6:1);const mon=new Date(dt.setDate(diff));return mon.toISOString().slice(0,10);};
              const weekSet=new Set(sorted.map(s=>weekOf(s.date)));
              const weeks=[...weekSet].sort().slice(-6);
              const weekLabels=weeks.map((w,i)=>"Sem "+(i+1));
              return(
                <div style={{overflowX:"auto"}}>
                  <table style={{minWidth:600,fontSize:12}}>
                    <thead>
                      <tr>
                        <th style={{minWidth:160,position:"sticky",left:0,background:"var(--sf)",zIndex:1}}>Ejercicio</th>
                        {weeks.map((w,i)=><th key={w} style={{textAlign:"center",minWidth:80,color:"var(--a2)"}}>{weekLabels[i]}<div style={{fontSize:9,color:"var(--mu)",fontWeight:400}}>{w.slice(5)}</div></th>)}
                        <th style={{textAlign:"center",minWidth:70,color:"var(--ac)"}}>Progreso</th>
                      </tr>
                    </thead>
                    <tbody>
                      {machinesWithData.map(m=>{
                        const hist=weightHist(sessions,m.id);
                        const weekData=weeks.map(w=>{
                          const sessInWeek=sorted.filter(s=>weekOf(s.date)===w);
                          const ex=sessInWeek.flatMap(s=>s.exercises).find(e=>e.machineId===m.id);
                          return ex?+ex.weight:null;
                        });
                        const first=weekData.find(v=>v!=null), last=[...weekData].reverse().find(v=>v!=null);
                        const pct=first&&last&&first>0?Math.round((last-first)/first*100):0;
                        return(
                          <tr key={m.id}>
                            <td style={{position:"sticky",left:0,background:"var(--sf)",zIndex:1}}>
                              <div style={{display:"flex",alignItems:"center",gap:6}}>
                                <span style={{fontSize:16}}>{m.emoji}</span>
                                <div><div style={{fontWeight:600,fontSize:12}}>{m.name}</div><div style={{fontSize:9,color:"var(--mu)"}}>{m.muscles.slice(0,1).join("")}</div></div>
                              </div>
                            </td>
                            {weekData.map((v,i)=>{
                              const prev=weekData.slice(0,i).reverse().find(x=>x!=null);
                              const color=v==null?"var(--mu)":prev==null?"var(--tx)":v>prev?"var(--gr)":v<prev?"var(--a3)":"var(--tx)";
                              const bg=v==null?"transparent":prev==null?"transparent":v>prev?"rgba(58,255,138,0.1)":v<prev?"rgba(255,58,110,0.1)":"transparent";
                              return(
                                <td key={i} style={{textAlign:"center",background:bg}}>
                                  {v!=null?<span style={{fontFamily:"var(--fm)",color,fontWeight:600}}>{v}kg</span>:<span style={{color:"var(--br)"}}>-</span>}
                                </td>
                              );
                            })}
                            <td style={{textAlign:"center"}}>
                              <span style={{fontFamily:"var(--fm)",fontSize:13,color:pct>0?"var(--gr)":pct<0?"var(--a3)":"var(--mu)",fontWeight:700}}>{pct>0?"+":""}{first?""+(pct)+"%":"-"}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </div>
        )}
        {tab==="nutrition"&&(
          <div style={{maxWidth:760}}>
            <div style={{...T.card,marginBottom:14}}>
              <div style={{fontSize:11,color:"var(--mu)",fontWeight:700,marginBottom:12,textTransform:"uppercase",letterSpacing:1}}>Tu perfil</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                {[["Altura",(prof.height||"-")+" cm"],["Peso",(prof.weight||"-")+" kg"],["Edad",""+(prof.age||"-")+" años"],["Género",gLbl(prof.gender)],["Objetivo",prof.goal||"-"],["Actividad",prof.activityLevel||"-"]].map(([k,v])=>(
                  <div key={k} style={{padding:10,background:"var(--sf2)",borderRadius:8}}><div style={{fontSize:10,color:"var(--mu)",marginBottom:3}}>{k.toUpperCase()}</div><div style={{fontSize:14,fontWeight:600}}>{v}</div></div>
                ))}
              </div>
              {prof.restrictions&&<div style={{marginTop:10,padding:10,background:"rgba(255,154,58,0.1)",borderRadius:8,fontSize:13,color:"var(--or)"}}>?? {prof.restrictions}</div>}
            </div>
            {nut?(
              <div style={{...T.card,border:"1px solid rgba(232,255,58,0.2)"}}>
                <div style={{fontSize:11,color:"var(--ac)",fontWeight:700,marginBottom:12,textTransform:"uppercase",letterSpacing:1}}>? Recomendación nutricional diaria</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
                  {[{l:"Calorías",v:nut.calories,u:"kcal",c:"var(--ac)",i:"?"},{l:"Proteínas",v:nut.protein,u:"g/día",c:"var(--a3)",i:"d"},{l:"Carbohidratos",v:nut.carbs,u:"g/día",c:"var(--a2)",i:"c"},{l:"Grasas",v:nut.fat,u:"g/día",c:"var(--or)",i:"f"}].map(n=>(
                    <div key={n.l} style={{padding:14,background:"var(--sf2)",borderRadius:10,textAlign:"center"}}>
                      <div style={{fontSize:22,marginBottom:5}}>{n.i}</div>
                      <div style={{fontFamily:"var(--fd)",fontSize:30,color:n.c,lineHeight:1}}>{n.v}</div>
                      <div style={{fontSize:11,color:"var(--mu)",marginTop:2}}>{n.u}</div>
                      <div style={{fontSize:10,color:"var(--mu)",marginTop:2}}>{n.l}</div>
                    </div>
                  ))}
                </div>
                <div style={{fontSize:12,color:"var(--mu)",padding:10,background:"var(--sf2)",borderRadius:8,lineHeight:1.6}}>* Harris-Benedict . actividad <strong style={{color:"var(--tx)"}}>{prof.activityLevel}</strong> . objetivo <strong style={{color:"var(--ac)"}}>{prof.goal}</strong>. Consulta a un nutricionista.</div>
              </div>
            ):<div style={{...T.card,textAlign:"center",padding:40,color:"var(--mu)"}}>Completa tu perfil para ver sugerencias nutricionales.</div>}
          </div>
        )}
        {tab==="calendar"&&(
          <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:16,maxWidth:800}}>
            <div style={{...T.card,minWidth:240}}>
              <AttCal attendance={att} sessions={sessions}/>
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
        {tab==="qr"&&(
          <div style={{maxWidth:420}}>
            <div style={{fontFamily:"var(--fd)",fontSize:20,letterSpacing:2,marginBottom:16}}>MI QR DE ACCESO</div>
            <QRCard userId={user.uid} userName={user.name}/>
            <div style={{...T.card,marginTop:14,fontSize:13,color:"var(--mu)",lineHeight:1.8}}>
              <div style={{fontWeight:700,color:"var(--tx)",marginBottom:6}}>¿Cómo funciona?</div>
              <ol style={{paddingLeft:18,display:"flex",flexDirection:"column",gap:6}}>
                <li>Al llegar al gym, escanea este QR con la cámara de tu teléfono.</li>
                <li>Se abrirá una pantalla de confirmación en el navegador.</li>
                <li>Tu asistencia quedará registrada automáticamente.</li>
                <li>El QR puede imprimirse o mostrarse desde la app.</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



