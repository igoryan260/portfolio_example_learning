const express = require("express");
const consign = require("consign")
const app = express()

//porta em que o servidor irá rodar
let port = 80

//configurando os motores de views (no caso será 'ejs' o nosso gerenciador de views)
app.set('view-engine', 'ejs')

//onde as views estão localizadas
app.set('views', './app/views')

//configurando onde estão os arquivos estáticos da aplicação (css, js, images)
app.set(express.static('./app/public'))

//configurando o middlware para reconhecer os dados de uma requisição via body
app.use(express.urlencoded({ extended: true }))

//configurando a aplicação para receber e reconhecer dados 'json'
app.use(express.json())

consign()
    .include('app/controllers')
    .then('app/models')
    .then('app/routes')
    .then('app/views')
    .into(app)

app.listen(port, () => {
    console.log("Servidor rodando na porta: " + port)
})

module.exports = app