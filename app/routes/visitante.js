module.exports = (application) => {
    application.post("/visitante", (req, res) => {
        application.controllers.visitante.visitar(req, res)
    })

    application.get("/visitante/sair", (req, res) => {
        application.controllers.visitante.sair(req, res)
    })
}