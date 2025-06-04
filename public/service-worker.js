// ===== SERVICE WORKER FOR CRADLE OF CIVILIZATION =====

const CACHE_NAME = 'cradle-of-civilization-v1.0.0';
const STATIC_CACHE = 'cradle-static-v1.0.0';
const DYNAMIC_CACHE = 'cradle-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/manifest.json',
    '../src/css/main.css',
    '../src/css/mobile.css',
    '../src/css/themes.css',
    '../src/js/utils/constants.js',
    '../src/js/utils/helpers.js',
    '../src/js/services/firebase-service.js',
    '../src/js/core/app.js',
    // Add icon files when they exist
    // '/icons/icon-192x192.png',
    // '/icons/icon-512x512.png'
];

// Files to cache on first access
const DYNAMIC_FILES = [
    // External resources
    'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap',
    'https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js',
    'https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js',
    'https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js'
];

// Network-first resources (Firebase API, user data)
const NETWORK_FIRST = [
    'https://firestore.googleapis.com',
    'https://identitytoolkit.googleapis.com',
    'https://securetoken.googleapis.com'
];

// Cache-first resources (static assets)
const CACHE_FIRST = [
    '/icons/',
    '/assets/',
    '.css',
    '.js',
    '.png',
    '.jpg',
    '.jpeg',
    '.svg',
    '.woff',
    '.woff2'
];

// ===== SERVICE WORKER EVENTS =====

// Install event - cache static files
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Service Worker: Static files cached successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Failed to cache static files', error);
            })
    );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated successfully');
                return self.clients.claim();
            })
            .catch((error) => {
                console.error('Service Worker: Activation failed', error);
            })
    );
});

// Fetch event - handle requests with caching strategies
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and other non-http requests
    if (!request.url.startsWith('http')) {
        return;
    }
    
    // Determine caching strategy based on request
    if (isNetworkFirst(request.url)) {
        event.respondWith(networkFirstStrategy(request));
    } else if (isCacheFirst(request.url)) {
        event.respondWith(cacheFirstStrategy(request));
    } else {
        event.respondWith(staleWhileRevalidateStrategy(request));
    }
});

// ===== CACHING STRATEGIES =====

/**
 * Network-first strategy - try network, fallback to cache
 * Best for: Dynamic content, API calls, user data
 */
async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
        
    } catch (error) {
        console.log('Service Worker: Network failed, trying cache for', request.url);
        
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page or fallback
        return getOfflineFallback(request);
    }
}

/**
 * Cache-first strategy - try cache, fallback to network
 * Best for: Static assets, images, fonts
 */
async function cacheFirstStrategy(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
        
    } catch (error) {
        console.log('Service Worker: Failed to fetch', request.url);
        return getOfflineFallback(request);
    }
}

/**
 * Stale-while-revalidate strategy - return cache, update in background
 * Best for: Semi-static content that changes occasionally
 */
async function staleWhileRevalidateStrategy(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    // Fetch from network in the background
    const networkPromise = fetch(request)
        .then((networkResponse) => {
            if (networkResponse.ok) {
                cache.put(request, networkResponse.clone());
            }
            return networkResponse;
        })
        .catch((error) => {
            console.log('Service Worker: Background fetch failed for', request.url);
        });
    
    // Return cached version immediately, or wait for network
    return cachedResponse || networkPromise || getOfflineFallback(request);
}

// ===== HELPER FUNCTIONS =====

/**
 * Check if request should use network-first strategy
 */
function isNetworkFirst(url) {
    return NETWORK_FIRST.some(pattern => url.includes(pattern));
}

/**
 * Check if request should use cache-first strategy
 */
function isCacheFirst(url) {
    return CACHE_FIRST.some(pattern => url.includes(pattern));
}

/**
 * Get offline fallback response
 */
async function getOfflineFallback(request) {
    const url = new URL(request.url);
    
    // For HTML pages, return cached index.html
    if (request.destination === 'document') {
        const cachedPage = await caches.match('/index.html');
        if (cachedPage) {
            return cachedPage;
        }
    }
    
    // For images, return a placeholder if available
    if (request.destination === 'image') {
        return new Response(
            '<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".35em" fill="#999">Image Unavailable</text></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
        );
    }
    
    // For other resources, return a generic offline response
    return new Response(
        JSON.stringify({ 
            error: 'Offline', 
            message: 'This content is not available offline' 
        }),
        { 
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'application/json' }
        }
    );
}

// ===== BACKGROUND SYNC =====

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Background sync triggered', event.tag);
    
    if (event.tag === 'game-orders-sync') {
        event.waitUntil(syncGameOrders());
    } else if (event.tag === 'user-preferences-sync') {
        event.waitUntil(syncUserPreferences());
    }
});

/**
 * Sync game orders when back online
 */
async function syncGameOrders() {
    try {
        console.log('Service Worker: Syncing game orders...');
        
        // Get pending orders from IndexedDB or localStorage
        const pendingOrders = await getPendingOrders();
        
        if (pendingOrders.length > 0) {
            // Attempt to sync with server
            const syncResults = await Promise.allSettled(
                pendingOrders.map(order => submitOrderToServer(order))
            );
            
            // Remove successfully synced orders
            const successfulOrders = syncResults
                .filter(result => result.status === 'fulfilled')
                .map((_, index) => pendingOrders[index]);
            
            await removePendingOrders(successfulOrders);
            
            // Notify clients of sync completion
            const clients = await self.clients.matchAll();
            clients.forEach(client => {
                client.postMessage({
                    type: 'ORDERS_SYNCED',
                    successful: successfulOrders.length,
                    failed: pendingOrders.length - successfulOrders.length
                });
            });
        }
        
    } catch (error) {
        console.error('Service Worker: Failed to sync game orders', error);
    }
}

/**
 * Sync user preferences when back online
 */
async function syncUserPreferences() {
    try {
        console.log('Service Worker: Syncing user preferences...');
        
        // Implementation would sync preferences with Firebase
        // For now, just log the action
        
    } catch (error) {
        console.error('Service Worker: Failed to sync user preferences', error);
    }
}

// ===== PUSH NOTIFICATIONS =====

// Handle push notifications
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push notification received');
    
    let notificationData = {
        title: 'Cradle of Civilization',
        body: 'You have a new notification',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        tag: 'default',
        renotify: true,
        requireInteraction: false,
        actions: [
            {
                action: 'view',
                title: 'View',
                icon: '/icons/action-view.png'
            },
            {
                action: 'dismiss',
                title: 'Dismiss',
                icon: '/icons/action-dismiss.png'
            }
        ]
    };
    
    // Parse push data if available
    if (event.data) {
        try {
            const pushData = event.data.json();
            notificationData = { ...notificationData, ...pushData };
        } catch (error) {
            console.warn('Service Worker: Failed to parse push data', error);
        }
    }
    
    event.waitUntil(
        self.registration.showNotification(notificationData.title, notificationData)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification clicked', event.action);
    
    event.notification.close();
    
    // Handle different actions
    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow('/')
        );
    } else if (event.action === 'dismiss') {
        // Just close the notification
        return;
    } else {
        // Default action - open the app
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// ===== UTILITY FUNCTIONS FOR OFFLINE STORAGE =====

/**
 * Get pending orders from storage
 */
async function getPendingOrders() {
    // In a real implementation, this would use IndexedDB
    // For now, return empty array
    return [];
}

/**
 * Submit order to server
 */
async function submitOrderToServer(order) {
    // Implementation would make actual API call
    // For now, just simulate success
    return Promise.resolve(order);
}

/**
 * Remove successfully synced orders
 */
async function removePendingOrders(orders) {
    // Implementation would remove from IndexedDB
    console.log('Service Worker: Removing synced orders', orders.length);
}

// ===== PERIODIC BACKGROUND SYNC =====

// Handle periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
    console.log('Service Worker: Periodic sync triggered', event.tag);
    
    if (event.tag === 'game-status-check') {
        event.waitUntil(checkGameStatus());
    }
});

/**
 * Check game status for turn deadlines
 */
async function checkGameStatus() {
    try {
        console.log('Service Worker: Checking game status...');
        
        // Implementation would check for upcoming deadlines
        // and show notifications if needed
        
    } catch (error) {
        console.error('Service Worker: Failed to check game status', error);
    }
}

// ===== MESSAGE HANDLING =====

// Handle messages from the main thread
self.addEventListener('message', (event) => {
    console.log('Service Worker: Message received', event.data);
    
    const { type, payload } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'CACHE_GAME_DATA':
            cacheGameData(payload);
            break;
            
        case 'CLEAR_CACHE':
            clearCache(payload.cacheNames);
            break;
            
        default:
            console.log('Service Worker: Unknown message type', type);
    }
});

/**
 * Cache game data for offline access
 */
async function cacheGameData(gameData) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const response = new Response(JSON.stringify(gameData));
        await cache.put(`/game-data/${gameData.gameId}`, response);
        console.log('Service Worker: Game data cached', gameData.gameId);
    } catch (error) {
        console.error('Service Worker: Failed to cache game data', error);
    }
}

/**
 * Clear specified caches
 */
async function clearCache(cacheNames = []) {
    try {
        const deletePromises = cacheNames.map(name => caches.delete(name));
        await Promise.all(deletePromises);
        console.log('Service Worker: Caches cleared', cacheNames);
    } catch (error) {
        console.error('Service Worker: Failed to clear caches', error);
    }
}

console.log('Service Worker: Script loaded successfully');