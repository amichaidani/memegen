function onSelectMeme(el) {
    changeSelectedMeme(el.dataset["id"]); // Model update
    console.log('data-set: ', el.dataset["id"]);
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

function onAddMemeRequest () {
    $('.upload-meme-btn').toggle('.hide')
    $('section.add-meme').toggle('.hide')
}
function onUploadMeme() {

    const selectedFile = document.getElementById('add_meme').files[0];
    const objectURL = window.URL.createObjectURL(selectedFile);
    let keywords = ['happy', 'funny', 'mad', 'warning']
    addMeme(objectURL, keywords)
    renderMemes()
    $('.add-meme label').text('Add another Meme')
}