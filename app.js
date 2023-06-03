const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const mime = require("mime");

const bcrypt = require("bcrypt");

// models and database
const sequelize = require("./util/database");
const signup = require("./models/signupmodel");
const expense = require("./models/expensemodel");

// controllers
const loginController = require("./controllers/login");
const signupController = require("./controllers/signup");
const expenseController = require("./controllers/expense");


const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, "public")));


// urls
app.post("/signupdetails", signupController.signupdetails);

app.post("/logindetails",loginController.logindetails);

app.post("/expensedetails",expenseController.expense);

app.get("/expensedetails",expenseController.getexpense);

app.delete("/deleteexpense",expenseController.deleteexpense);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "/public")));




// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

app.get("/public/expense.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public","expense.html"));
});

app.get("/public/singup.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public","singup.html"));
});
app.get("/public/expense.js", (req, res) => {
  res.sendFile(path.join(__dirname, "public","expense.js"));
});

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
