function galleryControllerInit() {
    createKeywordsMap();
    renderKeywords();
}

function onSelectMeme(el) {
    changeSelectedMeme(el.dataset["id"]); // Model update
    console.log('data-set: ', el.dataset["id"]);
    onEditMeme();
}

function renderMemes() {
    let strHTMLs = getMemesStrHTMLs();
    $('.grid-container').html(strHTMLs)
}

function onEditMeme() {
    renderCanvas();
    onChangeView();
}

function onKeywordSearch (searchedWord) {
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
    $('.upload-meme-btn').toggle('.hide')
    $('.add-meme-section').toggle('.hide')
}
function onUploadMeme() {

    const selectedFile = document.getElementById('add_meme').files[0];
    const objectURL = window.URL.createObjectURL(selectedFile);
    let keywords = ['happy', 'funny', 'mad', 'warning']
    addMeme(objectURL, keywords)
    renderMemes()
    $('.add-meme-section label').text('Add another Meme')
}