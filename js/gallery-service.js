'use strict'

// TO DO : 
// The user may also filter the list by selecting a keyword from a
//  list where each word size is determined by the popularity
//   of the keyword search (make an initial “random” setup so it will look good from the start):
// Start editing , key words, 

var gMemes = [
    { id: 1, url: 'img/eddie.jpg', keywords: ['preaching'] },
    { id: 2, url: 'img/man.jpg', keywords: ['happy'] },
    { id: 3, url: 'img/man.jpg', keywords: ['sad'] },
    { id: 4, url: 'img/man.jpg', keywords: ['sad'] },
];

var gSelectedMeme = null;

function changeSelectedMeme(id) {
    gSelectedMeme = getMemeById(id);
}

function getMemeById(id) {
    // debugger
    let searchedImgIdx = gMemes.findIndex(img => img.id === +id)
    return gMemes[searchedImgIdx]
}