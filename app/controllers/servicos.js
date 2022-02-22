module.exports.servicosPage = (req, res) => {
    if (!req.session.visitanteAutenticado) {
        res.redirect("/admin")
    } else {
        res.render("servicos.ejs", { infoDesigne: req.session, projetos: req.session.resultFormated })
    }
}