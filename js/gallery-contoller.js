function galleryControllerInit() {
    createKeywords();
    createKeywordsMap();
    renderKeywords();
}

function onSelectMeme(el) {
    changeSelectedMeme(el.dataset["id"]); // Model update
    onEditMeme();
}

function renderMemes(memes) {
    if (!memes) memes = gMemes;
    let strHTMLs = getMemesStrHTMLs(memes);
    $('.grid-container').html(strHTMLs)
}

function onEditMeme() {
    initEditor();
}

function onKeywordSearch(searchedWord) {
    let str = searchedWord.toLowerCase();
    let regex = /([a-z])\w*/g;
    str.match(regex).forEach(keyword => updateKeywords(keyword))
    renderKeywords();
}
function onFilterMemes(str) {
    let memesToDiplay = filterMemes(str); 
    renderMemes(memesToDiplay)  
}

function renderKeywords() {
    let strHTMLs = getKeywordsStrHTMLs();
    let elContainer = document.querySelector('.tags-container')
    elContainer.innerHTML = strHTMLs
    $(elContainer).hide();
    $(elContainer).fadeIn()
}

function onUploadMeme() {
    let str = prompt('Please type Keywords sepersted by space to describe Meme')
    let keywords = str.split(' ')
    const selectedFile = document.getElementById('add_meme').files[0];
    const objectURL = window.URL.createObjectURL(selectedFile);
    addMeme(objectURL, keywords)
    renderMemes()
}