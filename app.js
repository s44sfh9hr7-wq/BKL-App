
// Veranstaltungstermin – später aus dem Adminbereich / der Datenbank laden.
const EVENT_DATE = new Date("2027-05-30T14:00:00+02:00");
const EVENT_END = new Date("2027-05-30T20:00:00+02:00");

const $ = (id) => document.getElementById(id);
const pad = (n, len=2) => String(n).padStart(len, "0");

function updateCountdown(){
  const now = new Date();
  const diff = EVENT_DATE - now;
  const dateLabel = new Intl.DateTimeFormat("de-DE", {
    day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit"
  }).format(EVENT_DATE).replace(",", " ·");
  $("eventDate").textContent = `${dateLabel} UHR`;

  if(diff > 0){
    const totalSec = Math.floor(diff/1000);
    const days = Math.floor(totalSec/86400);
    const hours = Math.floor((totalSec%86400)/3600);
    const minutes = Math.floor((totalSec%3600)/60);
    const seconds = totalSec%60;
    $("days").textContent = pad(days,3);
    $("hours").textContent = pad(hours);
    $("minutes").textContent = pad(minutes);
    $("seconds").textContent = pad(seconds);

    if(diff < 24*60*60*1000){
      $("eventState").textContent = "BKL 2027 – HEUTE!";
    } else if(diff < 7*24*60*60*1000){
      $("eventState").textContent = "BKL 2027 – ENDSPURT";
    } else {
      $("eventState").textContent = "BKL 2027 – DER COUNTDOWN LÄUFT";
    }
  } else if(now <= EVENT_END){
    $("days").textContent = "BKL";
    $("hours").textContent = "20";
    $("minutes").textContent = "27";
    $("seconds").textContent = "!";
    $("eventState").textContent = "BKL 2027 LÄUFT – LIVE VERFOLGEN";
  } else {
    $("days").textContent = "---";
    $("hours").textContent = "--";
    $("minutes").textContent = "--";
    $("seconds").textContent = "--";
    $("eventState").textContent = "BKL 2027 – BEENDET";
  }
}
updateCountdown();
setInterval(updateCountdown,1000);

const drawer = $("drawer");
const scrim = $("scrim");
function openMenu(){ drawer.classList.add("open"); scrim.classList.add("show"); drawer.setAttribute("aria-hidden","false"); }
function closeMenu(){ drawer.classList.remove("open"); scrim.classList.remove("show"); drawer.setAttribute("aria-hidden","true"); }
$("menuBtn").addEventListener("click",openMenu);
$("closeMenuBtn").addEventListener("click",closeMenu);
scrim.addEventListener("click",closeMenu);

const modal = $("modal");

function showPage(page){
  document.querySelectorAll(".page").forEach(el=>el.classList.remove("active-page"));
  let target = $("homePage");
  if(page === "events") target = $("eventsPage");
  if(page === "current-event") target = $("eventDetailPage");
  if(page === "account") target = $("accountPage");
  if(page === "participation") target = $("participationPage");
  if(page === "team") target = $("teamPage");
  if(page === "register") target = $("registerPage");
  if(page === "participant-registration") target = $("participantRegistrationPage");
  if(page === "admin") target = $("adminPage");
  if(page === "admin-approval") target = $("adminApprovalPage");
  if(page === "gallery") target = $("galleryPage");
  if(page === "gallery-moderation") target = $("galleryModerationPage");
  target.classList.add("active-page");
  window.scrollTo({top:0, behavior:"smooth"});
  document.querySelectorAll(".bottom-nav button").forEach(b=>b.classList.remove("active"));
  if(page === "home"){ const b=document.querySelector('.bottom-nav [data-page="home"]'); if(b)b.classList.add("active"); }
  if(page === "account"){ const b=document.querySelector('.bottom-nav [data-page="account"]'); if(b)b.classList.add("active"); }
}

const pageNames = {
  home:"Startseite",
  events:"Veranstaltungen",
  "current-event":"BKL 2027 – Veranstaltungsseite",
  signup:"Anmeldung",
  team:"Mein Team",
  live:"Live-Karte",
  scanner:"QR-Scanner",
  results:"Ergebnisse & Rangliste",
  gallery:"Galerie",
  news:"News",
  sponsors:"Sponsoren",
  legal:"Rechtliches & Dokumente",
  contact:"Kontakt",
  account:"Mein Konto",
  impressum:"Impressum",
  privacy:"Datenschutz",
  agb:"AGB",
  terms:"Teilnahmebedingungen",
  "past-event":"BKL 2026 – Archiv",
  "share-event":"Veranstaltung teilen",
  "route-to-start":"Route zum Startpunkt",
  "forgot-password":"Passwort vergessen",
  "my-registration":"Meine Anmeldung",
  "profile-data":"Persönliche Daten",
  "create-team":"Neues Team gründen",
  "join-team-code":"Team per Code beitreten",
  "team-search":"Team suchen",
  "share-team-code":"Einladung teilen",
  "participant-submit":"Teilnehmeranmeldung abschließen"
};

function showModal(title,text,actions=[]){
  $("modalTitle").textContent=title;
  $("modalText").textContent=text;
  const holder=$("modalActions");
  holder.innerHTML="";
  actions.forEach((a,i)=>{
    const b=document.createElement("button");
    b.textContent=a.label;
    b.className=i===0?"primary":"secondary";
    b.onclick=()=>{ if(a.action) a.action(); else modal.close(); };
    holder.appendChild(b);
  });
  modal.showModal();
}
$("modalClose").addEventListener("click",()=>modal.close());

document.addEventListener("click",(e)=>{
  const target=e.target.closest("[data-page]");
  if(!target) return;
  closeMenu();
  const page=target.dataset.page;

  // Real prototype pages
  if(page==="home"){ showPage("home"); return; }
  if(page==="events"){ showPage("events"); return; }
  if(page==="current-event"){ showPage("current-event"); return; }
  if(page==="account"){ showPage("account"); return; }
  if(page==="register"){ showPage("register"); return; }
  if(page==="admin"){
    if(!demoLoggedIn || !["orga","master"].includes(demoRole)){
      showModal("Keine Berechtigung","Der BKL-Administrationsbereich ist ausschließlich für Orga-Team-Mitglieder und Master-Admins sichtbar.",[{label:"OK"}]);
      return;
    }
    renderAdminRole();
    showPage("admin");
    return;
  }
  if(page==="admin-approval"){
    if(!demoLoggedIn || !["orga","master"].includes(demoRole)){
      showModal("Keine Berechtigung","Diese Funktion ist nur für das BKL-Orga-Team verfügbar.",[{label:"OK"}]);
      return;
    }
    showPage("admin-approval"); return;
  }
  if(page==="gallery"){ showPage("gallery"); return; }
  if(page==="gallery-moderation"){
    if(!demoLoggedIn || !["orga","master"].includes(demoRole)){
      showModal("Keine Berechtigung","Die Galerie-Freigabe ist nur für das BKL-Orga-Team verfügbar.",[{label:"OK"}]);
      return;
    }
    showPage("gallery-moderation"); return;
  }

  // "Jetzt anmelden": first account/login, then participation.
  if(page==="signup"){
    startBklHymn();
    if(!demoLoggedIn){
      showPage("account");
      showModal("Zuerst BKL-Konto",
        "Für die aktive Anmeldung brauchst du zunächst ein BKL-Konto. Erstelle ein Konto oder melde dich an. Danach kannst du ein Team gründen, beitreten oder suchen.",
        [{label:"ZU MEINEM KONTO"}]);
    } else if(!demoParticipantEligible){
      showPage("account");
      showModal("Teilnahme nicht freigeschaltet",
        "Dein Konto kann die Zuschauerfunktionen nutzen. Die aktive Teilnahme ist für dieses Demo-Konto aufgrund der Altersprüfung nicht freigeschaltet.",
        [{label:"OK"}]);
    } else {
      showPage("participation");
    }
    return;
  }

  if(page==="participation"){
    if(demoLoggedIn && isOrganizerRole()){
      showModal("Teilnahme nicht möglich",
        "Als Mitglied des BKL-Orga-Teams sind Sie nicht berechtigt, aktiv am Bierkistenlauf teilzunehmen. Um als Teilnehmer anzutreten, muss Ihrem Konto zuvor die Orga-Team-Berechtigung entzogen werden.",
        [{label:"OK"}]);
      return;
    }
    if(!demoLoggedIn){ showPage("account"); return; }
    if(!demoParticipantEligible){
      showModal("Teilnahme nicht möglich",
        "Für dieses Konto sind Team- und Teilnehmerfunktionen aufgrund der Altersprüfung gesperrt.",
        [{label:"OK"}]);
      return;
    }
    showPage("participation");
    return;
  }

  if(page==="team"){
    if(demoLoggedIn && isOrganizerRole()){
      showModal("Teilnahme nicht möglich",
        "Als Mitglied des BKL-Orga-Teams sind Sie nicht berechtigt, aktiv am Bierkistenlauf teilzunehmen. Um als Teilnehmer anzutreten, muss Ihrem Konto zuvor die Orga-Team-Berechtigung entzogen werden.",
        [{label:"OK"}]);
      return;
    }
    if(!demoLoggedIn){ showPage("account"); return; }
    if(!demoParticipantEligible){
      showModal("Teamfunktion gesperrt",
        "Für dieses Konto sind Teamfunktionen aufgrund der Altersprüfung nicht verfügbar.",
        [{label:"OK"}]);
      return;
    }
    demoHasTeam=true;
    renderTeamState();
    showPage("team");
    return;
  }

  if(page==="participant-registration"){
    if(demoLoggedIn && isOrganizerRole()){
      showModal("Teilnahme nicht möglich",
        "Als Mitglied des BKL-Orga-Teams sind Sie nicht berechtigt, aktiv am Bierkistenlauf teilzunehmen. Um als Teilnehmer anzutreten, muss Ihrem Konto zuvor die Orga-Team-Berechtigung entzogen werden.",
        [{label:"OK"}]);
      return;
    }
    if(!demoLoggedIn){ showPage("account"); return; }
    if(!demoParticipantEligible){
      showModal("Teilnehmeranmeldung gesperrt",
        "Das aktuell eingestellte Mindestalter für BKL 2027 wird am Veranstaltungstag nicht erreicht.",
        [{label:"OK"}]);
      return;
    }
    showPage("participant-registration");
    return;
  }

  // Protected future functions
  const protection=target.dataset.protected;
  if(protection==="registered"){
    if(demoLoggedIn){
      showModal("Live-Karte",
        "Dein Konto ist registriert. Die echte Live-Karte wird in einem späteren Entwicklungsschritt angebunden.",
        [{label:"OK"}]);
    } else {
      showModal("Anmeldung erforderlich",
        "Erstelle ein kostenloses BKL-Konto oder melde dich an, um die Live-Karte zu nutzen.",
        [{label:"ZU MEINEM KONTO", action:()=>{ modal.close(); showPage("account"); }},{label:"ABBRECHEN"}]);
    }
  } else if(protection==="participant"){
    if(demoLoggedIn && demoParticipantEligible && demoHasTeam){
      showModal("QR-Scanner",
        "Die Teilnehmer- und Teamprüfung ist erfüllt. Der echte QR-Scanner wird später angebunden.",
        [{label:"OK"}]);
    } else {
      showModal("Teilnehmer-Funktion",
        "Der QR-Scanner wird später nur für freigeschaltete Teilnehmer eines Teams verfügbar sein.",
        [{label:"OK"}]);
    }
  } else {
    showModal(pageNames[page] || "BKL",
      "Diese Funktion ist im aktuellen Prototyp noch ein Platzhalter und wird in den nächsten Entwicklungsschritten umgesetzt.",
      [{label:"OK"}]);
  }
});


let demoLoggedIn=false,demoHasTeam=false,demoParticipantEligible=true,demoRole="user";
let currentAuthUser=null,currentProfile=null;

async function loadOwnProfile(){
  if(!window.bklSupabase || !currentAuthUser){ currentProfile=null; return; }
  const {data,error}=await window.bklSupabase.from("profiles").select("*").eq("id",currentAuthUser.id).maybeSingle();
  if(error){ console.error("Profil konnte nicht geladen werden:",error); currentProfile=null; return; }
  currentProfile=data||null;
  demoRole=(currentProfile?.role==="master"||currentProfile?.role==="orga")?currentProfile.role:"user";
  if(currentProfile?.date_of_birth){
    demoParticipantEligible=ageOnDate(new Date(currentProfile.date_of_birth+"T12:00:00"),eventDay)>=eventMinimumAge;
  }
}

async function syncAuthState(){
  if(!window.bklSupabase) return;
  const {data:{session}}=await window.bklSupabase.auth.getSession();
  currentAuthUser=session?.user||null;
  demoLoggedIn=!!currentAuthUser;
  if(demoLoggedIn) await loadOwnProfile(); else {currentProfile=null;demoRole="user";demoHasTeam=false;demoParticipantEligible=true;}
  const identity=$("accountIdentity");
  if(identity) identity.textContent=currentProfile?.alias ? `${currentProfile.alias} · ${currentAuthUser.email||""}` : (currentAuthUser?.email||"");
  renderAccountState(); renderTeamState(); renderRoleState(); renderAdminRole();
}

function renderAccountState(){
  const a=$("accountLoggedOut"),b=$("accountLoggedIn");
  if(!a||!b)return;
  a.classList.toggle("hidden",demoLoggedIn);
  b.classList.toggle("hidden",!demoLoggedIn);

  const p=$("participateAccountBtn"), t=$("myTeamAccountBtn"), hint=$("participateAccountHint");
  if(p){
    p.disabled = demoLoggedIn && !demoParticipantEligible;
    if(hint) hint.textContent = demoParticipantEligible ? "Team gründen oder beitreten" : "Aufgrund der Altersprüfung gesperrt";
  }
  if(t) t.disabled = demoLoggedIn && !demoParticipantEligible;
}
function renderTeamState(){
  const a=$("teamEmptyState"),b=$("teamDemoState");
  if(!a||!b)return;
  a.classList.toggle("hidden",demoHasTeam);
  b.classList.toggle("hidden",!demoHasTeam);
}

function isOrganizerRole(){ return demoRole==="orga" || demoRole==="master"; }

function renderRoleState(){
  const adminEntry=$("accountAdminEntry"), drawerEntry=$("drawerAdminEntry");
  const allowed=demoLoggedIn && isOrganizerRole();
  if(adminEntry) adminEntry.classList.toggle("hidden",!allowed);
  if(drawerEntry) drawerEntry.classList.toggle("hidden",!allowed);

  document.querySelectorAll(".role-switch").forEach(btn=>{
    btn.classList.toggle("active",btn.dataset.demoRole===demoRole);
  });

  const p=$("participateAccountBtn"), t=$("myTeamAccountBtn"), hint=$("participateAccountHint");
  if(demoLoggedIn && isOrganizerRole()){
    if(p) p.disabled=true;
    if(t) t.disabled=true;
    if(hint) hint.textContent="Als Orga-Team-Mitglied nicht möglich";
  } else {
    renderAccountState();
  }
}

function renderAdminRole(){
  const roleLine=$("adminRoleLine"), system=$("systemAdminModule");
  if(roleLine) roleLine.textContent = demoRole==="master" ? "Angemeldet als Master-Admin" : "Angemeldet als Orga-Team-Mitglied";
  if(system) system.classList.toggle("hidden",demoRole!=="master");
}

document.querySelectorAll("[data-admin-module]").forEach(btn=>btn.addEventListener("click",()=>{
  const key=btn.dataset.adminModule;
  if(key==="system" && demoRole!=="master"){
    showModal("Master-Rechte erforderlich","Dieser Bereich ist ausschließlich für Master-Admins verfügbar.",[{label:"OK"}]);
    return;
  }
  if(key==="event"){
    closeAdminPanels();
    openEventAdmin();
    return;
  }
  if(key==="teams"){ closeAdminPanels(); openTeamAdmin(); return; }
  if(key==="payment"){ closeAdminPanels(); openPaymentAdmin(); return; }
  if(key==="rules"){ closeAdminPanels(); openRulesAdmin(); return; }
  if(key==="route"){ closeAdminPanels(); openRouteAdmin(); return; }
  if(key==="bonus"){ closeAdminPanels(); openBonusAdmin(); return; }
  if(key==="race"){ closeAdminPanels(); openRaceAdmin(); return; }
  if(key==="live"||key==="map"){ closeAdminPanels(); openLiveMapAdmin(); return; }
  closeAdminPanels();
  const names={
    teams:"Teams & Teilnehmer",rules:"Regelwerk & Strafenkatalog",
    route:"QR & Checkpoints",bonus:"Bonusstationen",race:"Rennsteuerung",live:"Live-Karte intern",
    sponsors:"Sponsoren & Inhalte",audit:"Änderungsprotokoll",system:"System & Administration"
  };
  const ws=$("adminWorkspace");
  if(ws){
    ws.classList.remove("hidden");
    ws.innerHTML=`<span class="eyebrow">V0.8.1 · ${demoRole==="master"?"MASTER":"ORGA"}</span><h2>${names[key]||"ADMIN-MODUL"}</h2><p>Dieses Modul ist im Admin-Dashboard vorgesehen und bereits korrekt rollenbasiert erreichbar. Die vollständige Fachlogik folgt im nächsten Ausbauschritt.</p>`;
    ws.scrollIntoView({behavior:"smooth",block:"start"});
  }
}));

const loginBtn=$("realLoginBtn");
if(loginBtn) loginBtn.addEventListener("click",async()=>{
  if(!window.bklSupabase){showModal("Verbindung fehlt","Supabase ist nicht verfügbar.",[{label:"OK"}]);return;}
  const email=$("loginEmail")?.value.trim(), password=$("loginPassword")?.value||"";
  if(!email||!password){showModal("Angaben fehlen","Bitte E-Mail-Adresse und Passwort eingeben.",[{label:"OK"}]);return;}
  loginBtn.disabled=true;
  const {error}=await window.bklSupabase.auth.signInWithPassword({email,password});
  loginBtn.disabled=false;
  if(error){showModal("Anmeldung fehlgeschlagen",error.message,[{label:"OK"}]);return;}
  await syncAuthState(); startBklHymn();
  showModal("Angemeldet","Du bist jetzt mit deinem echten BKL-Konto angemeldet.",[{label:"WEITER"}]);
});

const logoutBtn=$("realLogoutBtn");
if(logoutBtn) logoutBtn.addEventListener("click",async()=>{
  if(window.bklSupabase) await window.bklSupabase.auth.signOut();
  await syncAuthState();
  showPage("account");
});

const acc=$("acceptJoinRequest");
if(acc) acc.addEventListener("click",()=>{
  acc.closest(".join-request").innerHTML='<div><b>Max Mustermann</b><small>Beitrittsanfrage angenommen ✓</small></div>';
});
const dec=$("declineJoinRequest");
if(dec) dec.addEventListener("click",()=>{
  dec.closest(".join-request").innerHTML='<div><b>Max Mustermann</b><small>Beitrittsanfrage abgelehnt</small></div>';
});



const TEAM_STORAGE_KEY="bkl-v082-teams";
const defaultAdminTeams=[
 {id:"t1",name:"Die Hopfenkrieger",status:"confirmed",payment:"confirmed",submitted:"12.04.2027 · 18:42",note:"",
  members:[
   {alias:"Toto",real:"Thomas Beispiel",email:"toto@example.de",dob:"1991-05-27",captain:true,consents:true},
   {alias:"Bierbaron",real:"Max Muster",email:"max@example.de",dob:"1990-02-14",captain:false,consents:true},
   {alias:"KistenKalle",real:"Karl Demo",email:"karl@example.de",dob:"1988-11-03",captain:false,consents:true},
   {alias:"HopfenHexer",real:"Jan Test",email:"jan@example.de",dob:"1993-08-19",captain:false,consents:true}
  ]},
 {id:"t2",name:"Kronkorkenkommando",status:"submitted",payment:"open",submitted:"18.04.2027 · 09:11",note:"",
  members:[
   {alias:"Korki",real:"Anna Beispiel",email:"anna@example.de",dob:"1994-03-09",captain:true,consents:true},
   {alias:"Malzi",real:"Lisa Muster",email:"lisa@example.de",dob:"1996-06-22",captain:false,consents:false},
   {alias:"Schaumi",real:"Peter Demo",email:"peter@example.de",dob:"1987-10-01",captain:false,consents:true}
  ]},
 {id:"t3",name:"Durstige Legion",status:"review",payment:"confirmed",submitted:"20.04.2027 · 21:05",note:"Teilnehmerkonto gelöscht – Ersatz erforderlich.",
  members:[
   {alias:"Legionär1",real:"Stefan Muster",email:"stefan@example.de",dob:"1992-12-11",captain:true,consents:true},
   {alias:"Legionär2",real:"Daniel Demo",email:"daniel@example.de",dob:"1989-04-05",captain:false,consents:true}
  ]},
 {id:"t4",name:"Die Gerstengarde",status:"draft",payment:"open",submitted:"Noch nicht eingereicht",note:"",
  members:[
   {alias:"Gerste",real:"Chris Beispiel",email:"chris@example.de",dob:"1995-01-15",captain:true,consents:true}
  ]}
];
let adminTeams=[];
let selectedAdminTeamId=null;
function loadAdminTeams(){
 try{adminTeams=JSON.parse(localStorage.getItem(TEAM_STORAGE_KEY))||structuredClone(defaultAdminTeams);}
 catch(e){adminTeams=JSON.parse(JSON.stringify(defaultAdminTeams));}
}
function saveAdminTeams(){localStorage.setItem(TEAM_STORAGE_KEY,JSON.stringify(adminTeams));}
function teamStatusLabel(s){return ({draft:"ENTWURF",submitted:"ANMELDUNG EINGEGANGEN",confirmed:"TEILNAHME BESTÄTIGT",review:"PRÜFUNG ERFORDERLICH"})[s]||s;}
function teamStatusClass(s){return "team-status-"+s;}
function openTeamAdmin(){
 $("adminWorkspace")?.classList.add("hidden"); $("eventAdminPanel")?.classList.add("hidden");
 $("teamAdminPanel")?.classList.remove("hidden"); $("teamAdminDetail")?.classList.add("hidden");
 renderAdminTeams(); $("teamAdminPanel")?.scrollIntoView({behavior:"smooth",block:"start"});
}
function renderAdminTeams(){
 const q=($("teamAdminSearch")?.value||"").toLowerCase(), f=$("teamAdminFilter")?.value||"all";
 const rows=adminTeams.filter(t=>(f==="all"||t.status===f)&&
   (t.name.toLowerCase().includes(q)||t.members.some(m=>(m.alias+" "+m.real).toLowerCase().includes(q))));
 if($("teamCountBadge")) $("teamCountBadge").textContent=`${rows.length} TEAM${rows.length===1?"":"S"}`;
 const list=$("teamAdminList"); if(!list)return;
 list.innerHTML=rows.length?rows.map(t=>`
  <button class="team-admin-card" data-team-id="${t.id}">
   <div><strong>${t.name}</strong><small>${t.members.length}/4 Teilnehmer · Kapitän: ${t.members.find(m=>m.captain)?.alias||"–"}</small></div>
   <div class="team-card-right"><span class="team-status ${teamStatusClass(t.status)}">${teamStatusLabel(t.status)}</span><small>Zahlung: ${t.payment==="confirmed"?"bestätigt":"offen"}</small></div>
  </button>`).join(""):`<div class="empty-state"><h3>KEINE TEAMS GEFUNDEN</h3><p>Die Suche oder der Filter liefert keine Treffer.</p></div>`;
 list.querySelectorAll("[data-team-id]").forEach(b=>b.addEventListener("click",()=>openTeamDetail(b.dataset.teamId)));
}
function openTeamDetail(id){
 selectedAdminTeamId=id; const t=adminTeams.find(x=>x.id===id); if(!t)return;
 $("teamAdminList")?.classList.add("hidden"); $("teamAdminDetail")?.classList.remove("hidden");
 const consentDone=t.members.filter(m=>m.consents).length;
 $("teamDetailContent").innerHTML=`
  <div class="team-detail-head"><div><span class="eyebrow">TEAM</span><h2>${t.name}</h2></div><span class="team-status ${teamStatusClass(t.status)}">${teamStatusLabel(t.status)}</span></div>
  ${t.note?`<div class="team-review-warning">⚠ ${t.note}</div>`:""}
  <div class="team-detail-facts">
   <div><small>TEILNEHMER</small><strong>${t.members.length}/4</strong></div>
   <div><small>BESTÄTIGUNGEN</small><strong>${consentDone}/${t.members.length}</strong></div>
   <div><small>ZAHLUNG</small><strong>${t.payment==="confirmed"?"BESTÄTIGT":"OFFEN"}</strong></div>
   <div><small>EINGEREICHT</small><strong>${t.submitted}</strong></div>
  </div>
  <h3 class="admin-section-title">TEILNEHMER</h3>
  <div class="member-admin-list">${t.members.map((m,i)=>`
   <div class="member-admin-row">
    <div><strong>${m.alias}${m.captain?' <span class="captain-chip">KAPITÄN</span>':''}</strong><small>${m.real} · ${m.email}<br>Geb.: ${m.dob.split("-").reverse().join(".")}</small></div>
    <div class="member-admin-state"><span>${m.consents?"✓ Bestätigt":"! Offen"}</span>${t.status!=="draft"?`<button class="mini-action" data-replace-index="${i}">ERSETZEN</button>`:""}</div>
   </div>`).join("")}</div>
  <label class="team-note-label">Interne Orga-Notiz<textarea id="teamInternalNote" rows="3" placeholder="Nur für Orga/Master sichtbar">${t.note||""}</textarea></label>
  <div class="event-admin-actions"><button id="saveTeamNoteBtn" class="btn btn-outline">NOTIZ SPEICHERN</button></div>
  <div class="team-log"><strong>LETZTE VERWALTUNG</strong><small>${t.lastChange||"Keine administrative Änderung im Prototyp."}</small></div>`;
 $("teamDetailContent").querySelectorAll("[data-replace-index]").forEach(b=>b.addEventListener("click",()=>replaceParticipant(Number(b.dataset.replaceIndex))));
 $("saveTeamNoteBtn")?.addEventListener("click",()=>{t.note=$("teamInternalNote").value.trim();t.lastChange=`Orga-Notiz geändert · ${new Date().toLocaleString("de-DE")}`;saveAdminTeams();showModal("Notiz gespeichert","Die interne Orga-Notiz wurde lokal gespeichert.",[{label:"OK"}]);});
}
function replaceParticipant(idx){
 const t=adminTeams.find(x=>x.id===selectedAdminTeamId), old=t?.members[idx]; if(!t||!old)return;
 showModal("Teilnehmer ersetzen",`„${old.alias}“ wird administrativ ersetzt. Der Ersatz muss ein BKL-Konto besitzen, die Altersgrenze erfüllen und seine persönlichen Bestätigungen selbst abgeben.`,[
  {label:"ABBRECHEN"},
  {label:"ERSATZ VORBEREITEN",onClick:()=>{
    const alias=prompt("Alias des Ersatzteilnehmers:"); if(!alias)return;
    const real=prompt("Vor- und Nachname des Ersatzteilnehmers:"); if(!real)return;
    const email=prompt("E-Mail-Adresse des Ersatzteilnehmers:"); if(!email)return;
    t.members[idx]={alias:alias.trim(),real:real.trim(),email:email.trim(),dob:"1990-01-01",captain:old.captain,consents:false};
    t.status="review"; t.note=`Ersatzteilnehmer ${alias.trim()} muss persönliche Bestätigungen abgeben.`;
    t.lastChange=`Teilnehmer ersetzt: ${old.alias} → ${alias.trim()} · ${new Date().toLocaleString("de-DE")} · Orga`;
    saveAdminTeams(); openTeamDetail(t.id);
    showModal("Ersatz vorbereitet","Der neue Teilnehmer wurde eingetragen und das Team auf „Prüfung erforderlich“ gesetzt. Die endgültige Teilnahmebestätigung darf erst nach den persönlichen Zustimmungen erfolgen.",[{label:"OK"}]);
  }}
 ]);
}
$("teamAdminSearch")?.addEventListener("input",renderAdminTeams);
$("teamAdminFilter")?.addEventListener("change",renderAdminTeams);
$("teamDetailBack")?.addEventListener("click",()=>{$("teamAdminDetail")?.classList.add("hidden");$("teamAdminList")?.classList.remove("hidden");renderAdminTeams();});
loadAdminTeams();


function ensurePaymentFields(){
 adminTeams.forEach(t=>{
  if(!t.payment)t.payment="open";
  if(t.paymentMethod===undefined)t.paymentMethod="";
  if(t.paymentAmount===undefined)t.paymentAmount="";
  if(t.paymentConfirmedAt===undefined)t.paymentConfirmedAt="";
  if(t.paymentConfirmedBy===undefined)t.paymentConfirmedBy="";
  if(t.participationConfirmedAt===undefined)t.participationConfirmedAt=t.status==="confirmed"?"Demo-Bestand":"";
  if(t.participationConfirmedBy===undefined)t.participationConfirmedBy=t.status==="confirmed"?"Demo-Orga":"";
  if(!Array.isArray(t.mailLog))t.mailLog=[];
 });
 saveAdminTeams();
}
function expectedPayment(t){const fee=Number(eventData?.fee||10);return eventData?.feeMode==="team"?fee:fee*t.members.length;}
function eur(v){return Number(v||0).toLocaleString("de-DE",{minimumFractionDigits:2,maximumFractionDigits:2})+" €";}
function openPaymentAdmin(){setTimeout(jumpToOpenAdminModule,0);
 ensurePaymentFields(); $("adminWorkspace")?.classList.add("hidden");$("eventAdminPanel")?.classList.add("hidden");$("teamAdminPanel")?.classList.add("hidden");
 $("paymentAdminPanel")?.classList.remove("hidden");$("paymentAdminDetail")?.classList.add("hidden");$("paymentAdminList")?.classList.remove("hidden");renderPaymentTeams();
}
function renderPaymentTeams(){
 ensurePaymentFields();const q=($("paymentAdminSearch")?.value||"").toLowerCase(),f=$("paymentAdminFilter")?.value||"all";
 const all=adminTeams.filter(t=>t.status!=="draft");
 const match=t=>f==="all"||(f==="payment-open"&&t.payment!=="confirmed")||(f==="payment-confirmed"&&t.payment==="confirmed")||(f==="participation-open"&&t.payment==="confirmed"&&t.status!=="confirmed")||(f==="participation-confirmed"&&t.status==="confirmed");
 const rows=all.filter(t=>match(t)&&t.name.toLowerCase().includes(q));
 $("paymentOpenBadge").textContent=all.filter(t=>t.payment!=="confirmed"||t.status!=="confirmed").length+" OFFEN";
 $("paymentAdminList").innerHTML=rows.map(t=>`<button class="team-admin-card" data-pay-team="${t.id}"><div><strong>${t.name}</strong><small>${t.members.length} Teilnehmer · Soll: ${eur(expectedPayment(t))}</small></div><div class="team-card-right"><span class="team-status ${t.payment==="confirmed"?"team-status-confirmed":"team-status-submitted"}">${t.payment==="confirmed"?"ZAHLUNG BESTÄTIGT":"ZAHLUNG OFFEN"}</span><small>${t.status==="confirmed"?"Teilnahme bestätigt":"Teilnahme offen"}</small></div></button>`).join("")||'<div class="empty-state"><h3>KEINE TREFFER</h3></div>';
 document.querySelectorAll("[data-pay-team]").forEach(b=>b.onclick=()=>openPaymentDetail(b.dataset.payTeam));
}
function openPaymentDetail(id){
 const t=adminTeams.find(x=>x.id===id);if(!t)return;ensurePaymentFields();selectedAdminTeamId=id;$("paymentAdminList").classList.add("hidden");$("paymentAdminDetail").classList.remove("hidden");
 const cons=t.members.every(m=>m.consents), can=t.payment==="confirmed"&&cons&&t.status!=="review"&&t.status!=="confirmed";
 $("paymentDetailContent").innerHTML=`<div class="team-detail-head"><div><span class="eyebrow">TEAM</span><h2>${t.name}</h2></div><span class="team-status ${teamStatusClass(t.status)}">${teamStatusLabel(t.status)}</span></div>
 <div class="payment-flow"><span class="done">ANMELDUNG</span><b>→</b><span class="${t.payment==="confirmed"?"done":"active"}">ZAHLUNG</span><b>→</b><span class="${t.status==="confirmed"?"done":t.payment==="confirmed"?"active":""}">TEILNAHME</span></div>
 <div class="payment-card"><h3>1 · ZAHLUNG</h3><p>Sollbetrag: <b>${eur(expectedPayment(t))}</b></p>${t.payment==="confirmed"?`<div class="participation-success">ZAHLUNG BESTÄTIGT<small>${t.paymentMethod.toUpperCase()} · ${eur(t.paymentAmount)} · ${t.paymentConfirmedAt} · ${t.paymentConfirmedBy}</small></div>`:`<div class="payment-entry"><label>Zahlungsart<select id="payMethod"><option value="">Bitte wählen</option><option value="cash">Bar</option><option value="paypal">PayPal</option></select></label><label>Betrag<input id="payAmount" type="number" step=".50" value="${expectedPayment(t)}"></label></div><button id="confirmPay" class="btn btn-orange">ZAHLUNG BESTÄTIGEN</button><p class="payment-meta">Keine E-Mail bei Zahlungsbestätigung.</p>`}</div>
 <div class="payment-card"><h3>2 · TEILNAHMEFREIGABE</h3><p class="payment-check ${t.payment==="confirmed"?"ok":"no"}">${t.payment==="confirmed"?"✓":"×"} Zahlung bestätigt</p><p class="payment-check ${cons?"ok":"no"}">${cons?"✓":"×"} Persönliche Bestätigungen (${t.members.filter(m=>m.consents).length}/${t.members.length})</p><p class="payment-check ${t.status!=="review"?"ok":"no"}">${t.status!=="review"?"✓":"×"} Keine offene Orga-Prüfung</p>${t.status==="confirmed"?`<div class="participation-success">TEILNAHME BESTÄTIGT<small>${t.participationConfirmedAt} · ${t.participationConfirmedBy}</small></div>`:`<button id="confirmPart" class="btn btn-orange" ${can?"":"disabled"}>TEILNAHME BESTÄTIGEN</button>`}</div>
 <div class="payment-card"><h3>E-MAIL-PROTOKOLL</h3><div class="mail-log">${t.mailLog.length?t.mailLog.map(x=>`<small>✓ ${x}</small>`).join(""):"<small>Noch keine Teilnahmebestätigungs-E-Mail protokolliert.</small>"}</div></div>`;
 $("confirmPay")?.addEventListener("click",()=>{const m=$("payMethod").value,a=Number($("payAmount").value);if(!m||a<=0){showModal("Angaben prüfen","Bitte Zahlungsart und Betrag eintragen.",[{label:"OK"}]);return;}showModal("Zahlung bestätigen?",`${m==="cash"?"Bar":"PayPal"} · ${eur(a)}. Es wird keine E-Mail versendet.`,[{label:"ABBRECHEN"},{label:"BESTÄTIGEN",onClick:()=>{t.payment="confirmed";t.paymentMethod=m;t.paymentAmount=a;t.paymentConfirmedAt=new Date().toLocaleString("de-DE");t.paymentConfirmedBy=demoRole==="master"?"Master-Admin":"Orga";saveAdminTeams();openPaymentDetail(id);}}]);});
 $("confirmPart")?.addEventListener("click",()=>{showModal("Teilnahme bestätigen?",`Die Teilnahme wird verbindlich bestätigt. Für alle ${t.members.length} Teammitglieder wird die Bestätigungs-E-Mail protokolliert.`,[{label:"ABBRECHEN"},{label:"TEILNAHME BESTÄTIGEN",onClick:()=>{const n=new Date().toLocaleString("de-DE"),w=demoRole==="master"?"Master-Admin":"Orga";t.status="confirmed";t.participationConfirmedAt=n;t.participationConfirmedBy=w;t.mailLog=t.members.map(m=>`${m.email} · Teilnahme bestätigt · ${n}`);saveAdminTeams();openPaymentDetail(id);}}]);});
}
$("paymentAdminSearch")?.addEventListener("input",renderPaymentTeams);$("paymentAdminFilter")?.addEventListener("change",renderPaymentTeams);$("paymentDetailBack")?.addEventListener("click",()=>{$("paymentAdminDetail").classList.add("hidden");$("paymentAdminList").classList.remove("hidden");renderPaymentTeams();});


const RULES_KEY="bkl-v084-rules";
const defaultRulesData={
 version:1, changed:"Noch nicht geändert",
 rules:[
  "Kiste: 20 × 0,5 l.",
  "Mindestalkoholgehalt: 4,7 % vol.",
  "Teamgröße: 2–4 Personen; empfohlen werden 4.",
  "Die Bierkiste darf während des Laufs nicht abgesetzt werden.",
  "Hilfsmittel zum Tragen der Kiste sind nicht erlaubt.",
  "Beim Zieleinlauf müssen alle Flaschen leer sein.",
  "Alle Kronkorken sind mitzuführen und im Ziel vorzuzeigen.",
  "Das Team muss gemeinsam ins Ziel einlaufen."
 ],
 penalties:[
  {id:"p1",name:"Kiste abgesetzt",minutes:5},
  {id:"p2",name:"Hilfsmittel verwendet",minutes:10},
  {id:"p3",name:"Kronkorken fehlen",minutes:2},
  {id:"p4",name:"Checkpoint fehlt",minutes:5}
 ],
 actions:[]
};
let rulesData;
function loadRulesData(){try{rulesData=JSON.parse(localStorage.getItem(RULES_KEY))||JSON.parse(JSON.stringify(defaultRulesData));}catch(e){rulesData=JSON.parse(JSON.stringify(defaultRulesData));}}
function saveRulesData(){localStorage.setItem(RULES_KEY,JSON.stringify(rulesData));}
function rulesMaster(){return demoRole==="master";}
function openRulesAdmin(){setTimeout(jumpToOpenAdminModule,0);
 $("rulesAdminPanel").classList.remove("hidden");$("rulesRoleBadge").textContent=rulesMaster()?"MASTER":"ORGA";
 renderRulesAdmin();$("rulesAdminPanel").scrollIntoView({behavior:"smooth",block:"start"});
}
function renderRulesAdmin(){
 $("rulesVersionLabel").textContent="V"+Number(rulesData.version).toFixed(1);$("rulesChangedLabel").textContent=rulesData.changed;
 const master=rulesMaster();
 $("rulesEditorList").innerHTML=rulesData.rules.map((r,i)=>`<div class="rule-edit-row"><span>${i+1}</span><textarea data-rule-index="${i}" rows="2" ${master?"":"disabled"}>${r}</textarea>${master?`<button data-remove-rule="${i}" class="mini-action">ENTFERNEN</button>`:""}</div>`).join("");
 $("penaltyCatalogList").innerHTML=rulesData.penalties.map((p,i)=>`<div class="penalty-edit-row"><input data-penalty-name="${i}" value="${p.name}" ${master?"":"disabled"}><label><input data-penalty-min="${i}" type="number" min="0" step=".5" value="${p.minutes}" ${master?"":"disabled"}> Min.</label>${master?`<button data-remove-penalty="${i}" class="mini-action">ENTFERNEN</button>`:""}</div>`).join("");
 $("addRuleBtn").disabled=!master;$("saveRulesBtn").disabled=!master;$("addPenaltyBtn").disabled=!master;$("savePenaltiesBtn").disabled=!master;
 document.querySelectorAll("[data-remove-rule]").forEach(b=>b.onclick=()=>{rulesData.rules.splice(Number(b.dataset.removeRule),1);renderRulesAdmin();});
 document.querySelectorAll("[data-remove-penalty]").forEach(b=>b.onclick=()=>{rulesData.penalties.splice(Number(b.dataset.removePenalty),1);renderRulesAdmin();});
 $("penaltyTeamSelect").innerHTML=adminTeams.filter(t=>t.status!=="draft").map(t=>`<option value="${t.id}">${t.name}</option>`).join("");
 $("penaltySelect").innerHTML='<option value="">Individuelle Strafe</option>'+rulesData.penalties.map(p=>`<option value="${p.id}">${p.name} · +${p.minutes} Min.</option>`).join("");
 renderPenaltyLog();
}
$("addRuleBtn")?.addEventListener("click",()=>{if(!rulesMaster())return;rulesData.rules.push("Neue Regel");renderRulesAdmin();});
$("saveRulesBtn")?.addEventListener("click",()=>{
 if(!rulesMaster()){showModal("Master-Rechte erforderlich","Nur Master-Admins dürfen das Regelwerk verändern.",[{label:"OK"}]);return;}
 rulesData.rules=[...document.querySelectorAll("[data-rule-index]")].map(x=>x.value.trim()).filter(Boolean);
 const mode=document.querySelector('input[name="ruleChangeMode"]:checked')?.value||"inform";
 rulesData.version=Number((rulesData.version+.1).toFixed(1));rulesData.changed=new Date().toLocaleString("de-DE");saveRulesData();renderRulesAdmin();
 showModal("Neue Regelwerksversion gespeichert",`Regelwerk V${rulesData.version.toFixed(1)} wurde gespeichert. ${mode==="reaccept"?"Für Teilnehmer ist eine erneute Zustimmung vorgesehen.":"Die Änderung ist als reine Information vorgesehen."} Im Produktivsystem wird die festgelegte Informations-E-Mail an alle registrierten BKL-Konten ausgelöst.`,[{label:"OK"}]);
});
$("addPenaltyBtn")?.addEventListener("click",()=>{if(!rulesMaster())return;rulesData.penalties.push({id:"p"+Date.now(),name:"Neue Strafe",minutes:1});renderRulesAdmin();});
$("savePenaltiesBtn")?.addEventListener("click",()=>{
 if(!rulesMaster())return;
 rulesData.penalties=rulesData.penalties.map((p,i)=>({...p,name:document.querySelector(`[data-penalty-name="${i}"]`).value.trim(),minutes:Number(document.querySelector(`[data-penalty-min="${i}"]`).value)})).filter(p=>p.name);
 saveRulesData();renderRulesAdmin();showModal("Strafenkatalog gespeichert","Der veranstaltungsbezogene Strafenkatalog wurde im Prototyp gespeichert.",[{label:"OK"}]);
});
$("applyPenaltyBtn")?.addEventListener("click",()=>{
 const tid=$("penaltyTeamSelect").value,pid=$("penaltySelect").value,custom=Number($("customPenaltyMinutes").value||0),reason=$("penaltyReason").value.trim();
 const team=adminTeams.find(t=>t.id===tid),cat=rulesData.penalties.find(p=>p.id===pid);
 if(!team){showModal("Team fehlt","Bitte ein Team auswählen.",[{label:"OK"}]);return;}
 const mins=custom>0?custom:Number(cat?.minutes||0);if(mins<=0){showModal("Strafzeit fehlt","Bitte eine Katalogstrafe oder eine individuelle Strafzeit angeben.",[{label:"OK"}]);return;}
 const label=custom>0?(cat?cat.name+" / individuell":"Individuelle Strafe"):(cat?.name||"Strafe");
 rulesData.actions.unshift({team:team.name,label,minutes:mins,reason:reason||"Kein zusätzlicher Grund",by:demoRole==="master"?"Master-Admin":"Orga",at:new Date().toLocaleString("de-DE")});
 saveRulesData();$("customPenaltyMinutes").value="";$("penaltyReason").value="";renderPenaltyLog();
 showModal("Strafe eingetragen",`${team.name}: +${mins} Minuten. Der Vorgang wurde protokolliert.`,[{label:"OK"}]);
});
function renderPenaltyLog(){
 $("penaltyActionLog").innerHTML=`<h3 class="admin-section-title">STRAFENPROTOKOLL</h3>`+(rulesData.actions.length?rulesData.actions.map(a=>`<div class="penalty-log-row"><strong>${a.team} · +${a.minutes} Min.</strong><small>${a.label} · ${a.reason}<br>${a.at} · ${a.by}</small></div>`).join(""):'<p class="payment-meta">Noch keine Strafe eingetragen.</p>');
}
loadRulesData();


const ROUTE_KEY="bkl-v085-route";let routeData;
function newToken(){let a=new Uint8Array(18);crypto.getRandomValues(a);return [...a].map(x=>x.toString(16).padStart(2,"0")).join("")}
function saveRoute(){localStorage.setItem(ROUTE_KEY,JSON.stringify(routeData))}
function loadRoute(){try{routeData=JSON.parse(localStorage.getItem(ROUTE_KEY))}catch(e){}if(!routeData)routeData={checkpoints:[1,2,3].map(n=>({id:"cp"+n,name:"Checkpoint "+n,location:"Streckenpunkt "+n,token:newToken()})),target:newToken()};saveRoute()}
function openRouteAdmin(){setTimeout(jumpToOpenAdminModule,0);$("routeAdminPanel").classList.remove("hidden");$("qrView").classList.add("hidden");renderRoute()}
function renderRoute(){
 $("cpCount").textContent=routeData.checkpoints.length+" CHECKPOINTS";
 $("cpList").innerHTML=routeData.checkpoints.map((c,i)=>`<div class="cp-card"><b>${i+1}</b><div><input data-n="${c.id}" value="${c.name}"><input data-l="${c.id}" value="${c.location}" placeholder="Standort"><small>Token · ${c.token.slice(0,10)}…</small></div><div><button class="mini-action" data-q="${c.id}">QR</button><button class="mini-action" data-u="${c.id}" ${i<1?"disabled":""}>↑</button><button class="mini-action" data-d="${c.id}" ${i===routeData.checkpoints.length-1?"disabled":""}>↓</button><button class="mini-action" data-r="${c.id}">NEU</button><button class="mini-action" data-x="${c.id}">×</button></div></div>`).join("");
 document.querySelectorAll("[data-n]").forEach(e=>e.onchange=()=>editCp(e.dataset.n,"name",e.value));document.querySelectorAll("[data-l]").forEach(e=>e.onchange=()=>editCp(e.dataset.l,"location",e.value));
 document.querySelectorAll("[data-q]").forEach(e=>e.onclick=()=>showQR(e.dataset.q));document.querySelectorAll("[data-u]").forEach(e=>e.onclick=()=>moveCp(e.dataset.u,-1));document.querySelectorAll("[data-d]").forEach(e=>e.onclick=()=>moveCp(e.dataset.d,1));document.querySelectorAll("[data-r]").forEach(e=>e.onclick=()=>regenCp(e.dataset.r));document.querySelectorAll("[data-x]").forEach(e=>e.onclick=()=>removeCp(e.dataset.x));
}
function editCp(id,k,v){let c=routeData.checkpoints.find(x=>x.id===id);if(c){c[k]=v.trim();saveRoute()}}
function moveCp(id,d){let i=routeData.checkpoints.findIndex(x=>x.id===id),j=i+d;if(j<0||j>=routeData.checkpoints.length)return;[routeData.checkpoints[i],routeData.checkpoints[j]]=[routeData.checkpoints[j],routeData.checkpoints[i]];saveRoute();renderRoute()}
function regenCp(id){let c=routeData.checkpoints.find(x=>x.id===id);showModal("QR neu erzeugen?",`Der bisherige Code für „${c.name}“ wird ungültig.`,[{label:"ABBRECHEN"},{label:"NEU ERZEUGEN",onClick:()=>{c.token=newToken();saveRoute();renderRoute();showQR(id)}}])}
function removeCp(id){let c=routeData.checkpoints.find(x=>x.id===id);showModal("Checkpoint entfernen?",`„${c.name}“ entfernen?`,[{label:"ABBRECHEN"},{label:"ENTFERNEN",onClick:()=>{routeData.checkpoints=routeData.checkpoints.filter(x=>x.id!==id);saveRoute();renderRoute()}}])}
function qrGraphic(t){let h=0;for(let c of t)h=((h<<5)-h+c.charCodeAt(0))|0;let s="";for(let i=0;i<441;i++){h=(Math.imul(h,1664525)+1013904223)|0;if(h&8)s+=`<i style="grid-area:${Math.floor(i/21)+1}/${i%21+1}"></i>`}return `<div class="qr-grid">${s}</div>`}
function showQR(id){let c=id==="target"?{name:"ZIEL",token:routeData.target}:routeData.checkpoints.find(x=>x.id===id);$("qrView").classList.remove("hidden");$("qrContent").innerHTML=`<span class="eyebrow">BKL 2027</span><h2>${c.name}</h2>${qrGraphic(c.token)}<p class="qr-token">Token: ${c.token}</p><p class="payment-meta">Prototyp-Vorschau. Der Token wird später serverseitig Veranstaltung und Station zugeordnet.</p>${id==="target"?'<button id="targetRegen" class="btn btn-outline">ZIEL-QR NEU ERZEUGEN</button>':""}`;$("targetRegen")?.addEventListener("click",()=>showModal("Ziel-QR neu erzeugen?","Der alte Ziel-Code wird ungültig.",[{label:"ABBRECHEN"},{label:"NEU ERZEUGEN",onClick:()=>{routeData.target=newToken();saveRoute();showQR("target")}}]));$("qrView").scrollIntoView({behavior:"smooth"})}
$("cpAdd")?.addEventListener("click",()=>{routeData.checkpoints.push({id:"cp"+Date.now(),name:"Neuer Checkpoint",location:"",token:newToken()});saveRoute();renderRoute()});
$("targetQr")?.addEventListener("click",()=>showQR("target"));$("appQrBtn")?.addEventListener("click",()=>{const u="https://s44sfh9hr7-wq.github.io/BKL-App/";$("qrView").classList.remove("hidden");$("qrContent").innerHTML=`<span class="eyebrow">DAUERHAFTER BKL-APP-QR</span><h2>BKL-APP ÖFFNEN</h2>${qrGraphic(u)}<p class="qr-token">${u}</p><p class="payment-meta">Für Plakate, Banner, Flyer und Werbung. Dieser QR bleibt unverändert.</p><button class="btn btn-orange" onclick="window.print()">DRUCKEN</button>`});$("qrClose")?.addEventListener("click",()=>$("qrView").classList.add("hidden"));
$("qrAll")?.addEventListener("click",()=>{$("qrView").classList.remove("hidden");$("qrContent").innerHTML='<span class="eyebrow">DRUCKANSICHT</span><h2>ALLE QR-CODES</h2><div class="qr-all">'+routeData.checkpoints.map(c=>`<div><h3>${c.name}</h3>${qrGraphic(c.token)}<small>${c.location}</small></div>`).join("")+`<div><h3>ZIEL</h3>${qrGraphic(routeData.target)}</div></div><button class="btn btn-orange" onclick="window.print()">DRUCKEN</button>`;$("qrView").scrollIntoView({behavior:"smooth"})});
loadRoute();


const BONUS_KEY="bkl-v086-bonus";let bonusData;
function saveBonus(){localStorage.setItem(BONUS_KEY,JSON.stringify(bonusData))}
function loadBonus(){try{bonusData=JSON.parse(localStorage.getItem(BONUS_KEY))}catch(e){}if(!bonusData)bonusData={stations:[{id:"b1",name:"Bonus 1",segment:"1",type:"find",location:"Versteckter Standort",bonus:2,active:true,prerequisite:"cp1",question:"",answers:["","",""],correct:0,token:newToken()}]};saveBonus()}
function openBonusAdmin(){setTimeout(jumpToOpenAdminModule,0);$("bonusAdminPanel").classList.remove("hidden");renderBonus()}
function setB(id,k,v){let s=bonusData.stations.find(x=>x.id===id);if(s){s[k]=v;saveBonus()}}
function renderBonus(){
 $("bonusCount").textContent=bonusData.stations.filter(s=>s.active).length+" AKTIV";
 $("bonusList").innerHTML=bonusData.stations.map(s=>`<div class="bonus-card"><div class="bonus-head"><strong>${s.name}</strong><label><input data-act="${s.id}" type="checkbox" ${s.active?"checked":""}> AKTIV</label></div><div class="bonus-grid"><label>Name<input data-name="${s.id}" value="${s.name}"></label><label>Abschnitt<input data-seg="${s.id}" value="${s.segment}"></label><label>Typ<select data-type="${s.id}"><option value="find" ${s.type==="find"?"selected":""}>Finde mich</option><option value="quiz" ${s.type==="quiz"?"selected":""}>Quiz</option></select></label><label>Bonuszeit (Min.)<input data-min="${s.id}" type="number" step=".5" value="${s.bonus}"></label><label>Tatsächlicher Standort<input data-loc="${s.id}" value="${s.location}"></label><label>Voraussetzung<select data-pre="${s.id}"><option value="">Keine</option>${routeData.checkpoints.map(c=>`<option value="${c.id}" ${s.prerequisite===c.id?"selected":""}>${c.name}</option>`).join("")}</select></label></div><div class="quiz-fields ${s.type==="quiz"?"":"hidden"}"><label>Quizfrage<input data-q="${s.id}" value="${s.question}"></label>${[0,1,2].map(n=>`<label><input type="radio" name="c-${s.id}" data-c="${s.id}" value="${n}" ${s.correct===n?"checked":""}> Antwort ${n+1}<input data-a="${s.id}|${n}" value="${s.answers[n]}"></label>`).join("")}<small>30 Sekunden · ein Versuch · falsch/Timeout: kein Bonus, keine Strafe.</small></div><div class="bonus-actions"><button class="mini-action" data-qr="${s.id}">QR</button><button class="mini-action" data-del="${s.id}">ENTFERNEN</button></div></div>`).join("");
 document.querySelectorAll("[data-name]").forEach(e=>e.onchange=()=>setB(e.dataset.name,"name",e.value.trim()));document.querySelectorAll("[data-seg]").forEach(e=>e.onchange=()=>setB(e.dataset.seg,"segment",e.value.trim()));document.querySelectorAll("[data-min]").forEach(e=>e.onchange=()=>setB(e.dataset.min,"bonus",Number(e.value)));document.querySelectorAll("[data-loc]").forEach(e=>e.onchange=()=>setB(e.dataset.loc,"location",e.value.trim()));document.querySelectorAll("[data-pre]").forEach(e=>e.onchange=()=>setB(e.dataset.pre,"prerequisite",e.value));document.querySelectorAll("[data-q]").forEach(e=>e.onchange=()=>setB(e.dataset.q,"question",e.value));document.querySelectorAll("[data-c]").forEach(e=>e.onchange=()=>setB(e.dataset.c,"correct",Number(e.value)));document.querySelectorAll("[data-a]").forEach(e=>e.onchange=()=>{let [id,n]=e.dataset.a.split("|"),s=bonusData.stations.find(x=>x.id===id);s.answers[+n]=e.value;saveBonus()});document.querySelectorAll("[data-type]").forEach(e=>e.onchange=()=>{setB(e.dataset.type,"type",e.value);renderBonus()});document.querySelectorAll("[data-act]").forEach(e=>e.onchange=()=>{let s=bonusData.stations.find(x=>x.id===e.dataset.act);if(e.checked&&bonusData.stations.some(x=>x!==s&&x.active&&x.segment===s.segment)){showModal("Abschnitt belegt","Pro Abschnitt darf nur eine Bonusstation aktiv sein.",[{label:"OK"}]);renderBonus();return}s.active=e.checked;saveBonus();renderBonus()});document.querySelectorAll("[data-del]").forEach(e=>e.onclick=()=>{bonusData.stations=bonusData.stations.filter(x=>x.id!==e.dataset.del);saveBonus();renderBonus()});document.querySelectorAll("[data-qr]").forEach(e=>e.onclick=()=>{let s=bonusData.stations.find(x=>x.id===e.dataset.qr);$("qrView").classList.remove("hidden");$("qrContent").innerHTML=`<span class="eyebrow">BONUSSTATION · NEUTRAL</span><h2>BKL BONUS</h2>${qrGraphic(s.token)}<p class="qr-token">${s.token}</p><p class="payment-meta">Keine Antwort und keine Bonuszeit im Ausdruck.</p>`});
}
$("bonusAdd")?.addEventListener("click",()=>{bonusData.stations.push({id:"b"+Date.now(),name:"Neue Bonusstation",segment:String(bonusData.stations.length+1),type:"find",location:"",bonus:2,active:false,prerequisite:"",question:"",answers:["","",""],correct:0,token:newToken()});saveBonus();renderBonus()});loadBonus();

const RACE_KEY="bkl-v087-race";let raceData,raceTimer;
function raceNow(){return new Date().toISOString()}
function loadRace(){try{raceData=JSON.parse(localStorage.getItem(RACE_KEY))}catch(e){}if(!raceData)raceData={status:"ready",start:null,closed:null,finishes:{},penaltyEdits:[]};saveRace()}
function saveRace(){localStorage.setItem(RACE_KEY,JSON.stringify(raceData))}
function fmtDur(ms){ms=Math.max(0,ms);let s=Math.floor(ms/1000),h=Math.floor(s/3600),m=Math.floor(s%3600/60);return [h,m,s%60].map(x=>String(x).padStart(2,"0")).join(":")}
function confirmedTeams(){return (adminTeams||[]).filter(t=>/bestätigt/i.test(t.status||""))}
function openRaceAdmin(){setTimeout(jumpToOpenAdminModule,0);$("raceAdminPanel").classList.remove("hidden");renderRace();clearInterval(raceTimer);raceTimer=setInterval(renderRaceClock,1000);$("raceAdminPanel").scrollIntoView({behavior:"smooth"})}
function renderRaceClock(){if(!$("raceClock"))return;$("raceClock").textContent=raceData.start?fmtDur((raceData.closed?new Date(raceData.closed):new Date())-new Date(raceData.start)):"00:00:00"}
function renderRace(){
 let teams=confirmedTeams(), finished=Object.keys(raceData.finishes).length;
 $("statStarted").textContent=raceData.start?teams.length:0;$("statFinish").textContent=finished;$("statTrack").textContent=raceData.start?Math.max(0,teams.length-finished):0;
 $("raceStatusBadge").textContent=raceData.status==="running"?"BKL LÄUFT":raceData.status==="closed"?"ABGESCHLOSSEN":"BEREIT";
 $("raceStartInfo").textContent=raceData.start?"Start: "+new Date(raceData.start).toLocaleTimeString("de-DE"):"Noch nicht gestartet";
 $("raceStartBtn").classList.toggle("hidden",raceData.status!=="ready");$("raceFinishBtn").classList.toggle("hidden",raceData.status!=="running");
 $("raceStartHint").textContent="Prototyp: Startfreigabe 30 Minuten vor Planstart wird im Backend verbindlich gegen Serverzeit geprüft.";
 renderRaceClock();renderFinishQueue();renderPenaltySummary();
}
function teamLabel(t){return t?.name||t?.teamName||t?.alias||"Team"}
function renderFinishQueue(){
 let teams=confirmedTeams();$("finishQueue").innerHTML=teams.length?teams.map(t=>{let id=String(t.id||teamLabel(t)),f=raceData.finishes[id];return `<div class="finish-card"><div><strong>${teamLabel(t)}</strong><small>${f?`Ziel: ${new Date(f.time).toLocaleTimeString("de-DE")} · ${f.confirmed?"✓ Ziel bestätigt":"Prüfung läuft"}`:"Noch auf der Strecke"}</small></div><div>${raceData.status==="running"&&!f?`<button class="mini-action" data-simfinish="${id}">ZIELSCAN TESTEN</button>`:""}${f&&!f.confirmed?`<button class="mini-action" data-confirmfinish="${id}">TEAM PRÜFEN</button>`:""}${raceData.status==="running"&&!f?`<button class="mini-action" data-manualfinish="${id}">MANUELL</button>`:""}</div></div>`}).join(""):'<p class="payment-meta">Noch keine bestätigten Teilnehmerteams vorhanden.</p>';
 document.querySelectorAll("[data-simfinish]").forEach(e=>e.onclick=()=>recordFinish(e.dataset.simfinish));
 document.querySelectorAll("[data-confirmfinish]").forEach(e=>e.onclick=()=>confirmFinish(e.dataset.confirmfinish));
 document.querySelectorAll("[data-manualfinish]").forEach(e=>e.onclick=()=>manualFinish(e.dataset.manualfinish));
}
function recordFinish(id){if(raceData.finishes[id])return;raceData.finishes[id]={time:raceNow(),confirmed:false,manual:false};saveRace();renderRace()}
function confirmFinish(id){let f=raceData.finishes[id];if(!f)return;showModal("Zieleinlauf bestätigen?","Checkpoint-, Bonus- und Strafdaten wurden zur Prüfung bereitgestellt. Die eingefrorene Zielzeit wird nicht verändert.",[{label:"ABBRECHEN"},{label:"ZIEL BESTÄTIGEN",onClick:()=>{f.confirmed=true;f.confirmedAt=raceNow();saveRace();renderRace()}}])}
function manualFinish(id){let reason=prompt("Begründung für die manuelle Zielzeit:");if(!reason)return;let tm=prompt("Zielzeit HH:MM:SS (leer = jetzt):");let d=new Date();if(tm&&/^\d\d:\d\d:\d\d$/.test(tm)){let [h,m,s]=tm.split(":").map(Number);d.setHours(h,m,s,0)}raceData.finishes[id]={time:d.toISOString(),confirmed:false,manual:true,reason};saveRace();renderRace()}
$("raceStartBtn")?.addEventListener("click",()=>showModal("BKL jetzt starten?","Mit der zweiten Bestätigung wird der tatsächliche gemeinsame Startzeitpunkt gesetzt.",[{label:"ABBRECHEN"},{label:"JETZT STARTEN",onClick:()=>{raceData.status="running";raceData.start=raceNow();raceData.closed=null;saveRace();renderRace()}}]));
$("raceFinishBtn")?.addEventListener("click",()=>showModal("BKL abschließen?","Der Rennbetrieb wird beendet. Ein Master kann die Veranstaltung später wieder öffnen.",[{label:"ABBRECHEN"},{label:"BKL ABSCHLIESSEN",onClick:()=>{raceData.status="closed";raceData.closed=raceNow();saveRace();renderRace()}}]));
function getPenaltyLog(){try{return rulesData?.penaltyLog||rulesData?.actions||[]}catch(e){return []}}
function renderPenaltySummary(){let log=getPenaltyLog(),s={};log.forEach((p,i)=>{if(p.removed)return;let n=p.team||p.teamName||"Unbekannt";s[n]=(s[n]||0)+Number(p.minutes||0)});$("racePenaltySummary").innerHTML=Object.keys(s).length?Object.entries(s).map(([n,m])=>`<div class="penalty-row"><strong>${n}</strong><span>+ ${m} Min.</span></div>`).join(""):'<p class="payment-meta">Noch keine aktiven Strafzeiten.</p>'}
loadRace();

const MAP_KEY="bkl-v088-map";let mapData,mapAdding=false;
function saveMap(){localStorage.setItem(MAP_KEY,JSON.stringify(mapData))}
function loadMap(){try{mapData=JSON.parse(localStorage.getItem(MAP_KEY))}catch(e){}if(!mapData)mapData={checkpoints:[],selected:null};saveMap()}
function openLiveMapAdmin(){setTimeout(jumpToOpenAdminModule,0);$("liveMapAdminPanel").classList.remove("hidden");renderMap();$("liveMapAdminPanel").scrollIntoView({behavior:"smooth"})}
function renderMap(){$("mapCpCount").textContent=mapData.checkpoints.length+" CHECKPOINTS";$("mapMarkers").innerHTML=mapData.checkpoints.map((c,i)=>`<button class="map-marker ${c.id===mapData.selected?"selected":""}" style="left:${c.x}%;top:${c.y}%" data-mid="${c.id}"><span>${i+1}</span></button>`).join("");document.querySelectorAll("[data-mid]").forEach(e=>e.onclick=v=>{v.stopPropagation();mapData.selected=e.dataset.mid;saveMap();renderMap()});let c=mapData.checkpoints.find(x=>x.id===mapData.selected);$("mapCpEditor").innerHTML=c?`<div class="map-edit-card"><strong>${c.name}</strong><label>Name<input id="mapName" value="${c.name}"></label><label>QR-Checkpoint<select id="mapLink"><option value="">Nicht verknüpft</option>${routeData.checkpoints.map(r=>`<option value="${r.id}" ${c.routeId===r.id?"selected":""}>${r.name}</option>`).join("")}</select></label><small>Position ${c.x.toFixed(2)} % / ${c.y.toFixed(2)} %</small><div><button id="mapMove" class="mini-action">VERSCHIEBEN</button><button id="mapDelete" class="mini-action">LÖSCHEN</button></div></div>`:"";if(c){$("mapName").onchange=e=>{c.name=e.target.value.trim()||c.name;saveMap();renderMap()};$("mapLink").onchange=e=>{c.routeId=e.target.value;saveMap()};$("mapMove").onclick=()=>beginMap(c.id);$("mapDelete").onclick=()=>{mapData.checkpoints=mapData.checkpoints.filter(x=>x.id!==c.id);mapData.selected=null;saveMap();renderMap()}}}
function beginMap(id=true){mapAdding=id;$("mapTapHint").classList.remove("hidden");$("mapCancelCp").classList.remove("hidden");$("mapAddCp").classList.add("hidden")}
function stopMap(){mapAdding=false;$("mapTapHint").classList.add("hidden");$("mapCancelCp").classList.add("hidden");$("mapAddCp").classList.remove("hidden")}
$("mapAddCp")?.addEventListener("click",()=>beginMap());$("mapCancelCp")?.addEventListener("click",stopMap);
$("liveMapEditor")?.addEventListener("click",e=>{if(!mapAdding)return;let r=e.currentTarget.getBoundingClientRect(),x=Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100)),y=Math.max(0,Math.min(100,(e.clientY-r.top)/r.height*100));if(typeof mapAdding==="string"){let c=mapData.checkpoints.find(q=>q.id===mapAdding);c.x=x;c.y=y;mapData.selected=c.id}else{let c={id:"m"+Date.now(),name:"Checkpoint "+(mapData.checkpoints.length+1),x,y,routeId:""};mapData.checkpoints.push(c);mapData.selected=c.id}saveMap();stopMap();renderMap()});loadMap();

const EVENT_STORAGE_KEY="bkl-v081-event";
const defaultEventData={
  type:"regular", status:"registration-open", name:"BKL 2027", shortName:"BKL 2027",
  date:"2027-05-30", startTime:"14:00", location:"Leggewies, Polch", distance:"5.0",
  regOpen:"2027-02-01T08:00", regClose:"2027-05-23T23:59", teamLimit:50, minAge:18,
  fee:10, feeMode:"person", paypal:"", payCash:true, payPaypal:true,
  description:"Der Bierkistenlauf Polch – gemeinsam starten, gemeinsam ins Ziel."
};
let eventData={...defaultEventData};

function loadEventData(){
  try{
    const saved=localStorage.getItem(EVENT_STORAGE_KEY);
    if(saved) eventData={...defaultEventData,...JSON.parse(saved)};
  }catch(e){ eventData={...defaultEventData}; }
}
function statusLabel(v){
  return ({draft:"ENTWURF",published:"VERÖFFENTLICHT","registration-open":"ANMELDUNG GEÖFFNET",
    "registration-closed":"ANMELDUNG GESCHLOSSEN",running:"BKL LÄUFT",completed:"BKL ABGESCHLOSSEN",archived:"ARCHIVIERT"})[v]||v;
}
function syncEventOverview(){
  const box=document.querySelector(".admin-event-overview");
  if(box){
    const cols=box.querySelectorAll("div");
    if(cols[0]) cols[0].innerHTML=`<small>AKTUELLE VERANSTALTUNG</small><strong>${eventData.name}</strong><span>${eventData.date.split("-").reverse().join(".")} · ${eventData.startTime} Uhr</span>`;
    if(cols[1]) cols[1].innerHTML=`<small>STATUS</small><strong id="adminEventStatus">${statusLabel(eventData.status)}</strong><span>37 / ${eventData.teamLimit} Teams</span>`;
  }
  $("testEventFlag")?.classList.toggle("hidden",eventData.type!=="test");
}
function fillEventForm(){
  const vals={evType:eventData.type,evStatus:eventData.status,evName:eventData.name,evShortName:eventData.shortName,
    evDate:eventData.date,evStartTime:eventData.startTime,evLocation:eventData.location,evDistance:eventData.distance,
    evRegOpen:eventData.regOpen,evRegClose:eventData.regClose,evTeamLimit:eventData.teamLimit,evMinAge:eventData.minAge,
    evFee:eventData.fee,evFeeMode:eventData.feeMode,evPaypal:eventData.paypal,evDescription:eventData.description};
  Object.entries(vals).forEach(([id,val])=>{ if($(id)) $(id).value=val; });
  if($("evPayCash")) $("evPayCash").checked=!!eventData.payCash;
  if($("evPayPaypal")) $("evPayPaypal").checked=!!eventData.payPaypal;
  updatePaymentReference();
  $("eventUnsavedBadge")?.classList.add("hidden");
}
function readEventForm(){
  return {
    type:$("evType").value,status:$("evStatus").value,name:$("evName").value.trim(),shortName:$("evShortName").value.trim(),
    date:$("evDate").value,startTime:$("evStartTime").value,location:$("evLocation").value.trim(),distance:$("evDistance").value,
    regOpen:$("evRegOpen").value,regClose:$("evRegClose").value,teamLimit:Number($("evTeamLimit").value),
    minAge:Number($("evMinAge").value),fee:Number($("evFee").value),feeMode:$("evFeeMode").value,
    paypal:$("evPaypal").value.trim(),payCash:$("evPayCash").checked,payPaypal:$("evPayPaypal").checked,
    description:$("evDescription").value.trim()
  };
}
function validateEventForm(d){
  if(!d.name||!d.date||!d.startTime||!d.location) return "Name, Datum, Startzeit und Start/Ziel müssen ausgefüllt sein.";
  if(!d.teamLimit||d.teamLimit<37) return "Das Teamlimit darf im aktuellen Teststand nicht unter den bereits angezeigten 37 Teams liegen.";
  if(d.regOpen && d.regClose && new Date(d.regOpen)>=new Date(d.regClose)) return "Der Anmeldeschluss muss nach der Öffnung der Anmeldung liegen.";
  if(!d.payCash && !d.payPaypal) return "Mindestens eine Zahlungsart muss aktiviert sein.";
  if(d.payPaypal && !d.paypal) return "Für PayPal muss eine PayPal-Adresse eingetragen werden.";
  return "";
}
function updatePaymentReference(){
  const year=($("evDate")?.value||eventData.date||"2027").slice(0,4);
  const el=$("evPaymentReference"); if(el) el.textContent=`BKL${year} – Teamname`;
}
function markEventDirty(){ $("eventUnsavedBadge")?.classList.remove("hidden"); updatePaymentReference(); }

function jumpToOpenAdminModule(){requestAnimationFrame(()=>requestAnimationFrame(()=>{const p=[...document.querySelectorAll(".admin-workspace")].find(x=>!x.classList.contains("hidden"));if(p)p.scrollIntoView({behavior:"smooth",block:"start"});}));}
function closeAdminPanels(){
  $("adminWorkspace")?.classList.add("hidden");
  $("eventAdminPanel")?.classList.add("hidden");
  $("teamAdminPanel")?.classList.add("hidden");
  $("paymentAdminPanel")?.classList.add("hidden");
  $("rulesAdminPanel")?.classList.add("hidden");
  $("routeAdminPanel")?.classList.add("hidden");
  $("bonusAdminPanel")?.classList.add("hidden");
  $("raceAdminPanel")?.classList.add("hidden");
  $("liveMapAdminPanel")?.classList.add("hidden");
}
function openEventAdmin(){setTimeout(jumpToOpenAdminModule,0);
  $("teamAdminPanel")?.classList.add("hidden");
  $("adminWorkspace")?.classList.add("hidden");
  $("eventAdminPanel")?.classList.remove("hidden");
  fillEventForm();
  const master=demoRole==="master";
  if($("newEventBtn")) $("newEventBtn").disabled=!master;
  if($("deleteEventBtn")) $("deleteEventBtn").disabled=!master;
  $("eventAdminPanel")?.scrollIntoView({behavior:"smooth",block:"start"});
}
document.querySelectorAll("#eventAdminPanel input,#eventAdminPanel select,#eventAdminPanel textarea").forEach(el=>el.addEventListener("input",markEventDirty));
$("eventResetBtn")?.addEventListener("click",()=>fillEventForm());
$("eventSaveBtn")?.addEventListener("click",()=>{
  const next=readEventForm(), error=validateEventForm(next);
  if(error){ showModal("Speichern nicht möglich",error,[{label:"OK"}]); return; }
  const important = next.date!==eventData.date || next.startTime!==eventData.startTime || next.location!==eventData.location;
  eventData=next;
  localStorage.setItem(EVENT_STORAGE_KEY,JSON.stringify(eventData));
  fillEventForm(); syncEventOverview();
  showModal("Veranstaltung gespeichert",
    important ? "Die Änderungen wurden im V0.8.1-Prototyp gespeichert. Im Produktivsystem würde diese Änderung zusätzlich die festgelegte Informations-E-Mail an alle BKL-Konten auslösen." : "Die Änderungen wurden im V0.8.1-Prototyp lokal auf diesem Gerät gespeichert.",
    [{label:"OK"}]);
});
$("newEventBtn")?.addEventListener("click",()=>{
  if(demoRole!=="master"){ showModal("Master-Rechte erforderlich","Nur Master-Admins dürfen einen neuen BKL anlegen.",[{label:"OK"}]); return; }
  eventData={...defaultEventData,status:"draft",name:"Neuer BKL",shortName:"BKL",date:"",startTime:"14:00"};
  fillEventForm();
  showModal("Neuer BKL – Entwurf","Ein neuer Veranstaltungsentwurf wurde im Editor vorbereitet. Er wird erst nach dem Speichern übernommen.",[{label:"OK"}]);
});
$("deleteEventBtn")?.addEventListener("click",()=>{
  if(demoRole!=="master"){ showModal("Master-Rechte erforderlich","Nur Master-Admins dürfen eine Veranstaltung vollständig löschen.",[{label:"OK"}]); return; }
  showModal("Veranstaltung löschen?",`Die Veranstaltung „${eventData.name}“ würde vollständig gelöscht. Im Produktivsystem bleibt der Löschvorgang im unveränderbaren Sicherheitsprotokoll erhalten.`,[
    {label:"ABBRECHEN"},
    {label:"LÖSCHEN",className:"danger",onClick:()=>{ localStorage.removeItem(EVENT_STORAGE_KEY); eventData={...defaultEventData}; fillEventForm(); syncEventOverview(); }}
  ]);
});
loadEventData();
syncEventOverview();

renderAccountState();
renderTeamState();
renderRoleState();


const bklAudio=$("bklAudio"),musicToggle=$("musicToggle");let hymnStarted=false;
function startBklHymn(){if(!bklAudio)return;hymnStarted=true;bklAudio.volume=.72;const p=bklAudio.play();if(p&&p.catch)p.catch(()=>{});if(musicToggle){musicToggle.classList.add("playing");musicToggle.textContent="♫"}}
function pauseBklHymn(){if(!bklAudio)return;bklAudio.pause();if(musicToggle){musicToggle.classList.remove("playing");musicToggle.textContent="▶"}}
if(musicToggle)musicToggle.addEventListener("click",()=>{if(!hymnStarted||bklAudio.paused)startBklHymn();else pauseBklHymn()});

// V0.6 Demo: configurable minimum age. In production this comes from event admin settings.
const eventMinimumAge = 18;
const eventDay = new Date("2027-05-30T14:00:00+02:00");

function ageOnDate(birth, target){
  let age=target.getFullYear()-birth.getFullYear();
  const md=target.getMonth()-birth.getMonth();
  if(md<0 || (md===0 && target.getDate()<birth.getDate())) age--;
  return age;
}
const registerRealBtn=$("registerRealBtn");
if(registerRealBtn){
  registerRealBtn.addEventListener("click",async()=>{
    const first=$("registerFirstName")?.value.trim(), last=$("registerLastName")?.value.trim();
    const alias=$("registerAlias")?.value.trim(), email=$("registerEmail")?.value.trim();
    const birth=$("birthDateDemo")?.value, password=$("registerPassword")?.value||"";
    const privacy=$("registerPrivacy")?.checked;
    const box=$("ageResult");
    if(!first||!last||!alias||!email||!birth||!password||!privacy){
      box.className="eligibility-box blocked"; box.textContent="Bitte alle Pflichtfelder ausfüllen und die Datenschutzhinweise bestätigen."; return;
    }
    if(password.length<8){box.className="eligibility-box blocked";box.textContent="Das Passwort muss mindestens 8 Zeichen lang sein.";return;}
    if(!window.bklSupabase){box.className="eligibility-box blocked";box.textContent="Supabase-Verbindung ist nicht verfügbar.";return;}
    registerRealBtn.disabled=true;
    const {data,error}=await window.bklSupabase.auth.signUp({
      email,password,
      options:{data:{first_name:first,last_name:last,alias,date_of_birth:birth}}
    });
    if(error){registerRealBtn.disabled=false;box.className="eligibility-box blocked";box.textContent="Registrierung fehlgeschlagen: "+error.message;return;}
    const user=data.user;
    // Wenn Supabase bereits eine Session liefert, versuchen wir das Profil anzulegen.
    // Bei aktivierter E-Mail-Bestätigung geschieht dies nach dem ersten bestätigten Login.
    if(data.session && user){
      const {error:pe}=await window.bklSupabase.from("profiles").upsert({
        id:user.id,first_name:first,last_name:last,alias,date_of_birth:birth
      },{onConflict:"id"});
      if(pe){console.error("Profilanlage:",pe);}
      await syncAuthState();
    }
    registerRealBtn.disabled=false;
    const age=ageOnDate(new Date(birth+"T12:00:00"),eventDay);
    box.className="eligibility-box allowed";
    box.innerHTML="<b>KONTO ANGELEGT ✓</b><br>Bitte prüfe jetzt dein E-Mail-Postfach und bestätige deine E-Mail-Adresse. Danach kannst du dich anmelden.";
    showModal("Bestätigungs-E-Mail gesendet","Dein BKL-Konto wurde angelegt. Bitte bestätige deine E-Mail-Adresse über den Link in der E-Mail. Erst danach ist die Anmeldung vollständig.",[{label:"OK"}]);
  });
}

async function ensureProfileAfterLogin(){
  if(!window.bklSupabase||!currentAuthUser||currentProfile) return;
  const m=currentAuthUser.user_metadata||{};
  if(!m.first_name||!m.last_name||!m.alias||!m.date_of_birth) return;
  const {error}=await window.bklSupabase.from("profiles").upsert({
    id:currentAuthUser.id,first_name:m.first_name,last_name:m.last_name,alias:m.alias,date_of_birth:m.date_of_birth
  },{onConflict:"id"});
  if(!error) await loadOwnProfile();
}
const paymentBtn=$("paymentReceivedBtn"), approveBtn=$("approveTeamBtn");
if(paymentBtn){
  paymentBtn.addEventListener("click",()=>{
    $("paymentStatus").textContent="EINGEGANGEN ✓";
    approveBtn.disabled=false;
    $("auditText").textContent="Zahlungseingang wurde in der Demo administrativ verbucht.";
  });
}
if(approveBtn){
  approveBtn.addEventListener("click",()=>{
    $("approvalStatus").textContent="BESTÄTIGT · STARTBERECHTIGT ✓";
    approveBtn.disabled=true;
    const mail=$("mailConfirmCheck").checked;
    $("auditText").textContent="Team wurde administrativ bestätigt."+ (mail?" Bestätigungs-E-Mail an Teammitglieder ist vorgesehen.":" E-Mail-Versand wurde abgewählt.");
    showModal("Team bestätigt","Die Hopfenhelden sind jetzt in dieser Demo startberechtigt."+ (mail?" Eine Bestätigungs-E-Mail würde im Produktivsystem automatisch versendet.":""),[{label:"OK"}]);
  });
}


const galleryUploadBtn=$("galleryUploadBtn");
if(galleryUploadBtn)galleryUploadBtn.addEventListener("click",()=>{if(!demoLoggedIn){showModal("Konto erforderlich","Fotos können nur von angemeldeten Nutzern hochgeladen werden. Nach dem Upload wartet das Bild auf die Orga-Freigabe.",[{label:"ZU MEINEM KONTO",action:()=>{modal.close();showPage("account")}},{label:"ABBRECHEN"}]);return}showModal("Foto hochladen","Demo: Der Upload wird zur Prüfung an das Orga-Team geschickt und erst nach Freigabe veröffentlicht.",[{label:"UPLOAD SIMULIEREN",action:()=>{modal.close();showModal("Upload eingereicht","Das Bild wartet jetzt auf die Freigabe.",[{label:"OK"}])}},{label:"ABBRECHEN"}])});
const videoLinkBtn=$("videoLinkBtn");if(videoLinkBtn)videoLinkBtn.addEventListener("click",()=>showModal("Video-Link","Pro BKL können externe Video-Links mit Vorschaufenster hinterlegt werden, z. B. YouTube.",[{label:"OK"}]));
function upd(){const l=$("moderationList"),c=$("pendingCount");if(l&&c)c.textContent=l.querySelectorAll(".moderation-card:not(.done)").length}
document.querySelectorAll(".approve-photo,.reject-photo").forEach(b=>b.addEventListener("click",()=>{const c=b.closest(".moderation-card");c.classList.add("done");c.querySelector(".moderation-actions").innerHTML=b.classList.contains("approve-photo")?"<strong style='color:#76d680'>FREIGEGEBEN ✓</strong>":"<strong style='color:#c47474'>ABGELEHNT</strong>";upd()}));upd();

// PWA-Basis
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("./service-worker.js").catch(()=>{});
}

document.addEventListener("click",e=>{const c=e.target.closest("[data-admin-module],[data-module],.admin-module-card,.admin-card");if(c&&c.closest("#adminDashboard,.admin-dashboard,.admin-grid,[data-admin-dashboard]"))setTimeout(jumpToOpenAdminModule,0);});

// V0.8.8.2 – öffentlicher BKL: Navigation & Streckenansicht
function openStartNavigation(){window.open("https://www.google.com/maps/search/?api=1&query=Leggewies%2C%20Polch","_blank","noopener");}
$("startNavigationBtn")?.addEventListener("click",openStartNavigation);
$("startNavigation")?.addEventListener("click",openStartNavigation);
$("startNavigation")?.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openStartNavigation()}});
function openRouteImage(){$("routeImageModal")?.classList.remove("hidden");document.body.classList.add("modal-open")}
function closeRouteImage(){$("routeImageModal")?.classList.add("hidden");document.body.classList.remove("modal-open")}
$("publicRouteMap")?.addEventListener("click",openRouteImage);
$("routeImageClose")?.addEventListener("click",closeRouteImage);
$("routeImageModal")?.addEventListener("click",e=>{if(e.target.id==="routeImageModal")closeRouteImage()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeRouteImage()});

// V0.9.1 – echte Supabase-Session übernehmen.
window.addEventListener("load", async()=>{
  if(!window.bklSupabase) return;
  await syncAuthState();
  await ensureProfileAfterLogin();
  await syncAuthState();
  window.bklSupabase.auth.onAuthStateChange(async(_event,session)=>{
    currentAuthUser=session?.user||null;
    demoLoggedIn=!!currentAuthUser;
    if(demoLoggedIn){await loadOwnProfile();await ensureProfileAfterLogin();}
    await syncAuthState();
  });
});
