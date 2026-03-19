export * from "./components2b_admin.jsx";
import { useState } from "react";
import { db } from "./supabase.js";

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
      setMsg("Código enviado a "+email);
      setScreen("verify");
    }catch(e){
      // Show code on screen as fallback
      setMsg("(Demo) Tu código es: "+c);
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
            <button style={{...T.bp,width:"100%",padding:12}} onClick={handle}>Ingresar &rarr;</button>
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
            <button style={{...T.bg,width:"100%",marginTop:8}} onClick={()=>setScreen("login")}>&larr; Volver</button>
          </div>
        )}
        {screen==="verify"&&(
          <div style={{...T.card,padding:30}}>
            <div style={{fontFamily:"var(--fd)",fontSize:20,letterSpacing:2,marginBottom:6}}>VERIFICAR CÓDIGO</div>
            <div style={{fontSize:13,color:"var(--mu)",marginBottom:18}}>Ingresa el código de 6 dígitos que te enviamos.</div>
            {msg&&<div style={{color:"var(--gr)",fontSize:13,marginBottom:12,background:"rgba(58,255,138,0.1)",padding:"8px 12px",borderRadius:8}}>{msg}</div>}
            <div style={{marginBottom:14}}><label style={{fontSize:11,color:"var(--mu)",display:"block",marginBottom:5}}>CÓDIGO</label><input value={code} onChange={e=>setCode(e.target.value)} placeholder="123456" style={{fontSize:24,fontFamily:"var(--fm)",textAlign:"center",letterSpacing:8}}/></div>
            {error&&<div style={{color:"var(--a3)",fontSize:13,marginBottom:12,background:"rgba(255,58,110,0.1)",padding:"8px 12px",borderRadius:8}}>{error}</div>}
            <button style={{...T.bp,width:"100%",padding:12}} onClick={verifyCode}>Verificar &rarr;</button>
            <button style={{...T.bg,width:"100%",marginTop:8}} onClick={()=>setScreen("forgot")}>&larr; Volver</button>
          </div>
        )}
        {screen==="newpass"&&(
          <div style={{...T.card,padding:30}}>
            <div style={{fontFamily:"var(--fd)",fontSize:20,letterSpacing:2,marginBottom:6}}>NUEVA CONTRASEÑA</div>
            <div style={{fontSize:13,color:"var(--mu)",marginBottom:18}}>Elige una nueva contraseña segura.</div>
            <div style={{marginBottom:12}}><label style={{fontSize:11,color:"var(--mu)",display:"block",marginBottom:5}}>NUEVA CONTRASEÑA</label><input type="password" value={newPass} onChange={e=>setNewPass(e.target.value)} placeholder="????????"/></div>
            <div style={{marginBottom:16}}><label style={{fontSize:11,color:"var(--mu)",display:"block",marginBottom:5}}>CONFIRMAR CONTRASEÑA</label><input type="password" value={newPass2} onChange={e=>setNewPass2(e.target.value)} placeholder="????????"/></div>
            {error&&<div style={{color:"var(--a3)",fontSize:13,marginBottom:12,background:"rgba(255,58,110,0.1)",padding:"8px 12px",borderRadius:8}}>{error}</div>}
            <button style={{...T.bp,width:"100%",padding:12}} onClick={saveNewPass}>Guardar contraseña &rarr;</button>
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




