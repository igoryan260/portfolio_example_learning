module.exports = (application) => {
    application.get("/servicos", (req, res) => {
        application.app.controllers.servicos.servicosPage(req, res)
    })
}