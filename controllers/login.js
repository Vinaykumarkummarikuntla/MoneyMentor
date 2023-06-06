const signup = require("../models/signupmodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// generate a token
// secret key generated from ours linux-terminal 
function generateAccessToken(id,mail){
  return jwt.sign({userId:id,mail:mail },'OM43lvuJhjSc74Wk9KGdKq33QQu7uojMhAyprCt1Mo5JKqjFJ2IdrQDgEm8omL2vN4hDglXFwNroOezKVBK+gg==')
}


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
        // res.redirect("/expense.html");

        // sending response back with token if user is authenticated
        res.status(200).json({ msg: "User logineed successfully", token:generateAccessToken(user.id,email) });
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

