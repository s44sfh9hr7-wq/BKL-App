
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

document.querySelectorAll(".role-switch").forEach(btn=>btn.addEventListener("click",()=>{
  demoRole=btn.dataset.demoRole;
  demoHasTeam=false;
  renderTeamState();
  renderRoleState();
  renderAdminRole();
  if(isOrganizerRole()){
    showModal(demoRole==="master"?"Master-Admin aktiviert":"Orga-Team aktiviert",
      "V0.8.0 Testrolle aktiv. Bei einem regulären BKL sind Teamgründung und Teambeitritt für Orga/Master gesperrt. In einer Testveranstaltung wird diese Sperre später gezielt aufgehoben.",
      [{label:"OK"}]);
  }
}));

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

const loginBtn=$("demoLoginBtn");
if(loginBtn) loginBtn.addEventListener("click",()=>{
  startBklHymn();
  demoLoggedIn=true;
  demoParticipantEligible=true; // normaler Demo-Login: volljähriger Testnutzer
  renderAccountState();
  renderRoleState();
  showModal("Demo-Login erfolgreich",
    "Du bist jetzt als registrierter Nutzer angemeldet. Die Live-Karte wäre freigeschaltet; die aktive Teilnahme kannst du anschließend separat starten.",
    [{label:"WEITER"}]);
});

const logoutBtn=$("demoLogoutBtn");
if(logoutBtn) logoutBtn.addEventListener("click",()=>{
  demoLoggedIn=false;
  demoHasTeam=false;
  demoParticipantEligible=true;
  demoRole="user";
  renderAccountState();
  renderTeamState();
  renderRoleState();
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
function openPaymentAdmin(){
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
function closeAdminPanels(){
  $("adminWorkspace")?.classList.add("hidden");
  $("eventAdminPanel")?.classList.add("hidden");
  $("teamAdminPanel")?.classList.add("hidden");
  $("paymentAdminPanel")?.classList.add("hidden");
}
function openEventAdmin(){
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
const registerDemoBtn=$("registerDemoBtn");
if(registerDemoBtn){
  registerDemoBtn.addEventListener("click",()=>{
    const raw=$("birthDateDemo").value, box=$("ageResult");
    if(!raw){
      box.className="eligibility-box blocked";
      box.innerHTML="<b>GEBURTSDATUM FEHLT</b><br>Bitte gib dein Geburtsdatum ein.";
      return;
    }
    const age=ageOnDate(new Date(raw+"T12:00:00"),eventDay);
    const ok=age>=eventMinimumAge;

    demoLoggedIn=true;
    demoParticipantEligible=ok;
    demoHasTeam=false;
    renderAccountState();
    renderTeamState();

    box.className="eligibility-box "+(ok?"allowed":"blocked");
    box.innerHTML=ok
      ? "<b>KONTO ERSTELLT ✓</b><br>Du bist am Veranstaltungstag "+age+" Jahre alt und erfüllst das aktuell eingestellte Mindestalter von "+eventMinimumAge+" Jahren. Die Teilnahmefunktionen sind freigeschaltet."
      : "<b>ZUSCHAUER-KONTO ERSTELLT ✓</b><br>Du bist am Veranstaltungstag "+age+" Jahre alt. Das Mindestalter für die aktive Teilnahme am BKL 2027 beträgt aktuell "+eventMinimumAge+" Jahre. Live-/Zuschauerfunktionen sind verfügbar; Team- und Teilnahmefunktionen bleiben gesperrt.";

    setTimeout(()=>{
      showPage("account");
      showModal(ok ? "BKL-Konto erstellt" : "Zuschauer-Konto erstellt",
        ok
          ? "Dein Demo-Konto wurde erstellt. Du kannst jetzt die Live-Funktionen nutzen und unter „Am BKL teilnehmen“ den Teamprozess starten."
          : "Dein Demo-Konto wurde erstellt. Zuschauerfunktionen wie die Live-Karte bleiben verfügbar; die aktive Teilnahme ist aufgrund des Mindestalters gesperrt.",
        [{label:"ZU MEINEM KONTO"}]);
    }, 250);
  });
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
