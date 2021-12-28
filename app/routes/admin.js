var multer = require("multer")
const multerConfig = require("../../config/multerConfig.js")

module.exports = (application) => {
    application.get("/admin", (req, res) => {
        res.render("admin.ejs")
    })

    application.post('/admin/login', (req, res) => {
        application.app.controllers.admin.login(req, res)
    })

    application.post('/admin/register', (req, res) => {
        application.app.controllers.admin.register(req, res)
    })

    application.post("/admin/new-post", multer(multerConfig).single("imagemCapaProjeto"), (req, res) => {
        //vamos enviar o request e o response para ser tratado no controller
        application.app.controllers.admin.novaPostagem(req, res)
    })
}