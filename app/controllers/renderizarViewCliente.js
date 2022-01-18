module.exports.renderizarView = (application, req, res) => {

    const { MongoClient } = require("mongodb")
    const uri = "mongodb://localhost:27017"

    async function run() {

        let client = new MongoClient(uri)

        try {
            await client.connect()
            console.log("Conexão Criada View Cliente")

            const db = client.db("portfolio_example")
            const collection = db.collection("admin")

            var result = await collection.findOne({ nomeUsuario: req.params.nomeUsuario })

        } finally {
            await client.close()
            console.log("conexão encerrada")

            //vamos agora verificar se existe o usuário. Se existir vamos renderizar a página inicial através dele e criar todas as sessões necessárias para continuar na página do cliente            
            if (result) {
                req.session.nome = result.administrador
                req.session.nomeUsuario = req.params.nomeUsuario
                req.session.email = result.email
                req.session.telefone = result.telefone
                req.session.whatsapp = result.whatsapp
                req.session.sobreMim = result.sobreMim
                req.session.servicosPrestados = result.servicosPrestados
                    //após todas as sessões criadas vamos dar o redirect na página inicial e fazer aparecer na página todas as informações do designer
                res.redirect("/")
            } else {

                //neste else, o que devemos fazer é o seguinte: após não ter encontrado o designer, é preciso redirecionar o cliente a uma página semelhante a de errors
                //aí datá certo a destruição de sessões e o cliente não ficará confuso, pois é uma página específica aos clientes e não restrita
                //aos administradores
                res.render("index.ejs", { infoDesigne: {} })
            }

        }
    }
    run().catch(console.dir)



}