// Nombre de la caché. Es buena práctica cambiar la versión (v1, v2, etc.) cada vez que actualices archivos.
const CACHE_NAME = 'iceking-comprobante-v1';

// Lista de archivos para almacenar en caché
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // Debes subir tu archivo de icono con este nombre:
  '/app_icon_512x512.png', 
  // Scripts de terceros esenciales (si el entorno lo permite)
  'https://cdn.tailwindcss.com',
  'https://html2canvas.hertzen.com/dist/html2canvas.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap'
];

// Instalar el Service Worker y almacenar en caché los archivos estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierta');
        // Agregamos todos los archivos necesarios a la caché
        return cache.addAll(urlsToCache).catch(error => {
            console.error('Error al agregar a la caché:', error);
        });
      })
  );
});

// Interceptar solicitudes y servir desde la caché si está disponible
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si hay respuesta en caché, la devuelve
        if (response) {
          return response;
        }
        // Si no está en caché, va a la red
        return fetch(event.request);
      })
  );
});

// Limpiar cachés antiguas (opcional, pero recomendado)
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Eliminar cachés que no están en la lista blanca
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
