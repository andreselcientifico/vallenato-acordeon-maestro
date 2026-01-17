// sw.js
const STATIC_CACHE = "vallenato-static-v4";
const RUNTIME_CACHE = "vallenato-runtime-v4";
const API_CACHE = "vallenato-api-v4";
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
          .filter((key) => ![STATIC_CACHE, RUNTIME_CACHE, API_CACHE].includes(key))
          .map((key) => {
            console.log(`🗑️ Deleting old cache: ${key}`);
            return caches.delete(key);
          })
      );
    })
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
  return new Response(
    JSON.stringify({ error: message, offline: true }),
    { status, headers: { "Content-Type": "application/json" } }
  );
}

/* ============================
   FETCH EVENT
   ============================ */
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // ❌ Solo maneja GET
  if (request.method !== "GET") {
    return;
  }

  // ❌ NO cachear HTML (SPA necesita backend siempre)
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request).catch(() => {
        // Si falla el HTML, devolver offline
        return createErrorResponse();
      })
    );
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
    event.respondWith(
      fetch(request).catch(() => createErrorResponse())
    );
    return;
  }

  // ❌ NO cachear autenticación (siempre network)
  if (
    url.pathname.startsWith("/api/auth") ||
    url.pathname.startsWith("/api/users/me")
  ) {
    event.respondWith(
      fetch(request).catch(() => createErrorResponse())
    );
    return;
  }

  // ✅ Assets estáticos reales → Cache First
  if (
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "image" ||
    request.destination === "font"
  ) {
    event.respondWith(
      caches.match(request).then(async (cached) => {
        if (cached) {
          return cached;
        }

        try {
          const response = await fetch(request);
          
          // Solo cachear si es exitoso (status 200)
          if (response && response.status === 200) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, response.clone());
            await cleanCache(STATIC_CACHE);
          }
          
          return response;
        } catch (error) {
          console.error(`❌ Fetch error for ${request.url}:`, error);
          // Retornar respuesta en cache si está disponible
          return cached || createErrorResponse();
        }
      })
    );
    return;
  }

  // 🟡 API pública → Network First con timeout
  if (url.pathname.startsWith("/api")) {
    event.respondWith(
      Promise.race([
        fetch(request)
          .then((response) => {
            // ✅ Solo cachear si es exitoso (2xx)
            if (response && response.status >= 200 && response.status < 300) {
              const cache = caches.open(API_CACHE);
              cache.then((c) => {
                c.put(request, response.clone());
                cleanCache(API_CACHE);
              });
            } else if (response && response.status >= 400) {
              // ❌ NO cachear errores (4xx, 5xx)
              console.warn(`API error ${response.status}: ${request.url}`);
            }
            return response;
          }),
        // Timeout de 8 segundos
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(null);
          }, 8000);
        })
      ])
        .then(async (response) => {
          // Si timeout o error, usar cache
          if (!response) {
            console.warn(`⏱️ Timeout/Failed - Using cache for: ${request.url}`);
            const cached = await caches.match(request);
            return cached || createErrorResponse(504, "Request Timeout");
          }
          return response;
        })
        .catch(async (error) => {
          console.error(`🔴 API Fetch error: ${request.url}`, error);
          // Si error de red, intentar cache
          const cached = await caches.match(request);
          if (cached) {
            console.log(`✅ Returning cached response for: ${request.url}`);
            return cached;
          }
          return createErrorResponse();
        })
    );
    return;
  }
});
