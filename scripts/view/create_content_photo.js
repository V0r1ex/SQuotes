function savePageIcon() {
    return html2canvas(cards).then(function(canvas) {
        const img = convertCanvasToImage(canvas)
        return img
    }) 
}

function convertCanvasToImage(canvas) {
    let dataURL = canvas.toDataURL()
    return dataURL
}

function resetPageStyles() {
    if (!document.querySelector('.backgroundContainer').style.backgroundImage) {
        if (sessionStorage.getItem('darkTheme')) cards.style.background = 'rgb(12, 37, 54)'
        else cards.style.background = 'rgb(79, 149, 241)'
    }
    cards.querySelectorAll('input[type="color"]').forEach(input => input.outerHTML = '<div class="changeColorForCanvas"></div>') 
    cards.querySelectorAll('.card').forEach(card => card.style.boxShadow = 'none')
}





