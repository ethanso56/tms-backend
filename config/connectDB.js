const mysql = require('mysql2/promise') 

// const connectDB = async () => {
// 	try {
// 		const db = await mysql.createConnection({
// 			host     : 'localhost',
// 			user     : 'root',
// 			password : 'Ethanso56',
// 			database : 'nodelogin'
// 		})
// 		console.log("connected to db")
// 		return db
// 	} catch (error) {
// 		console.log(error)
// 	}
	
// }

// const db = connectDB()

// const db = mysql.createConnection({
// 	host     : 'localhost',
// 	user     : 'root',
// 	password : 'Ethanso56',
// 	database : 'nodelogin'
// })



const db = mysql.createPool({
	host     : 'localhost',
	user     : 'root',
	password : 'Ethanso56',
	database : 'nodelogin'
})

// db.query("SELECT 1 = 1")

// console.log("db")

module.exports = {
	db
}