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

module.exports = Checkgroup
