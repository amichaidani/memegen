// TODO:
// 1) handle canvas img resizing
// 2) Touch commands for mobile
// 3) download gMemes

// Mouse tracking vars
var gMousePosition;
var gOffset = [0, 0];
var elCaption;
var gIsDown = false;

var gFocusedCaption = null;
var gElMemeImg;

function initEditor() {
    renderCanvas();
    onChangeView();
}

function renderCanvas() {
    //Todo: Limit displayed img to max width of 75% of viewport
    let selectedMeme = getSelectedMeme();
    gElMemeImg = document.querySelector('.canvas-main');
    gElMemeImg.src = selectedMeme.url;

    $('.caption').remove(); // Clear all caption elements
    createDefaultCaptions(); // Construct default top/bottom captions
    renderCaptions(); // Create caption elements and inject to DOM
    setTimeout(function () {
        $('.caption').first().css('top', '20px');
        // TODO: Shorten this horrible line:
        $('.caption').css('top', ($(gElMemeImg).outerHeight - 70) + 'px');
        $('.caption').last().blur();

    }, 100)

    gFocusedCaption = null;

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
            gMousePosition.x + gOffset[0] + gFocusedCaption.offsetWidth >= $(gElMemeImg).outerWidth(true) ||
            // Fix the bottom border detection
            gMousePosition.y + gOffset[1] + gFocusedCaption.offsetHeight > $(gElMemeImg).offset().top + $(gElMemeImg).outerHeight(true) - 2
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
        let chosenColor = el.value;
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
    renderCanvas();
}

// Clicked on download
function onEditorDownload() {
    drawCaptionsOnCanvas();
}

// EDITOR TOOLS END

function propagateColorClick() {
    $("#caption-color-picker")[0].click();
}

// Change state of editor toolbar to get style of focused caption
function updateTools() {
    let elColorPicker = $('#caption-color-picker')
    if (gFocusedCaption) {
        $(elColorPicker).val(rgb2hex($(gFocusedCaption).css("color")));
    } else {
        $(elColorPicker).val('#ffffff');
    }
}

// function drawCaptionsOnCanvas() {
//     $('.caption').each(function (idx) {
//         fontStr = $(this).css('font-size') + ' ' + $(this).css('font-family');
//         captionCoords = {
//             x: $(this).position().left,
//             y: $(this).position().top + $(this).outerHeight()
//         }
//         text = $(this).text();
//         color = $(this).css('color');
//         gCtx.font = fontStr;
//         gCtx.fillStyle = color;
//         gCtx.strokeStyle = 'black';
//         gCtx.lineWidth = 4;
//         gCtx.strokeText(text, captionCoords.x, captionCoords.y);
//         gCtx.fillText(text, captionCoords.x, captionCoords.y);
//     });
// }



