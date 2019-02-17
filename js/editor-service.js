gCaptions = [];
gCaptionNextId = 0;

function createDefaultCaptions() {
    gCaptions = [];
    createCaption('Heading Top');
    createCaption('Heading Bottom');
}

function createCaption(txt) {
    let caption = {
        id: gCaptionNextId++,
        txt: txt,
        x: 0,
        y: 0,
        fontSize: 50,
        fontFamily: 'Impact',
        color: '#ffffff',
        strokeColor: '#000000',
        strokeWidth: 2,
        textWidth: 0,
        align: 'center'
    }
    gCaptions.push(caption);
    return caption;
}

function getClickedCaption(coords) {
    let clickedCaption = gCaptions.find(caption => {
        return (coords.x >= caption.x
            && coords.x <= caption.x + caption.textWidth
            && coords.y >= caption.y - caption.fontSize
            && coords.y <= caption.y)
    });
    return clickedCaption;
}

function updateCaptionMeasureText(id, width) {
    let caption = getCaptionById(id);
    caption.textWidth = width;
}

function updateCaption(id, newTxt) {
    let caption = getCaptionById(id)
    caption.txt = newTxt;
}

function deleteCaption(id) {
    let captioniDx = getCaptionIdxById(id);
    gCaptions.splice(captioniDx, 1);
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