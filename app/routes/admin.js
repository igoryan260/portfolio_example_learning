module.exports = (application) => {
    application.get("/admin", (req, res) => {
        res.render("admin.ejs")
    })

    application.post('/admin/login', (req, res) => {
        application.app.controllers.admin.login(req, res)
    })

    application.post('/admin/register', (req, res) => {
        application.app.controllers.admin.register(req, res)
    })
}