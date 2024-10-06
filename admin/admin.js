var approve = document.getElementById('approveCard_1');
var deny = document.getElementById('denyCard_1');
var cardHolder = document.getElementById('cardholder');
var section = document.getElementById('containerSection');
var sidenavtrigger = document.querySelector('.sidenav-trigger');

if(approve) {
    approve.addEventListener('click', function() {
        alert('Approved');
        // TODO: Remove the appropriate card.
        cardHolder.innerHTML = '<h4>Pending Posts</h4>';
    })
}

if(deny) {
    deny.addEventListener('click', function() {
        alert('Denied');
        // TODO: Remove the appropriate card.
        cardHolder.innerHTML = '<h4>Pending Posts</h4>';
    })
}

if(section) {

    changeScreenSize(window.matchMedia("(max-width: 900px)").matches);
    window.matchMedia("(max-width: 900px)").onchange = function (e) {
        changeScreenSize(e.matches);
    }
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