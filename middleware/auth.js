const jwt = require('jsonwebtoken');
const User = require('../models/signupmodel');


exports.authenticate = async(req,res,next) =>{

    try{
        const secretkey = 'OM43lvuJhjSc74Wk9KGdKq33QQu7uojMhAyprCt1Mo5JKqjFJ2IdrQDgEm8omL2vN4hDglXFwNroOezKVBK+gg=='
        const token = await req.header('Authorization')
        
        const user = jwt.verify(token,secretkey)
        console.log("userid>>>>>>>>>>.." ,user.userId)
        User.findByPk(user.userId)
        .then(user => {
            console.log(JSON.stringify(user));
            // important
            req.user = user;
            next();
        }
        )
        .catch(err =>{
            console.log(err)
        })
    }

    catch(err){
        console.log(err)
       return res.status(401).json({message:false});
   }
}

