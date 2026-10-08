/* BKL V0.9.8.8 | bestehende team_race_times als einzige Rennzeitquelle */
(()=>{'use strict';
const el=id=>document.getElementById(id),sb=()=>window.bklSupabase;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const id=()=>typeof eventData!=='undefined'?eventData?._dbId:null;
const dur=ms=>{let n=Math.floor(Math.max(0,ms)/1000);return [Math.floor(n/3600),Math.floor(n%3600/60),n%60].map(x=>String(x).padStart(2,'0')).join(':');};
let adminTimer=null,myTimer=null;
const rpc=async(name,args)=>{const {data,error}=await sb().rpc(name,args);if(error)throw Error(error.message);return data;};
const msg=e=>alert('BKL Rennverwaltung: '+(e.message||e));
async function load(){const ev=id(),host=el('race987');if(!ev||!host||!sb())return;
const d=await rpc('bkl_race_admin_state',{p_event_id:ev}),teams=d.teams||[],groups=d.groups||[];

host.innerHTML=`<h3>RENNVERWALTUNG · V0.9.8.8</h3><p class="payment-meta">Serverzeit für Start und Ziel. Vorhandene Rennzeiten bleiben erhalten.</p>
${d.link_status==='ambiguous'?'<p class="payment-meta">Die Team-Zuordnung ist nicht eindeutig. Bitte identische Veranstaltungstitel und Daten prüfen.</p>':d.link_status==='missing'?'<p class="payment-meta">Für diese Veranstaltung existiert noch kein passender Team-Datensatz. Sobald dieser mit demselben Namen und Datum angelegt ist, werden Teams automatisch angezeigt.</p>':''}
<label>Startverfahren <select id="r987mode"><option value="mass" ${d.mode==='mass'?'selected':''}>Massenstart</option><option value="group" ${d.mode==='group'?'selected':''}>Gruppenstart</option><option value="individual" ${d.mode==='individual'?'selected':''}>Einzelstart</option></select></label>
<button class="mini-action" id="r987reload">AKTUALISIEREN</button>
${d.mode==='group'?`<div class="race-actions"><button class="mini-action" id="r987add">+ GRUPPE</button><button class="mini-action" id="r987distribute">GLEICHMÄSSIG VERTEILEN</button></div>${groups.map(g=>`<div class="finish-card"><strong>${esc(g.name)}</strong><button class="mini-action" data-startgroup="${g.id}" ${g.started_at?'disabled':''}>${g.started_at?'GESTARTET':'GRUPPE STARTEN'}</button></div>`).join('')}`:''}
${d.mode==='mass'?`<button class="btn btn-orange" id="r987mass" ${!teams.some(t=>!t.started_at)?'disabled':''}>ALLE STARTEN</button>`:''}
<h3>TEAMS (${teams.length})</h3>${teams.map(t=>`<div class="finish-card"><div><b>${esc(t.name)}</b><small>${t.started_at?'Start '+new Date(t.started_at).toLocaleTimeString('de-DE'):'Nicht gestartet'} · ${t.finished_at?'Ziel '+new Date(t.finished_at).toLocaleTimeString('de-DE'):'Nicht im Ziel'} <strong data-start="${t.started_at||''}" data-end="${t.finished_at||''}"></strong></small></div><div>${d.mode==='group'&&!t.started_at?`<select data-teamgroup="${t.id}"><option value="">Gruppe wählen</option>${groups.map(g=>`<option value="${g.id}" ${t.group_id===g.id?'selected':''}>${esc(g.name)}</option>`).join('')}</select>`:''}${d.mode==='individual'&&!t.started_at?`<button class="mini-action" data-startteam="${t.id}">STARTEN</button>`:''}${t.started_at&&!t.finished_at?`<button class="mini-action" data-finishteam="${t.id}">ZIEL ERFASSEN</button>`:''}</div></div>`).join('')||'<p>Keine Teams in der zugeordneten Datenbank-Veranstaltung.</p>'}`;
const action=async(a,p={},question)=>{if(question&&!confirm(question))return;try{await rpc('bkl_race_manage',{p_event_id:ev,p_action:a,...p});await load();}catch(e){msg(e);}};

el('r987mode').onchange=e=>action('mode',{p_mode:e.target.value});el('r987reload').onclick=()=>load().catch(msg);
el('r987add')?.addEventListener('click',()=>{const n=prompt('Name der Startgruppe');if(n?.trim())action('add_group',{p_name:n.trim()});});
el('r987distribute')?.addEventListener('click',()=>action('distribute',{},'Teams gleichmäßig verteilen?'));
el('r987mass')?.addEventListener('click',()=>action('start',{},'Alle Teams jetzt starten?'));
host.querySelectorAll('[data-startgroup]').forEach(b=>b.onclick=()=>action('start',{p_group_id:b.dataset.startgroup},'Gruppe jetzt starten?'));
host.querySelectorAll('[data-startteam]').forEach(b=>b.onclick=()=>action('start',{p_team_id:b.dataset.startteam},'Team jetzt starten?'));
host.querySelectorAll('[data-finishteam]').forEach(b=>b.onclick=()=>action('finish',{p_team_id:b.dataset.finishteam},'Zielzeit jetzt erfassen?'));
host.querySelectorAll('[data-teamgroup]').forEach(s=>s.onchange=()=>s.value&&action('assign',{p_team_id:s.dataset.teamgroup,p_group_id:s.value}));
clearInterval(adminTimer);const tick=()=>host.querySelectorAll('[data-start]').forEach(x=>x.textContent=x.dataset.start?' · '+dur((x.dataset.end?Date.parse(x.dataset.end):Date.now())-Date.parse(x.dataset.start)):'');tick();adminTimer=setInterval(tick,1000);
}
function init(){const panel=el('raceAdminPanel');if(!panel)return;
[...panel.children].forEach(x=>x.style.display='none');const host=document.createElement('section');host.id='race987';panel.appendChild(host);
// Die Funktion wird von app.js im globalen Scope definiert. Eine eigene globale
// Funktion verhindert den alten localStorage-Rennstart.
window.openRaceAdmin=function(){if(typeof closeAdminPanels==='function')closeAdminPanels();panel.classList.remove('hidden');host.textContent='Lade Rennverwaltung …';load().catch(msg);panel.scrollIntoView({behavior:'smooth'});};
const originalNav=el('adminPage');if(originalNav){originalNav.addEventListener('click',e=>{if(e.target.closest('[data-admin-module="race"]'))setTimeout(()=>{if(!panel.classList.contains('hidden'))load().catch(msg);},50);});}
const team=el('teamPage');if(team){const box=document.createElement('section');box.className='admin-subcard hidden';box.innerHTML='<h3>MEINE TEAM-STOPPUHR</h3><strong id="r987clock">Noch kein Start</strong><p class="payment-meta">Nur für Mitglieder deines Teams.</p><button class="mini-action" id="r987clockrefresh">AKTUALISIEREN</button>';team.appendChild(box);
const update=async()=>{const ev=typeof publicEvent==='function'?publicEvent():null;if(!ev?._dbId||!sb()){box.classList.add('hidden');return;}try{const rows=await rpc('bkl_race_my_time',{p_event_id:ev._dbId});const r=rows?.[0];if(!r){box.classList.add('hidden');return;}box.classList.remove('hidden');const start=r.started_at?Date.parse(r.started_at):null,end=r.finished_at?Date.parse(r.finished_at):null,offset=Date.parse(r.server_now)-Date.now();clearInterval(myTimer);const tick=()=>el('r987clock').textContent=start?dur((end||Date.now()+offset)-start):'Noch nicht gestartet';tick();myTimer=setInterval(tick,1000);}catch(e){box.classList.add('hidden');}};
el('r987clockrefresh').onclick=update;
const oldShow=window.showPage; if(typeof oldShow==='function')window.showPage=function(p){oldShow(p);if(p==='team')update();else{clearInterval(myTimer);box.classList.add('hidden');}};
}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
