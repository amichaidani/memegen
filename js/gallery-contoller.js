function galleryControllerInit() {
    createKeywordsMap();
    renderKeywords();
}

function onSelectMeme(el) {
    changeSelectedMeme(el.dataset["id"]); // Model update
    onEditMeme();
}

function renderMemes() {
    let strHTMLs = getMemesStrHTMLs();
    $('.grid-container').html(strHTMLs)
}

function onEditMeme() {
    initEditor();
}

function onKeywordSearch(searchedWord) {
    let str = searchedWord.toLowerCase()
    let regex = /([a-z])\w*/g
    firstWord = str.match(regex)[0]
    updateKeywords(firstWord)
}

function renderKeywords() {
    let strHTMLs = getKeywordsStrHTMLs();
    let elContainer = document.querySelector('.tags-container')
    elContainer.innerHTML = strHTMLs
}

// Upload meme
function onAddMemeRequest() {
    $('.upload-meme-btn').hide();
    $('.add-meme-section').show();
}
function onUploadMeme(ev) {
    let str = prompt('Please type Keywords sepersted by space to describe Meme')
    let keywords = str.split(' ')
    const selectedFile = document.getElementById('add_meme').files[0];
    const objectURL = window.URL.createObjectURL(selectedFile);
    addMeme(objectURL, keywords)
    renderMemes()
}