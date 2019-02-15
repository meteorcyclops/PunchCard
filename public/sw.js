// // install
self.addEventListener('install', function (event) {
    console.log('sw installed')
    event.waitUntil(
      caches.open('KfsysccCard').then(function(cache) {
        return cache.addAll([
          './',
          './index.html',
          './static/js/bundle.js'
        ]);
      })
    );
});

// fetch
self.addEventListener('fetch', function (event) {
    event.respondWith(
      caches.match(event.request).then( function (response){
        if (response) {
          return response;
        } else{
          return fetch(event.request)
        }
      })
    );
});

self.addEventListener('activate', function(event){
  console.log('activated!')
});
