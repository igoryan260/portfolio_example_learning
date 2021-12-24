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

            // conexão estabelecida
            // a variavel abaixo se transformará num array contendo as informações retiradas do banco de dados
            const result = await colecao.find({ administrador: req.body.nomeAdm }).toArray()


            //o codigo abaixo irá verificar o resultado que é um array, e logo pegará seu primeiro índice e comparar com a informação digitada no formulário
            if (result[0]) {

                if (result[0].administrador === req.body.nomeAdm) {

                    res.send("Você existe na base de dados: " + result[0].administrador)
                        //console.log("Você existe na base de dados")

                } else {

                    //console.log("Você não existe na base de dados")
                    res.send("Você não existe na base de dados")

                }
            } else {
                //caso não tenha retornado nada na variável "result", a aplicação retornará na página 'admin' com o erro
                res.send("Nenhum usuário encontrado")
            }

            console.log("Connected successfully to server");
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
            console.log("Connection closed successfully")
        }
    }
    run().catch(console.dir);


    //aqui eu faço um teste para saber se o servidor consegue recuperar as informações do body
    //console.log(req.body.nomeAdm)
    //res.send("Página de administrador: " + req.body.nomeAdm)

}