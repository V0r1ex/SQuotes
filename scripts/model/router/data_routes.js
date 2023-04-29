const UsersDbController = require('../db/users_controller.js')
const PageDbController = require('../db/page_controller.js')
const globalData = require('../../controller/global_data.js')
const UsersController = new UsersDbController()
const PageController = new PageDbController()
const FileManager = require('./../file_manager.js')
const fm = new FileManager()
const authMiddlware = require('./../db/authMiddleware')

module.exports = function(app) {

    //авторизация/регистрация/выход
    app.get('/exit', (req, res) => {
        res.clearCookie('token', {path: '/'})
        res.end()
    })

    app.post('/postRegistration', (req, res) => { UsersController.registration(req, res).then(data => res.send(data)) })
    app.post('/postChangePassword', (req, res) => { const user = authMiddlware(req, res); UsersController.changePassword(req, user).then(data => res.send(data)) })
    app.post('/postAutorization', (req, res) => UsersController.autorization(req, res).then(data => res.send(data)))
    app.get('/getUserName', (req, res) => { const user = authMiddlware(req, res); res.send(user)} )

    //список страниц
    app.get('/getPages', (req, res) => { const user = authMiddlware(req, res); UsersController.getPages(user).then(data => res.send(data)) })
    app.post('/savePages', (req, res) => { const user = authMiddlware(req, res); UsersController.savePages(req, user) }) 
    app.post('/saveIcon', (req, res) => { const user = authMiddlware(req, res);  fm.createFile(user, req.files.file)}) 

    //отдельная страница
    app.get('/getPage', (req, res) => { const user = authMiddlware(req, res); PageController.getPage(req, user).then(data => res.send(data)) })
    app.post('/addPage', (req, res) => { const user = authMiddlware(req, res); PageController.addPage(req, user) })
    app.post('/savePage', (req, res) => { const user = authMiddlware(req, res); PageController.savePage(req, user) }) 
    app.post('/removePage', (req, res) => { const user = authMiddlware(req, res); PageController.removePage(req, user) })

    app.post('/createFilePath', (req, res) => { globalData.createFilePath = req.body })
    app.post('/createFile', (req, res) => { const user = authMiddlware(req, res); const file = req.files.file; fm.createFile(user, file, globalData); PageController.addFile(req, user, file.name)  })
    app.post('/updateFileSys', (req, res) => { const user = authMiddlware(req, res); PageController.updateFileSys(req, user)  })

}