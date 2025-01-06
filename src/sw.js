const cacheName = 'cache-v1';
const filesToCache = [
  './assets/css/style.min.css',
  './assets/js/local/script.js',
  './assets/js/default.js',
  './assets/js/marked.min.js',
  './assets/js/purify.min.js',
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    await cache.addAll(filesToCache);
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keyList = await caches.keys();
    await Promise.all(
      keyList.map(key => {
        if (key !== cacheName) {
          return caches.delete(key);
        }
      })
    );
  })());
  e.waitUntil(self.clients.claim());
});
