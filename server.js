const express = require('express')
const app = express()
const session = require('express-session')
const path = require('path')
const { logger } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
// const connectDB = require('./config/connectDB')

const PORT = process.env.PORT || 3500

app.use(logger)

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(express.json())

app.use(cookieParser())

app.use(cors(corsOptions))

app.use(express.urlencoded({ extended: true }));

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/admin', require('./routes/adminRoutes'))
app.use('/user', require('./routes/adminRoutes'))

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler)

// connectDB();

// db.connect((err) => {
//     if (err) {
//         console.log("Error in the connection")
//         console.log(err)
//     } else {
//         console.log(`Database Connected`)
//         db.query(`SHOW DATABASES`,
//             function (err, result) {
//                 if (err)
//                     console.log(`Error executing the query - ${err}`)
//                 else
//                     console.log("Result: ", result)
//             })
//     }
// })

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))