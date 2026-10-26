/* V0.9.9.3.4f – Archiv abgeschlossener Veranstaltungen: nur Galerie und Ergebnisse. */
(()=>{'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let archiveEvents=[];
const completed=e=>e && e.type!=='test' && (['completed','archived'].includes(e.status) || e.historicalEntry===true);
async function refreshArchive(){
 const card=document.querySelector('.past-event-card[data-page="past-event"]');
 if(!card||!window.bklSupabase)return;
 const {data,error}=await window.bklSupabase.from('bkl_event_state').select('id,app_data');
 if(error){console.warn('BKL Archiv:',error.message);return;}
 archiveEvents=(data||[]).map(r=>({...r.app_data,_dbId:r.id})).filter(completed).sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
 if(!archiveEvents.length){card.style.display='none';return;}
 const holder=card.parentElement;
 holder.querySelectorAll('[data-bkl-archive-card]').forEach(n=>n.remove());
 archiveEvents.forEach(e=>{
  const el=document.createElement('button');el.type='button';el.className='past-event-card';el.dataset.bklArchiveCard=e._dbId;
  const date=e.date?new Date(e.date+'T12:00:00').toLocaleDateString('de-DE'):'';
  el.innerHTML=`<div><span class="event-status event-status-done">BEENDET</span><h3>${esc(e.shortName||e.name||'BKL')}</h3><p>${esc(e.name||'Bierkistenlauf Polch')}</p><small>${esc(date)}</small></div><span class="past-arrow">→</span>`;
  holder.insertBefore(el,card);
 });
 card.style.display='none';
}
function openArchive(id){
 const ev=archiveEvents.find(x=>x._dbId===id);
 if(!ev)return;
 const modal=document.getElementById('modal');
 if(modal?.open)modal.close();
 showModal(ev.shortName||ev.name||'BKL – Archiv','Abgeschlossene Veranstaltung',[
  {label:'GALERIE ANSEHEN',action:()=>go('gallery',id)},
  {label:'ERGEBNISSE & RANGLISTE',action:()=>go('results',id)}
 ]);
}
function go(type,id){
 const modal=document.getElementById('modal');if(modal?.open)modal.close();
 window.BKLArchiveOpening=true;
 if(type==='gallery')window.BKLArchiveGalleryEventId=id;
 else window.BKLArchiveResultsEventId=id;
 const trigger=document.createElement('button');trigger.dataset.page=type;document.body.appendChild(trigger);trigger.click();trigger.remove();
 window.BKLArchiveOpening=false;
}
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-bkl-archive-card],.past-event-card[data-page="past-event"]');
 if(!b)return;
 e.preventDefault();e.stopImmediatePropagation();
 const id=b.dataset.bklArchiveCard||archiveEvents[0]?._dbId;
 if(id)openArchive(id);
},true);
document.addEventListener('click',e=>{if(e.target.closest('[data-page="events"]'))setTimeout(refreshArchive,0);},true);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refreshArchive);else refreshArchive();
})();
