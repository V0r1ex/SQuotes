const registrationWindow = `
<h3>Регистрация</h3>
<button id="closeRegistration" class="baseButton baseForm" onclick="closeModal('registration')"><i class="fa fa-times" aria-hidden="true"></i></button>
<form onsubmit="return false;">
    <label for="username">Логин</label>
    <input  type="text" name="username" required>
    <label for="password">Пароль</label>
    <input  type="password" name="password" required>
    <label for="secondPassword">Повторите пароль</label>
    <input type="password" name="secondPassword" required>
    <div class="rememberCheck">
        <input type="checkbox" name="remember">
        <label for="secondPassword">Запомнить меня</label>
    </div>
    <button class="baseForm baseButton" onclick="registration()">Зарегистрироваться</button>
</form>
`

function getWindowAt(windowInner) {
    for (let child of document.querySelector('.box').children) {
        child.style.filter = 'blur(15px)'
    }
    const at = document.createElement('div')
    at.className = 'registration'
    at.innerHTML = windowInner
    document.body.appendChild(at)
}

function closeModal(modalClass) {
    for (let child of document.querySelector('.box').children) {
        child.style.filter = ''
    }
    const modal = document.querySelector('.' + modalClass)
    document.body.removeChild(modal)
}

function registration() {
    const inputs = document.querySelector('.registration').querySelectorAll('input')
    inputs.forEach(element => element.style.animation = '')
    const checkbox = document.querySelector('.registration').querySelector('input[type="checkbox"]').checked
    const [name, password, secondPassword] = [inputs[0].value.trim(), inputs[1].value, inputs[2].value]
    if (password === secondPassword && name && password) {
        const usernameVaild = onValidUsername(name)
        const passwordValid = onValidPassword(password)
        if (usernameVaild && passwordValid) {
            ajaxPost('/postRegistration', {name: name, password: password, user_secondPassword: secondPassword, save: checkbox})
            .then(data => {
                if (data) {
                    window.location.reload()
                } else addModal(`Пользователь с ником ${name} уже существует.`, 'error')
            })
        } else if (!usernameVaild) {
            addModal('Имя пользователя должно содержать только латинские буквы, цифры и _', 'error')
            inputs[0].style.animation = 'uncorrectPassword 1s ease-in-out infinite forwards'   
        } else if  (!passwordValid) {
            addModal('Пароль должен содержать только латинские буквы, цифры и _. Минимальная длина пароля 6 символов.', 'error')
            inputs[1].style.animation = 'uncorrectPassword 1s ease-in-out infinite forwards'   
        }
    } else if (!password || !secondPassword || !name) {
        addModal('Введите данные.', 'error')
    } else if(password != secondPassword) {
        inputs[2].style.animation = 'uncorrectPassword 1s ease-in-out infinite forwards'   
        addModal('Повторный пароль не верен.', 'error')
    } 
}

function exit() {
    ajaxGet('/exit')
    window.location.reload()
}

const onValidUsername = (username) => {
    const usernameRegex = /^[a-z0-9_]+$/
    return usernameRegex.test(username)
}

const onValidPassword = (password) => {
    const passwordRegex = /^[a-z0-9_]{6,}$/
    return passwordRegex.test(password)
}

