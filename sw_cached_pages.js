// cache vars
const cacheName = 'v1';
const cacheAssets = [
    'index.html',
    'restaurant.html',
    'css/style.css',
    'data/restaurants.json',
    'img/*.jpg',
    'js/*.js'
];

// call install event
self.addEventListener('install', (e) => {
    console.log('Service worker: Installed');
});

// call activate event
self.addEventListener('activate', (e) => {
    console.log('Service worker: Activated');
    // remove unwanted caches
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache !== cacheName){
                        console.log('Service worker: Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// call fetch event
self.addEventListener('fetch', e => {
    console.log('Service worker: fetching');
    e.respondWith(
        fetch(e.request)
        .then(res => {
            // make a clone of response
            const resClone = res.clone();
            // open cache
            caches
                .open(cacheName)
                .then(cacheObj => {
                    // add response to cache
                    cacheObj.put(e.request, resClone);
            });
            return res;
            // if connection drops catch will run
        }).catch(err => caches.match(e.request).then(res => res))
    );
});