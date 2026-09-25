const CACHE = "bkl-prototype-v0965";
const ASSETS = [
  "./","./index.html","./styles.css","./app.js","./supabase-config.js",
  "./assets/bkl-banner.jpeg","./assets/bkl-logo.png",
  "./assets/apple-touch-icon.png","./assets/icon-192.png","./assets/icon-512.png",
  "./assets/bkl-streckenkarte-oeffentlich.jpg","./assets/bkl-qr-core.js","./assets/bkl-live-karte.jpg",
  "./bkl-hymne.mp3"
];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  const core=u.origin===location.origin&&(u.pathname.endsWith("/")||/\/(index\.html|app\.js|styles\.css|supabase-config\.js)$/.test(u.pathname));
  if(core)e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)));
  else e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});