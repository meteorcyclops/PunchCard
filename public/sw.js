// // install
self.addEventListener('install', function (event) {
    console.log('sw installed')
    event.waitUntil(
      caches.open('KfsysccCard').then(function(cache) {
        return cache.addAll([
          './',
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
          return (
            fetch(event.request)
            .then( function(res){
              return (
                caches.open( 'KfsysccCard' )
                  .then( function(cache) {
                    cache.put( event.request.url, res.clone() );
                    return res
                  } )
              )
            } )
          )
        }
      })
    );
});

self.addEventListener('activate', function(event){
  console.log('activated!')
});
