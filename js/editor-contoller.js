var gMousePosition;
var gOffset = [0, 0];
var elCaption;
var gIsDown = false;
var gFocusedCaption = null;
var gCanvas = $('.canvas-main')[0];
var gCtx;

function renderCanvas() {
    //Todo: Limit displayed img to max width of 75% of viewport
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
    updateTools();
}

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

function propagateColorClick() {
    $("#caption-color-picker")[0].click();
}


function updateTools() {
    let elColorPicker = $('#caption-color-picker')
    if (gFocusedCaption) {
        $(elColorPicker).val(rgb2hex($(gFocusedCaption).css("color")));
    } else {
        $(elColorPicker).val('#ffffff');
    }
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
        gFocusedCaption = null;
    }
    updateTools();
}

function onCaptionChangeColor(el) {
    if (gFocusedCaption) {
        let chosenColor = el.value;
        let id = +gFocusedCaption.dataset.id;

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

function onEditorDownload() {
    drawCaptionsOnCanvas();
}

function drawCaptionsOnCanvas() {
    $('.caption').each(function (idx) {
        fontStr = $(this).css('font-size') + ' ' + $(this).css('font-family');
        captionCoords = {
            x: $(this).position().left,
            y: $(this).position().top
        }
        text = $(this).text();
        color = $(this).css('color');
        gCtx.font = fontStr;
        gCtx.fillStyle = color;

        gCtx.fillText(text, captionCoords.x, captionCoords.y);
    });
}


function onCaptionChange(el) {
    updateCaption(+el.dataset.id, el.innerText);
}
