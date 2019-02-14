function init() {
    $('.editor').hide();
}

// Galerry funcs
function getClickedImgInfo (id) {
    console.log('id: ', id);
    
}

// End of gallery funcs

$('.text-line').on('mousemove', function (e) {
    if (e.which !== 1) return;
    let mouseCoords = {
        x: e.pageX - ($('.text-line').offset().left),
        y: e.pageY - ($('.text-line').offset().top)
    };
    $('.text-line').css({ top: mouseCoords.y, left: mouseCoords.x });
});

