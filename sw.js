const CACHE_VERSION="v7",CACHE_NAME="project-k-v"+CACHE_VERSION,urlsToCache=["/project-k/","/project-k/index.html","/project-k/css/main.min.v7.css?v=7","/project-k/js/gall7.min.v7.js?v=7","/project-k/js/main.min.v7.js?v=7","/project-k/js/sw.js?v=7","/project-k/favicon.ico?"];self.addEventListener("install",e=>{console.log("Service Worker: Installing..."),e.waitUntil(caches.open(CACHE_NAME).then(cache=>{console.log("Service Worker: Caching files...");return cache.addAll(urlsToCache).catch(err=>{console.error("Failed to cache:",err)})}))}),self.addEventListener("fetch",e=>{console.log(`Service Worker: Fetching ${e.request.url}`),e.respondWith(caches.match(e.request).then(response=>response||fetch(e.request)))}),self.addEventListener("activate",e=>{console.log("Service Worker: Activating...");const cacheWhitelist=[CACHE_NAME];e.waitUntil(caches.keys().then(cacheNames=>Promise.all(cacheNames.map(cacheName=>{if(!cacheWhitelist.includes(cacheName))return console.log(`Service Worker: Deleting old cache: ${cacheName}`),caches.delete(cacheName)}))))});
