const tag = `
<div class="tag" contenteditable="true" spellcheck="false" onblur="dumpSession()">Tag</div>
<div class="tagButtons">
    <input class="tagSelect" type="checkbox" onclick="setTag(this.parentElement.parentElement)">
    <button class="cardButton closePanel" onclick="removeTag(this.parentElement.parentElement)"><i class="fa fa-times" aria-hidden="true"></i></button>
</div>
`

function removeCard(card) {
    card.parentElement.removeChild(card)
    ajaxPost('/updateFileSys', { files: [...new Set(Array.from(cards.querySelectorAll('[namefile]')).map(el => el.getAttribute('namefile')))] })
    detectCardFileOnPage(card)
    dumpSession()
}

function detectCardFileOnPage(card) {
    let files = cards.querySelectorAll('[namefile]')
    let cardFiles = card.querySelectorAll('[namefile]')
    let target
    cardFiles.forEach(el => {
        target = false
        files.forEach(el2 => {
            console.log(el.getAttribute('namefile'), el2.getAttribute('namefile'))
            if (el.getAttribute('namefile') !== el2.getAttribute('namefile')) {}
            else target = true
        })
        if (target) ajaxPost('/removeFile', { fileCode: el.getAttribute('namefile')})
    })
}

function copyCard(card) {
    const copyCard = card.cloneNode(true)
    const randomCardID = randomID()
    copyCard.setAttribute('_id', randomCardID)
    setCardParams(copyCard)
    dumpSession()
}

function updateBackground(input, element=document.querySelector('.backgroundContainer')) {
    let url = URL.createObjectURL(input.files[0])
    if (element.className == 'card') setEditDate(element)
    else {
        document.body.style.backgroundImage = `url(${url})`
    }
    element.style.backgroundImage = `url(${url})`
    saveFile(input.files[0], element)
    ajaxPost('/updateFileSys', { files: [...new Set(Array.from(document.querySelectorAll('[namefile]')).map(el => el.getAttribute('namefile')))] })
    dumpSession()
}

function changeCardBackgroundSize(input) {
    let card = input.parentElement.parentElement.parentElement
    card.style.backgroundSize = `${input.value}% auto` 
    if (input.value == 0) {
        input.closest('.card').querySelector('#getFile').value = ''
        card.style.backgroundImage = 'none'
        card.style.backgroundSize = '100%'
    }
}

function setCardColor(colorHex, card) {
    let colorHsl = fromHexToHsl(colorHex)  //получаем hsl
    const buttons = card.querySelectorAll('button')
    for (let button of buttons) {
        button.style.color = 'hsla(' + colorHsl[0] + ', ' +  (colorHsl[1]-30) + '%, ' + (colorHsl[2]-30) + '%, ' + '1)'
        button.style.backgroundColor = 'hsla(' + colorHsl[0] + ', ' +  (colorHsl[1]-10) + '%, ' + (colorHsl[2]-10) + '%, ' + '1)'
        button.style.borderColor = 'hsla(' + colorHsl[0] + ', ' +  (colorHsl[1]-30) + '%, ' + (colorHsl[2]-30) + '%, ' + '1)'
    } 
    card.querySelector('.rangeBackground').style.backgroundColor = 'hsla(' + colorHsl[0] + ', ' +  (colorHsl[1]-30) + '%, ' + (colorHsl[2]-20) + '%, ' + '1)'
    card.querySelector("input[type='range'].rangeBackground").style.setProperty('--range-color', 'hsla(' + colorHsl[0] + ', ' +  (colorHsl[1]+10) + '%, ' + (colorHsl[2]+20) + '%, ' + '1)')
    card.querySelector('#color').style.borderColor = 'hsla(' + colorHsl[0] + ', ' +  (colorHsl[1]-30) + '%, ' + (colorHsl[2]-30) + '%, ' + '1)'
    // const audio = card.querySelectorAll('audio')
    // if (audio.length > 0) audio.forEach(el => el.style.setProperty('--audio-bgc', 'hsla(' + colorHsl[0] + ', ' +  (colorHsl[1]-10) + '%, ' + (colorHsl[2]-10) + '%, ' + '1)'))
    card.style.backgroundColor = 'hsla(' + colorHsl[0] + ', ' +  colorHsl[1] + '%, ' + colorHsl[2] + '%, ' + '1)'
    card.style.color = 'hsla(' + colorHsl[0] + ', ' +  (colorHsl[1]-30) + '%, ' + (colorHsl[2]-30) + '%, ' + '1)'
}

function setColorComponentTxt(input) {
    const colorHsl = fromHexToHsl(input.value)  //получаем hsl
    const component = input.closest('.component')
    component.style.color = 'hsla(' + colorHsl[0] + ', ' +  (colorHsl[1]-30) + '%, ' + (colorHsl[2]-30) + '%, ' + '1)'
}

//скрываем активный компонент
document.addEventListener('click', (event) => {
    const selected = document.querySelector('.component.focus')
    if (selected) {
        if (!event.composedPath().includes(selected)) 
            selected.classList.remove('focus')
    }
})
function addComponent(input, card, element) {
    setEditDate(card.parentElement)
    let componentContainer = card.querySelector('.componentContainer')
    let component = document.createElement('div')
    component.className = 'component'
    let newElement
    if (element === 'description')  {
        component.innerHTML += `<div class="content" onfocusin='this.parentElement.classList.add("focus")' contenteditable="true" spellcheck="false" onblur='setEditDate(this.closest(".card")); dumpSession()'>Ваш текст</div>`
    }
    else if (element === 'img') {
        newElement = document.createElement('img')
    } else if (element === 'audio') {
        newElement = document.createElement('audio')
        newElement.controls = 'true'
        component.innerHTML += `<div class="audio-name">${input.files[0].name.split('.')[0]}</div>`
        newElement.controlsList="nodownload noplaybackrate"
    } else {
        newElement = document.createElement('video')
        newElement.controls = 'true'
        newElement.addEventListener('playing', () => newElement.style.animation = 'linearGradientMove .3s infinite linear')
        newElement.addEventListener('pause', () => newElement.style.animation = '')
    }
    if (element !== 'description') {
        newElement.setAttribute('namefile', input.files[0].name)
        let url = URL.createObjectURL(input.files[0])
        newElement.src = url 
        newElement.setAttribute('type', input.files[0].type.replace('/', '').replace(/video|image|audio/i, ''))
        saveFile(input.files[0], newElement)
        component.appendChild(newElement)
        input.value = ''
    }
    const buttons = document.createElement('div')
    component.appendChild(buttons)
    buttons.outerHTML = `<div class="componentButtons">
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
                        </div>`
    componentContainer.appendChild(component)
    dumpSession()
}

function checkbox(btn) {
    btn.classList.toggle('isCheckbox')
    const component = btn.closest('.component')
    resetContent(component)
    const divs = Array.from(component.querySelector('.content').children)
    if (btn.classList.contains('isCheckbox'))  {
        const text = component.innerText.split('\n')[0]
        divs.forEach(el => el.innerHTML = `<input type="checkbox" onclick='this.nextSibling.classList.toggle("strike")'><span>${el.textContent}</span>`)
        if (divs.length < component.querySelector('.content').innerText.split('\n').length) component.innerHTML = component.innerHTML.replace(text, `<div><input type="checkbox" onclick='this.nextSibling.classList.toggle("strike")'><span>${text}</span></div>`) 
    }
    else {
        const content = component.querySelector('.content')
        Array.from(content.querySelectorAll('input')).forEach(el => el.remove())
        content.innerHTML = content.innerHTML.replaceAll(`<input type="checkbox" onclick='this.nextSibling.classList.toggle("strike")'>`, '') 
    }
}

function ol(btn) {
    const component = btn.closest('.component').querySelector('.content')
    let divs = Array.from(component.children)
    if (!btn.classList.contains('isOl')) {
        resetContent(component)
        const text = component.innerText.split('\n')[0]
        component.innerHTML = component.innerHTML.replace(text, `<div>${text}</div>`) 
        component.innerHTML = '<ol>' + component.innerHTML 
        divs = Array.from(component.querySelector('ol').children)
        divs.forEach(el => el.outerHTML = `<li><span>${el.textContent}</span></li>`)
        component.innerHTML = component.innerHTML + '</ol>' 
    }
    else {
        resetContent(component)
    }
    btn.classList.toggle('isOl')
    dumpSession()
}

function ul(btn) {
    const component = btn.closest('.component').querySelector('.content')
    let divs = Array.from(component.children)
    if (!btn.classList.contains('isUl')) {
        resetContent(component)
        const text = component.innerText.split('\n')[0]
        component.innerHTML = component.innerHTML.replace(text, `<div>${text}</div>`) 
        component.innerHTML = '<ul>' + component.innerHTML
        divs = Array.from(component.querySelector('ul').children)
        divs.forEach(el => el.outerHTML = `<li><span>${el.textContent}</span></li>`)
        component.innerHTML = component.innerHTML + '</ul>' 
    }
    else {
        resetContent(component)
    }
    btn.classList.toggle('isUl')
    dumpSession()
}

function incFZ(btn) {
    const component = btn.closest('.component')
    component.style.fontSize = parseInt(getComputedStyle(component).getPropertyValue('font-size'))+1+'px'
    dumpSession()
}

function decFZ(btn) {
    const component = btn.closest('.component')
    component.style.fontSize = parseInt(getComputedStyle(component).getPropertyValue('font-size'))-1+'px'
    dumpSession()
}

function resetContent(component) {
    const listItems = Array.from(component.querySelectorAll('li'))
    listItems.forEach(el => el.innerHTML = el.outerHTML = `<div>${el.textContent}</div>`)
    component.innerHTML = component.innerHTML.replace(/<ul>|<\/ul>/g, '')
    component.innerHTML = component.innerHTML.replace(/<ol>|<\/ol>/g, '')
}

function translateComponentLeft(component) {
    setEditDate(component.closest('.card'))
    try { component.parentElement.insertBefore(component, component.previousSibling) } catch {}
    dumpSession()
}

function translateComponentRight(component) {
    setEditDate(component.closest('.card'))
    try { component.parentElement.insertBefore(component.nextSibling, component) } catch {}
    dumpSession()
}

function removeComponent(component) {
    component.closest('.card').querySelector('.buttonsContainer').querySelectorAll('input').forEach(input => input.value = '')
    setEditDate(component.closest('.card'))
    component.parentElement.removeChild(component)
    ajaxPost('/updateFileSys', { files: [...new Set(Array.from(document.querySelectorAll('[namefile]')).map(el => el.getAttribute('namefile')))] })
    dumpSession()
}

function copyComponent(component) {
    const cloneComponent = component.cloneNode(true)
    component.parentElement.appendChild(cloneComponent)
}

function tagsPanel(card) {
    card.querySelectorAll('.tagContainer').forEach(tag => tag.style.visibility = 'visible')
    card.querySelectorAll('.tagContainer').forEach(tag => tag.style.position = 'static')
    card.querySelector('.panel').querySelector('.searchCard').value = ''
    card.querySelector('.panel').style.visibility = "visible"
    dumpSession()
}

function searchAllTags(input, panel) {
    const searchValue = input.value.toLocaleLowerCase()
    const tags = panel.querySelectorAll('.tagContainer')
    for (let tag of tags) {
        if (!tag.textContent.toLocaleLowerCase().includes(searchValue)) {
            tag.style.visibility = 'hidden'
            tag.style.position = 'absolute'
        } else {
            tag.style.visibility = 'visible'
            tag.style.position = 'relative'
        }
    }
}

function setTag(tagContainer) {
    tagContainer.classList.toggle("selectedTag")
    dumpSession()
}

function removeTag(tagContainer) {
    tagContainer.parentElement.removeChild(tagContainer)
    dumpSession()
}

function addTag(panel) {
    const newTag = document.createElement('div')
    newTag.className = "tagContainer"
    newTag.innerHTML = tag
    panel.querySelector('.tags').appendChild(newTag)
    dumpSession()
}

function setEditDate(card) {
    card.querySelector('.editDate').textContent = `Изменено: ${new Date().toLocaleDateString()}`
}

function setCardParams(card) {
    const videos = card.querySelectorAll('video')
    for (let video of videos) {
        video.addEventListener('playing', () => video.style.animation = 'linearGradientMove .3s infinite linear')
        video.addEventListener('pause', () => video.style.animation = '')
    }
    card.className = 'card'
    drugAndDrop(card)
    cards.appendChild(card)
}

