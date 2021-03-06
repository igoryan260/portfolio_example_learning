const multer = require("multer")
var path = require("path")
var crypto = require("crypto")
var { diskStorage } = require("multer")

module.exports = {
    dest: path.resolve(__dirname, "..", "app", "public", "image", "tmp", "uploads"),
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, "..", "app", "public", "image", "tmp", "uploads"))
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) throw err;

                const fileName = `${hash.toString('hex')}-${file.originalname}`;

                cb(null, fileName)
            })
        }
    })
}