'use strict'
var gElMemeImg;
var gCanvas;
var gCtx;
var gFocusedCaption = null;

// Mouse tracking vars
var gMousePosition;
var gOffset = [0, 0];
var elCaption;
var gIsDown = false;
var gElCaptionReady = false;

function initEditor() {
    createDefaultCaptions();
    setupEditor();
    onChangeView();
}

function setupEditor() {
    //Todo: Limit displayed img to max width of 75% of viewport
    let selectedMeme = getSelectedMeme();
    gElMemeImg = document.querySelector('.meme-background');
    gElMemeImg.src = selectedMeme.url;
    gCanvas = document.querySelector('canvas')
    gCtx = gCanvas.getContext('2d');
    setTimeout(() => {
        gCanvas.width = $(gElMemeImg).outerWidth();
        gCanvas.height = $(gElMemeImg).outerHeight();
        gCtx.canvas.width = gCanvas.width;
        gCtx.canvas.height = gCanvas.height;
        gCtx.drawImage(gElMemeImg, 0, 0, gCanvas.width, gCanvas.height);
        placeDefaultCaptions();
        renderCaptions();
    }, 300);
}

function renderCanvas() {
    gCtx.drawImage(gElMemeImg, 0, 0, gCanvas.width, gCanvas.height);
    renderCaptions();
}
// Place the default top and bottom captions
function placeDefaultCaptions() {
    let captions = getCaptions();
    captions.forEach((caption, index) => {
        caption.x = gCanvas.width / 2;
        if (index === 0) {
            caption.y = caption.fontSize + 20;
        } else {
            caption.y = gCanvas.height - caption.fontSize + 20;
        }
    })
}

// Render '.caption' elements
function renderCaptions() {
    let captions = getCaptions(); // Get captions from model
    captions.forEach(caption => {
        renderSingleCaption(caption);
    });
}

// Render single new caption
function renderSingleCaption(caption) {
    // Set font
    gCtx.font = caption.fontSize + 'px ' + caption.fontFamily;
    // Set colors and stroke
    gCtx.fillStyle = caption.color;
    gCtx.strokeStyle = caption.strokeColor;
    gCtx.lineWidth = caption.strokeWidth;
    // Get the measured text width
    let textWidth = gCtx.measureText(caption.txt);
    // Update the model with the measured text width
    updateCaptionMeasureText(caption.id, textWidth.width);
    // Paint it!
    gCtx.fillText(caption.txt, caption.x, caption.y);
    gCtx.strokeText(caption.txt, caption.x, caption.y);
    updateTools();
}

function onCaptionTouch(el, ev) {
    ev.stopPropagation();
    ev.preventDefault();
    ev = ev.touches[0];
    console.log(ev);

    gFocusedCaption = el;
    updateTools();
    gOffset = [
        $(el).offset().left - ev.clientX,
        $(el).offset().top - ev.clientY
    ];

    gFocusedCaption.style.left = (ev.clientX - gOffset[0]) + 'px';
    gFocusedCaption.style.top = (ev.clientY - gOffset[1]) + 'px';
}

// CAPTIONS DRAG FUNCTION START
// Clicked on caption
function onCanvasClick(ev) {
    gIsDown = true;
    let coords = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    let caption = getClickedCaption(coords);
    if (caption) {
        gFocusedCaption = caption;
        updateTools(caption);
    }
    else {
        gFocusedCaption = null;
    }
}

// Released mouse from caption
function onCanvasRelease() {
    gIsDown = false;
    console.log('out')
}

// Track mouse movement for drag-and-drop
document.addEventListener('mousemove', function (event) {
    event.preventDefault();

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

        dragCaptions();
    }
}, true);

function dragCaptions() {
    gFocusedCaption.style.left = (gMousePosition.x + gOffset[0]) + 'px';
    gFocusedCaption.style.top = (gMousePosition.y + gOffset[1]) + 'px';

}
// CAPTIONS DRAG FUNCTION END

// EDITOR TOOLS START
// Changed value of caption text
function onCaptionChange(el) {
    updateCaption(+el.dataset.id, el.innerText);
}

// Clicked on add new caption
function onCaptionAdd() {
    let caption = createCaption('New Caption', gCanvas.width);
    renderSingleCaption(caption);
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
        changeCaptionColor(gFocusedCaption.id, chosenColor);
        renderCanvas();
    }
}

// Clicked on caption enlarge font size
function onCaptionTextSizeChange(el) {
    if (gFocusedCaption) {
        let action = el.dataset.action;
        if (action === 'enlarge') {
            captionLarger(gFocusedCaption.id);
        } else {
            captionSmaller(gFocusedCaption.id);
        }
    }
    renderCanvas();
}

// Clicked on reset
function onEditorReset() {
    setupEditor();
}

// Clicked on download
function onEditorDownload() {
    downloadImg();
}

function downloadImg() {
    let imgContent = gCanvas.toDataURL('image/jpeg');
    document.querySelector('#download-link').href = imgContent;
}
// EDITOR TOOLS END

// Change state of editor toolbar to get style of focused caption
function updateTools(caption) {
    let elColorPicker = $('.jscolor')[0];
    if (caption) {
        elColorPicker.jscolor.fromString(caption.color);
    } else {
        elColorPicker.jscolor.fromString('ffffff')
    }
}

