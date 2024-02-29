const { db } = require('../config/connectDB')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const login = async (req, res) => {
    const q = "SELECT * FROM accounts WHERE username = ?"

    console.log("in login controller")

    try {
        const data = await db.query(q, [req.body.username])

        if (data[0].length === 0) return res.status(404).json("User not found!");

        const checkPassword = bcrypt.compareSync(
            req.body.password,
            data[0][0].password
        );
    
        if (!checkPassword)
            return res.status(400).json("Wrong password!");
            
        // create jwt
        const accessToken = jwt.sign(
            { username: data[0][0].username }, 
            process.env.ACCESS_TOKEN_SECRET
        //    { expiresIn: '1d' }
        );
    
        // const refreshToken = jwt.sign(
        //     { username: data[0][0].username }, 
        //     process.env.REFRESH_TOKEN_SECRET,
        //     { expiresIn: '1d' }
        // );
    
        const { password, ...others } = data[0][0];
    
        res
          .cookie("jwt", accessToken, {
            httpOnly: true
        //    maxAge: 24 * 60 * 60 * 1000
          })
          .status(200)
          .json({ accessToken, others });
      
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
    logout
   // refresh
}
