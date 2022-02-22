module.exports = (application) => {
    application.get("/visitante/servicos", (req, res) => {
        application.app.controllers.servicos.servicosPage(req, res)
    })
}