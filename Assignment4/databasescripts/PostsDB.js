//Post Database Control. To keep files clean, I will be splitting this into Posts & Users (Once auth gets added.)
// Import the functions you need from the Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

//For our alert system for syncing
const okButton = document.getElementById('okbutton')
const alert = document.getElementById('alert')

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAudRMByz-KL_2hWf2Z8fVfiwGQKbL-Sms",
    authDomain: "mobile-web-development-83086.firebaseapp.com",
    projectId: "mobile-web-development-83086",
    storageBucket: "mobile-web-development-83086.firebasestorage.app",
    messagingSenderId: "515099643242",
    appId: "1:515099643242:web:d81f3768fd452976ad2913"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Create IndexDB database named "Social_Media_PWA"
const indexDB = window.indexedDB.open("socialmedia_pwa", 2)

indexDB.addEventListener("error", console.error)
var indexedDBInstance = null
/**
 * For this project, I will be using a class to hold all of my Posts. 
 * @type {Post[]}
 */
var allPosts = []

indexDB.addEventListener("success", (event) => {
    indexedDBInstance = event.target.result
})

indexDB.addEventListener("upgradeneeded", (event) => {
    indexedDBInstance = event.target.result;
    // We create a new object store if it does not exist. If it does not, create an Id key. Finally a place to store the JSON required. It's easier to store the full JSON and re-parse it.
    if (!indexedDBInstance.objectStoreNames.contains("posts")) {
        const postsStore = indexedDBInstance.createObjectStore("posts", { keyPath: "id" });
        postsStore.createIndex("json", "json", { unique: false });
    }
});

okButton.addEventListener('click', () => {
    alert.style.display = 'none'
})


window.addEventListener("DOMContentLoaded", ()=> {
    loadAllDataFromDatabase();
})

window.addEventListener("online", ()=> {
    // Show the alert for 5 seconds. To alert the user that IndexDB is syncing with Firebase
    alert.style.display = 'block'
    setTimeout(() => {
        alert.style.display = 'none'
    }, 5000)
    syncronizeFirebaseToIndexedDB()
})

/**
 * @description Force updates the Student & Admin previous posts. 
 */
function updatePostsUI() {    
    const posts = document.getElementById("pendingPosts")
    posts.innerHTML = ""
    // To keep stuff efficent, I will use a Foreach instead of a normal for loop to add all of the posts
    allPosts.forEach(post => {
        
        const postElement = document.createElement("div")
        // Admins can only approve / deny posts. Students can only see their posts.
        if(window.location.pathname.includes("admin")) {
            // Don't show if the admin has already approved the post.
            if(post.isApproved) {
                return;
            }
            // Admin View UI. To make sure that each button is unique, I put the ID in the button's ID.
            postElement.innerHTML = `
        <div class="card cardHeight blue-grey darken-1 z-depth-3">
                    <div class="card-content white-text">
                      <span class="card-title">${post.title}</span>
                      <p>${post.content}</p>
                        <img style="margin-top: 20px;" class="responsive-img" src="../images/pexels-pixabay-270404.jpg" alt="Social Media Post ${post.title}">
                    </div>
                    <div class="card-action">
                      <a id="approveCard_${post.id}">Approve</a>
                      <a id="denyCard_${post.id}">Deny</a>
                    </div>
            </div>
        `
        posts.appendChild(postElement)
        // Approve will hide the post from Admin's view, but will keep it in the database if needed. (U = Update)
        document.getElementById("approveCard_" + post.id).addEventListener('click', function() {
            alert('Approved, Submitting to Social Media');
            const approvedPost = getPosts().find(thePost => post.id === thePost.id)
            approvedPost.isApproved = true
            updatePost(approvedPost)
            updatePostsUI()
        })
    
        // Denying will delete the post. (D = Delete)
        document.getElementById("denyCard_" + post.id).addEventListener('click', function() {
            alert('Denied, Deleted Post');
            const deniedPost = getPosts().find(thePost => post.id === thePost.id)
            deletePost(deniedPost)
            updatePostsUI()
        })
        } else {
            // TODO Make sure that the post IS THE user that's logged in.             
            if(post.userId != 1 || post.userId != "1") {
                return;
            }
            //Student's Post View
            postElement.innerHTML = `
        <div class="col s1 cardholder">
                <div class="card blue-grey darken-1 z-depth-3" >
                    <div class="card-content white-text">
                      <span class="card-title">${post.title}</span>
                      <div class="spacer"></div>
                      <p><i>${post.isApproved ? "Approved" : "Pending"}</i></p>
                      <p>${post.content}</p>
                        <img style="margin-top: 20px; " class="responsive-img" src="../images/pexels-barbland-28260049.jpg" alt="Blueberry Pancake">
                    </div>
                  </div>
            </div>
        `
        posts.appendChild(postElement)
        }
        
        
    })
}
/**
 * 
 * @description Create a new Post object, Add to allPosts array and attempt to save it to Firebase & IndexedDB. (C = Create)
 * @param {string} title 
 * @param {string} content 
 * @param {Date} date 
 * @param {boolean} isApproved 
 * @param {string} userId 
 */
export function createPost(title, content, date, isApproved, userId) {
    
    const post = new Post(createUUID(), title, content, date, isApproved, userId)
    allPosts.push(post)
    attemptToSavePosts(post)
}
/**
 * @description Update the post with the given post. Save to DBs (U = Update)
 * @param {Post} post 
 */
export function updatePost(post) {
    attemptToSavePosts(post)
}
/**
 @description Delete the post with the given post. Save to DBs (D = Update)
 * @param {Post} post 
 */
export function deletePost(post) {
    allPosts = allPosts.filter(thePost => thePost.id !== post.id)
    pushOrUpdatePostToIndexedDB(post, true)
    pushOrUpdatePostToFirebase(post, true)
}
/**
 * @returns {Post[]} Returns all of the posts
 */
export function getPosts() {
    return allPosts
}
/**
 * @description Helper function to save the posts to both Firebase & IndexedDB. To keep function sizes smaller, split IndexedDB & firebase into their own functions.
 * @param {Post} post 
 */
function attemptToSavePosts(post) {
    pushOrUpdatePostToFirebase(post)
    pushOrUpdatePostToIndexedDB(post)
}
/**
 * @description Load all of the data from the database. If offline, load from IndexedDB. If online, load from Firebase.
 */
function loadAllDataFromDatabase() {
    if(!navigator.onLine) {
        const transaction = indexedDBInstance.transaction("posts", "readonly");
        const postsStore = transaction.objectStore("posts");
        const request = postsStore.getAll();
        request.addEventListener("success", (event) => {
            event.target.result.forEach(post => {
                // With us saving the JSON to both Databases, we have to bring it out of JSON to the Post Object. Once finished on each, update the UI.
                allPosts.push(new Post(post.id, post.title, post.content, post.date, post.isApproved, post.userId))
            })
            updatePostsUI()

        }) 
    } else {
        const db = getFirestore(app);
        const postsCollection = collection(db, "posts");
        getDocs(postsCollection).then((querySnapshot) => {
            // Refer to line #198 for the reason for the new class
            querySnapshot.forEach((doc) => {
                const post = doc.data();
                post.id = doc.id;
                const postClass = new Post(post.id, post.title, post.content, post.date, post.isApproved, post.userId);
                allPosts.push(postClass)
            });
            updatePostsUI()

        });
    }

    
}
/**
 * @description This function runs if we come back online to make sure our Firebase & IndexedDB are in sync. 
 */
function syncronizeFirebaseToIndexedDB() {  
    const db = getFirestore(app);
    const postsCollection = collection(db, "posts");
    getDocs(postsCollection).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const post = doc.data();
            post.id = doc.id;
            const postClass = new Post(post.id, post.title, post.content, post.date, post.isApproved, post.userId);
            if(!allPosts.find(thePost => thePost.id === postClass.id)) {
                allPosts.push(postClass)
            } else {
                const postIndex = allPosts.findIndex(thePost => thePost.id === postClass.id)
                allPosts[postIndex] = postClass
            }
            
        });
        updatePostsUI()

    });
    allPosts.forEach(post => {
        pushOrUpdatePostToFirebase(post)
    })
    
}
/**
 * @description When a post is passed into our function, it will check if first, we need to store it locally or not, then it will then go in and check if it exists, if it exists, update it, if isDeleting is true, Delete it. Else it adds it to our Databases.
 * @param {Post} post 
 * @param {boolean} isDeleting 
 */
function pushOrUpdatePostToFirebase(post, isDeleting = false) {
    if(!navigator.onLine) {
        return
    }
    const db = getFirestore(app);
        const postsCollection = collection(db, "posts");
        if (post.id) {
            const postRef = doc(db, "posts", post.id);
            if(isDeleting) {
                deleteDoc(postRef)
            } else {
                // I chose {merge: true} as it will only update the fields. This works the same as without. I don't want to have to replace the whole document for one thing.
                // We also push the JSON that the class created to Firebase for easy access.
                setDoc(postRef, post.toJSON(), { merge: true })
                .then(()=> {
                    updatePostsUI()
                })
                .catch((error) => {
                    console.error("Error updating post in Firebase:", error);
                });
            }
        } else {
            addDoc(postsCollection, post.toJSON())
                .then((docRef) => {
                    console.log("Post added to Firebase successfully with ID:", docRef.id);
                    // We update the PostID if it was not created in Firebase to an ID firebase created.
                    post.id = docRef.id;
                    updatePostsUI()
                })
                .catch((error) => {
                    console.error("Error adding post to Firebase:", error);
                });
        }
}
/**
 * @description When a post is passed into our function, it will check if first, we need to store it locally or not, then it will then go in and check if it exists, if it exists, update it, if isDeleting is true, Delete it. Else it adds it to our Databases.
 * @description This function is nearly idenitical to pushOrUpdatePostToFirebase. The major changes between the two is the syntax for IndexedDB. using addEventsListeners.
 * @param {Post} post 
 * @param {boolean} isDeleting 
 */
function pushOrUpdatePostToIndexedDB(post, isDeleting = false) {
        const transaction = indexedDBInstance.transaction("posts", "readwrite");
        const postsStore = transaction.objectStore("posts");

        if (post.id) {
            if(isDeleting) {
                const request = postsStore.delete(post.id);
                request.addEventListener("success", ()=> {
                    updatePostsUI()
                })
                request.addEventListener("error", (event)=> {
                    console.error("Error deleting post in IndexedDB:", event.target.error);
                })
            } else {
                const request = postsStore.put(post.toJSON()); 
                request.addEventListener("error", (event)=> {
                    console.error("Error updating post in IndexedDB:", event.target.error);
                })
                request.addEventListener("success", ()=> {
                    updatePostsUI()
                })
            }
        } else {
            const request = postsStore.add(post.toJSON());
            request.addEventListener("error", (event)=> {
                console.error("Error updating post in IndexedDB:", event.target.error);
            })
            request.addEventListener("success", ()=> {
                updatePostsUI()
            })
        }
    }
/**
 * @description This function creates a temporary UUID in case Firebase is not available. To the most part this is only used when offline.
 * @returns {string} Returns UUID
 */
function createUUID() {
    var letters = "abcdefghijklmnopqrstuvwxyz";
    return letters[Math.floor(Math.random() * letters.length)] + Date.now();
}
/**
 * @description Created a New object to hold all of the data that I would need to store. This also makes it easier to convert for database storing & updating.
 */
class Post {
    constructor(id, title, content, date, isApproved, userId) {
        this.id = id
        this.userId = userId
        this.content = content
        this.date = date
        this.title = title
        this.isApproved = isApproved
    }
/**
 * 
 * @returns {{id: string, userId: string, content: string, date: Date, title: string, isApproved: boolean}} - Returns a storable object for our databases.
 */ 
    toJSON() {
        return {
            "id": this.id,
            "userId": this.userId,
            "content": this.content,
            "date": this.date,
            "title": this.title,
            "isApproved": this.isApproved
        }
    }
}