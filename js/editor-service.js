'use strict'

var gCaptions = [];
var gCaptionNextId = 0;

function createDefaultCaptions() {
    gCaptions = [];
    createCaption('Heading Top');
    createCaption('Heading Bottom');
}

function placeDefaultCaptions(canvasDimensions) {
    gCaptions.forEach((caption, index) => {
        caption.x = canvasDimensions.width / 2;
        if (index === 0) {
            caption.y = caption.fontSize + 20;
        } else {
            caption.y = canvasDimensions.height - caption.fontSize + 20;
        }
    })
}

function createCaption(txt, canvasDimensions) {
    let caption = {
        id: gCaptionNextId++,
        txt: txt,
        textWidth: 0,
        align: 'center',
        x: (canvasDimensions) ? canvasDimensions.width / 2 : 0,
        y: (canvasDimensions) ? canvasDimensions.height / 2 : 0,
        fontSize: 50,
        fontFamily: 'Impact',
        color: '#ffffff',
        strokeColor: '#000000',
        strokeWidth: 2,
    }
    gCaptions.push(caption);
    return caption;
}

function getClickedCaption(coords) {
    let clickedCaption = gCaptions.find(caption => {
        if (caption.align === 'center') {
            return (coords.x >= caption.x - (caption.textWidth / 2)
                && coords.x <= caption.x + (caption.textWidth / 2)
                && coords.y >= caption.y - caption.fontSize
                && coords.y <= caption.y)
        }
        if (caption.align === 'left') {
            return (coords.x >= caption.x
                && coords.x <= caption.x
                && coords.y >= caption.y - caption.fontSize
                && coords.y <= caption.y)
        }
    });
    return clickedCaption;
}

function updateCaptionMeasureText(id, width) {
    let caption = getCaptionById(id);
    caption.textWidth = width;
}

function updateCaptionCoords(id, coords) {
    let caption = getCaptionById(id);
    caption.x = coords.x;
    caption.y = coords.y;
}

function deleteCaption(id) {
    let captionIndex = getCaptionIdxById(id);
    gCaptions.splice(captionIndex, 1);
}

function getCaptionIdxById(id) {
    let foundCaption = gCaptions.findIndex((caption) => {
        return caption.id === id;
    })
    return foundCaption;
}

function getCaptionById(id) {
    let foundCaption = gCaptions.find((caption) => {
        return caption.id === id;
    })
    return foundCaption;
}

function getCaptions() {
    return gCaptions;
}

function changeCaptionColor(id, color) {
    let caption = getCaptionById(id);
    caption.color = color;
}

function captionLarger(id) {
    let caption = getCaptionById(id);
    if (caption.fontSize >= 90) return false;
    caption.fontSize += 10;
    return caption.fontSize;
}

function captionSmaller(id) {
    let caption = getCaptionById(id);
    if (caption.fontSize <= 10) return false;
    caption.fontSize -= 10;
    return caption.fontSize;
}

function updateCaptionText(id, newTxt) {
    let caption = getCaptionById(id);
    caption.txt = newTxt;
}