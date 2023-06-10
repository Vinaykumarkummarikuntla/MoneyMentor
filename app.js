const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

require('dotenv').config()

const userAuthentication = require("./middleware/auth")

const expenseRouter = require("./routes/expense")
const purchaseRouter = require("./routes/purchase")



const bcrypt = require("bcrypt");

// models and database
const sequelize = require("./util/database");
const signup = require("./models/signupmodel");
const expense = require("./models/expensemodel");
const order = require("./models/ordermodel");

// controllers
const loginController = require("./controllers/login");
const signupController = require("./controllers/signup");



const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, "public")));



// login
app.post("/signupdetails", signupController.signupdetails);
// signup
app.post("/logindetails",loginController.logindetails);



// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "/public")));


app.use(expenseRouter);
app.use(purchaseRouter);


app.get("/public/expense.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public","expense.html"));
});

app.get("/public/singup.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public","singup.html"));
});
app.get("/public/expense.js", (req, res) => {
  res.sendFile(path.join(__dirname, "public","expense.js"));
});

signup.hasMany(expense);
expense.belongsTo(signup);

signup.hasMany(order);
order.belongsTo(signup);




sequelize
  // .sync({force :true })
  .sync()
  .then((response) => {
    console.log(response);
    app.listen(4000);
  })
  .catch((err) => {
    console.log(err);
  });
