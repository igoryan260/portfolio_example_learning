module.exports.homepage = (application, req, res) => {
    //res.send("Olá, vendo se funciona a rota informada home page")
    res.render("index.ejs", { infoDesigne: req.session })
}