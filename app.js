const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const sequelize = require("./util/database");
const signup = require("./models/signupmodel");

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/signupdetails", async (req, res, next) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const data = await signup.create({
      username: username,
      email: email,
      password: password,
    });
    res.status(200).json({ signupdetails: data });
  } catch (err) {
    console.error(err);
  }
});

app.post("/logindetails", async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user= await signup
      .findOne({
        where: {
          email: email,
        },
      })
      .then((user) => {
        if (user) {
          if (user.password === password) {
            res.status(200).json({ logindetails: user });
            console.log("Password is correct");
          } else {
            console("Password is incorrect");
            res.status(401).json({ error: "User not authorized" });
          }
        } else {
          console.log("User is does not exist");
          res.status(404).json({ error: "User is not found" });
        }
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

sequelize
  .sync()
  .then((response) => {
    console.log(response);
    app.listen(4000);
  })
  .catch((err) => {
    console.log(err);
  });
