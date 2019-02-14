// Mouse tracking vars
var mousePosition;
var offset = [0, 0];
var elCaption;
var isDown = false;
var gFocusedCaption = null;

function init() {
    createDefaultCaptions();
    renderCaptions();
    $('.gallery').show();
    $('.editor').hide();
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
        <span class="caption" data-id="${caption.id}" onmousedown="onCaptionClick(this,event)" onmouseup="onCaptionRelease()" contenteditable="true" oninput="onCaptionChange(this)">${caption.txt}!</span>
        `
    $('.editor-container').append(strHTML)
    $('.caption').focus();
}

// Clicked on caption
function onCaptionClick(el, ev) {
    isDown = true;
    gFocusedCaption = el;
    offset = [
        el.offsetLeft - ev.clientX,
        el.offsetTop - ev.clientY
    ];
}

// Released mouse from caption
function onCaptionRelease() {
    isDown = false;
    gFocusedCaption.focus();
}

// Track mouse movement for drag-and-drop
document.addEventListener('mousemove', function (event) {
    event.preventDefault();
    if (isDown && gFocusedCaption) {
        mousePosition = {

            x: event.clientX,
            y: event.clientY

        };
        gFocusedCaption.style.left = (mousePosition.x + offset[0]) + 'px';
        gFocusedCaption.style.top = (mousePosition.y + offset[1]) + 'px';
    }
}, true);

function onCaptionAdd() {
    let caption = createCaption('New Caption');
    renderNewCaption(caption);
}

function onCaptionDelete() {
    deleteCaption(gFocusedCaption.dataset.id);
    deRenderCaption(gFocusedCaption);
}
// Galerry funcs
function onSelectMeme(el) {
    changeSelectedMeme(el.dataset["id"]); // Model update
    console.log('data-set: ',el.dataset["id"]);
    $(`#${el.id}`).css('border', '3px solid red'); 
}

// End of gallery funcs

function onCaptionChange(el) {
    updateCaption(+el.dataset.id, el.innerText);
}
