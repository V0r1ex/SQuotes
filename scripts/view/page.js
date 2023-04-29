const page = `
    <div class="headerCard">
        <h3 contenteditable="true" spellcheck="false" onblur='setEditDate(this.closest(".card")); dumpSession()'>Заголовок</h3>
        <div class="buttons">
            <input name="color" id="color" type="color" onchange="dumpSession()" value="#5b5d7a" oninput='setCardColor(this.value, this.parentElement.parentElement.parentElement); this.setAttribute("value", this.value)'>
            <button class="cardButton" onclick='this.parentElement.querySelector("#getFile").click()'><i class="fa fa-file-image-o" aria-hidden="true"></i></button>
            <input type="file" accept="image/png, image/jpeg" name="file" id="getFile" style="display:none" onchange="updateBackground(this, this.parentElement.parentElement.parentElement)"> 
            <button class="cardButton" id="deleteCard" onclick="removeCard(this.parentElement.parentElement.parentElement)"><i class="fa fa-trash" aria-hidden="true"></i></button>
            <button class="cardButton" id="copyCard" onclick="copyCard(this.parentElement.parentElement.parentElement)"><i class="fa fa-clone" aria-hidden="true"></i></button>
            <button class="cardButton" id="saveCard" onclick='sessionStorage.setItem("copyiedCard", this.closest(".card").outerHTML)'><i class="fa fa-files-o" aria-hidden="true"></i></button>
            <button class="cardButton" id="setTag" onclick="tagsPanel(this.parentElement.parentElement.parentElement)"><i class="fa fa-filter" aria-hidden="true"></i></button>
            <input type="range" class="rangeBackground" min="0" max="100" value="50" oninput='changeCardBackgroundSize(this); this.setAttribute("value", this.value)'>
        </div>
    </div>
    <div class="mainCard">
        <div class="componentContainer">
            <div class="component">
                <div class="content" contenteditable="true" onfocusin='this.parentElement.classList.add("focus")' spellcheck="false" onblur='setEditDate(this.closest(".card")); dumpSession()'>Ваш текст</div>
                <div class="componentButtons">
                    <button class="removeComponent" onclick="removeComponent(this.parentElement.parentElement)"><i class="fa fa-times" aria-hidden="true"></i></button>
                    <button class="copyComponent" onclick="copyComponent(this.parentElement.parentElement)"><i class="fa fa-clone" aria-hidden="true"></i></button>
                    <button class="arrowButton" onclick="translateComponentLeft(this.parentElement.parentElement)"><i class="fa fa-arrow-left" aria-hidden="true"></i></button>
                    <button class="arrowButton" onclick="translateComponentRight(this.parentElement.parentElement)"><i class="fa fa-arrow-right" aria-hidden="true"></i></button>
                    <div class="additional-btns">
                        <button class="checboxItem" onclick="checkbox(this)"><i class="fa fa-check-square" aria-hidden="true"></i></button>
                        <button class="olItem" onclick="ol(this)"><i class="fa fa-list-ol" aria-hidden="true"></i></button>
                        <button class="ulItem" onclick="ul(this)"><i class="fa fa-list-ul" aria-hidden="true"></i></button>
                        <button class="font-size-inc" onclick="incFZ(this)">oO</button>
                        <button class="font-size-dec" onclick="decFZ(this)">Oo</button>
                        <input class="color" name="color" id="color" type="color" oninput='setColorComponentTxt(this); this.setAttribute("value", this.value)'>
                    </div>
                </div>
            </div>
        </div>
        <div class="buttonsContainer">
            <button id="addTextComponent" class="toolsButton" onclick='addComponent(this, this.parentElement.parentElement.parentElement, "description")'><i class="fa fa-plus" aria-hidden="true"></i><span>TXT</span></button>
            <input id="addImgComponent" type="file" accept="image/png, image/jpeg" name="file" style="display:none" onchange='addComponent(this, this.parentElement.parentElement, "img")'> 
            <button class="toolsButton" onclick='this.parentElement.querySelector("#addImgComponent").click()'><i class="fa fa-plus" aria-hidden="true"></i><span>IMG</span></button>
            <input id="addVideoComponent" type="file" accept="video/mp4" name="file" style="display:none" onchange='addComponent(this, this.parentElement.parentElement, "video")'> 
            <button id="addVideo" class="toolsButton" onclick='this.parentElement.querySelector("#addVideoComponent").click()'><i class="fa fa-plus" aria-hidden="true"></i><span>VIDEO</span></button>
            <input id="addAudioComponent" type="file" accept="audio/mp3" name="file" style="display:none" onchange='addComponent(this, this.parentElement.parentElement, "audio")'> 
            <button id="addAudio" class="toolsButton" onclick='this.parentElement.querySelector("#addAudioComponent").click()'><i class="fa fa-plus" aria-hidden="true"></i><span>AUDIO</span></button>
        </div>
    </div>
    <div class="footerCard">
        <div class="createDate"></div>
        <div class="editDate"></div>
    </div>
    <div class="panel">
        <input class="cardButton searchCard" type="search" placeholder="Введите тег" spellcheck="false" oninput="searchAllTags(this, this.parentElement)">
        <button class="cardButton closePanel" onclick='this.parentElement.style.visibility = "hidden"; this.parentElement.querySelectorAll(".tagContainer").forEach(tagContainer => tagContainer.style.visibility = "hidden"); dumpSession()'><i class="fa fa-times" aria-hidden="true"></i></button>
        <div class="tags"></div>
        <button class="cardButton" id="addTag" onclick='addTag(this.parentElement)'><i class="fa fa-plus" aria-hidden="true"></i></button>
    </div>`

const modalTutorialInner = `
<h3 class="tutorial__title">Руководство</h3>
<button class="baseForm closeModal" onclick='closeModal("modalTutorial")'><i class="fa fa-times" aria-hidden="true"></i></button>
<div class="tutorial__container">
    <img class="tutorial__image" src="../resources/images/tutor-1.png" alt="image">
    <div class="tutorial__row">
        <img class="tutorial__image" src="../resources/images/tutor-2.png" alt="image">
        <img class="tutorial__image" src="../resources/images/tutor-3.png" alt="image">
    </div>
    <img class="tutorial__image" src="../resources/images/tutor-4.png" alt="image">
</div>
`

const filters = document.querySelector('.filters')
const cards = document.querySelector('.cards')
const main = document.querySelector('main')

if (getCookie('token')) {
    ajaxGet('/getPage').then(data => {
        if (data.page_inner) cards.innerHTML = data.page_inner
        states = [cards.innerHTML]
        setDefaultToCard(cards)
    }) 
}
 
const selectFilters = document.querySelector('.selectFilters')

document.addEventListener('click', (event) => {
	const withinBoundaries = event.composedPath().includes(selectFilters)
	if (!withinBoundaries ) {
		selectFilters.classList.remove('isActive')
	}
})

function addCard() {
    const newCard = document.createElement('div')
    const randomCardID = randomID()
    newCard.setAttribute('_id', randomCardID)
    newCard.innerHTML = page
    newCard.querySelector('.createDate').textContent = `Создано: ${new Date().toLocaleDateString()}`
    setEditDate(newCard)
    setCardParams(newCard)
    dumpSession()
}

function removeLastCard() {
    const cardsArr = cards.querySelectorAll('.card')
    if (cardsArr.length > 0) {
        const lastCard = cardsArr[cardsArr.length-1]
        detectCardFileOnPage(lastCard)
        ajaxPost('/updateFileSys', { files: [...new Set(Array.from(document.querySelectorAll('[namefile]')).map(el => el.getAttribute('namefile')))] })
        cards.removeChild(lastCard)
        dumpSession()
    }
}

function removeAllCards() {
    cards.innerHTML = document.querySelector('.backgroundContainer').outerHTML
    ajaxPost('/updateFileSys', { files: [...new Set(Array.from(document.querySelectorAll('[namefile]')).map(el => el.getAttribute('namefile')))] })
    dumpSession()
}

function shuffleCards() {
    let allCards = Array.from(cards.querySelectorAll('.card'))
    allCards = shuffle(allCards)
    cards.innerHTML = document.querySelector('.backgroundContainer').outerHTML
    for (let card of allCards) {
        cards.appendChild(card)
    }
    dumpSession()
}

function searchAllCard(search) {
    const searchValue = search.value.toLocaleLowerCase()
    const headers = cards.querySelectorAll('h3')
    for (let header of headers) {
        let card = header.parentElement.parentElement
        if (!header.textContent.toLocaleLowerCase().includes(searchValue)) {
            card.style.visibility = 'hidden'
            card.style.display = 'none'
        } else {
            card.style.visibility = 'visible'
            card.style.display = 'flex'
        }
    }
}

function changeBackgroundSize(input) {
    const backgroundContainer = document.querySelector('.backgroundContainer')
    backgroundContainer.style.backgroundSize = `${input.value}% auto`
    document.body.style.backgroundSize = `${input.value}% auto`
    if (input.value == 0) {
        backgroundContainer.style.background = 'var(--bodyBackground)' 
        document.body.style.backgroundImage = 'var(--bodyBackground)' 
    }
    dumpSession()
}

function setDefaultToCard(cards) {
    const backgroundContainer = document.querySelector('.backgroundContainer')
    const strikeSpans = document.querySelectorAll('span.strike')
    strikeSpans.forEach(el => el.previousElementSibling.checked = true)
    if (backgroundContainer.style.backgroundImage) {
        document.body.style.backgroundSize = `${getComputedStyle(backgroundContainer).getPropertyValue('background-size')} auto`
        document.body.style.backgroundImage = `url(../${getCookie('username')}/${getCookie('page_id')}/${document.querySelector('.backgroundContainer').getAttribute('namefile')})`
    }
    for (let card of cards.querySelectorAll('.card')) {
        card.querySelectorAll('.tagContainer').forEach(el => {
            if (el.classList.contains('selectedTag')) el.querySelector('.tagSelect').checked = true
        })
        if (card.style.backgroundImage && card.style.backgroundImage != 'none') card.style.backgroundImage = `url(../${getCookie('username')}/${getCookie('page_id')}/${card.getAttribute('namefile')})`
        drugAndDrop(card)
    }
    const videos = cards.querySelectorAll('video')
    const images = cards.querySelectorAll('img')
    const audios = cards.querySelectorAll('audio')
    audios.forEach(audio => audio.src = `../${getCookie('username')}/${getCookie('page_id')}/${audio.getAttribute('namefile')}`)
    images.forEach(image => image.src = `../${getCookie('username')}/${getCookie('page_id')}/${image.getAttribute('namefile')}`)
    for (let video of videos) {
        video.src = `../${getCookie('username')}/${getCookie('page_id')}/${video.getAttribute('namefile')}`
        video.addEventListener('playing', () => video.style.animation = 'linearGradientMove .3s infinite linear')
        video.addEventListener('pause', () => video.style.animation = '')
    }
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]]
    }
    return array
}

function saveFile(file, element) {
    element.setAttribute('namefile', file.name)
    ajaxPost('/createFilePath', { page_id: getCookie('page_id'), file_name: file.name })
    ajaxPostFile(file)
}

function showFilters(select) {
    let nameFilters = Array.from(document.querySelectorAll('.tagContainer')).filter(el => el.classList.contains('selectedTag'))
    let oldNameFilters = Array.from(filters.children).filter(el => el.classList.contains('isActive')).map(el => el.textContent)
    nameFilters = nameFilters.map(el => el.querySelector('.tag').textContent)
    nameFilters = [...new Set(nameFilters)]
    filters.innerHTML = ''
    for (let nameFilter of nameFilters) {
        if (oldNameFilters.includes(nameFilter)) filters.innerHTML += `<div class="filter isActive">${nameFilter}</div>`
        else filters.innerHTML += `<div class="filter">${nameFilter}</div>`
    }
    for (let filter of document.querySelectorAll('.filter')) {
        filter.addEventListener('click', () => filterCards(filter))
    }
    select.classList.toggle('isActive')
    if (nameFilters.length == 0) addModal('Создайте и активируйте фильтры.', 'warning')
}

function filterCards(filter) {
    filter.classList.toggle('isActive')
    for (let card of cards.querySelectorAll('.card')) {
        if (filter.classList.contains('isActive')) {
            let nameFilters = Array.from(card.querySelectorAll('.tagContainer')).filter(el => el.classList.contains('selectedTag') && el.querySelector('.tag').textContent === filter.textContent)
            if (nameFilters.length == 0) {
                card.style.visibility = 'hidden'
                card.style.position = 'absolute'
                card.querySelector('.panel').style.visibility = 'hidden'
            }  
        } else {
            card.style.visibility = 'visible'
            card.style.position = 'relative' 
        } 
    }
}

function openTutorialModal() {
    for (let child of document.querySelector('.box').children) {
        child.style.filter = 'blur(15px)'
    }
    const modal = document.createElement('div')
    modal.className = 'modalTutorial'
    modal.innerHTML = modalTutorialInner
    document.body.appendChild(modal)
}




