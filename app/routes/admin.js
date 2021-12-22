module.exports = (application) => {
    application.get("/admin", (req, res) => {
        application.app.controllers.admin.login(req, res)
    })
}