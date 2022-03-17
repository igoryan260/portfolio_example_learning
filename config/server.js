const express = require("express");
var consign = require("consign")
const app = express()
const cool = require('cool-ascii-faces');
const path = require('path');
const cors = require("cors")
    //importar o express -session
var expressSession = require('express-session')

//porta em que o servidor irá rodar
let port = process.env.PORT || 80

//onde as views estão localizadas
app.set('views', './app/views')

//configurando os motores de views (no caso será 'ejs' o nosso gerenciador de views)
app.set('view-engine', 'ejs')

//utilizando o cool
app.get('/cool', (req, res) => res.send(cool()))

//configurando onde estão os arquivos estáticos da aplicação (css, js, images)
app.use(express.static('app/public'));

app.use(cors());

//configurando o middlware para reconhecer os dados de uma requisição via body
app.use(express.urlencoded({ extended: true }))

//configurando a aplicação para receber e reconhecer dados 'json'
app.use(express.json())

//criando e configurando sessões na aplicação
app.set('trust proxy', 1)

//cinfigurar o middlware do express-session
app.use(expressSession({
    secret: 'Chave de sessão',
    resave: false,
    saveUninitialized: false
}))


app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
    res.setHeader("Access-Control-Allow-Headers", "content-type")
    res.setHeader("Access-Control-Allow-Credentials", true)

    next()
})


consign()
    .include('app/controllers')
    .then('app/models')
    .then('app/routes')
    .into(app)

app.listen(port, () => {
    console.log("Servidor rodando na porta: " + port)
})

module.exports = app