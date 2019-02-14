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

function onChangeView() {
    $('.gallery').toggle('hide');
    $('.editor').toggle('hide');
}

// test on upload image
function onUploadMeme() {
    // debugger
    const selectedFile = document.getElementById('add_meme').files[0];
    console.log('selected file : ', selectedFile);
    const objectURL = window.URL.createObjectURL(selectedFile);
    // const objectURL = window.URL.createObjectURL(fileObj);
    gMemes.push(createMeme(objectURL, ['happy']))
    renderMemes()
}
// End of gallery funcs

function onCaptionChange(el) {
    updateCaption(+el.dataset.id, el.innerText);
}
