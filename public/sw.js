const cacheName = 'cache-v1'

self.addEventListener('install', {})

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keyList = await caches.keys()
    await Promise.all(
      keyList.map(key => {
        if (key !== cacheName) {
          return caches.delete(key)
        }
      })
    )
  })())
  e.waitUntil(self.clients.claim())
})
