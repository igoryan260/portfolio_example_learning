module.exports = (application) => {
    //aqui precisa requisitar o controller
    application.get("/visitante/sobreMim", (req, res) => {
        application.app.controllers.sobre_mim.sobreMimPage(req, res)
    })
}