const { db } = require('../config/connectDB')

const Checkgroup = async (userid, groupname) => {

    const q = "SELECT `groups` FROM accounts WHERE username = '" + userid + "'"

    try {
        const data = await db.query(q);
        if (data[0][0].groups.split(",").includes(groupname.toLowerCase())) {
            console.log("true")
            return true
        } else {
            console.log("false")
            return false
        }
    } catch (error) {
        console.error(error);
        return false
    }
}

// const Checkgroup = async (userid, groupname) => {

//     const q = "SELECT `groups` FROM accounts WHERE username = '" + userid + "'"

//     db.query(q, (err, data) => {
//         if (err) console.log(err);
//         console.log(data)
//         console.log(data[0].groups.split(",").toString())
        
//         if (data[0].groups.split(",").includes(groupname.toLowerCase())) {
//             console.log("true")
//             return true 
//         } else {
//             console.log("false")
//             return false
//         }
//     })
// }

module.exports = Checkgroup
