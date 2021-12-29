module.exports = (application) => {
    application.get("/rotaTeste", (req, res) => {
        application.app.controllers.admin.pegarPostagens(req, res)
    })
}