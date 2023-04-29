const express = require('express')
const path = require('path')
const router = require('./router/router.js')
const db = require('./db/db')
const cookie = require('cookie-parser')
const fileupload = require("express-fileupload")
const app = express()
app.use(cookie('secret key'))
app.set('view engine', 'ejs')
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb'}))
app.use(fileupload())
app.use(express.static('public'))
app.use(express.static('users'))
app.use(express.static('scripts'))

const PORT = 8081

const globalPath = (page) => {
    return path.resolve(`${__dirname}/../../views/${page}.ejs`)
}

// запуск сервера
const start = async () => {
    try {
        router(app, globalPath)
        await db.authenticate()
        await db.sync()
        app.listen(PORT, (err) => {
            err ? console.log(err) : console.log(`Server started on port: http://localhost:${PORT}`) 
        })
    } catch (err) {
        console.log(err)
    }
}
start()
