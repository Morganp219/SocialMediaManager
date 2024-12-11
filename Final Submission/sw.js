// Service Worker
self.addEventListener("install", event => {
    console.log("Service worker installed");
    const installCache = () => {
    caches.open("socialmediamgr").then(async cache => {
        try {
            await cache.addAll(["./index.html", 
                "./styles/style.css", 
                "./main.js",  
                "./firebase.js",
                "./admin/users.js", 
                "./styles/materialize.min.css", 
                "./styles/materialize.min.js", 
                "./student/student.html", 
                "./student/student.css", 
                "./student/student.js", 
                "./admin/admin.html", 
                "./admin/admin.css", 
                "./admin/admin.js", 
                "./admin/users.html", 
                "./manifest.json",
                "./images/icon.png", 
                "./images/Designer.jpeg", 
                "./images/pexels-barbland-28260049.jpg", 
                "./images/pexels-personone.jpg", 
                "./images/pexels-pixabay-270404.jpg", 
                "./images/pexels-pixabay-302769.jpg", 
                "./databasescripts/PostsDB.js",
                "./databasescripts/AuthDB.js",
                "./images/share_icon.png",
                "https://fonts.googleapis.com/icon?family=Material+Icons",
                "https://fonts.gstatic.com/s/materialicons/v142/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2",
                "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js",
                "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js",
                "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js",
                
            ])
            console.log("Caching complete");

        }    catch (err) {
            console.error(err);
        }

    })

}
    event.waitUntil(installCache());
});
 self.addEventListener("activate", event => {
    console.log("Service worker activated");
    event.waitUntil(
        (async () => {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames
                .filter(cacheName => cacheName !== "socialmediamgr")
                .map(cacheName => caches.delete(cacheName)));
                        
    })
    );
 });

 self.addEventListener("fetch", event => {
    event.respondWith(
        (async () => {
            // Prevent POST requests from being cached. (Firebase)
            if(event.request.method !== "GET") {
                if(navigator.onLine) {
                    return fetch(event.request);
                } else {
                    return 
                }
               
            }
            const cachedResponse = await caches.match(event.request);
            if (cachedResponse) {
                return cachedResponse;
            }
            if(!navigator.onLine) {
                return 
            }
            
            return fetch(event.request);
        })()
    );
 })
