const jwt = require('jsonwebtoken')
const { secret } = require('./configJWT')

module.exports = (req, res) => {
    try {
        const token = req.cookies.token
        if (!token) res.status(403)
        const decode = jwt.verify(token, secret)
        res.cookie('username', decode.name, {path: '/'})
        return decode

    } catch(error) {
        console.log(error)
        res.status(403)
    }
}