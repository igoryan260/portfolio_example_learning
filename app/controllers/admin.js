//variáveis de ambiente
require("dotenv").config()

//esta variável representa o framework que criptografa as informações confidenciais do usuário
var md5 = require("md5")
const { MongoClient } = require("mongodb")
const objectId = require("mongodb").ObjectId

//coletando informação das variáveis de ambiente
const dbUser = process.env.DB_USER;
const dbSenha = process.env.DB_SENHA;

const uri = `mongodb+srv://${dbUser}:${dbSenha}@cluster0.7gcf3.mongodb.net/Cluster0?retryWrites=true&w=majority;`

const client = new MongoClient(uri)

module.exports.login = (req, res) => {

    console.log(dbUser)
    console.log(dbSenha)

    const { MongoClient } = require("mongodb");
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
            const result = await colecao.find({
                nomeUsuario: req.body.nomeUsuarioLogin,
                senha: { $eq: req.body.senhaLogin }
            }).toArray()

            //o codigo abaixo irá verificar o resultado que é um array, e logo pegará seu primeiro índice e comparar com a informação digitada no formulário
            if (result[0]) {
                if (result[0].nomeUsuario === req.body.nomeUsuarioLogin) {
                    //agora vamos criar uma sessão, caso o usuário tiver sido autenticado ele pode criar a sessão que só será destruida caso ele mesmo queira sair
                    req.session.autenticado = true
                        //criando a sessão onde o objectId do usuário possa ser recuperado em qualquer página do servidor
                    req.session.userId = result[0]._id.toHexString()
                }
            } else {
                console.log("Não Achamos resultado")
                    //caso não tenha retornado nada na variável "result", a aplicação retornará na página 'admin' com o erro
                req.session.validacaoUser = "usuário não encontrado"
                res.redirect("/admin")

            }

            if (req.session.autenticado === true) {
                res.redirect("/admin")
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

            const doc = {
                administrador: req.body.adminRegister,
                senha: req.body.senhaRegister,
                nomeUsuario: req.body.nomeUsuarioRegister,
                email: req.body.email,
                telefone: req.body.telefone,
                whatsapp: req.body.whatsapp,
                sobreMim: req.body.sobreMim,
                servicosPrestados: req.body.servicos
            }

            const result = await collection.findOne({
                nomeUsuario: req.body.nomeUsuarioRegister
            })

            //se resultado for vazio (ele não existir) podemos inserir o novo usuário, se existir manda erro pro usuário
            if (!result) {
                console.log("vamos inseri-lo")
                await collection.insertOne(doc)
            } else {
                console.log("Não vammos inseri-lo")
                req.session.validacaoUser = "Nome de usuário já existe"
                res.redirect("/admin")
            }

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

            //agora vamos pegar a nova postagem e adicionar no documento de postagem juntamente com o id do usuario, da seguinte forma
            const newPost = {
                userId: req.session.userId,
                tituloProjeto: req.body.tituloProjeto,
                imagensProjeto: req.file,
                descricao: req.body.descricao
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