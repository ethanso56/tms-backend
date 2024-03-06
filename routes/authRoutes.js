const express = require('express')
const { login, logout, verifyUserLoggedIn } = require('../controllers/authController')
const verifyJWT = require('../middleware/verifyJWT')
const isAdmin = require('../middleware/isAdmin')
const router = express.Router()


router.post('/login', login)
router.post('/logout', logout)

router.post('/verifyuserloggedin', verifyUserLoggedIn)

module.exports = router