const navbar = document.querySelector('.nav__mobile-list')
const navBtn = document.querySelector('.nav__mobile_btn')
//const scrollBtn = document.querySelector('.scroll-btn')

// скрытие/показ кнопки прокрутки
// window.addEventListener('scroll', showScrollButton)
// function showScrollButton() {
//     if (window.scrollY > 500) scrollBtn.style.animation = 'appearance 1s forwards'   
//     else if(getComputedStyle(scrollBtn).getPropertyValue('opacity') > 0)  scrollBtn.style.animation = 'disappearance 1s forwards'
// }

// скрытие навбара
document.addEventListener('click', (event) => {
	const withinBoundaries = event.composedPath().includes(navbar) || event.composedPath().includes(navBtn)
	if (!withinBoundaries) {
		navbar.classList.remove('open')
	}
})

// анимация для навбара
navBtn.onclick = () => {
    navbar.style.display = 'flex'
    navbar.classList.toggle('open')
}
