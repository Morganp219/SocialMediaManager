// Imports
import {attemptToLogin, attemptSignOut} from './firebase.js'
// Variables
var loginText = document.getElementById('loginText');
var loginSection = document.getElementById('loginSection');

var username = document.getElementById('username');
var password = document.getElementById('password');
var loginButton = document.getElementById('loginButton');
var isShowingInstallPrompt = false

// Event Listeners
// Login Button 
loginButton.addEventListener('click', function(e) {    
    e.preventDefault()
    if(!navigator.onLine) {
        alert("You are currently offline. Please connect to the internet to login.")
        return;
    }
    if(username.value == "" || password.value == "") {
        alert("Please enter a username and password")
        return;
    }
    console.log("Login Button Clicked");
    
    attemptToLogin(username.value, password.value)
});

// Implementation of Service Worker
if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
}

// Change the screen size based on the window size.
changeScreenSize(window.matchMedia("(max-width: 900px)").matches);
window.matchMedia("(max-width: 900px)").onchange = function (e) {
    changeScreenSize(e.matches);
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
// Installation Prompt
window.addEventListener('beforeinstallprompt', (e) => {
    // e.preventDefault();
    const installPrompt = document.getElementById('installPrompt');
    console.log("Install Prompt");
    

    if(localStorage.getItem('hasInstallPromptBeenShown') == 'true') {
        installPrompt.style.display = 'none';
        return;
    }
    installPrompt.style.display = 'flex';
    isShowingInstallPrompt = true;
    document.getElementById('closeInstallPromptBtn').addEventListener('click', ()=> {
        console.log("Close Install Prompt");
        
        localStorage.setItem('hasInstallPromptBeenShown', 'true');
        closeInstallPrompt()
    })
    document.getElementById('installPrompt').addEventListener('click', ()=> {
        console.log("Close Install Prompt");
        
        localStorage.setItem('hasInstallPromptBeenShown', 'true');
        closeInstallPrompt()
    })
})
// Close window if app is installed
window.addEventListener('appinstalled', (e) => {
    closeInstallPrompt()
})
// Close Install Window.
function closeInstallPrompt() {
    const installPrompt = document.getElementById('installPrompt');
    installPrompt.style.display = 'none';
    isShowingInstallPrompt = false;
}