const express=require('express');
const router=express.Router();
const  {ensureAuthenticated}=require('../config/auth');
const User=require('../models/User');


router.get('/',(req,res)=>{
    res.render('welcome')
})

router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    res.render('dashboard',{
        pat:req.user.patient
    })
});


router.post('/dashboard',ensureAuthenticated,(req,res)=>{
    const num=req.body.numero;
    const num1=req.body.numero1
    const n=req.user.patient.length;
    const errors=[];
if(typeof num!='undefined')
{
    let i=0;
    if(num<10000000 || num>99999999)
    {
        errors.push({msg:"la longueur du numero est 8"});
    }
    
    while(i<n && req.user.patient[i].telephone!=num)
    {
        i=i+1;
    }
    if(i>n)
    {
        errors.push({msg:"Patient inexistant"});
    }
    
    if(errors.length>=1)
    {
        res.render('dashboard',{
            errors,
            num,
            pat:req.user.patient
        })
    }
    else
    {
        res.redirect('/pat/consultation/'+i);
    }
}
else
{
    if(num1<10000000 || num1>99999999)
    {
        errors.push({msg:"la longueur du numero est 8"});
        res.render('dashboard',{errors});
    }
    
    User.find({'patient.telephone':num1})
     .then((Users)=>{
         if(!Users)
         {
            
            errors.push({msg:'Patient inexitant'});
            res.render('dashboard',{errors});
         }
         else
         {
            console.log(Users);
            //3andi resultat ki n3mel console.log(Users);
            //Ama ki na3mmel Users.patient wela email ijini undefined 
         }
         
     })
    
}
})

module.exports=router;