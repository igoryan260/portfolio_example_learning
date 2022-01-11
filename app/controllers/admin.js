//esta variável representa o framework que criptografa as informações confidenciais do usuário
var md5 = require("md5")
const { MongoClient } = require("mongodb")
var uri = "mongodb://localhost:27017"
const client = new MongoClient(uri)
const objectId = require("mongodb").ObjectId

module.exports.login = (req, res) => {

    const { MongoClient } = require("mongodb");
    // Connection URI
    const uri = "mongodb://localhost:27017";
    // Create a new MongoClient
    const client = new MongoClient(uri);
    async function run() {

        try {
            // Connect the client to the server
            await client.connect();

            let database = client.db("portfolio_example")
            let colecao = database.collection("admin")

            //para a segurança do sistema, vamos criptografar a senha e pesquisar a senha já criptografada
            req.body.senhaLogin = md5(req.body.senhaLogin)

            // conexão estabelecida
            // a variavel abaixo se transformará num array contendo as informações retiradas do banco de dados
            const result = await colecao.find({ administrador: req.body.nomeLogin, senha: { $eq: req.body.senhaLogin } }).toArray()

            //o codigo abaixo irá verificar o resultado que é um array, e logo pegará seu primeiro índice e comparar com a informação digitada no formulário
            if (result[0]) {

                if (result[0].administrador === req.body.nomeLogin) {
                    //agora vamos criar uma sessão, caso o usuário tiver sido autenticado ele pode criar a sessão que só será destruida caso ele mesmo queira sair
                    req.session.autenticado = true
                        //criando a sessão onde o objectId do usuário possa ser recuperado em qualquer página do servidor
                    req.session.userId = result[0]._id.toHexString()
                }
            } else {
                //caso não tenha retornado nada na variável "result", a aplicação retornará na página 'admin' com o erro
                res.send("Usuário não encontrado")
            }

            if (req.session.autenticado === true) {
                res.redirect("/admin")
            } else {
                res.render("admin.ejs")
            }

            console.log("Connected successfully to server");
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
            console.log("Connection closed successfully")
        }
    }

    run().catch(console.dir);
}

module.exports.register = (req, res) => {

    //criando objeto do mongoclient
    const { MongoClient } = require("mongodb")

    //uri da base de dados
    const uri = "mongodb://localhost:27017"

    //instanciando o objeto mongo
    const client = new MongoClient(uri)

    //o código abaixo utiliza a tecnologia MD5 para criptografar as senhas dos usuarios
    req.body.senhaRegister = md5(req.body.senhaRegister)


    async function run() {
        try {
            await client.connect()
            console.log("Conexão iniciada")

            const database = client.db("portfolio_example")
            const collection = database.collection("admin")

            const doc = { administrador: req.body.adminRegister, senha: req.body.senhaRegister }

            await collection.insertOne(doc)
            console.log("Documento inserido")

        } finally {
            //encerrando conexão após o uso para a segurança do sistema
            await client.close()
            res.redirect("/admin")
            console.log("Conexão encerrada")
        }
    }

    run().catch(console.dir)
}

module.exports.novaPostagem = (req, res) => {

    async function run() {
        try {

            await client.connect()

            //conectando à base de dados do portfolio exemplo
            const database = client.db("portfolio_example")

            //nestas primeiras linhas de código, eu preciso pegar o objectId do usuario logado e após isso inserir esta referência no documento de postagens
            //no caso, cada postagem vai ter o código do objectId do usuário autenticado para refernciar o dono da postagem

            //collection dos usuários
            const collectionSearch = database.collection("admin")
            const userSearch = { administrador: "Igor" }

            //resultado da busca pelo usuário
            const resultSearch = await collectionSearch.findOne(userSearch)
                //converter de ObjectId para string normal
            const userId = resultSearch._id.toHexString()
                //agora vamos pegar a nova postagem e adicionar no documento de postagem juntamente com o id do usuario, da seguinte forma
            const newPost = {
                userId: req.session.userId,
                tituloProjeto: req.body.tituloProjeto,
                imagemCapaProjeto: req.file.path
            }

            //criando a collection dos uploads dos projetos
            const collectionProjects = database.collection("projects")

            //inserindo novo documento na base de dados
            await collectionProjects.insertOne(newPost)

        } finally {
            await client.close()
        }
        res.redirect("/admin")
    }

    run().catch(console.dir)


}