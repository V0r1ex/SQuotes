const links = document.querySelectorAll('li a')
let states = ['<div class="backgroundContainer"></div>']

for (let link of links) {
    link.addEventListener('click', (e) => {
        e.preventDefault()
        dumpSessionRedirect(link)
    })
}

function dumpSession() {
    states.push(document.querySelector('.cards').innerHTML)
    let files = Array.from(cards.querySelectorAll('[namefile]'))
    let fileNames = [...new Set(files.map(el => el.getAttribute('namefile')))]
    // Здесь будет сохранение файлов на страницу
    savePageIcon().then(data => {
        ajaxPost('/savePage', { page_inner: cards.innerHTML, page_icon: data }) 
    })
}

function dumpSessionRedirect(link) {
    states.push(document.querySelector('.cards').innerHTML)
    let oldCardsInner = cards.innerHTML
    resetPageStyles()
    savePageIcon().then(data => {
        ajaxPost('/savePage', { page_inner: oldCardsInner, page_icon: data }) 
        window.location = link.getAttribute('href')
    })
}

function returnState() {
    if (states.length > 1) {
        states.splice(states.length-1, 1)
        cards.innerHTML = states[states.length-1]
    } else cards.innerHTML = states[0]
}
