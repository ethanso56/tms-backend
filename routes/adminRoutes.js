const express = require('express')
const { createUser, createGroup, getAllUsers, getAllGroups, editUser, editUserStatus } = require('../controllers/adminController')
const router = express.Router()
const verifyJWT = require('../middleware/verifyJWT')
const isAdmin = require('../middleware/isAdmin')

router.use(verifyJWT)
router.use(isAdmin)

router.post('/create_user', createUser)
router.post('/create_group', createGroup)
router.get('/all_users', getAllUsers)
router.get('/all_groups', getAllGroups)
router.patch('/edit_user', editUser)
router.patch('/edit_user_status', editUserStatus)

module.exports = router