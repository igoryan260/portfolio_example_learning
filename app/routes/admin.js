var multer = require("multer")
const multerConfig = require("../../config/multerConfig.js")
const app = require("../../config/server.js")

module.exports = (application) => {
    application.get("/admin", (req, res) => {
        if (req.session.autenticado !== true) {
            res.render("admin.ejs", { "validacao": req.session.validacaoUser })
        } else {
            res.render("administrar.ejs", { projetos: req.session.userId })
        }
    })

    application.post('/admin/login', (req, res) => {
        application.app.controllers.admin.login(req, res)
    })

    application.post('/admin/register', (req, res) => {
        application.app.controllers.admin.register(req, res)
    })

    application.post("/admin/new-post", multer(multerConfig).single("imagensProjeto"), (req, res) => {
        //vamos enviar o request e o response para ser tratado no controller
        /*application.app.controllers.admin.novaPostagem(req, res)*/
        application.app.controllers.admin.novaPostagem(req, res)

    })



    //rota para fazer logout, destruir a sessão criada
    application.get("/admin/sair", (req, res) => {
        //destruir a sessão
        req.session.destroy()
            //redirecionar o usuário
        res.redirect("/admin")
    })
}