const allPersons = document.getElementById("persons")
const addPerson = document.getElementById("addUser")

allPersons.innerHTML = ""

function createTempUsers() {
    addUserProfile("Admin")
    addUserProfile("Student")
}

// ID is temporary and will be replaced by the actual ID from Firebase Auth.
addPerson.addEventListener('click', () => {
    addUserProfile("Temp User")
})
/**
 * @description This function is WIP. This will eventually take the User Object.
 * @param {string} name 
 */
function addUserProfile(name) {
    var uuid = createUUID();
    const person = document.createElement("div")
    person.innerHTML = `<div class="card blue-grey darken-1 userCard">
                <div class="card-content white-text">
                    <img src="../images/pexels-personone.jpg" alt="Person One" class="responsive-img circle">
                  <span class="card-title">${name}</span>
                </div>
                <div class="card-action">
                  <a href="#" id="user_${uuid}">Delete</a>
                </div>
              </div>`
    allPersons.appendChild(person)
    document.getElementById(`user_${uuid}`).addEventListener('click', () => {
        const con = confirm("Are you sure you want to delete this user?")
        if(con) {
            allPersons.removeChild(person)
        }
    })
}

createTempUsers()

/**
 * @description This function creates a temporary UUID in case Firebase is not available. To the most part this is only used when offline.
 * @returns {string} Returns UUID
 */
function createUUID() {
    var letters = "abcdefghijklmnopqrstuvwxyz";
    return letters[Math.floor(Math.random() * letters.length)] + Date.now();
}