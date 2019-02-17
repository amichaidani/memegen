'use strict'

const GALLERY_VIEW = 'gallery';
const EDITOR_VIEW = 'editor';
var gCurrentView = GALLERY_VIEW;

function init() {
    // jQuery is very nice for hiding and showing. Yup.
    $('.gallery').show();
    $('.editor').hide();
    createGMemes();
    renderMemes();
    galleryControllerInit();
}

// jQuery is also very nice for toggle fade animations. C'mon, i'm dreaming of VUE..
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