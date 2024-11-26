const CACHE_VERSION = "v7";
const CACHE_NAME = "project-k-v" + CACHE_VERSION;

const urlsToCache = [
  "/project-k/",                        // Home page
  "/project-k/index.html",               // Index page
  "/project-k/css/main.min.v7.css",      // Main CSS
  "/project-k/js/gall7.min.v7.js",       // JavaScript
  "/project-k/js/main.min.v7.js",        // Main JavaScript
  "/project-k/js/sw.js",                 // Service Worker script itself
  "/project-k/favicon.ico",              // Favicon
  "/project-k/img/RJ-45.svg",            // SVG image
  "/project-k/img/usb.svg",              // Another SVG image
  "/project-k/img/QR%20Code.png",        // PNG image
  "/project-k/font/kitten-corner.woff2"  // Font file (woff2)
];

// Install event: Cache static assets
self.addEventListener("install", (e) => {
  console.log("Service Worker: Installing...");
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Caching files...");
      return cache.addAll(urlsToCache).catch((err) => {
        console.error("Failed to cache:", err);
      });
    })
  );
});

// Fetch event: Serve cached files or fallback to network
self.addEventListener("fetch", (e) => {
  console.log(`Service Worker: Fetching ${e.request.url}`);
  e.respondWith(
    caches.match(e.request).then((response) => {
      if (response) {
        console.log("Service Worker: Found in cache");
        return response; // Return from cache
      }
      console.log("Service Worker: Not in cache, fetching from network");
      return fetch(e.request).catch(() => {
        // Fallback to offline page if network fails (optional)
        return caches.match('/offline.html');
      });
    })
  );
});

// Activate event: Clean up old caches
self.addEventListener("activate", (e) => {
  console.log("Service Worker: Activating...");
  const cacheWhitelist = [CACHE_NAME];
  e.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log(`Service Worker: Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
