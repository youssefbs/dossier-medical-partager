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
    const m=req.user.patient.length;
    if(m==0)
    {
        errors.push({msg:"Il n'a pas de cosultaion "});
        res.render('dashboard',{errors});
    }
    else
    {
        let i;
        for(i=0;i<m;i++)
        {
            if(req.user.patient[i].telephone==num1)
            {
                
                   res.redirect('pat/cosultation/contenu/'+i);
                   i=m+1;
                break;
            }   
        }
        if(i>m)
        {
            errors.push({msg:"Il n'a pas de pateint avec se numero"});
            res.render('dashboard',{errors});
        }
            
    }

    
    
}
})

module.exports=router;