const signup = require("../models/signupmodel");
const bcrypt = require("bcrypt");

exports.logindetails = async (req, res, next) => {
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
  };


  
  