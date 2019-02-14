const GALLERY_VIEW = 'gallery';
const EDITOR_VIEW = 'editor';
var gCurrentView = GALLERY_VIEW;

function init() {
    $('.gallery').show();
    $('.editor').hide();
    createGMemes();
    renderMemes();
}

function onChangeView() {
    if (gCurrentView === GALLERY_VIEW) {
        $('.gallery').fadeToggle('fast', function () {
            $('.editor').fadeToggle();
        });
        gCurrentView = EDITOR_VIEW;
    } else {
        $('.editor').fadeToggle('fast', function () {
            $('.gallery').fadeToggle();
        });
        gCurrentView = GALLERY_VIEW;
    }
}
