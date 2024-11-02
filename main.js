var loginText = document.getElementById('loginText');
var loginSection = document.getElementById('loginSection');

var username = document.getElementById('username');
var password = document.getElementById('password');
var loginButton = document.getElementById('loginButton');



changeScreenSize(window.matchMedia("(max-width: 900px)").matches);
window.matchMedia("(max-width: 900px)").onchange = function (e) {
    changeScreenSize(e.matches);
}

loginButton.addEventListener('click', function(e) {
    e.preventDefault();
    if(username.value == 'admin' && password.value == 'admin') {
        window.location.href = './admin/admin.html';
    } else if(username.value == 'student' && password.value == 'student') {
        window.location.href = './student/student.html';
    }
    else {
        alert('Invalid Login');
    }
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