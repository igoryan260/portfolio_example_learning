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

                //vamos procurar todos os projetos do designer pesquisado e renderizar na página
                const collection_projects = bd.collection("projects")
                var resultProjects = await collection_projects.find({ "userId": result._id.toHexString() }).toArray()

                //na variável abaixo vamos formatar as informações vindas do banco de dados
                var resultFormated = resultProjects.map(function(elemento) {

                    let jsonResult = {
                        idProjeto: elemento._id.toHexString(),
                        tituloImagem: elemento.tituloProjeto,
                        url: elemento.imagensProjeto.path.substr((elemento.imagensProjeto.path.lastIndexOf("uploads") + 8), elemento.imagensProjeto.path.length),
                        descricao: elemento.descricao
                    }

                    return jsonResult;
                })

                //na variável abaixo vamos formatar as informações vindas do banco de dados e pegar na ordem invertida
                var reverseResultFormated = resultProjects.map(function(elemento) {

                    let jsonResult = {
                        idProjeto: elemento._id.toHexString(),
                        tituloImagem: elemento.tituloProjeto,
                        url: elemento.imagensProjeto.path.substr((elemento.imagensProjeto.path.lastIndexOf("uploads") + 8), elemento.imagensProjeto.path.length),
                        descricao: elemento.descricao
                    }

                    return jsonResult;
                })

                //para captar também o endereço e titulos das imagens, vamos criar uma sessão diferente para ser mandado na variável 'projetos
                req.session.resultFormated = resultFormated

                //para criar as últimas postagens do banco de dados
                req.session.ultimosProjetos = reverseResultFormated.reverse()

                console.log(req.session.resultFormated)
                console.log()
                console.log()
                console.log(req.session.ultimosProjetos)

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

                // para apresentar os últimos projetos feitos do designer, precisamos pegar o resultado do banco de dados e selecionar do último até o antepenúltimo


                //res.render("index.ejs", { infoDesigne: req.session, projetos: req.session.resultFormated })
                res.redirect("/")
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