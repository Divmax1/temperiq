import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// ── Supabase client ──────────────────────────────────────────────────────────
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ── Styles ───────────────────────────────────────────────────────────────────
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; }
    :root {
      --bg: #0d0b12; --surface: #16131f; --surface2: #1e1a2d;
      --border: rgba(255,255,255,0.07); --gold: #d4a843; --gold-light: #f0c96a;
      --text: #f0ece4; --muted: #8a8599;
      --font-display: 'Cormorant Garamond', serif; --font-body: 'DM Sans', sans-serif;
    }
    body { background: var(--bg); color: var(--text); font-family: var(--font-body); overflow-x: hidden; min-height: 100vh; }
    ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: var(--bg); } ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 4px; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    @keyframes pulse { 0%,100% { transform:scale(1); opacity:1; } 50% { transform:scale(1.06); opacity:.85; } }
    @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
    @keyframes orb { 0% { transform:translate(0,0) scale(1); } 33% { transform:translate(40px,-30px) scale(1.1); } 66% { transform:translate(-20px,20px) scale(.95); } 100% { transform:translate(0,0) scale(1); } }
    @keyframes slideUp { from { transform:translateY(100%); opacity:0; } to { transform:translateY(0); opacity:1; } }
    @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
    @keyframes popIn { 0% { transform:scale(.5); opacity:0; } 70% { transform:scale(1.08); } 100% { transform:scale(1); opacity:1; } }
    .fade-up { animation: fadeUp .6s ease both; }
    .fade-in { animation: fadeIn .4s ease both; }
    .pop-in  { animation: popIn .5s cubic-bezier(.34,1.56,.64,1) both; }
    .float   { animation: float 4s ease-in-out infinite; }
    .orb { position:absolute; border-radius:50%; filter:blur(80px); pointer-events:none; animation:orb 8s ease-in-out infinite; }
    .btn-primary { background:linear-gradient(135deg,var(--gold),#b8892a); color:#0d0b12; font-family:var(--font-body); font-weight:600; font-size:15px; border:none; border-radius:14px; padding:14px 32px; cursor:pointer; transition:transform .18s,box-shadow .18s; box-shadow:0 4px 24px rgba(212,168,67,.3); }
    .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 32px rgba(212,168,67,.45); }
    .btn-primary:disabled { opacity:.6; cursor:not-allowed; transform:none; }
    .btn-ghost { background:transparent; color:var(--muted); font-family:var(--font-body); font-size:14px; border:1px solid var(--border); border-radius:14px; padding:12px 28px; cursor:pointer; transition:all .18s; }
    .btn-ghost:hover { border-color:var(--gold); color:var(--gold); }
    .card { background:var(--surface); border:1px solid var(--border); border-radius:20px; }
    .input { background:var(--surface2); border:1px solid var(--border); border-radius:12px; padding:14px 16px; color:var(--text); font-family:var(--font-body); font-size:15px; width:100%; outline:none; transition:border-color .2s; }
    .input:focus { border-color:var(--gold); }
    .input::placeholder { color:var(--muted); }
    .progress-bar { height:3px; background:var(--surface2); border-radius:2px; overflow:hidden; }
    .progress-fill { height:100%; background:linear-gradient(90deg,var(--gold),var(--gold-light)); border-radius:2px; transition:width .4s ease; }
    .bubble-ai   { background:var(--surface2); border-radius:0 18px 18px 18px; }
    .bubble-user { background:linear-gradient(135deg,#3a2f10,#5c4a1e); border-radius:18px 0 18px 18px; }
    .nav-tab { flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; padding:10px 0; cursor:pointer; transition:color .2s; color:var(--muted); font-size:11px; font-family:var(--font-body); background:none; border:none; }
    .nav-tab.active { color:var(--gold); }
    .plans-scroll::-webkit-scrollbar { display:none; }
  `}</style>
);

// ── DATA ─────────────────────────────────────────────────────────────────────
const TEMPERAMENTS = {
  Choleric:   { color:"#c94040", bg:"rgba(201,64,64,0.1)",  element:"🔥", tagline:"The Natural Leader",   description:"Bold, driven, and decisive. You take charge of every room you enter. Your ambition and confidence inspire those around you.", strengths:["Natural leadership","Goal-oriented","Decisive","Energetic","Confident","Productive"], weaknesses:["Impatient","Domineering","Hot-tempered","Stubborn","Insensitive","Workaholic"], career:["Executive","Entrepreneur","Military Officer","Lawyer","Surgeon"], relationship:"You need a partner who respects your ambition but can gently soften your edges. You love deeply but express it through acts of service.", advice:"Practice pausing before reacting. Your strength multiplies when paired with empathy." },
  Melancholic:{ color:"#3a5fb0", bg:"rgba(58,95,176,0.1)",  element:"💧", tagline:"The Deep Thinker",     description:"Thoughtful, analytical, and gifted. You see the world with remarkable depth and pursue excellence in everything.", strengths:["Analytical","Detail-oriented","Creative","Empathetic","Loyal","Perfectionist"], weaknesses:["Overthinking","Self-critical","Moody","Pessimistic","Withdrawn","Indecisive"], career:["Scientist","Artist","Writer","Accountant","Philosopher"], relationship:"You love with extraordinary depth. You need a partner who creates a safe space for your sensitivity and appreciates your loyalty.", advice:"Give yourself the same grace you give others. Your standards are high — remember you're human." },
  Sanguine:   { color:"#c8a02a", bg:"rgba(200,160,42,0.1)", element:"✨", tagline:"The Joyful Connector", description:"Vibrant, enthusiastic, and magnetic. You light up every room and have the rare gift of making everyone feel seen.", strengths:["Charismatic","Optimistic","Creative","Enthusiastic","Adaptable","Compassionate"], weaknesses:["Impulsive","Disorganized","Unreliable","Attention-seeking","Forgetful","Superficial"], career:["Actor","Sales Professional","Motivational Speaker","Nurse","Teacher"], relationship:"You bring joy and adventure to love. You need a partner who matches your energy and gives you space to be expressive.", advice:"Channel your enthusiasm into follow-through. The world needs your spark — and your commitment." },
  Phlegmatic: { color:"#3a7d5c", bg:"rgba(58,125,92,0.1)",  element:"🌿", tagline:"The Steady Anchor",    description:"Calm, reliable, and deeply wise. You are the person everyone turns to in a storm — your peace is your superpower.", strengths:["Patient","Reliable","Diplomatic","Calm under pressure","Empathetic","Consistent"], weaknesses:["Passive","Avoids conflict","Indifferent","Slow to change","Procrastinator","Stubborn"], career:["Counselor","Diplomat","Social Worker","Administrator","Nurse"], relationship:"You are the most faithful partner. You love quietly but deeply. You need a partner who draws out your warmth patiently.", advice:"Your peace is strength, not weakness. But speak up — the world needs your wisdom out loud." },
};

const BLENDS = {
  CM:{label:"Driven Perfectionist",desc:"You combine bold leadership with a deep need for excellence. You get things done AND get them right."},
  MC:{label:"Analytical Leader",desc:"You think deeply before acting, but when you move — you move with precision and power."},
  CS:{label:"Charismatic Achiever",desc:"You have the drive to win AND the charm to bring everyone along. Hard to ignore in a room."},
  SC:{label:"Energetic Trailblazer",desc:"Fun and fierce. You light up rooms and get results. Sometimes your speed leaves others behind."},
  CP:{label:"Determined Diplomat",desc:"You push hard for results but genuinely care about people. You balance drive with patience well."},
  PC:{label:"Calm Commander",desc:"You lead without needing to shout. Your quiet steadiness earns trust, and when you act — people listen."},
  MS:{label:"Creative Soul",desc:"Deeply feeling and richly expressive. You create beautiful things and connect deeply."},
  SM:{label:"Passionate Connector",desc:"You love people deeply and feel everything fully. Your empathy and energy make you unforgettable."},
  MP:{label:"Quiet Thinker",desc:"Reflective, sensitive, and steady. You rarely rush and often see things others completely miss."},
  PM:{label:"Gentle Analyst",desc:"You process the world quietly and carefully. People feel completely safe with you."},
  SP:{label:"Easy-Going Optimist",desc:"Happy, warm, and low-maintenance. You make friends everywhere and rarely have bad days."},
  PS:{label:"Warm Peacemaker",desc:"You bring calm and joy wherever you go. You love people without conditions."},
};

const DAILY_QUOTES = {
  Choleric:   [{q:"Today, pause before you respond. Your instinct is powerful — just aim it right."},{q:"You don't have to win every argument to be respected. Pick the ones that matter."},{q:"Results matter, but so does how you make people feel along the way."},{q:"Rest is not weakness. Even the best engines need to cool down."},{q:"Asking for help is not losing control — it's smart leadership."},{q:"One act of patience today can save you from three apologies tomorrow."},{q:"The people around you move slower than you — and that's okay. Bring them with you."}],
  Melancholic:[{q:"Done and delivered beats perfect and delayed. Ship the work."},{q:"You have replayed that conversation enough. It's okay to let it go now."},{q:"Your sensitivity is not a flaw. It's the reason people trust you with their secrets."},{q:"The standards you hold others to — are you holding yourself to the same kindness?"},{q:"One small, messy step forward is worth more than ten perfectly planned ones you never took."},{q:"You don't have to earn rest. You're allowed to just be today."},{q:"Not everything needs to be understood to be appreciated. Enjoy something today."}],
  Sanguine:   [{q:"Following through on one thing today will mean more than starting five new ones."},{q:"The people who love you need consistency, not just good energy. Show up steady."},{q:"Your joy is contagious. Protect it — don't give it to people who don't value it."},{q:"You don't have to perform today. The real you — quiet and unfiltered — is enough."},{q:"One quiet, focused hour today will surprise you with what you can produce."},{q:"You're allowed to say no without a long explanation. No is a complete sentence."},{q:"Before you commit to something new, finish what's already in front of you."}],
  Phlegmatic: [{q:"Speak up today — even once. The room needs to hear what you've been thinking."},{q:"Avoiding conflict doesn't make it disappear. One honest conversation clears the air."},{q:"Your loyalty is rare. Make sure the people receiving it are actually worth it."},{q:"Being comfortable is great. Being a little uncomfortable is where you grow."},{q:"You hold everything together for others. Who is holding things together for you?"},{q:"Say what you need today. The people who love you can't guess — they need to hear it."},{q:"You've been putting off one thing for a while now. Today is the day to start it."}],
};

const ROLE_ADVICE = {
  Choleric:   {spouse:"As a spouse, your Choleric energy means you protect fiercely. Learn to slow down and listen — your partner needs presence, not just solutions.",student:"In school, you excel at leadership roles. Channel your drive into study groups. Manage your frustration when teachers move too slowly.",employer:"As an employer, you set a blazing pace. Remember: your team needs clarity and encouragement, not just speed. Celebrate small wins.",employee:"As an employee, you chafe under micro-management. Communicate your ambitions clearly to your boss and request autonomy on projects.",teacher:"As a teacher, your authority commands respect. Balance discipline with warmth — students follow you best when they feel safe."},
  Melancholic:{spouse:"You love with extraordinary depth. Express your affection verbally — your partner may not see what's happening in your rich inner world.",student:"You are a natural student. Watch for perfectionism paralysis. Done and good enough sometimes beats perfect and late.",employer:"As a leader, you set high standards. Be mindful that your silence can feel like disapproval. Verbalize appreciation explicitly.",employee:"You thrive with clear expectations and quality work. Ask for detailed feedback — it fuels you.",teacher:"You are a deeply gifted teacher. Your students will remember your passion for years."},
  Sanguine:   {spouse:"You are the light in your relationship. Work on consistency — your partner needs to know they can count on you even when it's not exciting.",student:"School can bore you. Find the story in every subject. Build a study routine so your energy doesn't scatter before exams.",employer:"You inspire your team like few others can. Build systems that work even when your excitement drops.",employee:"You energize any workplace. Ask for variety in your tasks and socialize strategically.",teacher:"You are unforgettable in the classroom. Your students are engaged and excited."},
  Phlegmatic: {spouse:"You are the most faithful partner. Speak your needs — your quiet nature can cause resentment to build silently.",student:"You are steady and dependable in school. Push yourself slightly outside comfort zones.",employer:"Your team trusts you completely. Learn to make hard decisions faster.",employee:"You are the backbone every team needs. Advocate for yourself more.",teacher:"Students feel completely safe with you. Introduce gentle challenges."},
};

const shuffleArray = arr => {
  const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a;
};

const QUIZ_QUESTIONS = [
  {q:"Your boss gives the team a tough deadline. What do you do?",options:[["Jump in and start delegating immediately","C"],["Sit down and map out every step carefully","M"],["Rally everyone's energy and lift the mood","S"],["Stay calm and check that everyone is okay first","P"]]},
  {q:"You're at a party where you barely know anyone. You usually:",options:[["Start introducing yourself and own the conversation","C"],["Find one interesting person and go really deep","M"],["Work the whole room — 5 new friends before it ends","S"],["Stick with the one person you know and enjoy the vibe","P"]]},
  {q:"Someone gives you harsh feedback on your work. Your first reaction:",options:[["Push back — you know what you're doing","C"],["Replay it in your head all night","M"],["Feel hurt but shake it off and vent to a friend","S"],["Say nothing and just adjust quietly","P"]]},
  {q:"You need to make a big decision (new job, moving cities). You:",options:[["Decide quickly — waiting wastes time","C"],["Research everything before making a move","M"],["Ask everyone you know for their opinion","S"],["Wait until you feel completely comfortable","P"]]},
  {q:"A close friend cancels your plans last minute. You feel:",options:[["Annoyed — your time matters","C"],["Disappointed and wondering if you did something wrong","M"],["A little bummed but you find something else fun to do","S"],["Totally fine — you secretly enjoy the free time","P"]]},
  {q:"You have a free Saturday with zero plans. You most likely:",options:[["Fill it with goals — gym, errands, side projects","C"],["Dive into a book, creative project, or something deep","M"],["Text your friends immediately to make plans","S"],["Sleep in, cook, watch something — pure rest","P"]]},
  {q:"When you're really stressed, people close to you see you:",options:[["Getting snappy and controlling everything","C"],["Going very quiet and pulling away","M"],["Talking non-stop and getting emotional","S"],["Pretending everything is fine when it's not","P"]]},
  {q:"Someone in your group is struggling. You naturally:",options:[["Step in and fix the problem for them","C"],["Listen carefully and help them think it through","M"],["Cheer them up and make them laugh","S"],["Sit with them quietly — no pressure, no rush","P"]]},
  {q:"Which phrase sounds most like you?",options:[["'If you want it done right, do it yourself.'","C"],["'There's always a better way — I just need to find it.'","M"],["'Life's too short to be serious all the time.'","S"],["'I just want everyone to be okay and happy.'","P"]]},
  {q:"How do you handle a disagreement with someone close to you?",options:[["Address it head-on immediately","C"],["Think it through carefully before saying anything","M"],["Talk about your feelings openly","S"],["Smooth it over and avoid the tension","P"]]},
  {q:"What would coworkers most likely say about you?",options:[["'Gets things done — can be intense though'","C"],["'Super detailed and reliable — hard to read'","M"],["'Always the fun one — lifts the whole room'","S"],["'Easiest person to work with — zero drama'","P"]]},
  {q:"You just got exciting news. What do you do first?",options:[["Start planning how to make the most of it","C"],["Think through all the implications quietly first","M"],["Call or text everyone you know right away","S"],["Sit with the feeling before you tell anyone","P"]]},
];

// ── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size=20 }) => {
  const icons = {
    home:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    chat:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    star:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    user:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    send:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    lock:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    check:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    sparkle: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v4m0 10v4M3 12h4m10 0h4M5.636 5.636l2.828 2.828m7.072 7.072 2.828 2.828M5.636 18.364l2.828-2.828m7.072-7.072 2.828-2.828"/></svg>,
    arrow:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    back:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
    eye:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    eyeOff:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  };
  return icons[name] || null;
};

// ── LOADING SCREEN ────────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:20}}>
      <span style={{fontFamily:"var(--font-display)",fontSize:24,color:"var(--gold)",letterSpacing:3}}>TEMPERIQ</span>
      <div style={{width:40,height:40,border:"3px solid var(--surface2)",borderTop:"3px solid var(--gold)",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
      <p style={{color:"var(--muted)",fontSize:13}}>Loading your profile...</p>
    </div>
  );
}

// ── ONBOARDING ────────────────────────────────────────────────────────────────
const slides = [
  {icon:"✦",title:"Know Who You Are",    subtitle:"Discover your classical temperament — the ancient framework that reveals your deepest self.",          bg1:"rgba(212,168,67,0.2)", bg2:"rgba(201,64,64,0.1)"},
  {icon:"◈",title:"Unlock Your Potential",subtitle:"Understand your strengths, manage your weaknesses, and live with purpose every single day.",          bg1:"rgba(58,95,176,0.2)",  bg2:"rgba(58,125,92,0.1)"},
  {icon:"❋",title:"Thrive in Every Role", subtitle:"Better relationships. Stronger leadership. Wiser parenting. One personality insight at a time.",     bg1:"rgba(200,160,42,0.15)",bg2:"rgba(58,95,176,0.15)"},
];
function Onboarding({ onDone }) {
  const [slide,setSlide]=useState(0); const s=slides[slide];
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 24px",position:"relative",overflow:"hidden"}}>
      <div className="orb" style={{width:300,height:300,background:s.bg1,top:-80,right:-80}}/>
      <div className="orb" style={{width:200,height:200,background:s.bg2,bottom:100,left:-60,animationDelay:"3s"}}/>
      <div style={{position:"absolute",top:48,left:"50%",transform:"translateX(-50%)"}}>
        <span style={{fontFamily:"var(--font-display)",fontSize:22,color:"var(--gold)",letterSpacing:3}}>TEMPERIQ</span>
      </div>
      <div key={slide} className="fade-up" style={{textAlign:"center",maxWidth:340,marginTop:40}}>
        <div style={{fontSize:72,marginBottom:24,animation:"float 3s ease-in-out infinite",display:"block",color:"var(--gold)"}}>{s.icon}</div>
        <h1 style={{fontFamily:"var(--font-display)",fontSize:38,fontWeight:600,lineHeight:1.2,marginBottom:16}}>{s.title}</h1>
        <p style={{color:"var(--muted)",lineHeight:1.7,fontSize:15}}>{s.subtitle}</p>
      </div>
      <div style={{display:"flex",gap:8,margin:"40px 0 32px"}}>
        {slides.map((_,i)=><div key={i} onClick={()=>setSlide(i)} style={{width:i===slide?24:8,height:8,borderRadius:4,background:i===slide?"var(--gold)":"var(--surface2)",cursor:"pointer",transition:"all .3s"}}/>)}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12,width:"100%",maxWidth:340}}>
        {slide<2?<button className="btn-primary" onClick={()=>setSlide(slide+1)} style={{width:"100%"}}>Continue</button>
                :<button className="btn-primary" onClick={onDone} style={{width:"100%"}}>Discover Your Temperament</button>}
        {slide<2&&<button className="btn-ghost" onClick={onDone} style={{width:"100%"}}>Skip</button>}
      </div>
    </div>
  );
}

// ── AUTH ──────────────────────────────────────────────────────────────────────
function Auth({ onAuth }) {
  const [mode,setMode]       = useState("signup");
  const [name,setName]       = useState("");
  const [email,setEmail]     = useState("");
  const [password,setPassword]=useState("");
  const [showPw,setShowPw]   = useState(false);
  const [role,setRole]       = useState("");
  const [error,setError]     = useState("");
  const [loading,setLoading] = useState(false);

  const pwRules = [
    {label:"At least 6 characters",        pass:password.length>=6},
    {label:"At least one number (0-9)",     pass:/[0-9]/.test(password)},
    {label:"At least one symbol (!@#$...)", pass:/[^a-zA-Z0-9]/.test(password)},
    {label:"At least one uppercase letter", pass:/[A-Z]/.test(password)},
  ];
  const pwValid = pwRules.every(r=>r.pass);

  const roles=[
    {id:"individual",label:"Individual",  icon:"🧍"},
    {id:"spouse",    label:"Couple/Spouse",icon:"💑"},
    {id:"employer",  label:"Manager",     icon:"🏢"},
    {id:"teacher",   label:"Teacher/Student",icon:"🎓"},
  ];

  const handleSubmit = async () => {
    setError("");
    if (!email.trim()||!password) return setError("Please fill in all fields.");
    if (mode==="signup"){
      if (!name.trim()) return setError("Please enter your name.");
      if (!role)        return setError("Please select your role.");
      if (!pwValid)     return setError("Password doesn't meet all requirements below.");
    }
    setLoading(true);
    try {
      if (mode==="signup"){
        const {data,error:e} = await supabase.auth.signUp({email,password,options:{data:{name,role}}});
        if (e) throw e;
        // Save profile to users table
        if (data.user){
          await supabase.from("users").upsert({id:data.user.id,name,email,role});
        }
        onAuth({name,email,role,uid:data.user?.id});
      } else {
        const {data,error:e} = await supabase.auth.signInWithPassword({email,password});
        if (e) throw e;
        const {data:profile} = await supabase.from("users").select("*").eq("id",data.user.id).single();
        onAuth({name:profile?.name||data.user.user_metadata?.name||"Friend",email,role:profile?.role||"individual",uid:data.user.id});
      }
    } catch(e){
      const msgs={
        "Invalid login credentials":"Wrong email or password. Please try again.",
        "User already registered":"This email is already registered. Try signing in.",
        "Password should be at least 6 characters":"Password must be at least 6 characters.",
      };
      setError(msgs[e.message]||e.message||"Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 24px",position:"relative",overflow:"hidden"}}>
      <div className="orb" style={{width:250,height:250,background:"rgba(212,168,67,0.15)",top:-60,right:-60}}/>
      <div className="orb" style={{width:180,height:180,background:"rgba(58,95,176,0.1)",bottom:80,left:-40,animationDelay:"4s"}}/>
      <div className="fade-up" style={{width:"100%",maxWidth:380}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <span style={{fontFamily:"var(--font-display)",fontSize:24,color:"var(--gold)",letterSpacing:3}}>TEMPERIQ</span>
          <h2 style={{fontFamily:"var(--font-display)",fontSize:30,marginTop:16}}>{mode==="signup"?"Begin Your Journey":"Welcome Back"}</h2>
          <p style={{color:"var(--muted)",fontSize:14,marginTop:8}}>{mode==="signup"?"Create your free account":"Sign in to continue"}</p>
        </div>
        <div className="card" style={{padding:28,display:"flex",flexDirection:"column",gap:14}}>
          {mode==="signup"&&(
            <div>
              <label style={{fontSize:12,color:"var(--muted)",display:"block",marginBottom:8}}>FULL NAME</label>
              <input className="input" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)}/>
            </div>
          )}
          <div>
            <label style={{fontSize:12,color:"var(--muted)",display:"block",marginBottom:8}}>EMAIL</label>
            <input className="input" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>
          </div>
          <div>
            <label style={{fontSize:12,color:"var(--muted)",display:"block",marginBottom:8}}>PASSWORD</label>
            <div style={{position:"relative"}}>
              <input className="input" type={showPw?"text":"password"} placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} style={{paddingRight:48}} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
              <button onClick={()=>setShowPw(v=>!v)} type="button" style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:showPw?"var(--gold)":"var(--muted)",display:"flex",alignItems:"center",padding:0}}>
                {showPw?<Icon name="eye" size={18}/>:<Icon name="eyeOff" size={18}/>}
              </button>
            </div>
          </div>
          {mode==="signup"&&password.length>0&&(
            <div style={{padding:"12px 14px",background:"var(--surface2)",borderRadius:10,display:"flex",flexDirection:"column",gap:6}}>
              {pwRules.map(r=>(
                <div key={r.label} style={{display:"flex",gap:8,alignItems:"center"}}>
                  <span style={{fontSize:12,color:r.pass?"#4ade80":"var(--muted)",fontWeight:700}}>{r.pass?"✓":"○"}</span>
                  <span style={{fontSize:12,color:r.pass?"#4ade80":"var(--muted)"}}>{r.label}</span>
                </div>
              ))}
            </div>
          )}
          {error&&(
            <div style={{padding:"10px 14px",background:"rgba(201,64,64,0.1)",border:"1px solid rgba(201,64,64,0.25)",borderRadius:10}}>
              <p style={{fontSize:13,color:"#f87171"}}>{error}</p>
            </div>
          )}
          {mode==="signup"&&(
            <div>
              <label style={{fontSize:12,color:"var(--muted)",display:"block",marginBottom:8}}>I AM A...</label>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {roles.map(r=>(
                  <div key={r.id} onClick={()=>setRole(r.id)} style={{padding:"12px",border:`1px solid ${role===r.id?"var(--gold)":"var(--border)"}`,borderRadius:12,cursor:"pointer",background:role===r.id?"rgba(212,168,67,0.1)":"transparent",display:"flex",alignItems:"center",gap:8,transition:"all .2s"}}>
                    <span>{r.icon}</span>
                    <span style={{fontSize:13,color:role===r.id?"var(--gold)":"var(--text)"}}>{r.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <button className="btn-primary" onClick={handleSubmit} disabled={loading} style={{width:"100%",marginTop:4}}>
            {loading?"Please wait...":(mode==="signup"?"Create Account":"Sign In")}
          </button>
          <p style={{textAlign:"center",fontSize:13,color:"var(--muted)"}}>
            {mode==="signup"?"Already have an account? ":"New here? "}
            <span style={{color:"var(--gold)",cursor:"pointer"}} onClick={()=>{setMode(mode==="signup"?"login":"signup");setError("");}}>
              {mode==="signup"?"Sign In":"Create Account"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── QUIZ ──────────────────────────────────────────────────────────────────────
function Quiz({ onComplete }) {
  const [current,setCurrent] = useState(0);
  const [answers,setAnswers] = useState([]);
  const [shuffled] = useState(()=>QUIZ_QUESTIONS.map(q=>({...q,options:shuffleArray(q.options)})));

  const handleAnswer = type => {
    const next=[...answers,type];
    if (current+1>=shuffled.length){
      const counts={C:0,M:0,S:0,P:0}; next.forEach(a=>counts[a]++);
      const map={C:"Choleric",M:"Melancholic",S:"Sanguine",P:"Phlegmatic"};
      const total=next.length;
      const pcts={Choleric:Math.round(counts.C/total*100),Melancholic:Math.round(counts.M/total*100),Sanguine:Math.round(counts.S/total*100),Phlegmatic:Math.round(counts.P/total*100)};
      const sorted=Object.entries(pcts).sort((a,b)=>b[1]-a[1]);
      onComplete(sorted[0][0],pcts,sorted[1][1]>=25?sorted[1][0]:null);
    } else { setAnswers(next); setCurrent(current+1); }
  };
  const handleBack = () => { if(current===0)return; setAnswers(p=>p.slice(0,-1)); setCurrent(current-1); };
  const q=shuffled[current]; const prev=answers[current];

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",padding:"48px 24px 32px",position:"relative",overflow:"hidden"}}>
      <div className="orb" style={{width:200,height:200,background:"rgba(212,168,67,0.12)",top:0,right:-40}}/>
      <div style={{marginBottom:32}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            {current>0&&<button onClick={handleBack} style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"var(--muted)"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--gold)";e.currentTarget.style.color="var(--gold)"}} onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--muted)"}}><Icon name="back" size={16}/></button>}
            <span style={{fontFamily:"var(--font-display)",fontSize:18,color:"var(--gold)"}}>TEMPERIQ</span>
          </div>
          <span style={{fontSize:13,color:"var(--muted)"}}>{current+1} / {shuffled.length}</span>
        </div>
        <div className="progress-bar"><div className="progress-fill" style={{width:`${(current/shuffled.length)*100}%`}}/></div>
      </div>
      <div key={current} className="fade-up" style={{flex:1,display:"flex",flexDirection:"column"}}>
        <p style={{fontSize:12,color:"var(--gold)",letterSpacing:2,textTransform:"uppercase",marginBottom:16}}>Question {current+1}</p>
        <h2 style={{fontFamily:"var(--font-display)",fontSize:28,lineHeight:1.35,marginBottom:40,fontWeight:600}}>{q.q}</h2>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {q.options.map(([text,type],i)=>{
            const sel=prev===type;
            return (
              <div key={i} onClick={()=>handleAnswer(type)} style={{padding:"18px 20px",border:`1px solid ${sel?"var(--gold)":"var(--border)"}`,borderRadius:16,cursor:"pointer",background:sel?"rgba(212,168,67,0.08)":"var(--surface)",display:"flex",alignItems:"center",justifyContent:"space-between",transition:"all .2s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--gold)";e.currentTarget.style.background="rgba(212,168,67,0.06)"}} onMouseLeave={e=>{e.currentTarget.style.borderColor=sel?"var(--gold)":"var(--border)";e.currentTarget.style.background=sel?"rgba(212,168,67,0.08)":"var(--surface)"}}>
                <span style={{fontSize:15,lineHeight:1.5}}>{text}</span>
                {sel?<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>:<Icon name="arrow" size={16}/>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── RESULT ────────────────────────────────────────────────────────────────────
function Result({ temperament, percentages, secondaryTemp, onContinue }) {
  const [stage,setStage]=useState(0);
  const t=TEMPERAMENTS[temperament];
  const tMap={Choleric:"C",Melancholic:"M",Sanguine:"S",Phlegmatic:"P"};
  const blendKey=secondaryTemp?tMap[temperament]+tMap[secondaryTemp]:null;
  const blend=blendKey?BLENDS[blendKey]:null;
  const sorted=percentages?Object.entries(percentages).sort((a,b)=>b[1]-a[1]):[];
  useEffect(()=>{ const ts=[setTimeout(()=>setStage(1),600),setTimeout(()=>setStage(2),1800),setTimeout(()=>setStage(3),2800)]; return()=>ts.forEach(clearTimeout); },[]);
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 24px",position:"relative",overflow:"hidden"}}>
      <div className="orb" style={{width:300,height:300,background:t.bg,top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}/>
      {stage>=1&&<div className="pop-in"><div style={{fontSize:80,marginBottom:8,animation:"float 3s ease-in-out infinite"}}>{t.element}</div></div>}
      {stage>=2&&<div className="fade-up" style={{textAlign:"center",marginTop:8}}><p style={{fontSize:12,color:"var(--muted)",letterSpacing:3,textTransform:"uppercase",marginBottom:8}}>Your Temperament</p><h1 style={{fontFamily:"var(--font-display)",fontSize:52,color:t.color,fontWeight:700,lineHeight:1}}>{temperament}</h1><p style={{color:t.color,fontSize:16,marginTop:8,opacity:.8}}>{t.tagline}</p></div>}
      {stage>=3&&(
        <div className="fade-up" style={{maxWidth:360,width:"100%",textAlign:"center",marginTop:24,padding:"0 16px"}}>
          {blend&&<div style={{marginBottom:16,padding:"10px 18px",background:"rgba(212,168,67,0.08)",border:"1px solid rgba(212,168,67,0.2)",borderRadius:14,display:"inline-block"}}><span style={{fontSize:12,color:"var(--gold)",letterSpacing:1}}>✦ {blend.label}</span></div>}
          <div className="card" style={{padding:20,marginBottom:16,borderColor:t.color+"33",textAlign:"left"}}><p style={{lineHeight:1.7,color:"var(--muted)",fontSize:14}}>{blend?blend.desc:t.description}</p></div>
          <div className="card" style={{padding:20,marginBottom:16,textAlign:"left"}}>
            <p style={{fontSize:11,color:"var(--gold)",letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Your Temperament Mix</p>
            {sorted.map(([name,pct])=>{ const tc=TEMPERAMENTS[name]; return (
              <div key={name} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:13,color:tc.color,fontWeight:600}}>{name}</span><span style={{fontSize:13,color:"var(--muted)",fontWeight:600}}>{pct}%</span></div>
                <div style={{height:8,background:"var(--surface2)",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:tc.color,borderRadius:4,transition:"width 1s ease",opacity:.85}}/></div>
              </div>
            );})}
          </div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center",marginBottom:24}}>
            {t.strengths.slice(0,3).map(s=><span key={s} style={{padding:"6px 14px",background:t.bg,border:`1px solid ${t.color}44`,borderRadius:20,fontSize:13,color:t.color}}>{s}</span>)}
          </div>
          <button className="btn-primary" onClick={onContinue} style={{width:"100%"}}>Go to My Dashboard →</button>
        </div>
      )}
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function Dashboard({ user, temperament, percentages, secondaryTemp, isPremium, onUpgrade, onRetake }) {
  const [tab,setTab]=useState("overview");
  const t=TEMPERAMENTS[temperament];
  const today=new Date().getDay();
  const dailyQuote=(DAILY_QUOTES[temperament]||DAILY_QUOTES.Choleric)[today%7];
  const roleAdvice=ROLE_ADVICE[temperament]?.[user.role]||"";
  const tMap={Choleric:"C",Melancholic:"M",Sanguine:"S",Phlegmatic:"P"};
  const blend=secondaryTemp?BLENDS[tMap[temperament]+tMap[secondaryTemp]]:null;
  const sortedPcts=percentages?Object.entries(percentages).sort((a,b)=>b[1]-a[1]):[];
  return (
    <div style={{maxWidth:480,margin:"0 auto",padding:"24px 16px 100px"}}>
      <div className="card fade-up" style={{padding:24,marginBottom:16,borderColor:t.color+"33",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:120,height:120,borderRadius:"50%",background:t.bg,filter:"blur(30px)"}}/>
        <div style={{display:"flex",alignItems:"center",gap:16,position:"relative"}}>
          <div style={{width:60,height:60,borderRadius:"50%",background:t.bg,border:`2px solid ${t.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{t.element}</div>
          <div style={{flex:1}}>
            <h2 style={{fontFamily:"var(--font-display)",fontSize:22,fontWeight:600}}>{user.name}</h2>
            <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4,flexWrap:"wrap"}}>
              <span style={{fontSize:13,color:t.color,fontWeight:600}}>{temperament}</span>
              {blend&&<><span style={{fontSize:12,color:"var(--muted)"}}>·</span><span style={{fontSize:12,color:"var(--gold)"}}>{blend.label}</span></>}
            </div>
          </div>
          <button onClick={onRetake} style={{fontSize:11,color:"var(--muted)",background:"none",border:"1px solid var(--border)",borderRadius:8,padding:"6px 12px",cursor:"pointer",flexShrink:0}}>Retake</button>
        </div>
        {sortedPcts.length>0&&(
          <div style={{marginTop:16,paddingTop:16,borderTop:"1px solid var(--border)"}}>
            <p style={{fontSize:11,color:"var(--muted)",letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>Your Mix</p>
            <div style={{display:"flex",gap:6,alignItems:"flex-end",height:40}}>
              {sortedPcts.map(([name,pct])=>{ const tc=TEMPERAMENTS[name]; return (
                <div key={name} title={`${name}: ${pct}%`} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <span style={{fontSize:10,color:tc.color}}>{pct}%</span>
                  <div style={{width:"100%",height:`${Math.max(pct*.3,4)}px`,background:tc.color,borderRadius:3,opacity:.8}}/>
                  <span style={{fontSize:9,color:"var(--muted)"}}>{name.slice(0,3)}</span>
                </div>
              );})}
            </div>
          </div>
        )}
      </div>
      <div className="card fade-up" style={{padding:20,marginBottom:16,background:`linear-gradient(135deg,${t.bg},transparent)`,borderColor:t.color+"22"}}>
        <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
          <Icon name="sparkle" size={18}/>
          <div>
            <p style={{fontSize:11,color:"var(--gold)",letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>Daily Reminder</p>
            <p style={{fontFamily:"var(--font-display)",fontSize:17,lineHeight:1.6,fontStyle:"italic"}}>"{dailyQuote.q}"</p>
          </div>
        </div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {["overview","traits","advice"].map(tb=><button key={tb} onClick={()=>setTab(tb)} style={{flex:1,padding:"10px",border:`1px solid ${tab===tb?t.color:"var(--border)"}`,borderRadius:12,background:tab===tb?t.bg:"transparent",color:tab===tb?t.color:"var(--muted)",cursor:"pointer",fontSize:13,fontFamily:"var(--font-body)",transition:"all .2s",textTransform:"capitalize"}}>{tb}</button>)}
      </div>
      {tab==="overview"&&<div className="fade-in"><div className="card" style={{padding:20,marginBottom:12}}><h3 style={{fontFamily:"var(--font-display)",fontSize:20,marginBottom:12,color:t.color}}>Who You Are</h3><p style={{color:"var(--muted)",lineHeight:1.7,fontSize:14}}>{t.description}</p></div><div className="card" style={{padding:20}}><h3 style={{fontFamily:"var(--font-display)",fontSize:20,marginBottom:12}}>Best Career Fits</h3><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{t.career.map(c=><span key={c} style={{padding:"6px 14px",background:"var(--surface2)",borderRadius:20,fontSize:13}}>{c}</span>)}</div></div></div>}
      {tab==="traits"&&<div className="fade-in" style={{display:"flex",flexDirection:"column",gap:12}}><div className="card" style={{padding:20}}><h3 style={{fontFamily:"var(--font-display)",fontSize:20,marginBottom:16,color:"#4ade80"}}>✓ Strengths</h3><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{t.strengths.map(s=><div key={s} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",background:"rgba(74,222,128,0.06)",borderRadius:10,border:"1px solid rgba(74,222,128,0.15)"}}><Icon name="check" size={14}/><span style={{fontSize:13}}>{s}</span></div>)}</div></div><div className="card" style={{padding:20}}><h3 style={{fontFamily:"var(--font-display)",fontSize:20,marginBottom:16,color:"#f87171"}}>⚠ Weaknesses</h3><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{t.weaknesses.map(w=><div key={w} style={{padding:"10px 12px",background:"rgba(248,113,113,0.06)",borderRadius:10,border:"1px solid rgba(248,113,113,0.15)"}}><span style={{fontSize:13,color:"var(--muted)"}}>{w}</span></div>)}</div></div></div>}
      {tab==="advice"&&<div className="fade-in" style={{display:"flex",flexDirection:"column",gap:12}}>
        <div className="card" style={{padding:20}}><h3 style={{fontFamily:"var(--font-display)",fontSize:20,marginBottom:12,color:t.color}}>Relationships</h3><p style={{color:"var(--muted)",lineHeight:1.7,fontSize:14}}>{t.relationship}</p></div>
        <div className="card" style={{padding:20}}><h3 style={{fontFamily:"var(--font-display)",fontSize:20,marginBottom:12}}>Your Role Advice</h3>
          {isPremium?<p style={{color:"var(--muted)",lineHeight:1.7,fontSize:14}}>{roleAdvice}</p>:(
            <div><p style={{color:"var(--muted)",lineHeight:1.7,fontSize:14,filter:"blur(4px)",userSelect:"none"}}>{roleAdvice}</p>
              <div style={{marginTop:16,padding:16,background:"rgba(212,168,67,0.08)",borderRadius:12,border:"1px solid rgba(212,168,67,0.2)",textAlign:"center"}}><Icon name="lock" size={20}/><p style={{fontSize:14,color:"var(--gold)",marginTop:8,marginBottom:12}}>Unlock with Premium</p><button className="btn-primary" onClick={onUpgrade} style={{fontSize:13,padding:"10px 24px"}}>Upgrade Now</button></div>
            </div>
          )}
        </div>
        <div className="card" style={{padding:20}}><h3 style={{fontFamily:"var(--font-display)",fontSize:20,marginBottom:12}}>Daily Practice</h3><p style={{color:"var(--muted)",lineHeight:1.7,fontSize:14}}>{t.advice}</p></div>
      </div>}
    </div>
  );
}

// ── CHATBOT ───────────────────────────────────────────────────────────────────
const FREE_MSG_LIMIT = 50;
function Chatbot({ user, temperament, isPremium, onUpgrade }) {
  const t=TEMPERAMENTS[temperament];
  const [messages,setMessages]=useState([{role:"assistant",content:`Hey ${user.name} 👋 I'm your Temperiq guide. As a ${temperament}, you have real strengths — and some blind spots worth knowing. What's on your mind?`}]);
  const [input,setInput]=useState(""); const [loading,setLoading]=useState(false);
  const [freeUsed,setFreeUsed]=useState(0);
  const limitHit=!isPremium&&freeUsed>=FREE_MSG_LIMIT;
  const bottomRef=useRef(null);
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[messages,loading]);

  const send = async () => {
    if (!input.trim()||loading||limitHit) return;
    const userMsg={role:"user",content:input};
    const newMsgs=[...messages,userMsg];
    setMessages(newMsgs); setInput(""); setLoading(true);
    if (!isPremium) setFreeUsed(n=>n+1);
    try {
      const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        system:`You are the Temperiq AI guide. Keep it simple, warm, and real — use everyday language. The user's name is ${user.name}. Their temperament is ${temperament}. Their role is ${user.role}. Talk like a wise friend. Give practical advice they can use today. Keep replies to 2-3 sentences unless they ask for more. Use their strengths: ${t.strengths.slice(0,3).join(", ")} and watch-outs: ${t.weaknesses.slice(0,3).join(", ")}.`,
        messages:newMsgs,
      })});
      const data=await res.json();
      let reply="I'm having trouble connecting. Please try again.";
      if (data.content&&Array.isArray(data.content)) reply=data.content.map(c=>c.type==="text"?c.text:"").filter(Boolean).join("")||reply;
      setMessages(m=>[...m,{role:"assistant",content:reply}]);
    } catch { setMessages(m=>[...m,{role:"assistant",content:"I'm having trouble connecting. Please try again."}]); }
    setLoading(false);
  };

  const prompts=["What are my biggest blind spots?","How do I handle conflict better?","Tips for my relationships?","How can I grow at work?"];
  return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 64px)",maxWidth:480,margin:"0 auto"}}>
      <div style={{padding:"20px 16px 12px",borderBottom:"1px solid var(--border)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:40,height:40,borderRadius:"50%",background:t.bg,border:`1px solid ${t.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{t.element}</div>
          <div style={{flex:1}}><p style={{fontFamily:"var(--font-display)",fontSize:17}}>Temperiq Guide</p><p style={{fontSize:12,color:"var(--gold)"}}>● Online</p></div>
          {!isPremium&&<div style={{fontSize:12,color:freeUsed>=FREE_MSG_LIMIT?"#f87171":"var(--muted)",background:"var(--surface2)",padding:"4px 10px",borderRadius:20,border:`1px solid ${freeUsed>=FREE_MSG_LIMIT?"rgba(248,113,113,0.3)":"var(--border)"}`}}>{Math.max(FREE_MSG_LIMIT-freeUsed,0)} free left</div>}
        </div>
      </div>
      <div style={{flex:1,overflow:"auto",padding:"16px"}}>
        {messages.map((m,i)=><div key={i} style={{marginBottom:12,display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}><div className={m.role==="user"?"bubble-user":"bubble-ai"} style={{maxWidth:"82%",padding:"12px 16px",fontSize:14,lineHeight:1.6}}>{m.content}</div></div>)}
        {loading&&<div style={{display:"flex",gap:6,padding:"14px 16px",alignItems:"center"}}>{[0,.2,.4].map((d,i)=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:"var(--gold)",animation:`pulse 1s ${d}s ease-in-out infinite`}}/>)}</div>}
        {messages.length===1&&<div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:12}}>{prompts.map(p=><button key={p} onClick={()=>setInput(p)} style={{padding:"8px 14px",background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:20,color:"var(--muted)",fontSize:12,cursor:"pointer",fontFamily:"var(--font-body)"}}>{p}</button>)}</div>}
        <div ref={bottomRef}/>
      </div>
      {limitHit&&<div style={{margin:"0 16px 12px",padding:18,background:"rgba(212,168,67,0.06)",border:"1px solid rgba(212,168,67,0.2)",borderRadius:16,textAlign:"center"}}><p style={{fontSize:14,color:"var(--gold)",marginBottom:4,fontWeight:600}}>You've used your {FREE_MSG_LIMIT} free messages</p><p style={{fontSize:13,color:"var(--muted)",marginBottom:12}}>Upgrade to keep chatting anytime.</p><button className="btn-primary" onClick={onUpgrade} style={{fontSize:13,padding:"10px 28px"}}>Unlock Premium</button></div>}
      <div style={{padding:"12px 16px",borderTop:"1px solid var(--border)",display:"flex",gap:10}}>
        <input className="input" style={{flex:1,opacity:limitHit?.4:1}} placeholder={limitHit?"Upgrade to continue...":"Ask your guide anything..."} value={input} onChange={e=>!limitHit&&setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} disabled={limitHit}/>
        <button onClick={send} disabled={loading||!input.trim()||limitHit} style={{width:48,height:48,borderRadius:14,background:"var(--gold)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",opacity:input.trim()&&!loading&&!limitHit?1:.5,flexShrink:0,transition:"opacity .2s"}}><Icon name="send" size={18}/></button>
      </div>
    </div>
  );
}

// ── PREMIUM MODAL ─────────────────────────────────────────────────────────────
function PremiumModal({ onClose, onPurchase }) {
  const plans=[
    {id:"basic",   name:"Personal",     price:"$1.99",period:"/mo",color:"#c8a02a",features:["Full trait analysis","Daily quotes","Role-based advice","Unlimited chatbot"]},
    {id:"pro",     name:"Relationships",price:"$2.99",period:"/mo",color:"#3a5fb0",popular:true,features:["Everything in Personal","Couple compatibility","Conflict resolution guide","Marriage & parenting advice"]},
    {id:"premium", name:"Professional", price:"$5.99",period:"/mo",color:"#c94040",features:["Everything in Relationships","Team temperament reports","Employee management tips","Classroom dynamics guide","Priority support"]},
  ];
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:"var(--surface)",borderRadius:"24px 24px 0 0",padding:"28px 0 40px",width:"100%",maxWidth:600,animation:"slideUp .3s ease"}} onClick={e=>e.stopPropagation()}>
        <div style={{textAlign:"center",marginBottom:20,padding:"0 20px"}}>
          <div style={{width:40,height:4,background:"var(--border)",borderRadius:2,margin:"0 auto 20px"}}/>
          <h2 style={{fontFamily:"var(--font-display)",fontSize:28,marginBottom:6}}>Unlock Full Power</h2>
          <p style={{color:"var(--muted)",fontSize:13}}>← Swipe to see all plans →</p>
        </div>
        <div className="plans-scroll" style={{display:"flex",flexDirection:"row",gap:14,overflowX:"auto",padding:"8px 20px 16px",scrollSnapType:"x mandatory",WebkitOverflowScrolling:"touch",msOverflowStyle:"none",scrollbarWidth:"none"}}>
          {plans.map(plan=>(
            <div key={plan.id} style={{minWidth:255,flex:"0 0 255px",padding:20,border:`2px solid ${plan.popular?plan.color:"var(--border)"}`,borderRadius:20,background:plan.popular?`${plan.color}14`:"var(--surface2)",position:"relative",scrollSnapAlign:"start"}}>
              {plan.popular&&<div style={{position:"absolute",top:-10,right:14,background:plan.color,color:"white",fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:10,letterSpacing:1}}>POPULAR</div>}
              <div style={{marginBottom:14}}><p style={{fontFamily:"var(--font-display)",fontSize:20,color:plan.color,marginBottom:4}}>{plan.name}</p><span style={{fontFamily:"var(--font-display)",fontSize:28,fontWeight:700}}>{plan.price}</span><span style={{fontSize:12,color:"var(--muted)"}}>{plan.period}</span></div>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>{plan.features.map(f=><div key={f} style={{display:"flex",gap:8,alignItems:"flex-start"}}><span style={{color:plan.color,fontSize:13,marginTop:1,flexShrink:0}}>✓</span><span style={{fontSize:13,color:"var(--muted)",lineHeight:1.4}}>{f}</span></div>)}</div>
              <button onClick={()=>onPurchase(plan.id)} style={{width:"100%",padding:"12px",borderRadius:12,border:`1px solid ${plan.color}`,background:plan.popular?plan.color:"transparent",color:plan.popular?"white":plan.color,cursor:"pointer",fontFamily:"var(--font-body)",fontWeight:600,fontSize:14}}>Get {plan.name}</button>
            </div>
          ))}
        </div>
        <p style={{textAlign:"center",fontSize:12,color:"var(--muted)",marginTop:8,padding:"0 20px"}}>Cancel anytime · No hidden fees</p>
      </div>
    </div>
  );
}

// ── BOTTOM NAV ────────────────────────────────────────────────────────────────
function BottomNav({ active, onChange, isPremium, onUpgrade }) {
  return (
    <div style={{position:"fixed",bottom:0,left:0,right:0,background:"var(--surface)",borderTop:"1px solid var(--border)",display:"flex",zIndex:50}}>
      <button className={`nav-tab ${active==="home"?"active":""}`} onClick={()=>onChange("home")}><Icon name="home" size={20}/><span>Home</span></button>
      <button className={`nav-tab ${active==="chat"?"active":""}`} onClick={()=>onChange("chat")}><Icon name="chat" size={20}/><span>Guide</span></button>
      <button className="nav-tab" onClick={onUpgrade} style={{color:"var(--gold)"}}><Icon name="star" size={20}/><span>{isPremium?"Premium ✓":"Premium"}</span></button>
      <button className={`nav-tab ${active==="profile"?"active":""}`} onClick={()=>onChange("profile")}><Icon name="user" size={20}/><span>Profile</span></button>
    </div>
  );
}

// ── PROFILE ───────────────────────────────────────────────────────────────────
function Profile({ user, temperament, percentages, isPremium, onLogout, onRetake, onUpgrade }) {
  const t=TEMPERAMENTS[temperament];
  const [toast,setToast]=useState("");
  const showToast=msg=>{setToast(msg);setTimeout(()=>setToast(""),2500);};
  const handleShare=()=>{
    const top=percentages?Object.entries(percentages).sort((a,b)=>b[1]-a[1])[0]:null;
    const txt=`I just discovered I'm ${top?top[1]+"% ":""}${temperament} on Temperiq — ${TEMPERAMENTS[temperament].tagline}. Find out yours!`;
    if (navigator.share){navigator.share({title:"My Temperiq Result",text:txt,url:window.location.href}).catch(()=>{});}
    else{navigator.clipboard?.writeText(txt).then(()=>showToast("Copied to clipboard!"));}
  };
  const handleSupport=()=>{window.location.href="mailto:support@temperiq.app?subject=Temperiq Support&body=Hi, I need help with: ";};
  const menu=[
    {label:"Retake Temperament Quiz",fn:onRetake,  icon:"✦"},
    {label:"Share My Results",        fn:handleShare,icon:"↗"},
    ...(!isPremium?[{label:"Upgrade to Premium",fn:onUpgrade,icon:"★"}]:[]),
    {label:"Contact Support",         fn:handleSupport,icon:"?"},
  ];
  return (
    <div style={{maxWidth:480,margin:"0 auto",padding:"32px 16px 100px",position:"relative"}}>
      {toast&&<div style={{position:"fixed",top:24,left:"50%",transform:"translateX(-50%)",background:"#1e1a2d",border:"1px solid rgba(212,168,67,0.3)",borderRadius:12,padding:"10px 20px",fontSize:14,color:"var(--gold)",zIndex:200,animation:"fadeUp .3s ease",whiteSpace:"nowrap"}}>✓ {toast}</div>}
      <h2 style={{fontFamily:"var(--font-display)",fontSize:28,marginBottom:24}}>My Profile</h2>
      <div className="card fade-up" style={{padding:24,marginBottom:16,borderColor:t.color+"33"}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{width:70,height:70,borderRadius:"50%",background:t.bg,border:`2px solid ${t.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,flexShrink:0}}>{t.element}</div>
          <div><h3 style={{fontFamily:"var(--font-display)",fontSize:22}}>{user.name}</h3><p style={{color:"var(--muted)",fontSize:13,marginTop:4}}>{user.email}</p><span style={{fontSize:13,color:t.color,fontWeight:600}}>{temperament}</span>{user.role&&<span style={{fontSize:12,color:"var(--muted)",marginLeft:8,textTransform:"capitalize"}}>· {user.role}</span>}</div>
        </div>
      </div>
      <div className="card fade-up" style={{padding:20,marginBottom:12}}>
        <p style={{fontSize:12,color:"var(--muted)",letterSpacing:2,textTransform:"uppercase",marginBottom:16}}>Your Plan</p>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div><p style={{fontFamily:"var(--font-display)",fontSize:18}}>{isPremium?"Premium Member":"Free Plan"}</p><p style={{fontSize:13,color:"var(--muted)",marginTop:4}}>{isPremium?"Full access unlocked ✓":`${FREE_MSG_LIMIT} free guide messages`}</p></div>
          {isPremium?<span style={{color:"var(--gold)",fontSize:22}}>★</span>:<button className="btn-primary" onClick={onUpgrade} style={{fontSize:12,padding:"8px 16px"}}>Upgrade</button>}
        </div>
      </div>
      <div className="card fade-up" style={{marginBottom:12,overflow:"hidden"}}>
        {menu.map((item,idx)=>(
          <button key={item.label} onClick={item.fn} style={{display:"flex",alignItems:"center",gap:14,padding:"16px 20px",background:"none",border:"none",borderBottom:idx<menu.length-1?"1px solid var(--border)":"none",cursor:"pointer",color:"var(--text)",fontFamily:"var(--font-body)",fontSize:15,width:"100%",textAlign:"left"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"} onMouseLeave={e=>e.currentTarget.style.background="none"}>
            <span style={{color:"var(--gold)",width:22,textAlign:"center",fontSize:16,flexShrink:0}}>{item.icon}</span>
            <span>{item.label}</span>
            <svg style={{marginLeft:"auto",opacity:.3}} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        ))}
      </div>
      <button onClick={onLogout} style={{width:"100%",padding:"14px",background:"rgba(201,64,64,0.06)",border:"1px solid rgba(201,64,64,0.15)",borderRadius:14,color:"#c94040",cursor:"pointer",fontFamily:"var(--font-body)",fontSize:15,marginTop:8}} onMouseEnter={e=>e.currentTarget.style.background="rgba(201,64,64,0.12)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(201,64,64,0.06)"}>
        Sign Out
      </button>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen,setScreen]           = useState("loading");
  const [user,setUser]               = useState(null);
  const [temperament,setTemperament] = useState(null);
  const [percentages,setPercentages] = useState(null);
  const [secondaryTemp,setSecondary] = useState(null);
  const [isPremium,setIsPremium]     = useState(false);
  const [showPremium,setShowPremium] = useState(false);
  const [navTab,setNavTab]           = useState("home");

  // ── On app load: check if user is already logged in ──────────────────────
  useEffect(()=>{
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const u = session.user;
        // Load profile
        const { data: profile } = await supabase.from("users").select("*").eq("id", u.id).single();
        setUser({ name: profile?.name || u.user_metadata?.name || "Friend", email: u.email, role: profile?.role || "individual", uid: u.id });
        // Load saved quiz results
        const { data: results } = await supabase.from("results").select("*").eq("id", u.id).single();
        if (results?.temperament) {
          setTemperament(results.temperament);
          setPercentages(results.percentages);
          setSecondary(results.secondary_temp);
          setIsPremium(results.is_premium || false);
          setScreen("app");
        } else {
          setScreen("quiz");
        }
      } else {
        setScreen("onboarding");
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = u => { setUser(u); };

  const handleQuizDone = async (t, p, s) => {
    setTemperament(t); setPercentages(p); setSecondary(s);
    if (user?.uid) {
      await supabase.from("results").upsert({ id: user.uid, temperament: t, percentages: p, secondary_temp: s || null, is_premium: false, updated_at: new Date().toISOString() });
    }
    setScreen("result");
  };

  const handleResultDone = () => setScreen("app");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); setTemperament(null); setPercentages(null); setSecondary(null);
    setIsPremium(false); setScreen("onboarding");
  };

  const handleRetake = () => setScreen("quiz");

  if (screen==="loading") return <><FontLink/><LoadingScreen/></>;

  return (
    <>
      <FontLink/>
      {screen==="onboarding" && <Onboarding onDone={()=>setScreen("auth")}/>}
      {screen==="auth"       && <Auth onAuth={handleAuth}/>}
      {screen==="quiz"       && <Quiz onComplete={handleQuizDone}/>}
      {screen==="result"     && <Result temperament={temperament} percentages={percentages} secondaryTemp={secondaryTemp} onContinue={handleResultDone}/>}
      {screen==="app" && (
        <div style={{minHeight:"100vh",paddingTop:16}}>
          {navTab==="home"    && <Dashboard user={user} temperament={temperament} percentages={percentages} secondaryTemp={secondaryTemp} isPremium={isPremium} onUpgrade={()=>setShowPremium(true)} onRetake={handleRetake}/>}
          {navTab==="chat"    && <Chatbot   user={user} temperament={temperament} isPremium={isPremium} onUpgrade={()=>setShowPremium(true)}/>}
          {navTab==="profile" && <Profile   user={user} temperament={temperament} percentages={percentages} isPremium={isPremium} onLogout={handleLogout} onRetake={handleRetake} onUpgrade={()=>setShowPremium(true)}/>}
          <BottomNav active={navTab} onChange={setNavTab} isPremium={isPremium} onUpgrade={()=>setShowPremium(true)}/>
        </div>
      )}
      <div style={{ textAlign: "center", padding: "16px", color: "var(--muted)", fontSize: 12, letterSpacing: 1 }}>
        © 2027 Maxwell Divine · Temperiq
      </div>
      {showPremium && <PremiumModal onClose={()=>setShowPremium(false)} onPurchase={()=>{setIsPremium(true);setShowPremium(false);}}/>}
    </>
  );
}
