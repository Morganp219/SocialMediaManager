self.addEventListener("install", event => {
    console.log("Service worker installed");
    const installCache = () => {
    caches.open("socialmediamgr").then(async cache => {
               
        // Home Page
        await cache.addAll(["./index.html", "./styles/style.css", "./main.js"]);
        // Student Side
        await cache.addAll(["./student/student.html", "./student/student.css", "./student/student.js"])
        //Admin Side
        await cache.addAll(["./admin/admin.html", "./admin/admin.css", "./admin/admin.js", "./admin/users.html"])
        // Images & Assets
        await cache.addAll(["./manifest.json", "./images/icon.png", "./images/Designer.jpeg", "./images/pexels-barbland-28260049.jpg", "./images/pexels-personone.jpg", "./images/pexels-pixabay-270404.jpg", "./images/pexels-pixabay-302769.jpg"])
        console.log("Caching complete");
        
    })

}
    event.waitUntil(installCache());
});
 self.addEventListener("activate", event => {
    console.log("Service worker activated");
 });