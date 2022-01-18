module.exports = (application) => {

    application.get("/cliente/:nomeUsuario", (req, res) => {
        application.app.controllers.renderizarViewCliente.renderizarView(application, req, res)
    })

    //fazer o logout para destruir as sessões
    application.get("/cliente/sair", (req, res) => {
        req.session.destroy()
        res.redirect("/")
    })
}