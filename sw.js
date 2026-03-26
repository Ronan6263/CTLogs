// AMC Service Worker — Offline Support
const CACHE = 'amc-v2'
const OFFLINE_ASSETS = [
  '/',
  '/index.html',
  '/logo.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm',
]

// ── INSTALL: cache app shell ──────────────────────────────────────────────────
self.addEventListener('install', e=>{
  e.waitUntil(
    caches.open(CACHE).then(cache=>{
      // Cache what we can — some CDN resources may fail due to CORS, that's ok
      return Promise.allSettled(OFFLINE_ASSETS.map(url=>cache.add(url).catch(()=>{})))
    }).then(()=>self.skipWaiting())
  )
})

// ── ACTIVATE: clean old caches ────────────────────────────────────────────────
self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=>
      Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))
    ).then(()=>self.clients.claim())
  )
})

// ── FETCH: serve from cache, fall back to network ─────────────────────────────
self.addEventListener('fetch', e=>{
  const url = new URL(e.request.url)

  // Don't intercept Supabase API calls — those need live network
  // We let them fail naturally; the app handles offline state
  if(url.hostname.includes('supabase.co')) return

  // For everything else: cache-first for GET, network-only for mutations
  if(e.request.method !== 'GET') return

  e.respondWith(
    caches.match(e.request).then(cached=>{
      if(cached) return cached
      return fetch(e.request).then(response=>{
        // Cache successful responses for app shell assets
        if(response && response.status === 200 && response.type !== 'opaque'){
          const clone = response.clone()
          caches.open(CACHE).then(cache=>cache.put(e.request, clone))
        }
        return response
      }).catch(()=>{
        // Network failed — if it's a navigation request, serve index.html
        if(e.request.mode === 'navigate'){
          return caches.match('/index.html')
        }
      })
    })
  )
})

// ── BACKGROUND SYNC: flush queued writes when back online ─────────────────────
self.addEventListener('sync', e=>{
  if(e.tag === 'ctlogs-sync'){
    e.waitUntil(flushQueue())
  }
})

async function flushQueue(){
  // Notify all clients that connection is restored so they can retry
  const clients = await self.clients.matchAll()
  clients.forEach(client=>client.postMessage({type:'ONLINE'}))
}

// Listen for messages from the app
self.addEventListener('message', e=>{
  if(e.data?.type==='SKIP_WAITING') self.skipWaiting()
})
