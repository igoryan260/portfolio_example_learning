const express = require("express");
const consign = require("consign")
const app = express()

//porta em que o servidor irá rodar
let port = 80

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