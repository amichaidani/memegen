var gElMemeImg;
var gCanvas;
var gCtx;
var gFocusedCaption = null;
var gElInputText = document.querySelector('.caption-text-input');
var gIsMobile = window.matchMedia("(max-width: 420px)").matches

// Mouse tracking vars
var gIsDown = false;
var canvasOffset;
var offsetX;
var offsetY;
var scrollX;
var scrollY;
var startX;
var startY;

// just a bit of jQuery, helps with ACTUAL DIMENSIONS calcs
function setMouseVars() {
    canvasOffset = $(gCanvas).offset();
    offsetX = canvasOffset.left;
    offsetY = canvasOffset.top;
    scrollX = $(gCanvas).scrollLeft();
    scrollY = $(gCanvas).scrollTop();
}

function initEditor() {
    updateCaptionsSizeByMediaQuery(gIsMobile)
    gCanvas = document.querySelector('canvas')
    gCtx = gCanvas.getContext('2d');
    setMouseVars();
    setupEditor();
    onChangeView();
}

function setupEditor() {
    createDefaultCaptions();
    //Todo: Limit displayed img to max width of 75% of viewport
    let selectedMeme = getSelectedMeme();
    gElMemeImg = document.querySelector('.meme-background');
    gElMemeImg.src = selectedMeme.url;
    setTimeout(() => {
        gCanvas.width = $(gElMemeImg).outerWidth();
        gCanvas.height = $(gElMemeImg).outerHeight();
        gCtx.canvas.width = gCanvas.width;
        gCtx.canvas.height = gCanvas.height;
        renderCanvas();
        placeDefaultCaptions(getCanvasDimensions());
        renderCanvas();
    }, 300);
}

// Re-render canvas
function renderCanvas() {
    gCtx.drawImage(gElMemeImg, 0, 0, gCanvas.width, gCanvas.height);
    renderCaptions();
}

// Render captions
function renderCaptions() {
    let captions = getCaptions(); // Get captions from model
    captions.forEach(caption => {
        renderSingleCaption(caption);
    });
}

// Render single caption
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

// Mouse down event on canvas
function onCanvasMouseDown(ev) {
    startX = parseInt(ev.clientX - offsetX);
    startY = parseInt(ev.clientY - offsetY);

    let coords = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    let caption = getClickedCaption(coords);
    if (caption) {
        gIsDown = true;

        gFocusedCaption = caption;
        gElInputText.value = caption.txt;
        gElInputText.style.display = "inline-block";
        gElInputText.style.left = coords.x + 'px';
        gElInputText.style.top = coords.y + 'px';
    }
    else {
        gFocusedCaption = null;
        hideInputCaption()
    }
    updateTools();
}

// Mouse out event on canvas
function onCanvasRelease() {
    gIsDown = false;
}

// Track mouse movement for drag-and-drop
function onCanvasMouseMove(ev) {
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
        hideInputCaption();
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


// Touch events
var touchStartX;
var touchStartY;
function onCanvasTouchStart(ev) {
    ev = ev.touches[0];
    touchStartX = ev.clientX - gCanvas.getBoundingClientRect().x;
    touchStartY = ev.clientY - gCanvas.getBoundingClientRect().y;

    let caption = getClickedCaption({ x: touchStartX, y: touchStartY });
    if (caption) {
        gIsDown = true;
        gFocusedCaption = caption;
    }
}

function onCanvasTouchEnd(ev) {
    gIsDown = false;
}


function onCanvasTouch(ev) {
    ev.preventDefault();
    ev = ev.touches[0]
    let newTouchX = ev.clientX - gCanvas.getBoundingClientRect().x;
    let newTouchY = ev.clientY - gCanvas.getBoundingClientRect().y;
    if (gIsDown) {
        let diffX = touchStartX - newTouchX;
        let diffY = touchStartY - newTouchY;
        let newCoords = {
            x: gFocusedCaption.x - diffX,
            y: gFocusedCaption.y - diffY
        }
        touchStartX = newTouchX;
        touchStartY = newTouchY;
        updateCaptionCoords(gFocusedCaption.id, newCoords) // Update the model
        renderCanvas();

    }
}

// Clicked on add new caption
function onCaptionAdd() {
    createCaption('New Caption', getCanvasDimensions());
    renderCanvas();
}

function getCanvasDimensions() {
    return { width: gCanvas.width, height: gCanvas.height }
}

// Clicked on delete caption
function onCaptionDelete() {
    if (gFocusedCaption) {
        deleteCaption(gFocusedCaption.id);
    }
    gFocusedCaption = null;
    hideInputCaption();
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
        hideInputCaption();
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

function onUpdateCaptionText(el, ev) {
    updateCaptionText(gFocusedCaption.id, el.value);
    if (ev.which === 13) {
        hideInputCaption()
    }
    renderCanvas();
}

// Change state of editor toolbar to get style of focused caption
function updateTools() {
    let elColorPicker = document.querySelector('.jscolor')
    if (gFocusedCaption) {
        elColorPicker.jscolor.fromString(gFocusedCaption.color);
    } else {
        elColorPicker.jscolor.fromString('ffffff')
    }
}

function hideInputCaption() {
    gElInputText.style.display = 'none';
}