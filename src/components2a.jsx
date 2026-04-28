export * from "./components1b.jsx";
import { useState } from "react";
import { db } from "./supabase.js";


export function TrainerDash({user,allUsers,plans,onUpdate}){
  const[selId,setSelId]=useState(null);
  const[view,setView]=useState("students");
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
          <div style={{fontSize:11,color:"var(--mu)"}}>Entrenador Personal . {students.length} alumnos</div>
        </div>
      </div>
      <div style={{borderBottom:"1px solid var(--br)",padding:"0 24px",display:"flex",gap:0,background:"var(--sf)"}}>
        {[["students","Mis Alumnos"],["library","Biblioteca de Rutinas"],["qrlist","QR Alumnos"]].map(([id,l])=>(
          <button key={id} onClick={()=>{setSelId(null);setView(id);}} style={{background:"none",border:"none",padding:"12px 16px",fontSize:13,fontWeight:500,cursor:"pointer",color:view===id?"var(--ac)":"var(--mu)",borderBottom:"2px solid "+(view===id?"var(--ac)":"transparent"),transition:"color .2s"}}>{l}</button>
        ))}
      </div>
      <div style={{padding:24,maxWidth:1080,margin:"0 auto"}}>
        {view==="qrlist"&&!sel&&(
          <div className="fi">
            <div style={{fontFamily:"var(--fd)",fontSize:18,letterSpacing:2,color:"var(--mu)",marginBottom:16}}>QR DE ACCESO — ALUMNOS</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:16}}>
              {students.map(s=><QRCard key={s.id} userId={s.uid} userName={s.name}/>)}
              {students.length===0&&<div style={{color:"var(--mu)",fontSize:13}}>No tienes alumnos asignados.</div>}
            </div>
          </div>
        )}
        {view==="library"&&!sel&&<ProgramLibrary trainer={user} onUpdate={onUpdate}/>}
        {view==="students"&&!sel?(
          <div className="fi">
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
              {[{l:"Alumnos asignados",v:students.length,c:"var(--ac)",i:"i"},{l:"Atendidos hoy",v:todaySt.length,c:"var(--a2)",i:"OK"},{l:"Sin asistir hoy",v:students.length-todaySt.length,c:"var(--a3)",i:"?"}].map(x=>(
                <div key={x.l} style={{...T.card,display:"flex",alignItems:"center",gap:12}}>
                  <div style={{fontSize:26}}>{x.i}</div>
                  <div><div style={{fontFamily:"var(--fd)",fontSize:32,color:x.c,lineHeight:1}}>{x.v}</div><div style={{fontSize:12,color:"var(--mu)"}}>{x.l}</div></div>
                </div>
              ))}
            </div>
            {todaySt.length>0&&(
              <div style={{...T.card,marginBottom:14,border:"1px solid rgba(58,255,232,0.2)"}}>
                <div style={{fontSize:11,color:"var(--a2)",fontWeight:700,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>Hoy en el gym - {today}</div>
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
                  <div key={s.id} style={{...T.card,cursor:"pointer",border:"1px solid "+(att?"rgba(58,255,232,0.3)":"var(--br)")}} onClick={()=>setSelId(s.id)}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                      <div><div style={{fontSize:15,fontWeight:700}}>{s.name}</div><div style={{fontSize:11,color:"var(--mu)"}}>{s.uid} . @{s.username}</div></div>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                        <span style={{...T.tag,background:"rgba(58,255,232,0.12)",color:"var(--a2)"}}>{plan?plan.name:"Sin plan"}</span>
                        {att&&<span style={{...T.tag,background:"rgba(58,255,138,0.2)",color:"var(--gr)"}}>OK Hoy</span>}
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
                    <div style={{fontSize:11,color:"var(--ac)",opacity:.8}}>* Próxima: {sg.machines.slice(0,2).map(m=>m.name).join(" + ")}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ):null}
        {sel&&(
          <div className="fi">
            <button style={{...T.bg,marginBottom:14}} onClick={()=>setSelId(null)}>&larr; Volver</button>
            <div style={{...T.card,marginBottom:14,display:"flex",alignItems:"center",gap:12}}>
              <div style={{fontSize:24}}>u</div>
              <div><div style={{fontSize:15,fontWeight:700}}>{sel.name} <span style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--mu)"}}>{sel.uid}</span></div>
                <div style={{fontSize:12,color:"var(--mu)"}}>Vista del entrenador . edición habilitada</div>
              </div>
            </div>
            <StudentDash user={sel} allUsers={allUsers} plans={plans} onUpdate={handleUpd} isEmbedded={true}/>
          </div>
        )}
      </div>
    </div>
  );
}
function ProgramLibrary({trainer,onUpdate}){
  const templates=trainer.templates||[];
  const[newTpl,setNewTpl]=useState(null);
  const[tplName,setTplName]=useState("");
  const[tplExs,setTplExs]=useState([]);
  function startNew(){setTplName("");setTplExs([{id:"te_1",machineId:MACHINES[0].id,sets:3,reps:10}]);setNewTpl(true);}
  function addEx(){setTplExs(p=>[...p,{id:"te_"+(Date.now()),machineId:MACHINES[0].id,sets:3,reps:10}]);}
  function saveTpl(){
    if(!tplName.trim())return;
    const tpl={id:"tpl_"+(Date.now()),name:tplName.trim(),exercises:tplExs};
    onUpdate({...trainer,templates:[...templates,tpl]});
    setNewTpl(null);
  }
  function delTpl(id){onUpdate({...trainer,templates:templates.filter(t=>t.id!==id)});}
  return(
    <div className="fi">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div><div style={{fontFamily:"var(--fd)",fontSize:18,letterSpacing:2}}>BIBLIOTECA DE RUTINAS</div>
          <div style={{fontSize:12,color:"var(--mu)"}}>Plantillas que tus alumnos pueden usar para crear sesiones</div>
        </div>
        <button style={T.bp} onClick={startNew}>+ Nueva plantilla</button>
      </div>
      {newTpl&&(
        <div style={{...T.card,marginBottom:16,border:"1px solid rgba(232,255,58,0.3)"}}>
          <div style={{marginBottom:10}}><label style={{fontSize:11,color:"var(--mu)",display:"block",marginBottom:5}}>NOMBRE DE LA RUTINA</label>
            <input value={tplName} onChange={e=>setTplName(e.target.value)} placeholder="Ej: Piernas + Glúteos A"/>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:12}}>
            {tplExs.map((ex,i)=>(
              <div key={ex.id} style={{display:"grid",gridTemplateColumns:"1fr 80px 80px 32px",gap:8,alignItems:"center"}}>
                <MachineSelect value={ex.machineId} onChange={v=>setTplExs(p=>p.map((e,j)=>j===i?{...e,machineId:v}:e))}/>
                <input type="number" value={ex.sets} onChange={e=>setTplExs(p=>p.map((e2,j)=>j===i?{...e2,sets:+e.target.value}:e2))} placeholder="Series" style={{padding:"6px 8px",fontSize:12}}/>
                <input type="number" value={ex.reps} onChange={e=>setTplExs(p=>p.map((e2,j)=>j===i?{...e2,reps:+e.target.value}:e2))} placeholder="Reps" style={{padding:"6px 8px",fontSize:12}}/>
                <button style={{...T.bd,padding:"4px 8px"}} onClick={()=>setTplExs(p=>p.filter((_,j)=>j!==i))}>X</button>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button style={T.bp} onClick={addEx}>+ Ejercicio</button>
            <button style={{...T.bp,background:"var(--gr)"}} onClick={saveTpl}>Guardar plantilla</button>
            <button style={T.bg} onClick={()=>setNewTpl(null)}>Cancelar</button>
          </div>
        </div>
      )}
      {templates.length===0&&!newTpl&&<div style={{color:"var(--mu)",textAlign:"center",padding:40}}>No hay plantillas. Crea la primera.</div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
        {templates.map(t=>(
          <div key={t.id} style={T.card}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontSize:15,fontWeight:700}}>{t.name}</div>
              <button style={{...T.bd,fontSize:11,padding:"3px 8px"}} onClick={()=>delTpl(t.id)}>X</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {(t.exercises||[]).map((ex,i)=>{const m=getMachine(ex.machineId);return(
                <div key={i} style={{display:"flex",gap:8,alignItems:"center",fontSize:12}}>
                  <span>{m?m.emoji:"?"}</span>
                  <span style={{flex:1,color:"var(--tx)"}}>{m?m.name:ex.machineId}</span>
                  <span style={{fontFamily:"var(--fm)",color:"var(--ac)"}}>{ex.sets}×{ex.reps}</span>
                </div>
              );})}
            </div>
            <div style={{fontSize:11,color:"var(--mu)",marginTop:10}}>{t.exercises.length} ejercicios . Los alumnos pueden aplicarla como sesión base</div>
          </div>
        ))}
      </div>
    </div>
  );
}
export function FinanceDash({users,students,trainers,plans,onUpdate,setProformaStudent}){
  const now2=new Date();
  const ym=now2.getFullYear()+"-"+String(now2.getMonth()+1).padStart(2,"0");
  const rows=students.map(s=>{
    const plan=plans.find(p=>p.id===s.planId);
    const sessM=(s.attendance||[]).filter(d=>d.startsWith(ym)).length;
    const planSess=plan&&plan.sessionsPerWeek?plan.sessionsPerWeek*4:null;
    const attPct=planSess?Math.round((sessM/planSess)*100):null;
    const pricePerSess=plan&&plan.priceNet&&plan.sessionsPerWeek?Math.round(plan.priceNet/(plan.sessionsPerWeek*4)):null;
    const net=pricePerSess?pricePerSess*sessM:plan&&plan.priceNet?+plan.priceNet:null;
    const iva=net?Math.round(net*.19):null;
    const total=net?net+iva:null;
    const trainer=users.find(u=>u.id===s.trainerId);
    return{s,plan,sessM,planSess,attPct,pricePerSess,net,iva,total,trainer};
  });
  const coachRows=trainers.map(coach=>{
    const myStudents=rows.filter(r=>r.trainer&&r.trainer.id===coach.id);
    const totalSess=myStudents.reduce((a,r)=>a+r.sessM,0);
    const rate=coach.sessionRate||0;
    const coachCost=rate*totalSess;
    const coachIncome=myStudents.reduce((a,r)=>a+(r.net||0),0);
    return{coach,myStudents,totalSess,rate,coachCost,coachIncome};
  });
  const totalIngresos=rows.reduce((a,r)=>a+(r.net||0),0);
  const totalCostoCoaches=coachRows.reduce((a,r)=>a+r.coachCost,0);
  const margenNeto=totalIngresos-totalCostoCoaches;
  const totalSessions=rows.reduce((a,r)=>a+r.sessM,0);
  const totalBruto2=Math.round(totalIngresos*1.19);
  return(
    <div>
      <div style={{fontFamily:"var(--fd)",fontSize:18,letterSpacing:2,color:"var(--mu)",marginBottom:16}}>CONTROL DE GESTIÓN - {MONTHS[now2.getMonth()]} {now2.getFullYear()}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginBottom:22}}>
        {[{l:"Ingresos netos",v:fmtCLP(totalIngresos),c:"var(--ac)",i:"$"},{l:"Total c/IVA",v:fmtCLP(totalBruto2),c:"var(--gr)",i:"?"},{l:"Costo coaches",v:fmtCLP(totalCostoCoaches),c:"var(--a3)",i:"e"},{l:"Margen bruto",v:fmtCLP(margenNeto),c:margenNeto>=0?"var(--gr)":"var(--a3)",i:"^"},{l:"Sesiones mes",v:totalSessions,c:"var(--a2)",i:"UP"},{l:"Alumnos activos",v:rows.filter(r=>r.sessM>0).length,c:"var(--or)",i:"i"}].map(x=>(
          <div key={x.l} style={{...T.card,border:"1px solid "+(x.c)+"33"}}>
            <div style={{fontSize:22,marginBottom:4}}>{x.i}</div>
            <div style={{fontFamily:"var(--fd)",fontSize:22,color:x.c,lineHeight:1}}>{x.v}</div>
            <div style={{fontSize:11,color:"var(--mu)",marginTop:3}}>{x.l}</div>
          </div>
        ))}
      </div>
      <div style={{fontFamily:"var(--fd)",fontSize:15,letterSpacing:2,color:"var(--mu)",marginBottom:10}}>DETALLE POR ALUMNO</div>
      <div style={{...T.card,marginBottom:22}}>
        <div style={{overflowX:"auto"}}>
          <table style={{minWidth:820}}>
            <thead><tr>{["ID","Alumno","Coach","Plan","Ses/sem","Asistencias","% Asist.","$/sesión","Neto","IVA","Total","Proforma"].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {rows.map(({s,plan,sessM,planSess,attPct,pricePerSess,net,iva,total,trainer})=>{
                const ac=attPct==null?"var(--mu)":attPct>=80?"var(--gr)":attPct>=50?"var(--or)":"var(--a3)";
                return(
                  <tr key={s.id}>
                    <td><span style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--ac)"}}>{s.uid}</span></td>
                    <td style={{fontWeight:600}}>{s.name}</td>
                    <td style={{fontSize:12,color:"var(--mu)"}}>{trainer?trainer.name:"-"}</td>
                    <td style={{fontSize:12}}>{plan?plan.name:<span style={{color:"var(--mu)"}}>Sin plan</span>}</td>
                    <td style={{textAlign:"center",fontFamily:"var(--fm)"}}>{plan&&plan.sessionsPerWeek?""+(plan.sessionsPerWeek)+"x":"-"}</td>
                    <td style={{textAlign:"center",fontFamily:"var(--fm)",color:"var(--a2)"}}>{sessM}{planSess?"/"+(planSess)+"":""}</td>
                    <td style={{textAlign:"center"}}>{attPct!=null?<span style={{fontFamily:"var(--fm)",color:ac,fontWeight:700}}>{attPct}%</span>:<span style={{color:"var(--mu)"}}>-</span>}</td>
                    <td style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--mu)"}}>{pricePerSess?fmtCLP(pricePerSess):"-"}</td>
                    <td style={{fontFamily:"var(--fm)",color:"var(--ac)"}}>{net?fmtCLP(net):"-"}</td>
                    <td style={{fontFamily:"var(--fm)",color:"var(--or)"}}>{iva?fmtCLP(iva):"-"}</td>
                    <td style={{fontFamily:"var(--fm)",color:"var(--gr)",fontWeight:700}}>{total?fmtCLP(total):"-"}</td>
                    <td><button style={{...T.bp,fontSize:11,padding:"5px 10px"}} onClick={()=>setProformaStudent(s)}>? Emitir</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{fontFamily:"var(--fd)",fontSize:15,letterSpacing:2,color:"var(--mu)",marginBottom:10}}>DETALLE POR COACH</div>
      <div style={T.card}>
        {coachRows.length===0&&<div style={{color:"var(--mu)",padding:20,textAlign:"center"}}>No hay coaches asignados aún.</div>}
        {coachRows.map(({coach,myStudents,totalSess,rate,coachCost,coachIncome})=>(
          <div key={coach.id} style={{marginBottom:16,paddingBottom:16,borderBottom:"1px solid var(--br)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div>
                <div style={{fontSize:15,fontWeight:700}}>{coach.name} <span style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--mu)"}}>{coach.uid}</span></div>
                <div style={{fontSize:12,color:"var(--mu)"}}>
                  {totalSess} sesiones . <span style={{color:"var(--or)"}}>{fmtCLP(rate)}/sesión</span>
                  {" "}<span style={{cursor:"pointer",color:"var(--mu)",fontSize:11,textDecoration:"underline"}} onClick={()=>{const nr=prompt("Tarifa por sesión de "+(coach.name)+" (CLP):",String(rate));if(nr&&!isNaN(+nr)){onUpdate([...users.filter(u=>u.id!==coach.id),{...coach,sessionRate:+nr}]);}}}>e editar</span>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"var(--fd)",fontSize:24,color:"var(--a3)"}}>{fmtCLP(coachCost)}</div>
                <div style={{fontSize:11,color:"var(--mu)"}}>a pagar . Margen: <span style={{color:"var(--gr)"}}>{fmtCLP(coachIncome-coachCost)}</span></div>
              </div>
            </div>
            <div style={{overflowX:"auto"}}>
              <table style={{minWidth:500,fontSize:12}}>
                <thead><tr>{["Alumno","Asistencias","$/sesión alumno","Ingreso","Costo coach","Margen"].map(h=><th key={h} style={{fontSize:10}}>{h}</th>)}</tr></thead>
                <tbody>
                  {myStudents.map(({s,sessM,pricePerSess,net})=>(
                    <tr key={s.id}>
                      <td style={{fontWeight:600}}>{s.name}</td>
                      <td style={{textAlign:"center",fontFamily:"var(--fm)",color:"var(--a2)"}}>{sessM}</td>
                      <td style={{fontFamily:"var(--fm)",color:"var(--mu)"}}>{pricePerSess?fmtCLP(pricePerSess):"-"}</td>
                      <td style={{fontFamily:"var(--fm)",color:"var(--ac)"}}>{net?fmtCLP(net):"-"}</td>
                      <td style={{fontFamily:"var(--fm)",color:"var(--a3)"}}>{fmtCLP(rate*sessM)}</td>
                      <td style={{fontFamily:"var(--fm)",color:(net||0)-rate*sessM>=0?"var(--gr)":"var(--a3)",fontWeight:700}}>{fmtCLP((net||0)-rate*sessM)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}




