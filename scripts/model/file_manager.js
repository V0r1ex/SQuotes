const fs = require('fs')
const path = require('path')

class FileManager {
    // создание папки пользователя
    createUser(username) {
        const path = this.createPathToPage(username)
        fs.mkdir(path, (err) => { console.log(err) })
    }
    // создание папки страницы
    addPage(username, page_id) {
        const pathImage = this.createPathToPage(username, page_id)
        if (!fs.existsSync(pathImage)) {
            fs.mkdirSync(pathImage)
        }
    }
    // создание папки карты
    addCard(username, page_id, card_id) {
        const path = this.createPathToPage(username, page_id, card_id)
        fs.mkdir(path, (err) => { console.log(err) })
    }
    // удаление папки карты
    removeCard(username, page_id, card_id) {
        const path = this.createPathToPage(username, page_id, card_id)
        fs.rmSync(path, { recursive: true, force: true }, (err) => { console.log(err) })
    }
    // сохранение папки карты
    savePage(username, page_id) {
        const pathFile = this.createPathToPage(username, page_id)
        fs.mkdir(pathFile, (err) => { console.log(err) })
    }
    // удаление папки страницы
    removePage(username, page_id) {
        const pathFile = this.createPathToPage(username, page_id)
        if (fs.existsSync(pathFile)) {
            if (fs.existsSync(pathFile+'.png')) fs.unlink(pathFile+'.png', (err) => { console.log(err) })
            fs.rmdir(pathFile, { recursive: true, force: true }, (err) => { console.log(err) })
        }
    }
    // создание картинки превью
    createImageBase64(base64, username, page_id) {
        const pathImage = this.createPathToPage(username, page_id)
        this.addPage(username, page_id)
        let base64Data = base64.replace("data:image/png;base64,", "")
        fs.writeFile(`${pathImage}.png`, base64Data, 'base64', function(err) {
            console.log(err)
        })
    }
    // создание файла
    createFile(user, file, global_data) {
        if (user) {
            let pathFile
            if (global_data) {
                const { page_id, file_name } = global_data.createFilePath
                if (page_id) pathFile = this.createPathToPage(user.name, page_id, file_name)
            }
            else pathFile = this.createPathToPage(user.name, 'icon.png')
            if (!fs.existsSync(pathFile) || !global_data) {
                fs.writeFile(`${pathFile}`, file.data, function(err) { console.log(err) })
            }
        }
    }
    // удаление файла
    removeFile(username, page_id) {
        const pathFile = this.createPathToPage(username, page_id, file_id)
        fs.unlink(pathFile, (err) => { console.log(err) })
    }
    // создание пути до пользователя/страницы/файла
    createPathToPage(username, page_id, file_id) {
        if (file_id) return path.resolve(`${__dirname}/../../users/${username}/${page_id}/${file_id}`)
        else if (page_id) return path.resolve(`${__dirname}/../../users/${username}/${page_id}`)
        else return path.resolve(`${__dirname}/../../users/${username}`)
    }
}

module.exports = FileManager