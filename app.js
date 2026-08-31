
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
  if(page==="admin-approval"){ showPage("admin-approval"); return; }
  if(page==="gallery"){ showPage("gallery"); return; }
  if(page==="gallery-moderation"){ showPage("gallery-moderation"); return; }

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


let demoLoggedIn=false,demoHasTeam=false,demoParticipantEligible=true;

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

const loginBtn=$("demoLoginBtn");
if(loginBtn) loginBtn.addEventListener("click",()=>{
  startBklHymn();
  demoLoggedIn=true;
  demoParticipantEligible=true; // normaler Demo-Login: volljähriger Testnutzer
  renderAccountState();
  showModal("Demo-Login erfolgreich",
    "Du bist jetzt als registrierter Nutzer angemeldet. Die Live-Karte wäre freigeschaltet; die aktive Teilnahme kannst du anschließend separat starten.",
    [{label:"WEITER"}]);
});

const logoutBtn=$("demoLogoutBtn");
if(logoutBtn) logoutBtn.addEventListener("click",()=>{
  demoLoggedIn=false;
  demoHasTeam=false;
  demoParticipantEligible=true;
  renderAccountState();
  renderTeamState();
});

const acc=$("acceptJoinRequest");
if(acc) acc.addEventListener("click",()=>{
  acc.closest(".join-request").innerHTML='<div><b>Max Mustermann</b><small>Beitrittsanfrage angenommen ✓</small></div>';
});
const dec=$("declineJoinRequest");
if(dec) dec.addEventListener("click",()=>{
  dec.closest(".join-request").innerHTML='<div><b>Max Mustermann</b><small>Beitrittsanfrage abgelehnt</small></div>';
});

renderAccountState();
renderTeamState();


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
