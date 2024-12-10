import { createPost, getPosts} from '../databasescripts/PostsDB.js';
import { attemptSignOut, currentUser } from '../firebase.js';

const content = document.getElementById('textarea1');
const title = document.getElementById('titlePostTextArea');

// Implementation of Service Worker

if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js');
}

document.getElementById("submitButton").addEventListener('click', () => {
    createPost(title.value, content.value, new Date(), false, currentUser.id)
    title.value = ""
    content.value = ""
})

document.querySelectorAll('.logoutButton').forEach(button => {
    button.addEventListener('click', () => {
        attemptSignOut()
    })
})
