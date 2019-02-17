'use strict'
const MIN_KEY_WORD_FONT_SIZE = 14;
const MAX_KEY_WORD_FONT_SIZE = 40;

function galleryControllerInit() {
    createKeywords();
    createKeywordsMap();
    renderKeywords();
    renderDropDownList();

}

function onSelectMeme(el) {
    changeSelectedMeme(el.dataset["id"]); // Model update
    onEditMeme();
}

function renderMemes(memes) {
    let strHTMLs = getMemesStrHTMLs(memes);
    $('.grid-container').html(strHTMLs);
}

function onSelectKeyword(input) {
    if (typeof (input) === 'str') {
        onKeywordSearch(input);
        onFilterMemes(input);
    } else {
        onKeywordSearch(input[0]);
        onFilterMemes(input[0]);
    }

}

function clickOnDropDownLi() {
    let input = document.getElementById('meme-search');
    let filter = input.value.toUpperCase();
    let ul = document.getElementById('drop-down-list');
    let li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (let i = 0; i < li.length; i++) {
        let a = li[i].getElementsByTagName("a")[0];
        let txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
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
    if (ev.key === 'Enter') onKeywordSearch(value);
    onFilterMemes(value);
    clickOnDropDownLi()
    document.querySelector('ul.drop-down-list').classList.remove('hide')
}
function onKeywordSearch(searchedWord) {
    if (searchedWord.length === 0) return

    let str = searchedWord.toLowerCase();
    let regex = /([a-z])\w*/g;
    let matchedKeywords = str.match(regex)
    if (matchedKeywords) {
        str.match(regex).forEach(keyword => updateKeywords(keyword))
        renderKeywords();
    } else alert('Sorry, only ABC English characters are being supported at the moment')
}

function onFilterMemes(str) {
    let memesToDiplay = filterMemes(str);
    if (memesToDiplay.length !== 0) renderMemes(memesToDiplay)
}

function renderKeywords() {
    let keywords = getKeywords();
    let keywordsMap = getKeywordsMap();
    let strHTMLs = getKeywordsStrHTMLs(keywords, keywordsMap);
    let elContainer = document.querySelector('.tags-container')
    elContainer.innerHTML = strHTMLs
    $(elContainer).hide(); //Jquery is been used here for animations purposes
    $(elContainer).fadeIn();


    function getKeywordsStrHTMLs(keywords, keywordsMap) {

        let strHTMLs = []
        keywords.forEach(keyword => {
            let KeywordToDiplay = keyword.charAt(0).toUpperCase() + keyword.substring(1, keyword.length)
            let strHTML = `<span class="${keyword}" style= "font-size:${keywordsMap[keyword].fontSize}px" onclick="onSelectKeyword(this.classList)" onmouseover="onHoverKeyword(this.classList)">${KeywordToDiplay}</span>`
            strHTMLs.push(strHTML)
        })

        strHTMLs = strHTMLs.join('')
        return strHTMLs
    }
}

function onHoverKeyword(elClass) {
    let elKeyword = document.querySelector(`.tags-container .${elClass[0]}`)
    elKeyword.classList.toggle('tada')
}

function renderDropDownList() {
    let elList = document.querySelector('.drop-down-list');
    let keywords = getKeywords();
    let strHTMLs = getListStrHTMLs(keywords);
    elList.innerHTML = strHTMLs

    function getListStrHTMLs(keywords) {
        let strHTMLs = []
        keywords.forEach(keyword => {
            let KeywordToDiplay = keyword.charAt(0).toUpperCase() + keyword.substring(1, keyword.length);
            let strHTML = ` <li class=""><a class="${keyword}" onmousedown="onSelectKeyword(this.classList)" >${KeywordToDiplay}</a></li>`
            strHTMLs.push(strHTML);
        })
        strHTMLs = strHTMLs.join('')
        return strHTMLs
    }
}


function hideDropDownList() {
    let elList = document.querySelector('ul.drop-down-list');
    elList.classList.add('hide');
}

function onUploadMeme() {
    let str = prompt('Please type Keywords (seperated by space) to describe the Meme');
    str = str.toLowerCase();
    let keywords = str.split(' ');
    const selectedFile = document.getElementById('add_meme').files[0];
    const objectURL = window.URL.createObjectURL(selectedFile);
    addMeme(objectURL, keywords);
    renderMemes();
    renderKeywords();
}

function hideModal() {
    let elModal = document.querySelector('.modal')
    elModal.classList.add('hide')
    elModal.style.display="none"
}