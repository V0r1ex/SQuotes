const buttonchangeTheme = document.querySelector('#changeTheme')
const globalStyle = document.documentElement

if (sessionStorage.getItem('darkTheme')) changeTheme(buttonchangeTheme)

function changeTheme(buttonchangeTheme) {
    if (buttonchangeTheme.classList.contains('darkTheme')) {
        buttonchangeTheme.innerHTML = '<i class="fa fa-moon-o" aria-hidden="true"></i>'
        globalStyle.style.setProperty('--headerFooterBackground', 'rgba(193, 221, 253, 0.5)')
        globalStyle.style.setProperty('--bodyBackgroundColor', 'rgba(25,155,231,1)')
        globalStyle.style.setProperty('--bodyBackground', 'linear-gradient(180deg, rgba(25,155,231,1) 0%, rgba(34,0,255,0.4) 70%)')
        globalStyle.style.setProperty('--toolsButtonColor', 'rgba(193, 221, 253, 0.8)')
        globalStyle.style.setProperty('--registrationBackgroundColor', 'rgb(25,155,231)')
        globalStyle.style.setProperty('--registrationBackground', 'linear-gradient(180deg, rgb(25,155,231) 0%, rgba(34,0,255,0.4) 70%)')
        globalStyle.style.setProperty('--baseButtonBackgroundColor', 'rgb(197,239,255)')
        globalStyle.style.setProperty('--baseButtonBackground', 'linear-gradient(180deg, rgba(197,239,255,1) 0%, rgba(104,227,255,0.6) 4%, rgba(182,154,246,0.9) 100%)')
        globalStyle.style.setProperty('--pageBackground', 'rgba(193, 221, 253, 0.5)')
        sessionStorage.removeItem('darkTheme')
    }
    else {
        buttonchangeTheme.innerHTML = '<i class="fa fa-sun-o" aria-hidden="true"></i>'
        globalStyle.style.setProperty('--headerFooterBackground', 'rgba(6, 16, 28, 0.5)')
        globalStyle.style.setProperty('--bodyBackgroundColor', 'rgb(12, 37, 54)')
        globalStyle.style.setProperty('--bodyBackground', 'linear-gradient(0deg, rgb(58, 46, 86) 0%, rgb(12, 37, 54) 100%)')
        globalStyle.style.setProperty('--toolsButtonColor', 'rgba(34, 68, 106, 0.8)')
        globalStyle.style.setProperty('--registrationBackgroundColor', 'rgb(62, 66, 112)')
        globalStyle.style.setProperty('--registrationBackground', 'linear-gradient(180deg, rgb(62, 66, 112) 0%, rgba(25, 20, 48, 0.8) 70%)')
        globalStyle.style.setProperty('--baseButtonBackgroundColor', 'rgb(62, 100, 126)')
        globalStyle.style.setProperty('--baseButtonBackground', 'linear-gradient(180deg, rgb(97, 114, 145) 0%, rgba(62, 100, 126, 0.6) 4%, rgba(107, 81, 167, 0.9) 100%)')
        globalStyle.style.setProperty('--pageBackground', 'rgba(46, 82, 122, 0.5)')
        sessionStorage.setItem('darkTheme', 'true')
    }
    buttonchangeTheme.classList.toggle('darkTheme')
}
