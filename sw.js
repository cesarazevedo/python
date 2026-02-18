// === SERVICE WORKER — python-course ===
const CACHE = 'python-course-v1';

// Instala sem esperar
self.addEventListener('install', () => self.skipWaiting());

// Remove caches antigos ao ativar
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys.filter(k => k !== CACHE).map(k => caches.delete(k))
            ))
            .then(() => self.clients.claim())
    );
});

// Estratégia: network-first → cache como fallback (offline)
self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;

    e.respondWith(
        fetch(e.request)
            .then(response => {
                // Armazena resposta bem-sucedida no cache
                const clone = response.clone();
                caches.open(CACHE).then(cache => cache.put(e.request, clone));
                return response;
            })
            .catch(() => caches.match(e.request))
    );
});
