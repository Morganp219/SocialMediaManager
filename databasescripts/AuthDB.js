//TODO: Add User Authentication. For the Final. This will follow the same logic as PostsDB.
// // Objects

//For our alert system. Users does not effect the functionality of the application in offline/online yet.
const okButton = document.getElementById('okbutton')
const alert = document.getElementById('alert')

okButton.addEventListener('click', () => {
    alert.style.display = 'none'
})

window.addEventListener("online", ()=> {
    // Show the alert for 5 seconds. To alert the user that IndexDB is syncing with Firebase
    alert.style.display = 'block'
    setTimeout(() => {
        alert.style.display = 'none'
    }, 5000)
})

// User Object
class User {
    constructor(id, username, isAdmin, lastLoggedIn) {
        this.id = id
        this.isAdmin = isAdmin
        this.username = username
        this.lastLoggedIn = lastLoggedIn
    }
}