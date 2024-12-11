// Imports
import { app, auth, attemptSignOut } from "../firebase.js";
import {createUserObject, attemptToSaveUser, clearIndexedDB} from "../databasescripts/AuthDB.js"
import {getAuth, onAuthStateChanged, createUserWithEmailAndPassword} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js'
// Document Elements
const allPersons = document.getElementById("persons")
const addUser = document.getElementById("addUser")
const fullName = document.getElementById("fullName")
const email = document.getElementById("email")
const password = document.getElementById("password")
const adminCheck = document.getElementById("adminCheck")
const saveBtn = document.getElementById("save_btn");
const cancelBtn = document.getElementById("cancel_btn")
const clickFormBackground = document.getElementById("clickFormBackground")

// Variables
var isShowingUserForm = false
allPersons.innerHTML = ""

// Hide Create Form (If visible)
hideCreateUserForm()

// Show/Hide the Create Form
addUser.addEventListener('click', () => {
    if(!navigator.onLine) {
        // Limitation of Firebase. Cannot create a user offline.
        alert("You are currently offline. Please connect to the internet to add a user.")
        return
    }
    isShowingUserForm = !isShowingUserForm
    if(isShowingUserForm) {
        showCreateUserForm()
    } else {
        hideCreateUserForm()
    }
})

saveBtn.addEventListener("click", ()=>{
    createUserWithLogin(email.value, password.value)
})

cancelBtn.addEventListener("click", ()=> {
    hideCreateUserForm()
})
clickFormBackground.addEventListener("click", ()=> {
    hideCreateUserForm()
})
document.querySelectorAll('.logoutButton').forEach(element => {
    element.addEventListener('click', () => {
        attemptSignOut()
    })
});

// Helper Functions of the Create Form.
function showCreateUserForm() {
    document.getElementById("userForm").style.display = "block"
}
function hideCreateUserForm() {
    document.getElementById("userForm").style.display = "none"
}

/**
 * @description Creates a new User with Firebase, then creates the user object, finally attempts to save the user.
 * @param {string} email 
 * @param {string} password 
 */
function createUserWithLogin(email, password) {
    createUserWithEmailAndPassword(auth, email, password).then((userCred)=> {
        const user = userCred.user
        const userObject = createUserObject(user.uid, fullName.value, email, adminCheck.checked, Date.now())
        attemptToSaveUser(userObject)

    }).catch((err)=> {
        // Throw an alert if the email is already in use.
        if(err.code == "auth/email-already-in-use") {
           alert("Email already in use") 
        }
        if(err.code == "auth/invalid-credential") {
            alert("Invalid Email or Password, Please Try Again.")
        }
        console.log(err);

    })
}
