const jwt = require('jsonwebtoken')
require('dotenv').config()

const verifyJWT = (req, res, next) => {

    const accessToken = req.cookies.accessToken

    if (!accessToken) {
        return res.status(401).json({ message: 'No access token at verify jwt' })
    }

    jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden at verify jwt' })
            req.username = decoded.username
            next()
        }
    )
}

// const verifyJWT = (req, res, next) => {
//     const authHeader = req.headers.authorization || req.headers.Authorization

//     if (!authHeader?.startsWith('Bearer ')) {
//         return res.status(401).json({ message: 'Unauthorized at verify jwt' })
//     }

//     const token = authHeader.split(' ')[1]

//     jwt.verify(
//         token,
//         process.env.ACCESS_TOKEN_SECRET,
//         (err, decoded) => {
//             if (err) return res.status(403).json({ message: 'Forbidden at verify jwt' })
//             req.username = decoded.username
//             next()
//         }
//     )
// }

module.exports = verifyJWT 