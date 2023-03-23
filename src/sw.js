const CACHE_VERSION = 'v1';
const CACHE_NAME = `static-${CACHE_VERSION}`;
const urlsToCache = [];
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(res => {
        return res || fetch(event.request);
      });
    })
  );
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  self.registration
    .update()
    .then(() => {
      console.log('Service worker updated!');
    })
    .catch(() => {
      console.log('Service worker update failed...');
    });
});
