// Implementation of Service Worker

if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js');
}