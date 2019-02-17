'use strict'
// meme6  , Say-That-Again-I-Dare-You
// meme7 , 1950s-middle-finger.jpg
var gNextMemeId = 1
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
    gMemes.push(createMeme('img/meme1.jpg', ['smiling']));
    gMemes.push(createMeme('img/meme3.jpg', ['crying', 'sad']));
    gMemes.push(createMeme('img/meme5.jpg', ['wondering', 'thinking']));
    gMemes.push(createMeme('img/meme6.jpg', ['wondering', 'thinking']));
    gMemes.push(createMeme('img/meme7.jpg', ['wondering', 'thinking']));
    gMemes.push(createMeme('img/meme8.jpg', ['wondering', 'thinking']));
    gMemes.push(createMeme('img/meme9.jpg', ['wondering', 'thinking']));
    gMemes.push(createMeme('img/meme10.jpg', ['wondering', 'thinking']));
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

function getMemes () {
    return gMemes;
}

function getKeywords () {
    return gKeywords
}

function getKeywordsMap () {
    return gKeywordsMap
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

function filterMemes(str) {
    let chars = str.toLowerCase();
    let memesToDiplay = [];
    if (str.length === 0) return memesToDiplay = gMemes
    gMemes.forEach(meme => {
        meme.keywords.forEach(keyword => {
            if (keyword.substring(0, chars.length) === chars) {
                memesToDiplay.push(meme);
            }
        })
    })
    return memesToDiplay;
}