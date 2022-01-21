module.exports = (application) => {
    application.post("/visitante", (req, res) => {
        application.app.controllers.visitante.visitar(req, res)
    })

    application.get("/visitante/sair", (req, res) => {
        application.app.controllers.visitante.sair(req, res)
    })
}