import {attemptToLogin, attemptSignOut} from './firebase.js'
var loginText = document.getElementById('loginText');
var loginSection = document.getElementById('loginSection');

var username = document.getElementById('username');
var password = document.getElementById('password');
var loginButton = document.getElementById('loginButton');
var isShowingInstallPrompt = false



changeScreenSize(window.matchMedia("(max-width: 900px)").matches);
window.matchMedia("(max-width: 900px)").onchange = function (e) {
    changeScreenSize(e.matches);
}
console.log("Loading Save Button");

loginButton.addEventListener('click', function(e) {    
    attemptToLogin(username.value, password.value)
});
// Implementation of Service Worker
if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
}



function changeScreenSize(isMobile) {
    if(isMobile) {
        loginText.classList.remove('col', 's6')
        loginSection.classList.remove('s6')
        loginSection.classList.add('s12')
    } else {
        loginText.classList.add('col', 's6')
        loginSection.classList.add('s6')
        loginSection.classList.remove('s12')
    }
}

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    const installPrompt = document.getElementById('installPrompt');
    installPrompt.style.display = 'flex';
    isShowingInstallPrompt = true;
    document.getElementById('closeInstallPromptBtn').addEventListener('click', ()=> {
        closeInstallPrompt()
    })
})

window.addEventListener('appinstalled', (e) => {
    const installPrompt = document.getElementById('installPrompt');
    installPrompt.style.display = 'none';
    isShowingInstallPrompt = false;
})

function closeInstallPrompt() {
    const installPrompt = document.getElementById('installPrompt');
    installPrompt.style.display = 'none';
    isShowingInstallPrompt = false;
}