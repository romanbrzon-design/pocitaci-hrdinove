// Chytrolínci – offline cache (stránka vždy čerstvá ze sítě, obrázky z cache)
const C='chytrolinci-v7';
self.addEventListener('install', e=>{ self.skipWaiting(); e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html','./config.js','./manifest.webmanifest','./icon-192.png']).catch(()=>{}))); });
self.addEventListener('activate', e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch', e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET' || u.origin!==location.origin) return;
  if(u.pathname.includes('/assets/')){
    e.respondWith(caches.open(C).then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(n=>{ if(n.ok) c.put(e.request,n.clone()); return n; }))));
  } else {
    e.respondWith(fetch(e.request).then(n=>{ if(n.ok){ const cl=n.clone(); caches.open(C).then(c=>c.put(e.request,cl)); } return n; }).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
  }
});
