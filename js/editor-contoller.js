'use strict'

// TODO:
// 2) Touch commands for mobile

var gFocusedCaption = null;
var gElMemeImg;
var gCanvas;

// Mouse tracking vars
var gMousePosition;
var gOffset = [0, 0];
var elCaption;
var gIsDown = false;

function initEditor() {
    setupEditor();
    onChangeView();
}

function setupEditor() {
    //Todo: Limit displayed img to max width of 75% of viewport
    let selectedMeme = getSelectedMeme();
    gElMemeImg = document.querySelector('.meme-background');
    gElMemeImg.src = selectedMeme.url;

    $('.caption').remove(); // Clear all caption elements
    createDefaultCaptions(); // Construct default top/bottom captions
    renderCaptions(); // Create caption elements and inject to DOM

    setTimeout(() => {
        placeDefaultCaptions()
    }, 300);

    gFocusedCaption = null;

}

function placeDefaultCaptions() {
    $('.caption').each(function (idx) {
        $(this).css('left', ((gElMemeImg.width / 2) - ($(this).outerWidth() / 2)) + 'px');
        $(this).css('top', (idx === 0) ? '20px' : gElMemeImg.height - 70 + 'px');
    })
}

// Render '.caption' elements
function renderCaptions() {
    let captions = getCaptions(); // Get captions from model
    captions.forEach(caption => {
        renderNewCaption(caption)
    });
}

// Render single new caption
function renderNewCaption(caption) {
    let strHTML = '';
    strHTML += `
        <div class="caption" data-id="${caption.id}" onmousedown="onCaptionClick(this,event)" onmouseup="onCaptionRelease()" contenteditable="true" oninput="onCaptionChange(this)">${caption.txt}</span>
        `
    $('.editor-container').append(strHTML);
    $('.caption').last()[0].focus();
    gFocusedCaption = $('.caption').last()[0];
    $(gFocusedCaption).css('left', ((gElMemeImg.width / 2) - ($(gFocusedCaption).outerWidth() / 2)) + 'px');
    $(gFocusedCaption).css('top', ((gElMemeImg.height / 2) - ($(gFocusedCaption).outerHeight() / 2)) + 'px');
    updateTools();
}

// CAPTIONS DRAG FUNCTION START
// Clicked on caption
function onCaptionClick(el, ev) {
    ev.stopPropagation();
    gIsDown = true;
    gFocusedCaption = el;
    updateTools();
    gOffset = [
        el.offsetLeft - ev.clientX,
        el.offsetTop - ev.clientY
    ];
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
            gMousePosition.y + gOffset[1] <= $(gElMemeImg).position().top ||
            gMousePosition.x + gOffset[0] + gFocusedCaption.offsetWidth >= gElMemeImg.offsetWidth ||
            gMousePosition.y + gOffset[1] + gFocusedCaption.offsetHeight > gElMemeImg.offsetHeight
        ) return;

        gFocusedCaption.style.left = (gMousePosition.x + gOffset[0]) + 'px';
        gFocusedCaption.style.top = (gMousePosition.y + gOffset[1]) + 'px';
    }
}, true);
// CAPTIONS DRAG FUNCTION END

// EDITOR TOOLS START
// Changed value of caption text
function onCaptionChange(el) {
    updateCaption(+el.dataset.id, el.innerText);
}

// Clicked on add new caption
function onCaptionAdd() {
    let caption = createCaption('New Caption');
    renderNewCaption(caption);
}

// Clicked on delete caption
function onCaptionDelete() {
    if (gFocusedCaption) {
        deleteCaption(+gFocusedCaption.dataset.id);
        gFocusedCaption.remove();
        gFocusedCaption = null;
    }
    updateTools();
}

// Clicked on caption color change
function onCaptionChangeColor(el) {
    if (gFocusedCaption) {
        let chosenColor = '#' + el
        let id = +gFocusedCaption.dataset.id;
        changeCaptionColor(id, chosenColor);
        gFocusedCaption.style.color = chosenColor;
    }
}

// Clicked on caption enlarge font size
function onCaptionLarger() {
    if (gFocusedCaption) {
        let size = captionLarger(+gFocusedCaption.dataset.id);
        if (size) {
            $(gFocusedCaption).css('font-size', size + 'px')
        }
        $(gFocusedCaption).focus();
    }
}

// Clicked on caption decrease font size
function onCaptionSmaller() {
    if (gFocusedCaption) {
        let size = captionSmaller(+gFocusedCaption.dataset.id);
        if (size) {
            $(gFocusedCaption).css('font-size', size + 'px').focus();
        }
        $(gFocusedCaption).focus();
    }
}

// Clicked on reset
function onEditorReset() {
    setupEditor();
}

// Clicked on download
function onEditorDownload() {
    renderToCanvas();
}

function renderToCanvas() {
    // Get canvas
    gCanvas = $('canvas')[0];
    let elCtx = gCanvas.getContext('2d');
    // Set canvas to EXACT dimensions of meme img
    $(gCanvas).css('width', $(gElMemeImg).outerWidth() + 'px');
    $(gCanvas).css('height', $(gElMemeImg).outerHeight() + 'px');
    // .. And set the context to the right size as well
    elCtx.canvas.width = $(gCanvas).width();
    elCtx.canvas.height = $(gCanvas).height();

    // Draw meme background img
    elCtx.drawImage(gElMemeImg, 0, 0, $(gCanvas).width(), $(gCanvas).height());

    $('.caption').each(function (index) {
        elCtx.fillStyle = $(this).css('color');
        elCtx.font = 'normal normal 300 ' + $(this).css('font-size') + ' Impact';
        elCtx.strokeStyle = $(this).css('-webkit-text-stroke-color');
        elCtx.lineWidth = 4;
        elCtx.strokeText($(this).text(), $(this).position().left, $(this).position().top + $(this).outerHeight());
        elCtx.fillText($(this).text(), $(this).position().left, $(this).position().top + $(this).outerHeight());
    });

    downloadImg();

}

function downloadImg() {
    let imgContent = gCanvas.toDataURL('image/jpeg');
    document.querySelector('#download-link').href = imgContent;
}
// EDITOR TOOLS END

// Change state of editor toolbar to get style of focused caption
function updateTools() {
    let elColorPicker = $('.jscolor')[0];
    if (gFocusedCaption) {
        let caption = getCaptionById(+gFocusedCaption.dataset.id);
        elColorPicker.jscolor.fromString(caption.color);
    } else {
        elColorPicker.jscolor.fromString('ffffff')
    }
}

