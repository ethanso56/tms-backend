const { db } = require('../config/connectDB')

const Checkgroup = async (userid, groupname) => {

    console.log("username: " + userid)
    console.log("group: " + groupname)

    const q = "SELECT `groups` FROM accounts WHERE username = '" + userid + "'"

    try {
        const data = await db.query(q);
        console.log(data[0][0].groups.split(","))
        if (data[0][0].groups.split(",").includes(groupname.toLowerCase())) {
            console.log("checkgroup true")
            return true
        } else {
            console.log("checkgroup false")
            return false
        }
    } catch (error) {
        console.error(error);
        return false
    }
}

module.exports = Checkgroup
