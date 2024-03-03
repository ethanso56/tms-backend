const express = require('express')
const router = express.Router()
const { editUser, checkUserGroup } = require('../controllers/userController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.patch('/edit_user', editUser)
// router.post('/checkgroup', checkUserGroup)

module.exports = router