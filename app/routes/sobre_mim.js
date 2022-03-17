module.exports = (application) => {
    //aqui precisa requisitar o controller
    application.get("/visitante/sobreMim", (req, res) => {
        application.controllers.sobre_mim.sobreMimPage(req, res)
    })
}