'use strict'

var gNextMemeId = 1
// TO DO : 
// The user may also filter the list by selecting a keyword from a
//  list where each word size is determined by the popularity
//   of the keyword search (make an initial “random” setup so it will look good from the start):
// Start editing , key words, 
// Add keyword input to keywords cloud
// keys of gkeywords map to lower case

var gMemes = [];
var gKeywords = [];
var gKeywordsMap = {} // Mapping the search freq of each keyword.
const MIN_KEY_WORD_FONT_SIZE = 14;
const MAX_KEY_WORD_FONT_SIZE = 40;

var gSelectedMeme = null;

function createMeme(url, keywords) {
    let meme = {
        id: gNextMemeId,
        url: url,
        keywords: keywords
    }
    gNextMemeId++
    return meme
}

function createGMemes() {
    gMemes.push(createMeme('img/man.png', ['smiling']));
    gMemes.push(createMeme('img/meme3.jpg', ['crying', 'sad']));
    gMemes.push(createMeme('img/meme4.jpg', ['teaching', 'in nature']));
    gMemes.push(createMeme('img/meme5.jpg', ['wondering', 'thinking']));
}


function createKeywords() {
    gMemes.forEach(meme => {
        meme.keywords.forEach(keyword => gKeywords.push(keyword));
    });
}

function createKeywordsMap() {
    gKeywords.forEach(keyword => {
        let searchCount = getRandomIntInclusive(6, 12)
        gKeywordsMap[keyword] = {
            searchCount: searchCount,
            fontSize: searchCount * 2
        }
    })
}

function changeSelectedMeme(id) {
    gSelectedMeme = getMemeById(id);
}

function getSelectedMeme() {
    return gSelectedMeme;
}

function getMemeById(id) {
    let searchedImgIdx = gMemes.findIndex(img => img.id === +id)
    return gMemes[searchedImgIdx]
}

function getKeywordsStrHTMLs() {

    let strHTMLs = []
    gKeywords.forEach(keyword => {
        let KeywordToDiplay = keyword.charAt(0).toUpperCase() + keyword.substring(1, keyword.length)
        let strHTML = `<span class="${keyword}" style= "font-size:${gKeywordsMap[keyword].fontSize}px">${KeywordToDiplay}</span>`
        strHTMLs.push(strHTML)
    })

    strHTMLs = strHTMLs.join('')
    return strHTMLs
}

function getMemesStrHTMLs() {
    let strHTMLs = []
    gMemes.forEach(meme => {
        let strHTML = `<div style="background-image: url(${meme.url})" data-id="${meme.id}" class="meme-img" onclick="onSelectMeme(this)"></div>`
        strHTMLs.push(strHTML)
    })

    strHTMLs = strHTMLs.join('')
    return strHTMLs
}

function addMeme(url, keywords) {   // User adds new Meme
    gMemes.unshift(createMeme(url, keywords))
    keywords.forEach((keyword) => updateKeywords(keyword))
}

function updateKeywords(keyword) {
    let keywordIdx = gKeywords.findIndex(word => word === keyword)
    if (keywordIdx !== -1) {
        gKeywordsMap[keyword].searchCount++
        changeFontSizeToKeywords(keywordIdx, keyword)
    } else {
        gKeywords.unshift(keyword);
        gKeywordsMap[keyword] = { searchCount: 1, fontSize: MIN_KEY_WORD_FONT_SIZE }
    }
}

function changeFontSizeToKeywords(idx, word) {
    let fontSize = gKeywordsMap[word].searchCount * 2
    if (fontSize < MAX_KEY_WORD_FONT_SIZE) {
        if (fontSize > MIN_KEY_WORD_FONT_SIZE) gKeywordsMap[word].fontSize = fontSize;
    }
        gKeywords.splice(idx, 1);
        gKeywords.forEach(keyword => {
            let fontSize = gKeywordsMap[keyword].fontSize;
            if (fontSize >= MIN_KEY_WORD_FONT_SIZE) {
                gKeywordsMap[keyword].fontSize -= 0.1 * fontSize;
            }
        })
        gKeywords.unshift(word);
    }