const CheckGroup = require("../utils/utils")

const isAdmin = async (req, res, next) => {
    console.log("logged in username: " + req.username)
    console.log("post username: " + req.body.username)
    if (await CheckGroup(req.username, "admin")) {
        console.log("is admin")
        next()
    } else {
        console.log("is not admin")
        return res.status(401).json({ message: 'Unauthorized page. Only for admin.' })
    }
}

module.exports = isAdmin
