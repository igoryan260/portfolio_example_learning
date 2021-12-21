module.exports = (application) => {
    //aqui o servidor reconhecerá a url que for digitada no navegador e após isso ele mandará uma requisição para o arquivo controllers, detro de 'apps' que por sua vez responderá com uma ação
    application.get("/", function(req, res) {
        application.app.controllers.index.homepage(application, req, res)
    })
}