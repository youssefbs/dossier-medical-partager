const express=require('express');
const router=express.Router();
const  {ensureAuthenticated}=require('../config/auth');

router.get('/register',(req,res)=>{
    res.render('registerPat');
});


router.post('/register',ensureAuthenticated,(req,res)=>{

    const {name,lastname,adresse,telephone}=req.body;
     
    const errors=[]
    if(!name||!lastname||!adresse||!telephone)
    {
        errors.push({msg:'Remplir tous les champs'});
    }
    if(telephone<10000000 || telephone>99999999)
    {
        errors.push({msg:'Le numero est incorrect'});
    }
 
    if(errors.length>=1)
    {
         res.render('registerPat',{
             errors,
             name,
             lastname,
             adresse,
             telephone
         });
    }
    else
    {
       const Patient={
         nomPat:name,
         pernomPat:lastname,
         adresse:adresse,
         telephone:telephone,
         consultation:[]
        }
     req.user.patient.push(Patient);
     req.user.save();
     res.redirect('/dashboard');
    }
     
 
 })

module.exports=router;