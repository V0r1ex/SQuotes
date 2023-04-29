module.exports = function(app, globalPath) {
    app.get('/pages/page', (req, res) => res.render(globalPath('page'), { title: 'SNotes | Pages | Page', name: 'page'  }))
    app.get('/', (req, res) => res.render(globalPath('main'), { title: 'SNotes', name: 'main' })     )
    app.get('/pages', (req, res) => res.render(globalPath('pages'), { title: 'SNotes | Pages', name: 'pages' }))
    app.get('/about', (req, res) => res.render(globalPath('about'), { title: 'SNotes | About', name: 'about' }))
    app.get('/contact', (req, res) => res.render(globalPath('contact'), { title: 'SNotes | Contact', name: 'contact' }))
    app.get('/privacy', (req, res) => res.render(globalPath('privacy'), { title: 'SNotes | Privacy', name: 'privacy' }))
    app.get('/post', (req, res) => res.render(globalPath('page'), { title: 'SNotes | Post', name: 'page' }))
    app.use((req, res) => {
        res
            .status(404)
            .render(globalPath('error'), { title: 'Error', name: '' })
        })
}