// Imports
import { createPost, deletePost, getPosts, updatePost } from '../databasescripts/PostsDB.js';
import { attemptSignOut } from '../firebase.js';

// Document Elements
const section = document.getElementById('containerSection');
const sidenavtrigger = document.querySelector('.sidenav-trigger');
const submitButton = document.getElementById('submitButton')
const title = document.getElementById('titlePostTextArea')
const content = document.getElementById('textarea1')


// Implementation of Service Worker
if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js');
}

// If needed on the page checks. (If the document element is not undefined.)
if(submitButton) {
    submitButton.addEventListener('click', () => {
        submit()
    })
}
if(section) {

    changeScreenSize(window.matchMedia("(max-width: 900px)").matches);
    window.matchMedia("(max-width: 900px)").onchange = function (e) {
        changeScreenSize(e.matches);
    }
}
// Setup Logout Button
document.querySelectorAll('.logoutButton').forEach(element => {
    element.addEventListener('click', () => {
        attemptSignOut()
    })
});

// Sidebar setup
document.addEventListener('DOMContentLoaded', function() {
    var sidenav = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(sidenav, {
        edge: 'left',
        draggable: true
    });
    sidenavtrigger.addEventListener('click', function() {
        instances[0].open();
    })
});



// Change from Row to Column based on screen size.
function changeScreenSize(isMobile) {
    if(isMobile) {
        section.classList.remove('row')
        section.classList.add('col')
    } else {
        section.classList.remove('col')
        section.classList.add('row')
    }
}

function submit() {
    createPost(title.value, content.value, new Date(), false, "1")
    title.value = ""
    content.value = ""
}



