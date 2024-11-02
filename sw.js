self.addEventListener("install", event => {
    console.log("Service worker installed");
    const installCache = () => {
    caches.open("socialmediamgr").then(async cache => {
               
        // Home Page
        try {
            await cache.addAll(["./index.html", "./styles/style.css", "./main.js", "./styles/materialize.min.css", "./styles/materialize.min.js", "./student/student.html", "./student/student.css", "./student/student.js", "./admin/admin.html", "./admin/admin.css", "./admin/admin.js", "./admin/users.html", "./manifest.json", "./images/icon.png", "./images/Designer.jpeg", "./images/pexels-barbland-28260049.jpg", "./images/pexels-personone.jpg", "./images/pexels-pixabay-270404.jpg", "./images/pexels-pixabay-302769.jpg"])
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
            const cachedResponse = await caches.match(event.request);
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request);
        })()
    );
 })