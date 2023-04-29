const routes = require('./routes')
const data_routes = require('./data_routes')

module.exports = function(app, globalPath) {
    data_routes(app, globalPath)
    routes(app, globalPath)
}