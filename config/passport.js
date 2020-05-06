const localStrategy=require('passport-local').Strategy;
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const User=require('../models/User');


module.exports=function(passport){
    passport.use(
        new localStrategy({usernameField:'code'},(code,password,done)=>{
                    //Match code
                    User.findOne({code:code})
                    .then(user=>{
                        if(!user)
                        {
                             return done(null,false,{msg:"The code is not registered"});
                        }
                        else
                        {
                             //Match password
                             bcrypt.compare(password,user.password,(err,isMatch)=>{
                                 if(err) throw(err);
                                 if(isMatch)
                                 {
                                    return done(null,user);
                                 }
                                 else
                                 {
                                    return done(null,false,{msg:"The password is  incorrect"});
                                 }
                             });
                        }
                    })
                    .catch((err)=>console.log(err)); 
        })
    );
    passport.serializeUser((user, done)=> {
        done(null,user.id);
      });
    
      passport.deserializeUser((id, done)=> {
        User.findById(id, (err, user)=> {
          done(err, user);
        });
      });

}