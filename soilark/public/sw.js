const CACHE_NAME = 'landark-v2'

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return
  if (!event.request.url.startsWith(self.location.origin)) return

  // Never cache HTML navigation requests — always fetch fresh to avoid serving
  // stale HTML that references outdated JS chunk hashes
  if (event.request.mode === 'navigate') return

  // Only cache versioned static assets (JS/CSS bundles in /assets/, images, fonts)
  const url = new URL(event.request.url)
  const isStaticAsset = /^\/assets\//.test(url.pathname) ||
    /\.(png|jpg|jpeg|svg|ico|webp|woff2?|ttf)$/.test(url.pathname)

  if (!isStaticAsset) return

  event.respondWith(
    caches.match(event.request).then(cached => {
      const network = fetch(event.request).then(response => {
        if (response.ok && response.headers.get('content-type')?.includes('text/html') === false) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone))
        }
        return response
      })
      return cached || network
    })
  )
})
