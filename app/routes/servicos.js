module.exports = (application) => {
    application.get("/visitante/servicos", (req, res) => {
        application.controllers.servicos.servicosPage(req, res)
    })
}