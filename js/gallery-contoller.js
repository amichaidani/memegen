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
    let strHTMLs = getMemesStrHTMLs(memes);
    $('.grid-container').html(strHTMLs)
}

function getMemesStrHTMLs(memes) {
    if (!memes) memes = getMemes();
    let strHTMLs = []
    memes.forEach(meme => {
        let strHTML = `<div style="background-image: url(${meme.url})" data-id="${meme.id}" class="meme-img" onclick="onSelectMeme(this)"></div>`
        strHTMLs.push(strHTML)
    })
    strHTMLs = strHTMLs.join('')
    return strHTMLs
}

function onEditMeme() {
    initEditor();
}
function onSearch(value, ev) {
    if (ev.key === 'Enter')  onKeywordSearch(value); 
    onFilterMemes(value);
}
function onKeywordSearch(searchedWord) {
    if (searchedWord.length === 0) return

    let str = searchedWord.toLowerCase();
    let regex = /([a-z])\w*/g;
    let matchedKeywords = str.match(regex)
    if (matchedKeywords) {
        str.match(regex).forEach(keyword => updateKeywords(keyword))
        renderKeywords();
    } else alert ('Sorry, only ABC English characters are being supported at the moment')
}

function onFilterMemes(str) {
    let memesToDiplay = filterMemes(str);
    if (memesToDiplay.length !== 0) renderMemes(memesToDiplay)
}

function renderKeywords() {
    let keywords = getKeywords();
    let keywordsMap = getKeywordsMap ();
    let strHTMLs = getKeywordsStrHTMLs(keywords, keywordsMap);
    let elContainer = document.querySelector('.tags-container')
    elContainer.innerHTML = strHTMLs
    $(elContainer).hide(); //Jquery is been used here for animations purposes
    $(elContainer).fadeIn();
}


function getKeywordsStrHTMLs(keywords, keywordsMap) {

    let strHTMLs = []
    keywords.forEach(keyword => {
        let KeywordToDiplay = keyword.charAt(0).toUpperCase() + keyword.substring(1, keyword.length)
        let strHTML = `<span class="${keyword}" style= "font-size:${keywordsMap[keyword].fontSize}px">${KeywordToDiplay}</span>`
        strHTMLs.push(strHTML)
    })

    strHTMLs = strHTMLs.join('')
    return strHTMLs
}

function onUploadMeme() {
    let str = prompt('Please type Keywords (seperated by space) to describe the Meme')
    let keywords = str.split(' ')
    const selectedFile = document.getElementById('add_meme').files[0];
    const objectURL = window.URL.createObjectURL(selectedFile);
    addMeme(objectURL, keywords)
    renderMemes();
    renderKeywords();
}