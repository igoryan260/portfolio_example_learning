module.exports.sobreMimPage = (req, res) => {
    if (!req.session.visitanteAutenticado) {
        res.redirect("/admin")
    } else {
        res.render("sobre_mim.ejs", { infoDesigne: req.session, projetos: req.session.resultFormated })
    }
}