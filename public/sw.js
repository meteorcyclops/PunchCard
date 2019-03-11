// // install
self.addEventListener('install', function (event) {
    console.log('sw installed')
    self.skipWaiting();
    // event.waitUntil(
    //   caches.open('KfsysccCard').then(function(cache) {
    //     return cache.addAll([
    //       './',
    //     ]);
    //   })
    // );
});

// fetch
self.addEventListener('fetch', function (event) {
    if (
      event.request.url === 'https://staff.kfsyscc.org/card/' 
      || event.request.url ==='https://staff.kfsyscc.org/card/index.html' 
      || event.request.url ==='http://localhost:3000/' 
      // || event.request.url.indexOf('sw') > -1
    ){
      event.respondWith(
        fetch(event.request)
          .then( function(res){
            if(res.status === 200) {
              return (
                caches.open( 'KfsysccCard' )
                .then( function(cache) {
                  cache.put( event.request.url, res.clone() );
                  return res
                } )
              )
            } else {
              return caches.match(event.request).then( function (response){
                if (response) {
                  return response;
                } else {
                    return res
                }
              })
            }
        })
        .catch (
          e => {
            return caches.match(event.request).then( function (response){
              if (response) {
                return response;
              } else {
                return e
              }
            })
          }
        ) 
      );
    } 
    
    else if (
      event.request.url.indexOf('hrapi') > -1
    ){
      return fetch(event.request)
    }else {
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
    }


});

self.addEventListener('activate', function(event){
  console.log('activated!')
});
