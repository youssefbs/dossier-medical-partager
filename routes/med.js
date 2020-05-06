const express=require('express');
const router=express.Router();
const User=require('../models/User');
const bcrypt=require('bcryptjs');
const passport=require('passport');




router.get('/login',(req,res)=>{
    res.render('loginMed');
});

router.get('/register',(req,res)=>{
    res.render('registerMed');
});


router.post('/register',(req,res)=>{
       const {name,lastname,code,email,password,password2}=req.body;
    //validation
       let errors=[];
       
       //required fields
       if(!name || !lastname || !code || !email || !password || !password2)
       {
           errors.push({ msg:'Remplir tous les champs'});
       }

       //check password
       if(password!=password2)
       {
           errors.push({msg:'vérifier le champ confirm password'})
       }
       
       //longueur password
      if(password.length<6)
      {
            errors.push({msg:'Password de longueur minimal 6'});
      }
         
      if(errors.length>=1)
      {
             res.render('registerMed',{
                 errors,
                 name,
                 lastname,
                 email,
                 code,
                 password,
                 password2
             });
      }
      else
      {
          // Unique
          User.findOne({code: code})
          .then((user)=>{
              if(user)
              {
                errors.push({msg:"Medecin deja enregistre"}); 
                res.render('registerMed',{
                    errors,
                    name,
                    lastname,
                    code,
                    email,
                    password,
                    password2
                });  
              }
              else
              {
                  const newUser=new User({
                      nom:name,
                      pernom:lastname,
                      code,
                      email,
                      password,
                  });
                  //Hash password
                  bcrypt.genSalt(10,(err,salt)=>{
                      bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw(err);

                        newUser.password=hash;
                        
                        console.log(newUser);
                        newUser.save()
                        .then(user=>{
                            req.flash('success_msg','You are registered');
                            res.redirect('/med/login');
                        })
                        .catch(err=>console.log(err));
                      });
                  });
              }
          });
      }

    });

//login
router.post('/login',(req,res,next)=>{
        passport.authenticate('local',{
            successRedirect:'/dashboard',
            failureRedirect:'/med/login',
            failureFlash:true
        })(req,res,next);
});


//logout
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/med/login');
})

module.exports=router;