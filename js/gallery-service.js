'use strict'
// meme6  , Say-That-Again-I-Dare-You
// meme7 , 1950s-middle-finger.jpg
// meme 12 Oprah-You-Get-A
// meme 13 patrcik
// meme 14 putin
// 
var gNextMemeId = 1
var gMemes = [];
var gKeywords = [];
var gKeywordsMap = {} // Mapping the search freq of each keyword.
// const MIN_KEY_WORD_FONT_SIZE = 14;
// const MAX_KEY_WORD_FONT_SIZE = 40;

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

function createKeywords() {
    let keywords = [];
    gMemes.forEach(meme => {
        meme.keywords.forEach(keyword => keywords.push(keyword));
    });  
    gKeywords = [...new Set(keywords)]; 
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
    gKeywords.splice(idx, 0, word);
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
    let uniqueMemesToDisplay = [...new Set(memesToDiplay)]; 
    return uniqueMemesToDisplay;
}


// Adding memes to gallery

function createGMemes() {
    gMemes.push(createMeme('img/meme1.jpg', ['snicky']));
    gMemes.push(createMeme('img/meme2.jpg', ['bossing', 'trump','leader']));
    gMemes.push(createMeme('img/meme3.jpg', ['sad', 'crying']));
    gMemes.push(createMeme('img/meme4.jpg', ['nature', 'kids']));
    gMemes.push(createMeme('img/meme5.jpg', ['wondering', 'thinking']));
    gMemes.push(createMeme('img/meme6.jpg', ['one_more_time', 'jackson']));
    gMemes.push(createMeme('img/meme8.jpg', ['leader', 'politics']));
    gMemes.push(createMeme('img/meme9.jpg', ['comics', 'frog']));
    gMemes.push(createMeme('img/meme10.jpg', ['amen', 'woman']));
    gMemes.push(createMeme('img/meme11.jpg', ['evil', 'percise']));
    gMemes.push(createMeme('img/meme12.jpg', ['woman', 'actor']));
    gMemes.push(createMeme('img/meme13.jpg', ['patrick', 'laughing']));
    gMemes.push(createMeme('img/meme14.jpg', ['putin', 'lecturing']));
    gMemes.push(createMeme('img/meme15.jpg', ['toys', 'kids']));
    gMemes.push(createMeme('img/meme16.jpg', ['dogs', 'love']));
    gMemes.push(createMeme('img/meme17.jpg', ['dogs', 'babies','love']));
    gMemes.push(createMeme('img/meme18.jpg', ['babies', 'beach','mad']));
    gMemes.push(createMeme('img/meme19.jpg', ['cat', 'sleep']));
    gMemes.push(createMeme('img/meme20.jpg', ['comedian']));
    gMemes.push(createMeme('img/meme21.jpg', ['babies', 'far_east']));
    gMemes.push(createMeme('img/meme22.jpg', ['told_you','media']));
    gMemes.push(createMeme('img/meme23.jpg', ['mad', 'scared','shout']));
    gMemes.push(createMeme('img/meme24.jpg', ['lecturing', 'media']));
    gMemes.push(createMeme('img/meme25.jpg', ['evil', 'finger']));
    gMemes.push(createMeme('img/meme26.jpg', ['think', 'actor']));
    gMemes.push(createMeme('img/meme27.jpg', ['kids', 'africa']));
    gMemes.push(createMeme('img/meme28.jpg', ['trump', 'fuck_you']));
    gMemes.push(createMeme('img/meme29.jpg', ['babies', 'amazed']));
    gMemes.push(createMeme('img/meme30.jpg', ['dogs', 'yoga']));
    gMemes.push(createMeme('img/meme31.jpg', ['happy', 'smiling','leader']));
    gMemes.push(createMeme('img/meme32.jpg', ['sport', 'hard','challenge']));
    gMemes.push(createMeme('img/meme33.jpg', ['drink', 'actor']));
    gMemes.push(createMeme('img/meme34.jpg', ['media', 'nature']));
}