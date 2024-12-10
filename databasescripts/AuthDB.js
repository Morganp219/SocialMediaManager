//TODO: Add User Authentication. For the Final. This will follow the same logic as PostsDB.
// // Objects
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
  import { app, indexDB, indexedDBInstance, auth} from "../firebase.js";

  //For our alert system. Users does not effect the functionality of the application in offline/online yet.
const okButton = document.getElementById('okbutton')
const alert = document.getElementById('alert')
var allUsers = []

okButton.addEventListener('click', () => {
    alert.style.display = 'none'
})

window.addEventListener("online", ()=> {
    // Show the alert for 5 seconds. To alert the user that IndexDB is syncing with Firebase
    alert.style.display = 'block'
    setTimeout(() => {
        alert.style.display = 'none'
    }, 5000)
    syncronizeFirebaseToIndexedDB()
})
document.addEventListener('DOMContentLoaded', ()=> {
    if(!window.location.href.includes("index.html")) {
        setTimeout(()=> {
            loadAllDataFromDatabase()
        }, 2000)
    }
})

export function createUserObject(id, fullname, username, isAdmin, lastLoggedIn) {
    return new User(id, fullname, username, isAdmin, lastLoggedIn)
}

export function clearIndexedDB() {
    const transaction = indexedDBInstance.transaction("Users", "readwrite");
    const usersStore = transaction.objectStore("Users");
    usersStore.clear();
}


function updateUsersUI() {
    if(!window.location.href.includes("users.html")) {
        return
    }
    console.log("Update Users UI, Users: ", allUsers);
    
    const usersContainer = document.getElementById("persons")
    usersContainer.innerHTML = ""
    allUsers.forEach(user => {
        const userElement = document.createElement("div")
        userElement.classList.add("person")
        userElement.innerHTML = `
        <div class="card blue-grey darken-1 userCard">
                <div class="card-content white-text">
                    <img src="../images/pexels-personone.jpg" alt="Person One" class="responsive-img circle">
                  <span class="card-title">${user.fullname}</span>
                </div>
                <div class="card-action">
                  <a id="user_${user.id}">Delete</a>
                </div>
              </div>`
              userElement.querySelector(`#user_${user.id}`).addEventListener('click', () => {
                  const con = confirm("Are you sure you want to delete this user?")
                  if(con) {
                    // Once connected to server, delete Auth user and delete User from Firebase. 
                    // Without Server, unable to delete auth.
                    alert("Deleting User Coming Soon!")
                  }
              })
        usersContainer.appendChild(userElement)
    })
}

function loadAllDataFromDatabase() {
    if(!navigator.onLine) {
        if(!indexedDBInstance) {
            console.error("IndexedDB not supported on this browser. Cannot load data.")
            return
        }
        const transaction = indexedDBInstance.transaction("Users", "readonly");
        const usersStore = transaction.objectStore("Users");
        const request = usersStore.getAll();
        request.addEventListener("success", (event) => {
            event.target.result.forEach(user => {
                // With us saving the JSON to both Databases, we have to bring it out of JSON to the Post Object. Once finished on each, update the UI.
                allUsers.push(new User(user.id, user.fullname, user.username, user.isAdmin, user.lastLoggedIn))
            })
            updateUsersUI()
        })
    } else {
        const db = getFirestore(app);
        const usersCollection = collection(db, "Users");
        getDocs(usersCollection).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const user = doc.data();
                user.id = doc.id;
                const userClass = new User(user.id, user.fullname, user.username, user.isAdmin, user.lastLoggedIn);
                allUsers.push(userClass)
                pushOrUpdateUserToIndexedDB(userClass)
            });
            updateUsersUI()
        });
    }
}

function deleteUser(user) {
    pushOrUpdateUserToFirebase(user, true)
    pushOrUpdateUserToIndexedDB(user, true)
}

function syncronizeFirebaseToIndexedDB() {
    const db = getFirestore(app);
    console.log("Syncronizing Firebase to IndexedDB");
    
    const usersCollection = collection(db, "users");
    
    getDocs(usersCollection).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const user = doc.data();
            user.id = doc.id;

            const userClass = new User(user.id, user.fullname, user.username, user.isAdmin, user.lastLoggedIn);
            if(!allUsers.find(theUser => theUser.id === userClass.id)) {
                allUsers.push(userClass)
                pushOrUpdateUserToIndexedDB(userClass)
            } else {
                const userIndex = allUsers.findIndex(theUser => theUser.id === userClass.id)
                allUsers[userIndex] = userClass
                pushOrUpdateUserToIndexedDB(userClass)
            }
            
        });
        updateUsersUI()

    });
}


function syncronizeIndexedDBToFirebase() {
    const transaction = indexedDBInstance.transaction("Users", "readonly");
    const usersStore = transaction.objectStore("Users");
    const request = usersStore.getAll();
    request.addEventListener("success", (event) => {
        event.target.result.forEach(user => {
            pushOrUpdateUserToFirebase(user)
        })
    })
}

export function attemptToSaveUser(user) {
    pushOrUpdateUserToFirebase(user)
    pushOrUpdateUserToIndexedDB(user)
}
/**
 * 
 * @param {User} user 
 * @param {boolean} isDeleting 
 * @returns 
 */
function pushOrUpdateUserToFirebase(user, isDeleting = false) {
    if(!navigator.onLine) {
        return
    }
    console.log("Pushing or Updating User to Firebase");
    
    const db = getFirestore(app);
        const userCollection = collection(db, "Users");
        if (user.id) {
            const userRef = doc(db, "Users", user.id);
            if(isDeleting) {
                deleteDoc(userRef)
            } else {
                // I chose {merge: true} as it will only update the fields. This works the same as without. I don't want to have to replace the whole document for one thing.
                // We also push the JSON that the class created to Firebase for easy access.
                setDoc(userRef, user.toJSON(), { merge: true })
                .then(()=> {
                    updateUsersUI()
                })
                .catch((error) => {
                    console.error("Error updating user in Firebase:", error);
                });
            }
        } else {
            addDoc(userCollection, user.toJSON())
                .then((docRef) => {
                    console.log("Post added to Firebase successfully with ID:", docRef.id);
                    // We update the PostID if it was not created in Firebase to an ID firebase created.
                    user.id = docRef.id;
                    updateUsersUI()
                })
                .catch((error) => {
                    console.error("Error adding user to Firebase:", error);
                });
        }
}

function pushOrUpdateUserToIndexedDB(user, isDeleting = false) {
    console.log("Pushing or Updating User to IndexedDB");
    
    const transaction = indexedDBInstance.transaction("Users", "readwrite");
    const postsStore = transaction.objectStore("Users");

    if (user.id) {
        if(isDeleting) {
            const request = postsStore.delete(user.id);
            request.addEventListener("success", ()=> {
                // updatePostsUI()
            })
            request.addEventListener("error", (event)=> {
                console.error("Error deleting user in IndexedDB:", event.target.error);
            })
        } else {
            const request = postsStore.put(user.toJSON()); 
            request.addEventListener("error", (event)=> {
                console.error("Error updating user in IndexedDB:", event.target.error);
            })
            request.addEventListener("success", ()=> {
                // updatePostsUI()
            })
        }
    } else {
        const request = postsStore.add(user.toJSON());
        request.addEventListener("error", (event)=> {
            console.error("Error updating user in IndexedDB:", event.target.error);
        })
        request.addEventListener("success", ()=> {
            // updatePostsUI()
        })
    }
}







// User Object
export class User {
    // ID will be the same as what Firebase Auth gives it.
    constructor(id, fullname, username, isAdmin, lastLoggedIn) {
        this.id = id
        this.fullname = fullname
        this.isAdmin = isAdmin
        this.username = username
        this.lastLoggedIn = lastLoggedIn
    }

    toJSON() {
        return {
            "id": this.id,
            "fullname": this.fullname,
            "username": this.username,
            "isAdmin": this.isAdmin,
            "lastLoggedIn": this.lastLoggedIn
        }
    }
}