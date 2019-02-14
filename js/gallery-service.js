'use strict'

var gNextMemeId = 1
// TO DO : 
// The user may also filter the list by selecting a keyword from a
//  list where each word size is determined by the popularity
//   of the keyword search (make an initial “random” setup so it will look good from the start):
// Start editing , key words, 
// Add keyword input to keywords cloud

var gMemes = [];
var gKeywords = {}

function createGMemes() {
    gMemes.push(createMeme('img/eddie.jpg', ['preaching']))
    gMemes.push(createMeme('img/man.png', ['sad']))
    gMemes.push(createMeme('img/meme3.jpg',['preaching', 'mad']))
    gMemes.push(createMeme('img/meme4.jpg',['preaching', 'fighting']))
    gMemes.push(createMeme('img/meme5.jpg', ['preaching', 'fighting']))
}

function createMeme(url, keywords) {
    let meme = {
        id: gNextMemeId,
        url: url,
        keywords: keywords
    }
    gNextMemeId++
    return meme
}


var gSelectedMeme = null;

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

function getStrHTMLs() {
    let strHTMLs = []
    gMemes.forEach(meme => {
        let strHTML = `<div style="background-image: url(${meme.url})" data-id="${meme.id}" class="meme-img" onclick="onSelectMeme(this)"></div>`
        strHTMLs.push(strHTML)
    })

    strHTMLs = strHTMLs.join('')
    return strHTMLs
}