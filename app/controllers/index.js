module.exports.homepage = (req, res) => {
    if (!req.session.visitanteAutenticado) {
        res.redirect("/admin")
    } else {
        res.render("index.ejs", { infoDesigne: {} })
    }
}