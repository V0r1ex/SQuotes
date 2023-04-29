const db = require('./db')
const file_manager = require('../file_manager.js')
const fm = new file_manager()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { secret } = require('./configJWT')

const generateAccessToken = (id, name) => {
    const payload = { id, name }
    return jwt.sign(payload, secret, { expiresIn: '24h' })
}

class UsersController {
    //создание пользователя
    async registration(req, res) {
        try {
            const { name, password, save } = req.body
            const hash_password = bcrypt.hashSync(password, 7)
            const newUser = await db.query(`SELECT EXISTS (SELECT * FROM users where name='${name}');`) 
            if (newUser[0][0].exists) {
                return ''
            }
            await db.query(`INSERT INTO users(name, password) values('${name}', '${hash_password}') RETURNING *;`)
            let user = await db.query(`SELECT * FROM users where name='${name}'`)
            user = user[0][0]
            if (save) {
                const token = generateAccessToken(user.id, user.name)
                res.cookie('token', token, { path: '/' })
            }
            fm.createUser(user.name)
            return { body: 'success' }
        } catch (error) {
            console.log(error)
            res.status(500)
        }
    }
    //получение пользователя
    async autorization(req, res) {
        try {
            const { name, password } = req.body
            let user = await db.query(`SELECT * FROM users where name='${name}'`)
            user = user[0][0]
            const validatePassword = bcrypt.compareSync(password, user.password)
            if (validatePassword) {
                const token = generateAccessToken(user.id, user.name)
                res.cookie('token', token, {path: '/'})
                return { body: 'success' }
            } 
        } catch {
            return { body: 'error' }
        }
    }
    //получение страниц пользователя
    async changePassword(req, user_auth) {
        try {
            const { password, newPassword } = req.body
            let user = await db.query(`SELECT * FROM users where name='${user_auth.name}'`)
            user = user[0][0]
            const autorizated = bcrypt.compareSync(password, user.password)
            if (autorizated) {
                const hash_newPassword = bcrypt.hashSync(newPassword, 7)
                const repeatPassword = bcrypt.compareSync(newPassword, user.password)
                if (!repeatPassword) {
                    await db.query(`UPDATE users set password='${hash_newPassword}' where name='${user.name}' RETURNING *`)
                    return { body: 'success' }
                }
                return { body: 'repeat_error'}
            }
        } catch {
            return { body: 'error' }
        }
    }
    //получение страниц пользователя
    async getPages(user_auth) {
        if (user_auth) {
            const user = await db.query(`SELECT * FROM users where name='${user_auth.name}'`)
            const pages = await db.query(`SELECT * FROM pages where user_name='${user_auth.name}'`)
            const icons = []
            for (let page of pages[0]) {
                icons.push(page.page_icon)
            }
            if (user[0][0]) return { pages_inner: user[0][0].pages_inner, page_icons: JSON.stringify(icons) }
            else return { pages_inner: '', page_icons: JSON.stringify(icons) }
        } 
    }
    //обновление страниц пользователя
    async savePages(req, user) {
        if (user) {
            const { pages_inner } = req.body
            await db.query(`UPDATE users set pages_inner='${pages_inner}' where name='${user.name}' RETURNING *`)
        }
    }
}

module.exports = UsersController