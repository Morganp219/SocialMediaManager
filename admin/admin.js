import { createPost, deletePost, getPosts, updatePost } from '../databasescripts/PostsDB.js';
import { attemptSignOut } from '/firebase.js';


var cardHolder = document.getElementById('cardholder');
var section = document.getElementById('containerSection');
var sidenavtrigger = document.querySelector('.sidenav-trigger');

var submitButton = document.getElementById('submitButton')
var title = document.getElementById('titlePostTextArea')
var content = document.getElementById('textarea1')


if(submitButton) {
    submitButton.addEventListener('click', () => {
        submit()
    })
}
document.querySelectorAll('.logoutButton').forEach(element => {
    element.addEventListener('click', () => {
        attemptSignOut()
    })
});

if(section) {

    changeScreenSize(window.matchMedia("(max-width: 900px)").matches);
    window.matchMedia("(max-width: 900px)").onchange = function (e) {
        changeScreenSize(e.matches);
    }
}

// Implementation of Service Worker

if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js');
}


function changeScreenSize(isMobile) {
    if(isMobile) {
        section.classList.remove('row')
        section.classList.add('col')
    } else {
        section.classList.remove('col')
        section.classList.add('row')
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var sidenav = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(sidenav, {
        edge: 'left',
        draggable: true
    });
    // instances[0].open();
    sidenavtrigger.addEventListener('click', function() {
        instances[0].open();
    })
});




function submit() {
    console.log("Submit");
    
    createPost(title.value, content.value, new Date(), false, "1")
    title.value = ""
    content.value = ""
}