function drugAndDrop (element) {  
  let copy = document.querySelector('.cardDruging')
  if (copy) element.parentNode.removeChild(copy)
  
  element.onmousedown = function(event) {
    event = event || window.event
    let target = event.target || event.srcElement
    let shiftX = event.pageX  - element.getBoundingClientRect().left
    let shiftY = event.pageY - element.getBoundingClientRect().top - scrollY
    if (this == target && element.offsetHeight - shiftY > 20) { //если клик был только по блоку, а не по элментам внутри
      element.style.visibility = 'hidden'
      let elementLeftBefore = element.getBoundingClientRect().left //положение до переноса
      let elementCopy = element.cloneNode(true)
      element.parentNode.appendChild(elementCopy)
      let cursorX
      moveAt(event.pageX, event.pageY) 
      elementCopy.style.position = 'absolute'
      elementCopy.className ='card cardDruging'
      elementCopy.style.zIndex = '100'
      elementCopy.style.margin = '0'
      elementCopy.style.visibility = 'visible'
      elementCopy.style.animation = 'sizing .5s forwards'

      function moveAt(pageX, pageY) {
        elementCopy.style.left = pageX - shiftX + 'px'
        elementCopy.style.top = pageY - shiftY + 'px'
      }
    
      function onMouseMove(event) {
        if (cursorX > event.pageX && cursorX - event.pageX > 1) elementCopy.style.rotate = '30deg'
        else if (cursorX < event.pageX && cursorX - event.pageX < -1) elementCopy.style.rotate = '-30deg'
        moveAt(event.pageX, event.pageY)
        if (cursorX && Math.abs(cursorX - event.pageX) <= 1) {
          elementCopy.style.rotate = '0deg'
        }
        cursorX = event.pageX
      }
    
      document.addEventListener('mousemove', onMouseMove)
      
      elementCopy.onmouseup = function() {
        let cards = document.querySelectorAll('.card')
        let cardsBiggerX = []
        let elementLeft = elementCopy.getBoundingClientRect().left
        let elementTop = elementCopy.getBoundingClientRect().top
        for (let i = 0; i < cards.length-1; i++) {
          let cardLeft = cards[i].getBoundingClientRect().left
          let cardTop = cards[i].getBoundingClientRect().top
          if (elementLeft - cardLeft < 300 && elementTop - cardTop < 300) {
            if (elementLeft - cardLeft < -100) cardsBiggerX.push(cards[i]) //если карта слева
            else if (elementTop - element.getBoundingClientRect().top > -200) cardsBiggerX.push(cards[i+1]) //если карта сверху
            else cardsBiggerX.push(cards[i])
            break
          }     
        }
        element.parentNode.insertBefore(element, cardsBiggerX[0]) //если справа есть элементы

        elementCopy.parentNode.removeChild(elementCopy)
        element.style.visibility = 'visible'
        document.removeEventListener('mousemove', onMouseMove);
        elementCopy.onmouseup = null

        let elementLeftAfter = element.getBoundingClientRect().left //положение после переноса
        if (elementLeftBefore != elementLeftAfter) dumpSession()
      }
    }    
  }
}





