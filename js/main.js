// Mouse tracking vars
var mousePosition;
var offset = [0, 0];
var end = [0, 0];
var elCaption;
var isDown = false;
var outOfBounds = false;
var gFocusedCaption = null;


function init() {

    createDefaultCaptions();
    renderCaptions();
    $('.gallery').hide();
    $('.editor').show();
    createGMemes();
    renderMemes();
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
        <div class="caption" data-id="${caption.id}" onmousedown="onCaptionClick(this,event)" onmouseup="onCaptionRelease()" contenteditable="true" oninput="onCaptionChange(this)">${caption.txt}!</span>
        `
    $('.editor-container').append(strHTML);
    $('.caption').last()[0].focus();
    gFocusedCaption = $('.caption').last()[0];
}

// Clicked on caption
function onCaptionClick(el, ev) {
    isDown = true;
    gFocusedCaption = el;
    updateTools();
    offset = [
        el.offsetLeft - ev.clientX,
        el.offsetTop - ev.clientY
    ];
}

function updateTools() {
    $('#caption-color-picker').val(rgb2hex($(gFocusedCaption).css("color")));
}

// Released mouse from caption
function onCaptionRelease() {
    isDown = false;
    $(gFocusedCaption).focus();
    // gFocusedCaption = null;
}

// Track mouse movement for drag-and-drop
document.addEventListener('mousemove', function (event) {
    event.preventDefault();

    // if (event.clientX
    if (isDown && gFocusedCaption) {
        mousePosition = {

            x: event.clientX,
            y: event.clientY

        };
        if (mousePosition.x + offset[0] <= 0 ||
            mousePosition.y + offset[1] <= 0 ||
            mousePosition.y + offset[1] + gFocusedCaption.offsetHeight > $('.canvas-main').offset().top + $('.canvas-main').outerHeight(true) - 2
        ) return;

        gFocusedCaption.style.left = (mousePosition.x + offset[0]) + 'px';
        gFocusedCaption.style.top = (mousePosition.y + offset[1]) + 'px';
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

// Galerry funcs
function onSelectMeme(el) {
    changeSelectedMeme(el.dataset["id"]); // Model update
    console.log('data-set: ',el.dataset["id"]);
    el.style.border= "thick solid #0000FF"
    onEditMeme();
}

function renderMemes() {
    let strHTMLs = getStrHTMLs();
    $('.grid-container').html(strHTMLs)
}

function onEditMeme() {
    console.log('Opening editor');
    
}

function onChangeView() {
    $('.gallery').toggle('hide');
    $('.editor').toggle('hide');
}

// test on upload image
function onUploadMeme() {
    // debugger
    const selectedFile = document.getElementById('add_meme').files[0];
    console.log('selected file : ', selectedFile);
    const objectURL = window.URL.createObjectURL(selectedFile);
    // const objectURL = window.URL.createObjectURL(fileObj);
    gMemes.push(createMeme(objectURL, ['happy']))
    renderMemes()
}
// End of gallery funcs

function onCaptionChange(el) {
    updateCaption(+el.dataset.id, el.innerText);
}
