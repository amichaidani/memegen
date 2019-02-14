'use strict'

console.log('Service Works');

// TO DO : 
// The user may also filter the list by selecting a keyword from a
//  list where each word size is determined by the popularity
//   of the keyword search (make an initial “random” setup so it will look good from the start):

var gImgs = [
    { id: 1, url: 'img/eddie.jpg', keywords: ['preaching'] },
    { id: 2, url: 'img/man.jpg', keywords: ['happy'] },
    { id: 3, url: 'img/man.jpg', keywords: ['sad'] },

];
var gMeme = {
    selectedImgId: 1,
    txts: [{
        line: 'I never eat Falafel',
        size: 20, align: 'left',
        color: 'red'
    }]
}

