// Import the functions you need from the Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {setPersistence, browserLocalPersistence, getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js'
import { clearIndexedDB, User } from "./databasescripts/AuthDB.js";
import {
    getFirestore,
    collection,
    doc,
    getDoc
  } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
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
export const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export var currentUser
// Create IndexDB database named "Social_Media_PWA"
// TODO Go back to 4
export var indexDB = window.indexedDB.open("socialmedia_pwa", 6)

indexDB.addEventListener("error", console.error)
export var indexedDBInstance = null




indexDB.addEventListener("success", (event) => {
    indexedDBInstance = event.target.result
})

indexDB.addEventListener("upgradeneeded", (event) => {
    
    // We create a new object store if it does not exist. If it does not, create an Id key. Finally a place to store the JSON required. It's easier to store the full JSON and re-parse it.
    if (!indexedDBInstance.objectStoreNames.contains("posts")) {
        const postsStore = indexedDBInstance.createObjectStore("posts", { keyPath: "id" });
        postsStore.createIndex("json", "json", { unique: false });
    }
    if(!indexedDBInstance.objectStoreNames.contains("Users")) {
        const usersStore = indexedDBInstance.createObjectStore("Users", { keyPath: "id" });
        usersStore.createIndex("json", "json", { unique: false });
    }
    if(!indexedDBInstance.objectStoreNames.contains("currentUser")) {
        const currentUserStore = indexedDBInstance.createObjectStore("currentUser", { keyPath: "id" });
        currentUserStore.createIndex("json", "json", { unique: false });
    }
});

console.log("Loading Authenication");

document.addEventListener("DOMContentLoaded", () => {
    onAuthStateChanged(auth, (user) => {
        console.log("Auth State Changed");
        
        if(user) {
            attemptToLoadUserFileFromFirebase(user).then((userClass) => {
                currentUser = userClass
            })
        } else {
            
            if(!window.location.href.includes("index.html")) {
                currentUser = null
                attemptSignOut()
            }
        }
    })
})


export function attemptSignOut() {
    // alert("You have been signed out")
    clearIndexedDB()
    localStorage.removeItem("currentUser")
    auth.signOut();
    window.location.href = "../index.html"
}

export function attemptToLogin(email, password) {
    setPersistence(auth, browserLocalPersistence).then(()=> {
        return signInWithEmailAndPassword(auth, email, password)
            
        }).then((userCred)=> {
            const user = userCred.user
            attemptToLoadUserFileFromFirebase(user).then((userClass) => {
                currentUser = userClass
                if(currentUser.isAdmin) {
                    window.location.href = "./admin/admin.html";
                } else {
                    window.location.href = "./student/student.html";
                }
            })
        .catch((err)=> {
            alert("Invalid Login, please try again")
        })
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
}

function attemptToLoadUserFileFromFirebase(user) {
    return new Promise((resolve, reject) => {
        console.log("Attempting to load user file from Firebase");
        
        if(navigator.onLine) {
            const db = getFirestore(app);
            const userRef = doc(db, "Users", user.uid);
            getDoc(userRef).then((doc) => {
                if (doc.exists()) {
                    const userData = doc.data();
                    userData.id = doc.id;
                    const userClass = new User(userData.id, userData.fullname, userData.username, userData.isAdmin, userData.lastLoggedIn);
                    localStorage.setItem("currentUser", JSON.stringify(userClass))
                    resolve(userClass)
                }
            });
        } else {
            attemptToGetFromLocalStorage().then((users) => {
                console.log(users);
                
                const myUser = users
                resolve(myUser)
            }).catch(() => {
                alert("You must be online to login")
                // reject()
            })
            // reject()
        }
    })
}

function attemptToGetFromLocalStorage() {
    return new Promise((resolve, reject) => {
        resolve(JSON.parse(localStorage.getItem("currentUser")))
    })
}