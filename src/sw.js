const CACHE_NAME = 'static-v1';
const urlsToCache = [];
this.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => this.skipWaiting()),
  );
});
this.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(CACHE_NAME)
      .then((cache) => cache.match(event.request)
        .then((res) => res || fetch(event.request))),
  );
});
this.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((key) => {
      if (key !== CACHE_NAME) {
        return caches.delete(key);
      }
      return null;
    }))),
  );
  this.registration
    .update()
    .then(() => {
      console.log('Service worker updated!');
    })
    .catch(() => {
      console.log('Service worker update failed...');
    });
});
