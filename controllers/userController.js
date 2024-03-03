const db = require('../config/connectDB')
const bcrypt = require('bcrypt')
const { CheckGroup } = require('../utils/utils')

const editUser = async (req, res) => {
    const q = "UPDATE accounts SET `password`=?, `email`=? WHERE username=?"

    try {
        const alphabetRegex = /[a-zA-Z]/;
        const numberRegex = /[0-9]/;
        const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

        if (req.body.password.length < 8 || req.body.password.length > 10) {
            return res.status(409).json("Password must be between 8 to 10 characters.")
        }

        if (!alphabetRegex.test(req.body.password) || !numberRegex.test(req.body.password) || !specialCharRegex.test(req.body.password)) {
            return res.status(409).json("Password must contain at least one alphabet, number and special character.")
        }

        if (req.body.email.length > 255) {
            return res.status(409).json("Email cannot be more than 250 characters.")
        }
        
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        const values = [
            hashedPassword,
            req.body.email,
            req.body.username
        ]

        const data = await db.query(q, values)
        if (data[0].affectedRows > 0) return res.json("Updated!");

    } catch (error) {
        console.log(error)
        return res.status(500).json(err);
    }
}

// const checkUserGroup = (req, res) => {
//     try {
//         if (CheckGroup(req.body.username, req.body.group)) {
//             return res.status(200)
//         } else {
//             return res.status
//         }
//     } catch (error) {
        
//     }
   
// }

module.exports = {
    editUser,
    checkUserGroup
}