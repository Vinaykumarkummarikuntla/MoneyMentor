const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const bcrypt = require("bcrypt");

const sequelize = require("./util/database");
const signup = require("./models/signupmodel");

const loginController = require("./controllers/login");
const signupController = require("./controllers/signup");
const expenseController = require("./controllers/expense");


const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));


app.post("/signupdetails", signupController.signupdetails);

app.post("/logindetails",loginController.logindetails);

app.post("/expensedetails",expenseController.expense);

app.get("/expensedetails",expenseController.getexpense);

app.delete("/deleteexpense",expenseController.deleteexpense);





sequelize
  .sync()
  .then((response) => {
    console.log(response);
    app.listen(4000);
  })
  .catch((err) => {
    console.log(err);
  });
