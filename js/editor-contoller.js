var gMousePosition;
var gOffset = [0, 0];
var elCaption;
var gIsDown = false;
var gFocusedCaption = null;
var gElMemeImg;
var gCtx;

function renderCanvas() {
    //Todo: Limit displayed img to max width of 75% of viewport
    let selectedMeme = getSelectedMeme();
    let elImg = document.querySelector('.canvas-main');
    elImg.src = selectedMeme.url;
    gElMemeImg = elImg;
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
            gMousePosition.x + gOffset[0] + gFocusedCaption.offsetWidth >= $('.canvas-main').outerWidth(true) ||
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
        if (size) {
            $(gFocusedCaption).css('font-size', size + 'px')
        }
        $(gFocusedCaption).focus();
    }
}

function onCaptionSmaller() {
    if (gFocusedCaption) {
        let size = captionSmaller(+gFocusedCaption.dataset.id);
        if (size) {
            $(gFocusedCaption).css('font-size', size + 'px').focus();
        }
        $(gFocusedCaption).focus();
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
            y: $(this).position().top + $(this).outerHeight()
        }
        text = $(this).text();
        color = $(this).css('color');
        gCtx.font = fontStr;
        gCtx.fillStyle = color;
        gCtx.strokeStyle = 'black';
        gCtx.lineWidth = 4;
        gCtx.strokeText(text, captionCoords.x, captionCoords.y);
        gCtx.fillText(text, captionCoords.x, captionCoords.y);
    });
}


function onCaptionChange(el) {
    updateCaption(+el.dataset.id, el.innerText);
}
