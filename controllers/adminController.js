const { db }= require('../config/connectDB')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const createUser = async (req, res) => {
    // Check if user exists
    const selectQ = "SELECT * FROM accounts WHERE username = ?"

    try {
        const seletion = await db.query(selectQ, [req.body.username])
        if (seletion[0].length) return res.status(409).json("User already exists")

        // Create new user
        // User validation

        if (req.body.username.length > 50) {
            return res.status(409).json("Username cannot be more than 50 characters.")
        }

        const alphabetRegex = /[a-zA-Z]/;
        const numberRegex = /[0-9]/;
        const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

        if (req.body.password.length < 8 || req.body.password.length > 10) {
            return res.status(400).json("Password must be between 8 to 10 characters.")
        }

        if (!alphabetRegex.test(req.body.password) || !numberRegex.test(req.body.password) || !specialCharRegex.test(req.body.password)) {
            return res.status(400).json("Password must contain at least one alphabet, number and special character.")
        }

        if (req.body.email.length > 255) {
            return res.status(409).json("Email cannot be more than 250 characters.")
        }

        // Hash the pwd
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);
        
        const insertQ = "INSERT INTO accounts (`username`, `password`, `email`, `groups`, `status`) VALUE (?)"

        const values = [
            req.body.username,
            hashedPassword,
            req.body.email,
            req.body.groups,
            req.body.status
        ]

        const insertion = await db.query(insertQ, [values])
        return res.status(200).json("User has been created.");

    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

const createGroup = async (req, res) => {
    // Check if group exists
    const selectQ = "SELECT * FROM `groups` WHERE groupname = ?"

    try {
        const selection = await db.query(selectQ, [req.body.groupname])
        if (selection[0].length) return res.status(400).json("Group already exists")

        if (req.body.groupname.length > 50) {
            return res.status(409).json("Groupname cannot be more than 50 characters.")
        }

        // Create new group
        const insertQ = "INSERT INTO `groups` (`groupname`) VALUE (?)"

        const value = [
            req.body.groupname,
        ]

        const insertion = await db.query(insertQ, value)
        return res.status(200).json("Group has been created.");

    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

const getAllUsers = async (req, res) => {
    const q = "SELECT username, email, `groups`, status FROM accounts"

    try {
        const data = await db.query(q)
        return res.json(data[0])
    } catch (err) {
        console.log(err)
        return res.status(500).json(err);
    }

}

const getAllGroups = async (req, res) => {
    const q = "SELECT * FROM `groups`"

    try {
        const data = await db.query(q)
        return res.json(data[0])
    } catch (error) {
        console.log(error)
        return res.status(500).json(error);
    }
}


const editUser = async (req, res) => {

    if (req.body.password == null) {
        const q = "UPDATE accounts SET `email`=?, `groups`=? WHERE username=?"

        try { 
            const values = [
                req.body.email,
                req.body.groups,
                req.body.username
            ]
    
            const data = await db.query(q, values)
            console.log(data)
            if (data[0].affectedRows > 0) return res.json("Updated!");
        } catch (error) {
            console.log(error)
            return res.status(500).json(err);
        }

    } else {
        const q = "UPDATE accounts SET `password`=?, `email`=?, `groups`=? WHERE username=?"
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
                req.body.groups,
                req.body.username
            ]
    
            const data = await db.query(q, values)
            console.log(data)
            if (data[0].affectedRows > 0) return res.json("Updated!");
        } catch (error) {
            console.log(error)
            return res.status(500).json(err);
        }
    }
}

// const editUser = (req, res) => {
//     const q = "UPDATE accounts SET `password`=?, `email`=?, `groups`=? WHERE username=?"

//     const salt = bcrypt.genSaltSync(10);
//     const hashedPassword = bcrypt.hashSync(req.body.password, salt);

//     const values = [
//         hashedPassword,
//         req.body.email,
//         req.body.groups,
//         req.body.username
//     ]

//     db.query(q, values, (err, data) => {
//         if (err) return res.status(500).json(err);
//         if (data.affectedRows > 0) return res.json("Updated!");
//     })
// }

const editUserStatus = async (req, res) => {
    const q = "UPDATE accounts SET `status`=? WHERE username=?"

    const values = [
        req.body.status,
        req.body.username
    ]

    try {
        const data = await db.query(q, values)
        if (data[0].affectedRows > 0) return res.json("Updated!");
    } catch (error) {
        console.log(error)
        return res.status(500).json(err);
    }
}

// const editUserStatus = (req, res) => {
//     const q = "UPDATE accounts SET `status`=? WHERE username=?"

//     const values = [
//         req.body.status,
//         req.body.username
//     ]

//     db.query(q, values, (err, data) => {
//         if (err) return res.status(500).json(err);
//         if (data.affectedRows > 0) return res.json("Updated!");
//     })
// }



module.exports = {
    createUser,
    createGroup,
    getAllUsers,
    getAllGroups,
    editUser, 
    editUserStatus
}