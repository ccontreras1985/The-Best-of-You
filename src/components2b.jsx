import { useState } from "react";
import { db } from "./supabase.js";
export * from "./components2a.jsx";

export function AdminDash({users,onUpdate}){
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
    // Send welcome email
    if(added.email){
      db.sendEmail({type:"welcome",to:added.email,name:added.name,username:added.username,password:nu.password}).catch(e=>console.log("Email error:",e));
    }
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
  function savePlan(){
    const saved={...planDraft,priceNet:planDraft.priceNet?+planDraft.priceNet:null,sessionsPerWeek:planDraft.sessionsPerWeek?+planDraft.sessionsPerWeek:null};
    setPlans(p=>p.map(x=>x.id===saved.id?saved:x));
    db.upsertPlan({id:saved.id,name:saved.name,sessions_per_week:saved.sessionsPerWeek,price_net:saved.priceNet}).catch(e=>console.error("Plan save error:",e));
    setEditingPlanId(null);
  }
  // Finance
  const now=new Date();
  const financeRows=students.map(s=>{
    const plan=plans.find(p=>p.id===s.planId);
    const sessM=monthCount(s.attendance||[]);
    const pricePerSess=plan&&plan.priceNet&&plan.sessionsPerWeek?Math.round(plan.priceNet/(plan.sessionsPerWeek*4)):null;
    const net=pricePerSess?pricePerSess*sessM:plan&&plan.priceNet?+plan.priceNet:null;
    return{s,plan,sessM,pricePerSess,net,iva:net?Math.round(net*.19):null,total:net?Math.round(net*1.19):null};
  });
  const totalNet=financeRows.reduce((a,x)=>a+(x.net||0),0);
  const totalBruto=Math.round(totalNet*1.19);
  const viewStudent=viewStudentId?users.find(u=>u.id===viewStudentId):null;
  const TABS=[{id:"users",l:"Usuarios",i:"i"},{id:"view",l:"Ver Alumnos",i:"S"},{id:"plans",l:"Planes",i:"="},{id:"finance",l:"Finanzas",i:"$"}];
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
                  <button style={T.bp} onClick={addUser}>Crear usuario -></button>
                </div>
              </div>
            )}
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
                    <button style={T.bp} onClick={saveEdit}>Guardar cambios -></button>
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
                          <td style={{fontSize:12,color:"var(--mu)"}}>{u.email||"-"}</td>
                          <td><span style={{...T.tag,background:u.role==="trainer"?"rgba(58,255,232,0.12)":"rgba(232,255,58,0.12)",color:u.role==="trainer"?"var(--a2)":"var(--ac)"}}>{u.role==="trainer"?"Entrenador":"Alumno"}</span></td>
                          <td style={{fontSize:12,color:"var(--mu)"}}>{u.role==="trainer"?`${(u.assignedStudents||[]).length} alumnos`:`${trainer?trainer.name:"Sin coach"} . ${plan?plan.name:"Sin plan"}`}</td>
                          <td><span style={{...T.tag,background:isActive?"rgba(58,255,138,0.12)":"rgba(255,58,110,0.12)",color:isActive?"var(--gr)":"var(--a3)"}}>{isActive?"Activo":"Inactivo"}</span></td>
                          <td style={{fontFamily:"var(--fm)",color:"var(--ac)"}}>{(u.sessions||[]).length}</td>
                          <td><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                            <button style={{...T.bw,fontSize:11,padding:"4px 8px"}} onClick={()=>setEditUser({...u})}>e</button>
                            <button style={{...T.bg,fontSize:11,padding:"4px 8px",color:isActive?"var(--a3)":"var(--gr)",border:`1px solid ${isActive?"rgba(255,58,110,0.3)":"rgba(58,255,138,0.3)"}`}} onClick={()=>toggleActive(u.id)}>{isActive?"on":"off"}</button>
                            <button style={{...T.bd,fontSize:11,padding:"4px 8px"}} onClick={()=>{if(window.confirm(`?Eliminar a ${u.name}?`))deleteUser(u.id);}}>X</button>
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
                          <div><div style={{fontSize:15,fontWeight:700}}>{s.name}</div><div style={{fontSize:11,color:"var(--mu)"}}>{s.uid} . @{s.username}</div></div>
                          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                            <span style={{...T.tag,background:"rgba(58,255,232,0.12)",color:"var(--a2)"}}>{plan?plan.name:"Sin plan"}</span>
                            {att&&<span style={{...T.tag,background:"rgba(58,255,138,0.2)",color:"var(--gr)"}}>OK Hoy</span>}
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
                <button style={{...T.bg,marginBottom:14}} onClick={()=>setViewStudentId(null)}><- Volver</button>
                <div style={{...T.card,marginBottom:14,display:"flex",alignItems:"center",gap:12,border:"1px solid rgba(255,154,58,0.3)"}}>
                  <div style={{fontSize:24}}>A</div>
                  <div><div style={{fontSize:15,fontWeight:700}}>{viewStudent.name} <span style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--mu)"}}>{viewStudent.uid}</span></div>
                    <div style={{fontSize:12,color:"var(--or)"}}>Vista Administrador - acceso completo</div>
                  </div>
                </div>
                <StudentDash user={viewStudent} allUsers={users} plans={plans} onUpdate={u=>{onUpdate(users.map(x=>x.id===u.id?u:x));setViewStudentId(null);setTimeout(()=>setViewStudentId(u.id),10);}} isEmbedded={true}/>
              </div>
            )}
          </div>
        )}
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
                        <button style={{...T.bp,fontSize:12,padding:"7px 14px"}} onClick={savePlan}>OK Guardar</button>
                        <button style={{...T.bg,fontSize:12}} onClick={()=>setEditingPlanId(null)}>Cancelar</button>
                      </div>
                    </div>
                  ):(
                    <div>
                      <div style={{fontSize:11,color:"var(--mu)",marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>{p.id}</div>
                      <div style={{fontSize:16,fontWeight:700,marginBottom:6}}>{p.name}</div>
                      <div style={{fontFamily:"var(--fm)",fontSize:26,color:"var(--ac)",marginBottom:4}}>{p.priceNet?fmtCLP(p.priceNet):"A convenir"}</div>
                      <div style={{fontSize:12,color:"var(--mu)",marginBottom:12}}>{p.sessionsPerWeek?`${p.sessionsPerWeek} sesiones/semana`:"Flexible"}</div>
                      <div style={{fontSize:12,color:"var(--mu)",marginBottom:12}}>Con IVA: <strong style={{color:"var(--tx)"}}>{p.priceNet?fmtCLP(Math.round(p.priceNet*1.19)):"-"}</strong></div>
                      <div style={{fontSize:11,color:"var(--mu)",marginBottom:12}}>Alumnos: <strong style={{color:"var(--a2)"}}>{students.filter(s=>s.planId===p.id).length}</strong></div>
                      <button style={{...T.bw,fontSize:12,padding:"6px 14px"}} onClick={()=>startEditPlan(p)}>e Editar plan</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
                        <div style={{fontFamily:"var(--fd)",fontSize:18,letterSpacing:2,color:"var(--mu)",marginBottom:14}}>DATOS DEL GYM (PROFORMA)</div>
            <div style={T.card}>
              {editingGym?(
                <div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                    {[["Nombre del gym","name"],["RUT","rut"],["Dirección","address"],["Teléfono","phone"],["Email","email"],["Banco","bank"],["Tipo de cuenta","accountType"],["N de cuenta","accountNumber"],["Titular cuenta","accountHolder"],["RUT titular","accountRut"]].map(([l,k])=>(
                      <div key={k}><label style={{fontSize:11,color:"var(--mu)",display:"block",marginBottom:4}}>{l.toUpperCase()}</label><input value={gymDraft[k]||""} onChange={e=>setGymDraft({...gymDraft,[k]:e.target.value})}/></div>
                    ))}
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button style={T.bg} onClick={()=>setEditingGym(false)}>Cancelar</button>
                    <button style={T.bp} onClick={()=>{setGymInfo({...gymDraft});setEditingGym(false);}}>Guardar -></button>
                  </div>
                </div>
              ):(
                <div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
                    {[["Nombre",gymInfo.name],["RUT",gymInfo.rut],["Dirección",gymInfo.address],["Teléfono",gymInfo.phone],["Email",gymInfo.email],["Banco",gymInfo.bank],["Tipo cuenta",gymInfo.accountType],["N cuenta",gymInfo.accountNumber],["Titular",gymInfo.accountHolder],["RUT titular",gymInfo.accountRut]].map(([k,v])=>(
                      <div key={k} style={{padding:"8px 12px",background:"var(--sf2)",borderRadius:8}}><div style={{fontSize:10,color:"var(--mu)",marginBottom:2}}>{k.toUpperCase()}</div><div style={{fontSize:13,fontWeight:600}}>{v}</div></div>
                    ))}
                  </div>
                  <button style={{...T.bw,fontSize:12}} onClick={()=>{setGymDraft({...gymInfo});setEditingGym(true);}}>e Editar datos del gym</button>
                </div>
              )}
            </div>
          </div>
        )}
                {tab==="finance"&&<FinanceDash users={users} students={students} trainers={trainers} plans={plans} onUpdate={onUpdate} setProformaStudent={setProformaStudent}/>}
      {profUser&&<ProfileSetup userName={profUser.name} onSave={p=>{if(p)onUpdate(users.map(u=>u.id===profUser.id?{...u,profile:p}:u));setProfUser(null);}}/>}
      {proformaStudent&&<ProformaModal student={proformaStudent} allUsers={users} plans={plans} gymInfo={gymInfo} onClose={()=>setProformaStudent(null)}/>}
    </div>
  );
}
export function Login({users,onLogin,onUpdateUsers}){
  const[screen,setScreen]=useState("login");
  const[username,setUsername]=useState("");
  const[password,setPassword]=useState("");
  const[email,setEmail]=useState("");
  const[code,setCode]=useState("");
  const[generatedCode,setGeneratedCode]=useState("");
  const[resetUser,setResetUser]=useState(null);
  const[newPass,setNewPass]=useState("");
  const[newPass2,setNewPass2]=useState("");
  const[error,setError]=useState("");
  const[msg,setMsg]=useState("");
  const[loading,setLoading]=useState(false);
  const[showPass,setShowPass]=useState(false);
  function handle(){
    const u=users.find(u=>u.username===username&&u.password===password&&u.active!==false);
    if(u)onLogin(u);else setError("Usuario o contraseña incorrectos");
  }
  async function sendReset(){
    setError("");setMsg("");setLoading(true);
    const u=users.find(u=>u.email&&u.email.toLowerCase()===email.toLowerCase()&&u.active!==false);
    if(!u){setError("No encontramos una cuenta con ese email.");setLoading(false);return;}
    const c=String(Math.floor(100000+Math.random()*900000));
    setGeneratedCode(c);setResetUser(u);
    try{
      await db.sendEmail({type:"reset",to:email,resetCode:c});
      setMsg(`Código enviado a ${email}`);
      setScreen("verify");
    }catch(e){
      // Show code on screen as fallback
      setMsg(`(Demo) Tu código es: ${c}`);
      setScreen("verify");
    }
    setLoading(false);
  }
  function verifyCode(){
    setError("");
    if(code.trim()===generatedCode){setScreen("newpass");}
    else setError("Código incorrecto, intenta de nuevo.");
  }
  async function saveNewPass(){
    setError("");
    if(newPass.length<6){setError("La contraseña debe tener al menos 6 caracteres.");return;}
    if(newPass!==newPass2){setError("Las contraseñas no coinciden.");return;}
    const updated={...resetUser,password:newPass};
    if(onUpdateUsers) await onUpdateUsers(updated);
    setMsg("¡Contraseña actualizada! Ya puedes ingresar.");
    setScreen("login");setUsername(resetUser.username);setPassword("");
  }
  const Logo=()=>(
    <div style={{textAlign:"center",marginBottom:32}}>
      <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:64,height:64,borderRadius:16,background:"var(--ac)",marginBottom:12}}><span style={{fontSize:32}}>*</span></div>
      <div style={{fontFamily:"var(--fd)",fontSize:36,letterSpacing:3}}>ELITE TRAINER</div>
      <div style={{fontSize:13,color:"var(--mu)",marginTop:4}}>The Best of You</div>
    </div>
  );
  return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--bg)",backgroundImage:"radial-gradient(ellipse at 20% 50%, rgba(232,255,58,0.05) 0%, transparent 60%)"}}>
      <div className="fi" style={{width:380,padding:"0 20px"}}>
        <Logo/>
        {screen==="login"&&(
          <div style={{...T.card,padding:30}}>
            <div style={{marginBottom:14}}><label style={{fontSize:11,color:"var(--mu)",display:"block",marginBottom:5}}>USUARIO</label><input value={username} onChange={e=>setUsername(e.target.value)} placeholder="tu_usuario" onKeyDown={e=>e.key==="Enter"&&handle()}/></div>
            <div style={{marginBottom:8}}>
              <label style={{fontSize:11,color:"var(--mu)",display:"block",marginBottom:5}}>CONTRASEÑA</label>
              <div style={{position:"relative"}}>
                <input type={showPass?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="????????" onKeyDown={e=>e.key==="Enter"&&handle()} style={{paddingRight:44}}/>
                <button onClick={()=>setShowPass(p=>!p)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"var(--mu)",fontSize:16,cursor:"pointer",padding:4}}>{showPass?"o":"o"}</button>
              </div>
            </div>
            <div style={{textAlign:"right",marginBottom:16}}>
              <span style={{fontSize:12,color:"var(--mu)",cursor:"pointer",textDecoration:"underline"}} onClick={()=>{setScreen("forgot");setError("");setMsg("");}}>?Olvidaste tu contraseña?</span>
            </div>
            {error&&<div style={{color:"var(--a3)",fontSize:13,marginBottom:12,background:"rgba(255,58,110,0.1)",padding:"8px 12px",borderRadius:8}}>{error}</div>}
            <button style={{...T.bp,width:"100%",padding:12}} onClick={handle}>Ingresar -></button>
          </div>
        )}
        {screen==="forgot"&&(
          <div style={{...T.card,padding:30}}>
            <div style={{fontFamily:"var(--fd)",fontSize:20,letterSpacing:2,marginBottom:6}}>RECUPERAR CONTRASEÑA</div>
            <div style={{fontSize:13,color:"var(--mu)",marginBottom:18}}>Ingresa tu email y te enviaremos un código de verificación.</div>
            <div style={{marginBottom:14}}><label style={{fontSize:11,color:"var(--mu)",display:"block",marginBottom:5}}>EMAIL</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@email.com"/></div>
            {error&&<div style={{color:"var(--a3)",fontSize:13,marginBottom:12,background:"rgba(255,58,110,0.1)",padding:"8px 12px",borderRadius:8}}>{error}</div>}
            {msg&&<div style={{color:"var(--gr)",fontSize:13,marginBottom:12,background:"rgba(58,255,138,0.1)",padding:"8px 12px",borderRadius:8}}>{msg}</div>}
            <button style={{...T.bp,width:"100%",padding:12,opacity:loading?0.6:1}} onClick={sendReset}>{loading?"Enviando...":"Enviar código ->"}</button>
            <button style={{...T.bg,width:"100%",marginTop:8}} onClick={()=>setScreen("login")}><- Volver</button>
          </div>
        )}
        {screen==="verify"&&(
          <div style={{...T.card,padding:30}}>
            <div style={{fontFamily:"var(--fd)",fontSize:20,letterSpacing:2,marginBottom:6}}>VERIFICAR CÓDIGO</div>
            <div style={{fontSize:13,color:"var(--mu)",marginBottom:18}}>Ingresa el código de 6 dígitos que te enviamos.</div>
            {msg&&<div style={{color:"var(--gr)",fontSize:13,marginBottom:12,background:"rgba(58,255,138,0.1)",padding:"8px 12px",borderRadius:8}}>{msg}</div>}
            <div style={{marginBottom:14}}><label style={{fontSize:11,color:"var(--mu)",display:"block",marginBottom:5}}>CÓDIGO</label><input value={code} onChange={e=>setCode(e.target.value)} placeholder="123456" style={{fontSize:24,fontFamily:"var(--fm)",textAlign:"center",letterSpacing:8}}/></div>
            {error&&<div style={{color:"var(--a3)",fontSize:13,marginBottom:12,background:"rgba(255,58,110,0.1)",padding:"8px 12px",borderRadius:8}}>{error}</div>}
            <button style={{...T.bp,width:"100%",padding:12}} onClick={verifyCode}>Verificar -></button>
            <button style={{...T.bg,width:"100%",marginTop:8}} onClick={()=>setScreen("forgot")}><- Volver</button>
          </div>
        )}
        {screen==="newpass"&&(
          <div style={{...T.card,padding:30}}>
            <div style={{fontFamily:"var(--fd)",fontSize:20,letterSpacing:2,marginBottom:6}}>NUEVA CONTRASEÑA</div>
            <div style={{fontSize:13,color:"var(--mu)",marginBottom:18}}>Elige una nueva contraseña segura.</div>
            <div style={{marginBottom:12}}><label style={{fontSize:11,color:"var(--mu)",display:"block",marginBottom:5}}>NUEVA CONTRASEÑA</label><input type="password" value={newPass} onChange={e=>setNewPass(e.target.value)} placeholder="????????"/></div>
            <div style={{marginBottom:16}}><label style={{fontSize:11,color:"var(--mu)",display:"block",marginBottom:5}}>CONFIRMAR CONTRASEÑA</label><input type="password" value={newPass2} onChange={e=>setNewPass2(e.target.value)} placeholder="????????"/></div>
            {error&&<div style={{color:"var(--a3)",fontSize:13,marginBottom:12,background:"rgba(255,58,110,0.1)",padding:"8px 12px",borderRadius:8}}>{error}</div>}
            <button style={{...T.bp,width:"100%",padding:12}} onClick={saveNewPass}>Guardar contraseña -></button>
          </div>
        )}
        <div style={{marginTop:14,padding:12,background:"var(--sf)",borderRadius:8,border:"1px solid var(--br)"}}>
          <div style={{fontSize:11,color:"var(--mu)",marginBottom:6,fontWeight:600}}>USUARIOS DEMO</div>
          {[["admin","admin123","Admin"],["coach_pablo","coach123","Entrenador"],["ana_torres","ana123","Alumno"]].map(([u,p,r])=>(
            <div key={u} style={{fontSize:11,color:"var(--mu)",marginBottom:3}}>
              <span style={{color:"var(--ac)",fontFamily:"var(--fm)"}}>{u}</span> / {p} <span style={{background:"var(--br)",padding:"1px 6px",borderRadius:4}}>{r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
