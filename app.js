const path = require('path')
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
// const helmet = require('helmet')
const morgan = require('morgan')
// const bcrypt = require('bcrypt')
// const schedule = require('node-schedule')

require('dotenv').config()

// middleware
// const userAuthentication = require('./middleware/auth')

// routes
const expenseRouter = require('./routes/expense')
const purchaseRouter = require('./routes/purchase')
const premiumFeatureRouter = require('./routes/premiumFeature')
const forgotPasswordRouter = require('./routes/forgotPassword')
const downloadreportRouter = require('./routes/downloadreport')
const loginandsignupRouter = require('./routes/signupandlogin')
const chartRouter = require('./routes/chart')

// const notificationController = require('./controllers/notification')


// models and database
const sequelize = require('./util/database')
const signup = require('./models/signupmodel')
const expense = require('./models/expensemodel')
const order = require('./models/ordermodel')
const forgotPassword = require('./models/forgotPasswordRequestsmodel')

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
)

const app = express()

app.use(cors())
// app.use(helmet())
app.use(morgan('combined', { stream: accessLogStream }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '/public')))

app.use(expenseRouter)
app.use(purchaseRouter)
app.use(premiumFeatureRouter)
app.use(forgotPasswordRouter)
app.use(downloadreportRouter)
app.use(loginandsignupRouter)
app.use(chartRouter)



// const job = schedule.scheduleJob('*/5 * * * *', async () => {
//   try {
//     const currentAmount = 1200; 
//     const recipientNumber = ; 

  
//     await notificationController.checkAmountAndSendNotification(currentAmount, recipientNumber);

//     console.log('Notification check completed successfully');
//   } catch (error) {
//     console.error('Error occurred during notification check:', error);
//   }
//   finally {
    
//     job.cancel();
//   }
// });


app.get('/', (req, res) => {
  // Render the index.html file
  res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});

app.get('/expense.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'expense.html'));
})

app.get('/singup.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'singup.html'))
})

//   res.sendFile(path.join(__dirname, 'public', 'expense.js'))
// })

//  models relationships
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
