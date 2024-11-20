import { createPost, getPosts} from '../databasescripts/PostsDB.js';
const content = document.getElementById('textarea1');
const title = document.getElementById('titlePostTextArea');

// Implementation of Service Worker

if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js');
}

document.getElementById("submitButton").addEventListener('click', () => {
    createPost(title.value, content.value, new Date(), false, "1")
    title.value = ""
    content.value = ""
})

