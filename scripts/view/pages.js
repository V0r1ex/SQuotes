const pageInner = `<div class="page">
<img src="" alt="">
<div class="footer-card">
    <button id="removePage" class="baseForm" onclick="removePage(this.parentElement.parentElement)"><i class="fa fa-trash" aria-hidden="true"></i></button>
    <h3 contenteditable onkeydown="enterInHeader(event)" spellcheck="false" onblur="dumpSession()">Page 0 name</h3>
    <button id="editNamePage" class="baseForm" isEditing="true" onclick="dumpSession(); savePageInCookies(this.parentElement.parentElement)"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>
</div>
</div>`

const main = document.querySelector('main')
const pagesContainer = main.querySelector('.pagesContainer')
const addNoteButton = main.querySelector('#addNote')
const removeNoteButton = main.querySelector('#removeNote')

addNoteButton.addEventListener('click', addPage)
removeNoteButton.addEventListener('click', removeLastPage)

if (getCookie('token')) {
    ajaxGet('/getPages').then(data => {
        pagesContainer.innerHTML = data.pages_inner 
        ajaxGet('/getUserName').then(data => setIconsToPages(data.name))
    })
}

// Создание страницы
function addPage() {
    pagesContainer.innerHTML += pageInner
    pagesContainer.lastChild.querySelector('h3').textContent = `Page ${pagesContainer.children.length} name`
    pagesContainer.lastChild.setAttribute('_id', randomID())
    ajaxPost('/addPage', { idPage: pagesContainer.lastChild.getAttribute('_id') })
    dumpSession()
}

// Удаление последней страницы
function removeLastPage() {
    const pages = pagesContainer.querySelectorAll('.page')
    if (pages.length > 0) {
        pagesContainer.removeChild(pages[pages.length-1])
        ajaxPost('/removePage', { page_id: pages[pages.length-1].getAttribute('_id')})
        dumpSession()
    }
}

// Удаление выбранной страницы
function removePage(page) {
    pagesContainer.removeChild(page)
    ajaxPost('/removePage', { page_id: page.getAttribute('_id')})
    dumpSession()
}

// enter в заголовке страницы
function enterInHeader(event) {
    if (event.keyCode == 13) { 
        event.preventDefault()
        document.activeElement.blur() 
    }
}

// сохранение id выбранной карточки в куки
function savePageInCookies(page) {
    document.cookie = "page_id=;expires=" + new Date(0).toUTCString()
    document.cookie = `page_id=${page.getAttribute('_id')};path=/`
    window.location.href = '/pages/page'
}

// выгрузка иконок страницам из файловой структуры
function setIconsToPages(name) {
    const pages = pagesContainer.querySelectorAll('.page')
    for (let page of pages) {
        page.querySelector('img').src = `${name}/${page.getAttribute('_id')}.png`
    }
}

// сохранение всех изменений
function dumpSession() {
    if (getCookie('token')) {
        ajaxPost('/savePages', { pages_inner: pagesContainer.innerHTML })
    }
}


