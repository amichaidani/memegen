// Mouse tracking vars
var gMousePosition;
var gOffset = [0, 0];
var elCaption;
var gIsDown = false;
var gFocusedCaption = null;
var gCanvas = $('.canvas-main')[0];
var gCtx;

function init() {
    $('.gallery').show();
    $('.editor').hide();
    renderMemes();
}

function renderCanvas() {
    let selectedMeme = getSelectedMeme();

    let img = new Image;
    img.src = selectedMeme.url;

    gCanvas.width = img.width;
    gCanvas.height = img.height;
    gCtx = gCanvas.getContext('2d')

    img.onload = function () {
        gCanvas.style.width = img.width;
        gCanvas.style.height = img.height;
        gCtx.drawImage(img, 0, 0); // Or at whatever offset you like
    };
    $('.caption').remove(); // Clear all caption elements
    createDefaultCaptions(); // Construct default top/bottom captions
    renderCaptions(); // Create caption elements and inject to DOM

    setTimeout(() => {
        $('.caption').first().css('top', '20px');
        // TODO: Shorten this horrible line:
        $('.caption').last().css('top', ($(gCanvas).height() - parseInt($('.caption').last().css('font-size'))) + 'px');
    }, 20); // Fix the timeout shit!

}



function renderCaptions() {
    let captions = getCaptions();
    captions.forEach(caption => {
        renderNewCaption(caption)
    });
}

function renderNewCaption(caption) {
    let strHTML = '';
    strHTML += `
        <div class="caption" data-id="${caption.id}" onmousedown="onCaptionClick(this,event)" onmouseup="onCaptionRelease()" contenteditable="true" oninput="onCaptionChange(this)">${caption.txt}</span>
        `
    $('.editor-container').append(strHTML);
    $('.caption').last()[0].focus();
    gFocusedCaption = $('.caption').last()[0];
}

// Clicked on caption
function onCaptionClick(el, ev) {
    gIsDown = true;
    gFocusedCaption = el;
    updateTools();
    gOffset = [
        el.offsetLeft - ev.clientX,
        el.offsetTop - ev.clientY
    ];
}

function updateTools() {
    $('#caption-color-picker').val(rgb2hex($(gFocusedCaption).css("color")));
}

// Released mouse from caption
function onCaptionRelease() {
    gIsDown = false;
    $(gFocusedCaption).focus();
    // gFocusedCaption = null;
}

// Track mouse movement for drag-and-drop
document.addEventListener('mousemove', function (event) {
    event.preventDefault();

    // if (event.clientX
    if (gIsDown && gFocusedCaption) {
        gMousePosition = {

            x: event.clientX,
            y: event.clientY

        };

        if (gMousePosition.x + gOffset[0] <= 0 ||
            gMousePosition.y + gOffset[1] <= $('.canvas-main').position().top ||
            gMousePosition.x + gOffset[0] + gFocusedCaption.offsetWidth >= $('.canvas-main').outerWidth(true) - 2 ||
            gMousePosition.y + gOffset[1] + gFocusedCaption.offsetHeight > $('.canvas-main').offset().top + $('.canvas-main').outerHeight(true) - 2
        ) return;

        gFocusedCaption.style.left = (gMousePosition.x + gOffset[0]) + 'px';
        gFocusedCaption.style.top = (gMousePosition.y + gOffset[1]) + 'px';
    }
}, true);

function onCaptionAdd() {
    let caption = createCaption('New Caption');
    renderNewCaption(caption);
}

function onCaptionDelete() {
    if (gFocusedCaption) {
        deleteCaption(+gFocusedCaption.dataset.id);
        gFocusedCaption.remove();
    }
}

function onCaptionChangeColor(el) {
    let chosenColor = el.value;
    let id = +gFocusedCaption.dataset.id;

    if (gFocusedCaption) {
        changeCaptionColor(id, chosenColor);
        gFocusedCaption.style.color = chosenColor;
    }
}

function onCaptionLarger() {
    if (gFocusedCaption) {
        let size = captionLarger(+gFocusedCaption.dataset.id);
        $(gFocusedCaption).css('font-size', size + 'px').focus();
    }
}

function onCaptionSmaller() {
    if (gFocusedCaption) {
        let size = captionSmaller(+gFocusedCaption.dataset.id);
        $(gFocusedCaption).css('font-size', size + 'px').focus();
    }
}

function onEditorReset() {
    renderCanvas();
}

// Galerry funcs
function onSelectMeme(el) {
    changeSelectedMeme(el.dataset["id"]); // Model update
    console.log('data-set: ', el.dataset["id"]);
    onEditMeme();
}

function renderMemes() {
    let strHTMLs = getStrHTMLs();
    $('.grid-container').html(strHTMLs)
}

function onEditMeme() {
    renderCanvas();
    changeView();
}

function changeView() {
    $('.gallery').toggle('hide');
    $('.editor').toggle('hide');
}
// End of gallery funcs

function onCaptionChange(el) {
    updateCaption(+el.dataset.id, el.innerText);
}
