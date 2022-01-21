module.exports.visitar = (req, res) => {
    console.log(req.body.nomeUsuario)

    const { MongoClient } = require("mongodb")
    const uri = "mongodb://localhost:27017"

    async function run() {
        try {
            var client = new MongoClient(uri)

            await client.connect()

            const bd = client.db("portfolio_example")
            const collection = bd.collection("admin")

            var result = await collection.findOne({ nomeUsuario: req.body.nomeUsuario })

            if (result) {

                //vamos criar uma sessão para autenticar o visitante, fazer o controle de renderização da página
                req.session.visitanteAutenticado = true
                req.session.nome = result.administrador
                req.session.idUser = result._id.toHexString()
                req.session.nomeUsuario = result.nomeUsuario
                req.session.email = result.email
                req.session.telefone = result.telefone
                req.session.whatsapp = result.whatsapp
                req.session.sobreMim = result.sobreMim
                req.session.servicosPrestados = result.servicosPrestados

                res.render("index.ejs", { infoDesigne: req.session })
            }
        } finally {
            await client.close()
        }
    }

    run().catch(console.dir)

}

module.exports.sair = (req, res) => {
    //aqui vamos destruir as sessões criadas no servidor para poder fazer o logout do visitante    
    req.session.destroy()
        //aqui abaixo vamos redirecionar o visitante para a página de admin, que será provisória afim de testes
    res.redirect("/admin")
}