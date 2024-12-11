// This file was to split out the functions that were commonly used between all of the pages.
// Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {setPersistence, browserLocalPersistence, getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js'
import { clearIndexedDB, User } from "./databasescripts/AuthDB.js";
import { getFirestore, doc, getDoc} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Variables
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
export var indexDB = window.indexedDB.open("socialmedia_pwa", 6)
export var indexedDBInstance = null


/**
 * @description This function was implemented to fix a bug where data would try to be loaded from the database before the database was initialized.
 * @returns Promise<IndexedDB>
 */
export function initializeIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open("socialmedia_pwa", 6);

        request.addEventListener("error", (event) => {
            console.error("IndexedDB error:", event.target.error);
            reject(event.target.error);
        });

        request.addEventListener("success", (event) => {
            indexedDBInstance = event.target.result;
            console.log("IndexedDB initialized successfully.");
            resolve(indexedDBInstance);
        });

        request.addEventListener("upgradeneeded", (event) => {
            const db = event.target.result;
            console.log("IndexedDB upgrade needed.");
            
            if (!db.objectStoreNames.contains("posts")) {
                const postsStore = db.createObjectStore("posts", { keyPath: "id" });
                postsStore.createIndex("json", "json", { unique: false });
            }
            if (!db.objectStoreNames.contains("Users")) {
                const usersStore = db.createObjectStore("Users", { keyPath: "id" });
                usersStore.createIndex("json", "json", { unique: false });
            }
            if (!db.objectStoreNames.contains("currentUser")) {
                const currentUserStore = db.createObjectStore("currentUser", { keyPath: "id" });
                currentUserStore.createIndex("json", "json", { unique: false });
            }
        });
    });
}

// if no user, make sure they go to login screen. If they are logged in, load the data neccessary for the page.
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

// Signout, Clear localstorage, indexeddb and redirect. also sign out of firebase auth
export function attemptSignOut() {
    // alert("You have been signed out")
    clearIndexedDB()
    localStorage.removeItem("currentUser")
    auth.signOut();
    window.location.href = "../index.html"
}
// Login with Firebase.
export function attemptToLogin(email, password) {
    setPersistence(auth, browserLocalPersistence).then(()=> {
        return signInWithEmailAndPassword(auth, email, password)
            
        }).then((userCred)=> {
            const user = userCred.user
            attemptToLoadUserFileFromFirebase(user).then((userClass) => {
                // If Admin go to admin page, if not go to student page.
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
// Load the current user from database then set it to currentUser for easy access.
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
// Get the current user from local storage.
function attemptToGetFromLocalStorage() {
    return new Promise((resolve, reject) => {
        resolve(JSON.parse(localStorage.getItem("currentUser")))
    })
}