const CACHE_NAME = 'tomitalk-v1.0.33';
const CACHE_VERSION = 5;

// Essential files to cache for offline functionality
const ESSENTIAL_CACHE = [
  '/',
  '/manifest.json?v=11',
  '/icons/icon-72x72.png?v=zmajcek9',
  '/icons/icon-144x144.png?v=zmajcek9',
  '/icons/icon-192x192.png?v=zmajcek9',
  '/icons/icon-512x512.png?v=zmajcek9',
  // Add other essential assets
];

// Game assets to pre-cache
const GAME_CACHE = [
  '/spomin-games',
  '/sestavljanke-games',
  '/igra-ujemanja',
  // Add game-specific assets
];

// API endpoints that should be cached
const API_CACHE_PATTERNS = [
  /\/api\/children/,
  /\/api\/progress/,
  /\/api\/user/
];

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching essential resources');
        return cache.addAll(ESSENTIAL_CACHE);
      })
      .then(() => {
        console.log('[SW] Essential resources cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Cache installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Handle different types of requests
  if (isStaticAsset(request)) {
    // Static assets: Cache First strategy
    event.respondWith(cacheFirst(request));
  } else if (isAPIRequest(request)) {
    // API requests: Network First strategy
    event.respondWith(networkFirst(request));
  } else if (isNavigationRequest(request)) {
    // Navigation requests: Network First with offline fallback
    event.respondWith(navigationHandler(request));
  } else {
    // Other requests: Network First
    event.respondWith(networkFirst(request));
  }
});

// Cache First strategy for static assets
async function cacheFirst(request) {
  try {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('[SW] Cache first failed:', error);
    return new Response('Offline content not available', { status: 503 });
  }
}

// Network First strategy for API and dynamic content
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('[SW] Network first fallback to cache:', error);
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    return new Response('Content not available offline', { status: 503 });
  }
}

// Navigation handler with offline fallback
async function navigationHandler(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    console.log('[SW] Navigation offline, serving cached page');
    const cached = await caches.match('/');
    if (cached) {
      return cached;
    }
    return new Response('Application not available offline', { status: 503 });
  }
}

// Helper functions
function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|ico|woff|woff2)$/);
}

function isAPIRequest(request) {
  const url = new URL(request.url);
  return API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname));
}

function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'progress-sync') {
    event.waitUntil(syncProgressData());
  }
});

// Sync progress data when back online
async function syncProgressData() {
  try {
    console.log('[SW] Syncing progress data...');
    // Implementation would sync cached progress data with server
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({ type: 'PROGRESS_SYNCED' });
    });
  } catch (error) {
    console.error('[SW] Progress sync failed:', error);
  }
}

// Handle push notifications (future enhancement)
self.addEventListener('push', (event) => {
  console.log('[SW] Push message received:', event);
  
  const options = {
    body: 'Čas je za novo govorino vajo!',
    icon: '/icons/icon-192x192.png?v=zmajcek9',
    badge: '/icons/icon-72x72.png?v=zmajcek9',
    tag: 'speech-reminder',
    requireInteraction: true,
    actions: [
      {
        action: 'open-app',
        title: 'Odpri aplikacijo'
      },
      {
        action: 'dismiss',
        title: 'Pozneje'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('TomiTalk', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'open-app') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Listen for skip waiting message to activate update immediately
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
