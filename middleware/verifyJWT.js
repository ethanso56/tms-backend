const jwt = require('jsonwebtoken')
const { db } = require('../config/connectDB')
require('dotenv').config()

const verifyJWT = (req, res, next) => {

    const accessToken = req.cookies.accessToken

    if (!accessToken) {
        return res.status(401).json({ message: 'No access token at verify jwt' })
    }

    jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden at verify jwt' })
            req.username = decoded.username
            
            // check status of user
            const q = 'SELECT `status` FROM `accounts` WHERE `username`=?'

            try {
                const [data] = await db.query(q, [req.username])
                console.log("is enabled: " + data[0].status)
                const isEnabled = data[0].status
                if (isEnabled === 0) {
                    console.log('Forbidden at verify jwt 2')
                    return res.status(401).json({ message: 'Forbidden at verify jwt 2' }) 
                }
                
            } catch (error) {
                console.log(error)
                return res.status(500).json(error)
            }

            next()
        }
    )

}

module.exports = verifyJWT 