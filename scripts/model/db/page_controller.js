const db = require('./db')
const file_manager = require('../file_manager.js')
const fm = new file_manager()
const fs = require('fs')

class PageController {
    // добавление страницы пользователю
    async addPage(req, user) {
        if (user) {
            const { idPage } = req.body
            await db.query(`INSERT INTO pages(user_name, id) values('${user.name}', '${idPage}')`) 
            fm.addPage(user.name, idPage)
        }
    }
    // удаление страницы пользователя
    async removePage(req, user) {
        if (user) {
            const { page_id } = req.body
            await db.query(`DELETE FROM pages where user_name='${user.name}' AND id='${page_id}'`) 
            fm.removePage(user.name, page_id)
        }
    }
    // сохранение страницы
    async savePage(req, user) {
        if (user) {
            const { page_inner, page_icon } = req.body
            const page_id = req.cookies.page_id
            fm.createImageBase64(page_icon, user.name, page_id)
            await db.query(`UPDATE pages set page_inner='${page_inner}' where user_name='${user.name}' AND id='${page_id}' RETURNING *`)
        }
    }
    // получение страницы
    async getPage(req, user) {
        const page_id = req.cookies.page_id
        if (user && page_id) {
            const page = await db.query(`SELECT * FROM pages where user_name='${user.name}' AND id='${page_id}'`)
            if (page[0][0]) return { page_inner: page[0][0].page_inner }
        }
    }
    // создание карточки
    async addCard(req, user) {
        if (user) {
            const { page_id, card_id } = req.body
            fm.addCard(user.name, page_id, card_id)
        }
    }
    // обноавление файлов
    async updateFileSys(req, user) {
        if (user) {
            const page_id = req.cookies.page_id
            const page_files = req.body.files
            const pathFile = fm.createPathToPage(user.name, page_id)
            const files = fs.readdirSync(pathFile)
            files.forEach(file => {
                if (!page_files.includes(file)) fs.unlink(fm.createPathToPage(user.name, page_id, file), (err) => { console.log(err) })
            })
        }
    }
    // добавление файла
    async addFile(req, user, file_name) {
        if (user) {
            const page_id = req.cookies.page_id
            let page = await db.query(`SELECT * FROM pages where user_name='${user.name}' AND id='${page_id}'`)
            let page_files = JSON.parse(page[0][0].page_files)
            page_files.push(file_name)
            await db.query(`UPDATE pages set page_files='${JSON.stringify(page_files)}' where user_name='${user.name}' AND id='${page_id}' RETURNING *`)
        }
    }
    // удаление файла
    async removeFile(req, user) {
        if (user) {
            const page_id = req.cookies.page_id
            let page = await db.query(`SELECT * FROM pages where user_name='${user.name}' AND id='${page_id}'`)
            let page_files = JSON.parse(page[0][0].page_files)
            page_files = page_files.filter(file => file != req.body.file_name)
            await db.query(`UPDATE pages set page_files='${JSON.stringify(page_files)}' where user_name='${user.name}' AND id='${page_id}' RETURNING *`)
        }
    }
}

module.exports = PageController