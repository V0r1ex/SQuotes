const autorizatedUser = `
<div class="linksAutorizated">
    <a onclick="getWindowAt(registrationWindow)">Создать аккаунт</a>
    <a onclick="getWindowAt(editPasswordInner)">Изменить пароль</a>
    <a onclick="exit()">Выйти</a>
</div>
`
const unAutorizatedUser = `<div class="buttons">
<form onsubmit="return false;">
    <div class="inputs">
        <input type="text" placeholder="Имя пользователя" style="width: 200px; height: 28px;" class="baseForm baseInput" required>
        <input type="password" placeholder="Пароль" style="width: 200px; height: 28px;" class="baseForm baseInput" required>
    </div>
    <button id="logIn" class="baseForm baseButton" onclick="autorization(this.parentElement)">Войти</button>
</form>  
</div>
<div class="links">
    <a onclick="getWindowAt(registrationWindow)">Нет аккаунта?</a> 
</div>`

const editPasswordInner = `
<h3>Смена пароля</h3>
<button id="closeRegistration" class="baseButton baseForm" onclick='closeModal("registration")'><i class="fa fa-times" aria-hidden="true"></i></button>
<form onsubmit="return false;">
    <label for="password">Прошлый пароль</label>
    <input  type="password" name="password" required>
    <label for="newPassword">Новый пароль</label>
    <input  type="password" name="newPassword" required>
    <label for="secondNewPassword">Повтор пароля</label>
    <input type="password" name="secondNewPassword" required>
    <button class="baseForm baseButton" onclick="changePassword()">Сменить пароль</button>
</form>
`

if (getCookie('token')) {
    ajaxGet('/getUserName').then(data => {
        logIn(data.name)
    })
}

if(window.location.href.includes('contact'))
    document.querySelector('a[href="/contact"]').style.textDecoration = 'underline'
else if(window.location.href.includes('about'))
    document.querySelector('a[href="/about"]').style.textDecoration = 'underline'
else if(window.location.href.includes('pages'))
    document.querySelector('a[href="/pages"]').style.textDecoration = 'underline'
else 
    document.querySelector('a[href="/"]').style.textDecoration = 'underline'

function autorization(form) {
    const inputs = form.querySelectorAll('input')
    inputs.forEach(element => element.style.animation = '')
    const [ name, password ] = [ inputs[0].value, inputs[1].value ]
    try {
        ajaxPost('/postAutorization', { name, password }).then(data => {
            if (data.body == 'success') {
                 window.location.reload()
            } else {
                addModal('Неверный логин или пароль.', 'error')
                inputs[0].style.animation = 'uncorrectPassword 1s ease-in-out infinite forwards'  
                inputs[1].style.animation = 'uncorrectPassword 1s ease-in-out infinite forwards'  
            }
        })
    } catch {
        addModal('Неверный логин или пароль.', 'error')
    }
}

function logIn(userName) {
    document.querySelector('.header-form-outer').innerHTML = `
    <div class="user-icon__container" title="icon">
        <button class="user-icon_btn" onclick="this.parentElement.querySelector('#user-icon_input').click();"><i class="fa fa-user-circle" aria-hidden="true"></i></button>
        <input id="user-icon_input" type="file" accept="image/png, image/jpeg" name="file" style="display:none" onchange="updateUserIcon(this)"> 
    </div>
    
    ` + document.querySelector('.header-form-outer').innerHTML 
    const urlIcon = `/${getCookie("username")}/icon.png`
    if (fileExists(urlIcon)) {
        const iconBtn = document.querySelector('.user-icon_btn')
        iconBtn.style.backgroundImage = `url('../${urlIcon}')`
        iconBtn.innerHTML = ''
        iconBtn.style.border = '2px solid #fff'
    }
    document.querySelector('.autorization').innerHTML = `<div class="username">${userName}</div>` + autorizatedUser  
}

function changePassword() {
    const inputs = document.querySelector('.registration').querySelectorAll('input')
    inputs.forEach(element => element.style.animation = '')
    const [password, newPassword, secondNewPassword] = [inputs[0].value, inputs[1].value, inputs[2].value]
    if (newPassword == secondNewPassword) {
        const passwordValid = onValidPassword(newPassword)
        if (passwordValid) {
            ajaxPost('/postChangePassword', { password, newPassword }).then(data => {
                if (data.body == 'success') {
                    addModal('Вы успешно сменили пароль.', 'ok')
                } else if (data.body == 'repeat_error') {
                    addModal('Новый пароль совпадает со старым.', 'error')
                }
                else addModal('Указан неверный пароль.', 'error')
            })
        } else {
            addModal('Пароль должен содержать только латинские буквы, цифры и _. Минимальная длина пароля 6 символов.', 'error')
            inputs[1].style.animation = 'uncorrectPassword 1s ease-in-out infinite forwards' 
        }
    } else {
        inputs[2].style.animation = 'uncorrectPassword 1s ease-in-out infinite forwards'   
        addModal('Повторный пороль не верен.', 'error')
    }
}

function updateUserIcon(input) { 
    const file = input.files[0]
    let url = URL.createObjectURL(file)
    const iconBtn = input.parentElement.querySelector('.user-icon_btn')
    iconBtn.innerHTML = ''
    iconBtn.style.backgroundImage = `url(${url})`
    iconBtn.style.border = '2px solid #fff'
    ajaxPostFile(file, '/saveIcon')
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ))
    return matches ? decodeURIComponent(matches[1]) : undefined
}
