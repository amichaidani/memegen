var gElMemeImg;
var gCanvas;
var gCtx;
var gFocusedCaption = null;

// Mouse tracking vars
var gIsDown = false;
var canvasOffset;
var offsetX;
var offsetY;
var scrollX;
var scrollY;
var startX;
var startY;

function initCanvas() {
    gCanvas = document.querySelector('canvas')
    gCtx = gCanvas.getContext('2d')
    canvasOffset = $(gCanvas).offset();
    offsetX = canvasOffset.left;
    offsetY = canvasOffset.top;
    scrollX = $(gCanvas).scrollLeft();
    scrollY = $(gCanvas).scrollTop();
}

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

// Re-render canvas
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
    // Set colors and stroke
    gCtx.fillStyle = caption.color;
    gCtx.strokeStyle = caption.strokeColor;
    gCtx.lineWidth = caption.strokeWidth;
    gCtx.font = caption.fontSize + 'px ' + caption.fontFamily;
    gCtx.textAlign = caption.align;
    // Get the measured text width
    let textWidth = gCtx.measureText(caption.txt);
    // Update the model with the measured text width
    updateCaptionMeasureText(caption.id, textWidth.width);
    // Paint it!
    gCtx.fillText(caption.txt, caption.x, caption.y);
    gCtx.strokeText(caption.txt, caption.x, caption.y);
}

// Hanlding touch events
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

// Mouse down event on canvas
function onCanvasMouseDown(ev) {
    gIsDown = true;
    startX = parseInt(ev.clientX - offsetX);
    startY = parseInt(ev.clientY - offsetY);

    let coords = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    let caption = getClickedCaption(coords);
    if (caption) {
        gFocusedCaption = caption;
    }
    else {
        gFocusedCaption = null;
    }
    updateTools();
}

// Mouse out event on canvas
function onCanvasRelease() {
    gIsDown = false;
    console.log('out')
}

// Track mouse movement for drag-and-drop
function onCanvasMouseMove(ev) {
    event.preventDefault();

    // Get coords of event
    let coords = {
        x: event.offsetX,
        y: event.offsetY
    }
    // Get the clicked caption and change the mouse cursor accordingly
    let caption = getClickedCaption(coords);
    if (caption) {
        document.body.style.cursor = 'move';
    } else {
        document.body.style.cursor = 'initial';
    }

    // Click is down? there is focused caption? let's move it!
    if (gIsDown && gFocusedCaption) {
        ev.preventDefault();
        let mouseX = parseInt(ev.clientX - offsetX);
        let mouseY = parseInt(ev.clientY - offsetY);

        var dx = mouseX - startX;
        var dy = mouseY - startY;
        startX = mouseX;
        startY = mouseY;
        let newCoords = {
            x: gFocusedCaption.x + dx,
            y: gFocusedCaption.y + dy
        }
        updateCaptionCoords(gFocusedCaption.id, newCoords) // Update the model
        renderCanvas();
    }
};

// EDITOR TOOLS START
// Clicked on add new caption
function onCaptionAdd() {
    createCaption('New Caption', { width: gCanvas.width, height: gCanvas.height });
    renderCanvas();
}

// Clicked on delete caption
function onCaptionDelete() {
    if (gFocusedCaption) {
        deleteCaption(gFocusedCaption.id);
    }
    gFocusedCaption = null;
    updateTools();
    renderCanvas();
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
    let imgContent = gCanvas.toDataURL('image/jpeg');
    document.querySelector('#download-link').href = imgContent;
}

// EDITOR TOOLS END

// Change state of editor toolbar to get style of focused caption
function updateTools() {
    let elColorPicker = $('.jscolor')[0];
    if (gFocusedCaption) {
        elColorPicker.jscolor.fromString(gFocusedCaption.color);
    } else {
        elColorPicker.jscolor.fromString('ffffff')
    }
}

