'use strict'

const GALLERY_VIEW = 'gallery';
const EDITOR_VIEW = 'editor';
var gCurrentView = GALLERY_VIEW;

function init() {
    $('.gallery').show();
    $('.editor').hide();
    createGMemes();
    renderMemes();
    galleryControllerInit();
}

function onChangeView() {
    if (gCurrentView === GALLERY_VIEW) {
        $('.gallery').fadeToggle('fast', function () {
            $('.editor').fadeToggle();
            document.body.scrollTop = 0; // For Safari
            document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera        
        });
        gCurrentView = EDITOR_VIEW;
    } else {
        $('.editor').fadeToggle('fast', function () {
            $('.gallery').fadeToggle();
            document.body.scrollTop = 0; // For Safari
            document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera        
        });
        gCurrentView = GALLERY_VIEW;
    }
}