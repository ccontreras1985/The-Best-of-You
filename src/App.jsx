import { useState, useEffect } from "react";
import { db } from "./supabase.js";
import { GS, T, MACHINES, MACHINE_GROUPS, GROUP_ICONS, GC, MONTHS, DEFAULT_PLANS, DEFAULT_GYM, INIT_USERS,
  newUid, newId, getMachine, sessionMuscles, sessionGroups, suggestNext, calcNut, weightHist,
  monthCount, todayISO, fmtCLP, gLbl,
  MachineSelect, MiniLine, MuscleRadar, AttCal, ProfileSetup, SessionModal, SessionsTab,
  ProformaModal, StudentDash, TrainerDash, FinanceDash, AdminDash, Login
} from "./components2b.jsx";

export default function App(){
  const[users,setUsers]=useState([]);
  const[plans,setPlans]=useState(DEFAULT_PLANS);
  const[loading,setLoading]=useState(true);
  const[currentUser,setCurrentUser]=useState(null);
  // Load data from Supabase on startup
  useEffect(()=>{
    async function load(){
      try{
        const [us, ps] = await Promise.all([db.getUsers(), db.getPlans()]);
        // Convert snake_case from DB to camelCase for app
        const mapped = us.map(u=>({
          ...u,
          trainerId: u.trainer_id,
          planId: u.plan_id,
          assignedStudents: u.assigned_students || [],
          sessions: u.sessions || [],
          attendance: u.attendance || [],
          profile: u.profile || {},
        }));
        setUsers(mapped);
        if(ps && ps.length) setPlans(ps.map(p=>({...p, sessionsPerWeek:p.sessions_per_week, priceNet:p.price_net})));
      }catch(e){ console.error("Error loading data:", e); }
      setLoading(false);
    }
    load();
  },[]);
  async function saveUserToDB(user){
    const dbUser = {
      id: user.id, uid: user.uid, role: user.role, name: user.name,
      username: user.username, password: user.password, email: user.email,
      active: user.active !== false,
      trainer_id: user.trainerId || null,
      plan_id: user.planId || null,
      profile: user.profile || {},
      attendance: user.attendance || [],
      sessions: user.sessions || [],
      assigned_students: user.assignedStudents || [],
    };
    await db.upsertUser(dbUser);
  }
  async function updateUser(updated){
    setUsers(prev=>prev.map(u=>u.id===updated.id?updated:u));
    if(currentUser&&currentUser.id===updated.id)setCurrentUser(updated);
    try{ await saveUserToDB(updated); }catch(e){ console.error("Error saving user:", e); }
  }
  async function updateUsers(newUsers){
    setUsers(newUsers);
    try{ await Promise.all(newUsers.map(u=>saveUserToDB(u))); }catch(e){ console.error("Error saving users:", e); }
  }
  async function deleteUserFromDB(id){
    try{ await db.deleteUser(id); }catch(e){ console.error("Error deleting user:", e); }
  }
  const synced=currentUser?users.find(u=>u.id===currentUser.id)||currentUser:null;
  if(loading) return(
    <>
      <GS/>
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--bg)",flexDirection:"column",gap:16}}>
        <div style={{fontFamily:"var(--fd)",fontSize:36,letterSpacing:3,color:"var(--ac)"}}>ELITE TRAINER</div>
        <div style={{color:"var(--mu)",fontSize:14}}>Cargando datos...</div>
        <div style={{width:40,height:40,border:"3px solid var(--br)",borderTop:"3px solid var(--ac)",borderRadius:"50%",animation:"spin 1s linear infinite"}}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </>
  );
  if(!synced) return(<><GS/><Login users={users} onLogin={u=>setCurrentUser(u)} onUpdateUsers={updateUser}/></>);
  return(
    <>
      <GS/>
      <div style={{position:"fixed",top:10,right:16,zIndex:400}} className="no-print">
        <button style={{...T.bg,fontSize:12}} onClick={()=>setCurrentUser(null)}>Cerrar sesión</button>
      </div>
      {synced.role==="admin"&&<AdminDash users={users} onUpdate={updateUsers} onDeleteUser={deleteUserFromDB}/>}
      {synced.role==="trainer"&&<TrainerDash user={synced} allUsers={users} plans={plans} onUpdate={updateUser}/>}
      {synced.role==="student"&&<StudentDash user={synced} allUsers={users} plans={plans} onUpdate={updateUser} isEmbedded={false}/>}
    </>
  );
}
