const { db } = require('../config/connectDB')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const CheckGroup = require('../utils/utils')
require('dotenv').config()

const login = async (req, res) => {
    const q = "SELECT * FROM accounts WHERE username = ?"

    console.log("in login controller")

    try {
        const data = await db.query(q, [req.body.username])

        if (data[0].length === 0) return res.status(404).json("User not found!");

        // User is disabled
        if (!data[0][0].status) {
            return res.status(401).json("User has been disabled")
        }

        const checkPassword = bcrypt.compareSync(
            req.body.password,
            data[0][0].password
        );
    
        if (!checkPassword)
            return res.status(400).json("Wrong password!");
            
        // create jwt
        const accessToken = jwt.sign(
            { username: data[0][0].username }, 
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
    
        // const refreshToken = jwt.sign(
        //     { username: data[0][0].username }, 
        //     process.env.REFRESH_TOKEN_SECRET,
        //     { expiresIn: '1d' }
        // );
    
        const { password, ...others } = data[0][0];

        const isAdmin = await CheckGroup(data[0][0].username, "admin")
        
        res
          .cookie("accessToken", accessToken, {
            httpOnly: true,
            expires: new Date(Date.now() + 1 * 3_600_000)
          //  maxAge: 24 * 60 * 60 * 1000
          })
          .status(200)
          .json({ accessToken, others, isAdmin });
      
    } catch (err) {
        console.log(err)
        return res.status(500).json(err);
    }

    // db.query(q, [req.body.username], (err, data) => {
    //     if (err) return res.status(500).json(err);
    //     if (data.length === 0) return res.status(404).json("User not found!");
    
    //     const checkPassword = bcrypt.compareSync(
    //       req.body.password,
    //       data[0].password
    //     );
    
    //     if (!checkPassword)
    //       return res.status(400).json("Wrong password!");
    
    //     const accessToken = jwt.sign({ username: data[0].username }, "secretkey");
    
    //     const { password, ...others } = data[0];
    
    //     res
    //       .cookie("accessToken", accessToken, {
    //         httpOnly: true,
    //       })
    //       .status(200)
    //       .json(others);
    //   });

}

const logout = (req, res) => {
    res.clearCookie("accessToken",{
      secure:true,
      sameSite:"none"
    }).status(200).json("User has been logged out.")
}

const verifyUserLoggedIn = (req, res) => {

    console.log("inside")

    let isLoggedIn = false
    let isAdmin = false
    let username = ''

    const accessToken = req.cookies.accessToken

    if (!accessToken) {
        res.status(200)
        .json({ isLoggedIn, isAdmin, username })
        //res.status(401).json({ message: 'No access token at verify user logged in' })
    } else {
        jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) {
                  //  res.status(403).json({ message: 'Forbidden at verify jwt' })
                  res.status(200)
                  .json({ isLoggedIn, isAdmin, username })
                } else {
                    req.username = decoded.username
                
                    // check status of user
                    const q = 'SELECT `status` FROM `accounts` WHERE `username`=?'
        
                    try {
                        const [data] = await db.query(q, [req.username])
                        console.log("is enabled: " + data[0].status)
                        const isEnabled = data[0].status
                        if (isEnabled === 0) {
                            console.log('Forbidden at verify jwt 2')
                            res.status(200)
                            .json({ isLoggedIn, isAdmin, username })
                         //   res.status(401).json({ message: 'Forbidden at verify jwt 2' }) 
                        } else {
                            console.log("test 2")
                            isLoggedIn = true
                            username = decoded.username
                        }
                        
                    } catch (error) {
                        console.log(error)
                     //   res.status(500).json(error)
                    }
                
                    if (await CheckGroup(req.username, "admin")) {
                        console.log("is admin")
                        console.log("test 3")

                        isAdmin = true

                        res.status(200)
                        .json({ isLoggedIn, isAdmin, username })
                    } else {
                        console.log("is not admin")
                    //    res.status(401).json({ message: 'Unauthorized page. Only for admin.' })

                        res.status(200)
                        .json({ isLoggedIn, isAdmin, username })
                    }
                }
                
            }
        )
    }

    // console.log("logged in: " + isLoggedIn)
    // console.log("admin: " + isAdmin)

//     res.status(200)
//     .json({ isLoggedIn, isAdmin })
}

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
// const refresh = (req, res) => {
//     const cookies = req.cookies

//     if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

//     const refreshToken = cookies.jwt

//     jwt.verify(
//         refreshToken,
//         process.env.REFRESH_TOKEN_SECRET,
//         async (err, decoded) => {
//             //if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
//             const q = "SELECT * FROM accounts WHERE username = ?"

//             try {
//                 const data = await db.query(q, [req.body.username])

//                 if (data[0].length === 0) return res.status(404).json("Unauthorised");

//                 const accessToken = jwt.sign(
//                     { username: decoded.username },
//                     process.env.ACCESS_TOKEN_SECRET,
//                     { expiresIn: '1d' }
//                 );
//                 res.json({ accessToken })
//             } catch (error) {
//                 console.log("err at refresh token")
//                 console.log(err)
//                 return res.sendStatus(403)
//             }
            
         
//         }
//     )
    
// }

module.exports = {
    login,
    logout,
    verifyUserLoggedIn
   // refresh
}
