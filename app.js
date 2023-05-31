const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const bcrypt = require("bcrypt");

const sequelize = require("./util/database");
const signup = require("./models/signupmodel");

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// storing user details in database
app.post("/signupdetails", async (req, res, next) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    console.log("the storing details are " + username + " and " + email);

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("hashedpassword", hashedPassword);

    const data = await signup.create({
      username: username,
      email: email,
      password: hashedPassword,
    });
    res.status(200).json({ signupdetails: data });
  } catch (err) {
    console.error(err);
  }

  //   res.sendFile('./public/login/index.html');
});

app.post("/logindetails", async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await signup.findOne({
      where: {
        email: email,
      },
    });
    if (user) {
      // console.log("Stored hashed password:", user.password);
      // console.log("Entered password:", password);

      const isMatched = await bcrypt.compare(password, user.password);

      // console.log("Password comparison result:", isMatched);

      if (isMatched) {
        res.status(200).json({ logindetails: user });
        console.log("Password is correct");
      } else {
        console.log("Password is incorrect");
        res.status(401).json({ error: "User not authorized" });
      }
    } else {
      console.log("User is does not exist");
      res.status(404).json({ error: "User is not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

sequelize
  .sync({})
  .then((response) => {
    console.log(response);
    app.listen(4000);
  })
  .catch((err) => {
    console.log(err);
  });
