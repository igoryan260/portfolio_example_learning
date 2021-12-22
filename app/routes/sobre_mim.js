module.exports = (application) => {
    //aqui precisa requisitar o controller
    application.get("/sobre-mim", (req, res) => {
        application.app.controllers.sobre_mim.sobreMimPage(req, res)
    })
}