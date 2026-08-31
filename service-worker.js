
const CACHE = "bkl-prototype-v07";
const ASSETS = [
  "./","./index.html","./styles.css","./app.js",
  "./assets/bkl-banner.jpeg","./assets/bkl-logo.png",
  "./assets/apple-touch-icon.png","./assets/icon-192.png","./assets/icon-512.png"
  ,"./assets/audio/bkl-hymne.mp3"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});
self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
