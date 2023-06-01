const bcrypt = require("bcrypt");
const signup = require("../models/signupmodel");

exports.signupdetails = async (req, res, next) => {
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
  };