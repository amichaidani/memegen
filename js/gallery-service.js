'use strict'

// TO DO : 
// The user may also filter the list by selecting a keyword from a
//  list where each word size is determined by the popularity
//   of the keyword search (make an initial “random” setup so it will look good from the start):
// Start editing , key words, 

var gMemes = [
    { id: 1, url: 'img/eddie.jpg', keywords: ['preaching'] },
    { id: 2, url: 'img/man.png', keywords: ['happy'] },
    { id: 3, url: 'img/man.png', keywords: ['sad'] },
    { id: 4, url: 'img/man.png', keywords: ['sad'] }
];
// url('../img/eddie.jpg');

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
    console.log('strhtmls: ', strHTMLs);
    return strHTMLs
}