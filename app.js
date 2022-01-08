//aqui temos que importar todas as configurações do servidor para o arquivo principal
const application = require('./config/server.js')
    //vamos configurar aqui uma api para recuperar imagens do sistema de acordo com o usuário selecionado
const { MongoClient } = require("mongodb")
const { ObjectID } = require("bson")
const md5 = require("md5")
const fs = require("fs")
const res = require('express/lib/response')

application.get("/api/:userId", function(req, res) {
    async function run() {

        let client = new MongoClient("mongodb://localhost:27017")

        try {

            await client.connect()

            const bd = client.db("portfolio_example")

            const collection = bd.collection("projects")

            const find = await collection.find({ userId: req.params.userId }).toArray()

            var result = find.map(function(origem) {
                return { titulo: origem.tituloProjeto, urlImagem: origem.imagemCapaProjeto, id: origem._id.toHexString() }
            })

            var url = Array()

            result.forEach((url_image, x, y) => {

                var resultado = { titulo: url_image.titulo, url: url_image.urlImagem.substr(60, url_image.length), idPost: url_image.id }

                url.push(resultado)

                console.log(url)
            });

            res.json(
                url
            )
        } finally {
            await client.close()
        }
    }

    run().catch(console.dir)
})

application.get("/imagens/:imagem", function(req, res) {
    var img = req.params.imagem

    fs.readFile('./tmp/uploads/' + img, function(err, content) {
        if (err) {
            res.status(400).json(err)
            return;
        }

        res.writeHead(200, { 'content-type': 'image' })
        res.end(content)
    })
})