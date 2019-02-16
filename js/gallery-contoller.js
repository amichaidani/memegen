function onSelectMeme(el) {
    changeSelectedMeme(el.dataset["id"]); // Model update
    onEditMeme();
}

function renderMemes() {
    let strHTMLs = getStrHTMLs();
    $('.grid-container').html(strHTMLs)
}

function onEditMeme() {
    renderCanvas();
    onChangeView();
}

// Upload meme

function onAddMemeRequest() {
    $('.upload-meme-btn').hide();
    $('.add-meme-section').show();
}
function onUploadMeme(ev) {
    let str = prompt('Please type Keywords sepersted by space to describe Meme')
    let keywords = str.split(' ')
    const selectedFile = document.getElementById('add_meme').files[0];
    const objectURL = window.URL.createObjectURL(selectedFile);
    gMemes.push(createMeme(objectURL, keywords))
    renderMemes()
}