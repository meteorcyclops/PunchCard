// importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js');

// if (workbox) {
//   console.log(`Yay! Workbox is loaded 🎉`);
  
//   workbox.routing.registerRoute(
//     new RegExp('.*\.js'),
//     workbox.strategies.cacheOnly()
//   );

//   workbox.routing.registerRoute(
//     // Cache CSS files
//     /.*\.css/,
//     // Use cache but update in the background ASAP
//     workbox.strategies.staleWhileRevalidate({
//       cacheName: 'css-cache',
//     })
//   );

//   workbox.routing.registerRoute(
//     /.*\.(?:png|jpg|jpeg|svg|gif)/,
//     // Use the cache if it's available
//     workbox.strategies.cacheFirst({
//       // Use a custom cache name
//       cacheName: 'image-cache',
//       plugins: [
//         new workbox.expiration.Plugin({
//           // Cache for a maximum of a week
//           maxAgeSeconds: 7 * 24 * 60 * 60,
//         })
//       ],
//     })
//   );
// } else {
//   console.log(`Boo! Workbox didn't load 😬`);
// }

// Date.prototype.addDays = function(days) {
//     console.log(this)
//     this.setDate(this.getDate() + days);
//     console.log(this)
//     return this;
// }

// var db;
// var request = indexedDB.open("KfsysccCardDatabase", 1);
// request.onerror = function(event) {
//     console.log('open idb failed')
// };
// request.onsuccess = function(event) {
//     db = request.result;
//     console.log('sucess connect db')
// };
// request.onupgradeneeded = function(event) {
//     console.log('onupgradeneeded')
//     db = request.result;
//     if( !db.objectStoreNames.contains('schedule') ){
//         db.createObjectStore("schedule", { keyPath: "sch_date" });
//     }
// };


// function showNotification() {
// }


// // if (Notification.permission === 'denied') {
// //     pushButton.textContent = 'Push Messaging Blocked.';
// //     pushButton.disabled = true;
// //     updateSubscriptionOnServer(null);
// //     return;
// //   }

// //   if (isSubscribed) {
// //     pushButton.textContent = 'Disable Push Messaging';
// //   } else {
// //     pushButton.textContent = 'Enable Push Messaging';
// //   }

// //   pushButton.disabled = false;



// function getScheData (data){

//     if (Notification.permission === 'granted') {
//         // registration.showNotification('和信醫院打卡系統', {
//         //     body: '提醒您五分鐘後上班！',
//         //     vibrate: [200, 100, 200, 100, 200, 100, 200],
//         //     tag: 'vibration-sample'
//         // });
//     }
//     // console.log(data)

//     // if ( data.api === 'punch' ){
//     //     console.log('punch');

//     //     // var uid = localStorage.getItem('uid') || ""
//     //     // var pwd = localStorage.getItem('pwd') || ""

//     //     var uid = data.username || ''
//     //     var pwd = data.password || ''

//     //     if (!uid || !pwd ){
//     //         console.log( 'no login info' )
//     //         return false
//     //     }

//     //     var nowDate = new Date();
//     //     var tomorrowDate = new Date().addDays(1)

//     //     var nowDateStr = nowDate.toISOString().slice(0,10).replace(/-/g, '')
//     //     var tomorrowDateStr = tomorrowDate.toISOString().slice(0,10).replace(/-/g, '')

//     //     console.log('1')
//     //     fetch(
//     //         `https://staff.kfsyscc.org/hrapi/card/`, 
//     //         {
//     //             method: "POST",
//     //             headers: new Headers({ 'Accept': 'application/json' }),
//     //             body: JSON.stringify({
//     //                 "api": "getScheList", //取得班表
//     //                 "username": uid,
//     //                 "password": pwd,
//     //                 "minDate": nowDateStr,
//     //                 "maxDate": tomorrowDateStr,
//     //             })
//     //         }
//     //     )
//     //     .then((res) => {
//     //         return res.json();
//     //     })
//     //     .then( ( data ) => {

//     //         console.log(data)
//     //         if (!data.status || data.data.length ==0 ){
//     //             return false
//     //         }

//     //         var tx    = db.transaction('schedule', 'readwrite');
//     //         var store = tx.objectStore('schedule');


//     //         data.data.forEach(element => {
//     //             store.put(element)
//     //         });

//     //         tx.complete()

//     //     })
//     // }
//     // {"api":"punch","cardtype":"1","username":"flyingpath","password":"1221221"}
// }

// self.addEventListener('notificationclick', function(event) {
//     event.notification.close();
//     clients.openWindow('https://staff.kfsyscc.org/card/');
// }, false);


// // install
self.addEventListener('install', function (event) {
    // Perform install steps
    console.log('sw installed')
    event.waitUntil(
      caches.open('KfsysccCard').then(function(cache) {
        return cache.addAll([
          '/'
        ]);
      })
    );
});

// fetch
self.addEventListener('fetch', function (event) {
    // event.request.clone().text()
    // .then( (d)=>{
    //     if (d){
    //         getScheData( JSON.parse(d) )
    //     }
    // } )
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

// // 監聽推播事件
// self.addEventListener('push', function(event) {
//     var data = {
//       "message":"[無法讀取訊息]"
//     }
//     try {
//       data = event.data.json();
//     } catch(e) {}
  
//     var title = '您有新訊息';
//     var body = data.message;
//     var icon = '/img/icon.png';
//     var tag = '';
  
//     event.waitUntil(
//       self.registration.showNotification(title, {
//         body: body,
//         icon: icon,
//         tag: tag
//       })
//     );
// });
