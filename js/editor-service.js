gCaptions = [];
gCaptionNextId = 0;

function createDefaultCaptions() {
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
        color: '#fff',
        strokeColor: '#000',
        strokeWidth: 4
    }
    gCaptions.push(caption);
    return caption;
}

function updateCaption(id, newTxt) {
    let caption = getCaptionById(id)
    caption.txt = newTxt;
}

function deleteCaption(id)[
    let caption = getCaptionById(id);
]

function getCaptionById(id) {
    let foundCaption = gCaptions.find((caption) => {
        return caption.id === id;
    })
    return foundCaption;
}

function getCaptions() {
    return gCaptions;
}