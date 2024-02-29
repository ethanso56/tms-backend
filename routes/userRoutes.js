const express = require('express')
const router = express.Router()
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.patch('/edit_user', editUser)

module.exports = router