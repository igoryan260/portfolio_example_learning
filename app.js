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

                var resultado = { titulo: url_image.titulo, url: url_image.urlImagem.substr(73, url_image.length), idPost: url_image.id }
                
                url.push(resultado)

                console.log(resultado)
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

//ler imagens para mostrar na tela do cliente
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

//excluir imagem do servidor e do cliente
application.get("/excluirImagem/:imagem/:urlImagem", function(req, res) {

    var imagemExcluir = req.params.urlImagem
    console.log(imagemExcluir)
    fs.unlink("./tmp/uploads/" + imagemExcluir, (err) => {
        if (err) throw err;
        console.log("Imagem excluida do servidor com sucesso")
    })

    async function run() {
        var client = new MongoClient("mongodb://localhost:27017")

        try {

            await client.connect()

            var db = client.db("portfolio_example")
            var collection = db.collection("projects")

            let idImagemProjeto = new ObjectID(req.params.imagem)

            await collection.deleteOne({ "_id": idImagemProjeto })
        } finally {
            await client.close()
        }

        res.redirect("/admin")
    }

    run().catch(console.dir)

})