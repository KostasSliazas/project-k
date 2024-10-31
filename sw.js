const CACHE_NAME = "project-k-v1";
const urlsToCache = [
  "/",  // Cache the root URL (home page)
  "/index.html",  // Cache the index.html file
  "/css/main.min.v1.css?v=1",  // Cache the CSS file with versioning
  "/js/gall7.min.v1.js?v=1",  // Cache the gallery file with versioning
  "/js/main.min.v1.js?v=1",  // Cache the main JavaScript file with versioning
  "/js/sw.js?v=1"  // Cache the service worker itself with versioning
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((s) => s || fetch(e.request))
  );
});
