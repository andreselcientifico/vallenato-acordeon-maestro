// sw.js
const STATIC_CACHE = "vallenato-static-v5";
const RUNTIME_CACHE = "vallenato-runtime-v5";
const API_CACHE = "vallenato-api-v5";
const MAX_CACHE_ITEMS = 50;

/* ============================
   INSTALL
   ============================ */
self.addEventListener("install", (event) => {
  console.log("🔧 Service Worker: Installing new version");
  self.skipWaiting();
});

/* ============================
   ACTIVATE
   ============================ */
self.addEventListener("activate", (event) => {
  console.log("🚀 Service Worker: Activating - Cleaning old caches");
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter(
            (key) => ![STATIC_CACHE, RUNTIME_CACHE, API_CACHE].includes(key),
          )
          .map((key) => {
            console.log(`🗑️ Deleting old cache: ${key}`);
            return caches.delete(key);
          }),
      );
    }),
  );

  self.clients.claim();
});

/* ============================
   UTILITY FUNCTIONS
   ============================ */

// Limpiar cache cuando excede límite
async function cleanCache(cacheName, maxItems = MAX_CACHE_ITEMS) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > maxItems) {
    // Borrar los items más antiguos
    for (let i = 0; i < keys.length - maxItems; i++) {
      await cache.delete(keys[i]);
    }
  }
}

// Crear respuesta de error offline
function createErrorResponse(status = 503, message = "Offline") {
  return new Response(JSON.stringify({ error: message, offline: true }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/* ============================
   FETCH EVENT
   ============================ */
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // ✅ FILTRO CRÍTICO: Ignorar esquemas que no sean http o https
  // Esto elimina el error "Request scheme 'chrome-extension' is unsupported"
  if (!request.url.startsWith("http")) {
    return;
  }

  // ❌ Solo maneja GET
  if (request.method !== "GET") return;

  // ❌ NO cachear HTML
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(fetch(request).catch(() => createErrorResponse()));
    return;
  }

  // ❌ NO cachear rutas SPA privadas/pesadas (sin fallback)
  if (
    url.pathname.startsWith("/cursos") ||
    url.pathname.startsWith("/admin") ||
    url.pathname.startsWith("/perfil") ||
    url.pathname.startsWith("/suscripciones") ||
    url.pathname.startsWith("/mis-cursos") ||
    url.pathname.startsWith("/mis-logros")
  ) {
    event.respondWith(fetch(request).catch(() => createErrorResponse()));
    return;
  }

  // ❌ NO cachear autenticación (siempre network)
  if (
    url.pathname.startsWith("/api/auth") ||
    url.pathname.startsWith("/api/users/me")
  ) {
    event.respondWith(fetch(request).catch(() => createErrorResponse()));
    return;
  }

  // ✅ ASSETS (CSS, JS, Imágenes) -> Cache First
  if (
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "image" ||
    request.destination === "font"
  ) {
    event.respondWith(
      caches.match(request).then(async (cached) => {
        if (cached) return cached;

        try {
          const response = await fetch(request);
          // Solo cachear si la respuesta es válida
          if (
            response &&
            response.status === 200 &&
            response.type === "basic"
          ) {
            const cache = await caches.open(STATIC_CACHE);
            // Clonamos la respuesta para poder guardarla y devolverla
            cache.put(request, response.clone());
            event.waitUntil(cleanCache(STATIC_CACHE));
          }
          return response;
        } catch (error) {
          return createErrorResponse();
        }
      }),
    );
    return;
  }

  // 🟡 API -> Network First
  if (url.pathname.startsWith("/api")) {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (response && response.status >= 200 && response.status < 300) {
            const cache = await caches.open(API_CACHE);
            // IMPORTANTE: Clonar siempre antes de usar .put()
            cache.put(request, response.clone());
            event.waitUntil(cleanCache(API_CACHE));
            return response;
          }
          return response;
        })
        .catch(async () => {
          // Si falla la red, buscar en cache
          const cached = await caches.match(request);
          return cached || createErrorResponse();
        }),
    );
    return;
  }
});
