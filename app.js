const path = require('path')
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
// const helmet = require('helmet')
const morgan = require('morgan')

require('dotenv').config()

// middleware
const userAuthentication = require('./middleware/auth')

// routes
const expenseRouter = require('./routes/expense')
const purchaseRouter = require('./routes/purchase')
const premiumFeatureRouter = require('./routes/premiumFeature')
const forgotPasswordRouter = require('./routes/forgotPassword')
const downloadreportRouter = require('./routes/downloadreport')

const bcrypt = require('bcrypt')

// models and database
const sequelize = require('./util/database')
const signup = require('./models/signupmodel')
const expense = require('./models/expensemodel')
const order = require('./models/ordermodel')
const forgotPassword = require('./models/forgotPasswordRequestsmodel')

// controllers
const loginController = require('./controllers/login')
const signupController = require('./controllers/signup')

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

const app = express()

app.use(cors())
// app.use(helmet())
app.use(morgan('combined', { stream: accessLogStream }))

// Set the Content Security Policy (CSP) directive
// app.use(helmet.contentSecurityPolicy({
//   directives: {
//     defaultSrc: ["'self'"],
//     scriptSrc: ["'self'", 'https://cdnjs.cloudflare.com', 'https://checkout.razorpay.com', 'https://cdn.jsdelivr.net']
//   }
// }))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// app.use(express.static(path.join(__dirname, "public")));

// login
app.post('/signupdetails', signupController.signupdetails)
// signup
app.post('/logindetails', loginController.logindetails)

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '/public')))

app.use(expenseRouter)
app.use(purchaseRouter)
app.use(premiumFeatureRouter)
app.use(forgotPasswordRouter)
app.use(downloadreportRouter)

app.get('/public/expense.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'expense.html'))
})

app.get('/public/singup.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'singup.html'))
})
app.get('/public/expense.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'expense.js'))
})

signup.hasMany(expense)
expense.belongsTo(signup)

signup.hasMany(order)
order.belongsTo(signup)

signup.hasMany(forgotPassword) // user has many forgot passwords requests
forgotPassword.belongsTo(signup)

sequelize
  // .sync({ force: true })
  .sync()
  .then((response) => {
    console.log(response)
    app.listen(4000)
  })
  .catch((err) => {
    console.log(err)
  })
