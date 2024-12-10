const allPersons = document.getElementById("persons")
const addUser = document.getElementById("addUser")
const fullName = document.getElementById("fullName")
const email = document.getElementById("email")
const password = document.getElementById("password")
const adminCheck = document.getElementById("adminCheck")
const saveBtn = document.getElementById("save_btn");
import { app, auth, attemptSignOut } from "../firebase.js";


import {createUserObject, attemptToSaveUser, clearIndexedDB} from "../databasescripts/AuthDB.js"
import {getAuth, onAuthStateChanged, createUserWithEmailAndPassword} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js'
var isShowingUserForm = false
allPersons.innerHTML = ""
hideCreateUserForm()


// ID is temporary and will be replaced by the actual ID from Firebase Auth.
addUser.addEventListener('click', () => {
    console.log("Add User");
    isShowingUserForm = !isShowingUserForm
    if(isShowingUserForm) {
        showCreateUserForm()
    } else {
        hideCreateUserForm()
    }
})
console.log("Loading Save Button");

saveBtn.addEventListener("click", ()=>{
    console.log("Save");
    
    if(adminCheck.checked) {
        console.log("Checked");
    }
    console.log(`Full name ${fullName.value} Email ${email.value} Password ${password.value}`);
    createUserWithLogin(email.value, password.value)
})
document.querySelectorAll('.logoutButton').forEach(element => {
    element.addEventListener('click', () => {
        attemptSignOut()
    })
});

function showCreateUserForm() {
    document.getElementById("userForm").style.display = "block"
}
function hideCreateUserForm() {
    document.getElementById("userForm").style.display = "none"
}


function createUserWithLogin(email, password) {
    createUserWithEmailAndPassword(auth, email, password).then((userCred)=> {
        const user = userCred.user
        console.log(user);
        const userObject = createUserObject(user.uid, fullName.value, email, adminCheck.checked, Date.now())
        console.log(userObject);
        attemptToSaveUser(userObject)

    }).catch((err)=> {
        if(err.code == "auth/email-already-in-use") {
           alert("Email already in use") 
        }
        console.log(err);

    })
}


/**
 * @description This function creates a temporary UUID in case Firebase is not available. To the most part this is only used when offline.
 * @returns {string} Returns UUID
 */
function createUUID() {
    var letters = "abcdefghijklmnopqrstuvwxyz";
    return letters[Math.floor(Math.random() * letters.length)] + Date.now();
}