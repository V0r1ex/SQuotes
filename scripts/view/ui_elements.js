for (let child of document.querySelector('.box').children) {
    child.style.filter = 'blur(15px)'
}

const button = document.querySelector('#scrollToTop')

if (button) window.addEventListener('scroll', showScrollButton)

document.addEventListener('keydown', (event) => {
    let copyiedCard = sessionStorage.getItem('copyiedCard')
    if (!event.ctrlKey && event.keyCode == 86 && copyiedCard) {
        const newCard = copyElement(copyiedCard).firstChild
        setCardParams(newCard)
        dumpSession()
    }
})

for (let child of document.querySelector('.box').children) {
    child.style.transition = '0.4s'
}

window.onload = () => {
    for (let child of document.querySelector('.box').children) {
        child.style.filter = ''
    }
    document.querySelector('.loading').style.display = 'none'
}

function showScrollButton() {
    if (window.scrollY > 500) {
        button.style.animation = 'appearance 1s forwards'   
    } else 
        button.style.animation = 'disappearance 1s forwards'
}

const modalsContainer = document.querySelector('.modals-container')
function addModal(txt, className) {
    const modal = document.createElement('div')
    if (className === 'ok') modal.innerHTML = '<i class="fa fa-check-circle" aria-hidden="true"></i>' + txt
    else if(className === 'warning') modal.innerHTML = '<i class="fa fa-info-circle" aria-hidden="true"></i>' + txt
    else modal.innerHTML = '<i class="fa fa-exclamation-circle" aria-hidden="true"></i>' + txt
    modal.className = `base-modal ${className}`
    modalsContainer.appendChild(modal)
    modal.style.animation = 'appearance 1s forwards' 
    modal.addEventListener('click', () => modalsContainer.removeChild(modal)) 
    setTimeout(() => {
        if (modal.parentElement == modalsContainer) {
            modal.style.animation = 'disappearance 1s forwards'
            setTimeout(() => modalsContainer.removeChild(modal), 1000)
        }
    }, 2000) 
}

function scrollWindowToTop() {
    let coffScroll = 10
    let start = setInterval(() => {
        if (window.scrollY > 0) {
            coffScroll += 0.7
            document.documentElement.scrollTop = window.scrollY - coffScroll
        }
        else clearInterval(start)
    }, 1)
}

function randomID() {
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    let ID = ''
    for (let i = 0; i < 10; i++) {
        let random = numbers[Math.floor(Math.random() * numbers.length)]
        ID += random
    }
    return ID
}

function copyElement(outerHTML) {
    let frag = document.createDocumentFragment()
    let elem = document.createElement('div')
    elem.innerHTML = outerHTML
    while (elem.childNodes[0]) {
        frag.appendChild(elem.childNodes[0])
    }
    return frag
}

function fileExists(url) {
    if(url){
        var req = new XMLHttpRequest();
        req.open('GET', url, false);
        req.send();
        return req.status==200;
    } else {
        return false;
    }
}