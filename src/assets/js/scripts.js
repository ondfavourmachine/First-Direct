function hide(event) {
    var items = document.getElementsByClassName('menu');
    for (let i = 0; i < items.length; i++) {
        items[i].classList.add("d-none");
    }
    document.getElementById("overlay").classList.add("d-none");
    }
function dropDown(event) {
    event.target.parentElement.children[1].classList.remove("d-none");
    document.getElementById("overlay").classList.remove("d-none");
}
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

$(document).ready(function(){
    $('.menu-button').click(function(){
        $('.side-nav').toggle()
    });
    $("body").tooltip({ selector: '[data-toggle=tooltip]' });
})