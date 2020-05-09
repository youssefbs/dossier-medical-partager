const express=require('express');
const router=express.Router();
const  {ensureAuthenticated}=require('../config/auth');
const User=require('../models/User');
const mongoose=require('mongoose');


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
    const num1=req.body.numero1;
    const num2=req.body.numero2;
    const errors=[];
if(typeof num!='undefined')
{
    let i=0;
    if(num<10000000 || num>99999999)
    {
        errors.push({msg:"la longueur du numero est 8"});
        res.render('dashboard',{
            errors,
            num,
            pat:req.user.patient
        })
    }
   
    User.findOne({"patient.telephone":num})
    .then((user)=>{
        if(user)
        {
            let i=0;
            for(i=0;i<user.patient.length;i++)
            {
                if(user.patient[i].telephone==num)
                    break;
            }
            console.log(user.patient[i]);
            User.findOne({"patient.telephone":num,code:req.user.code})
            .then((user1)=>{
                if(user1)
                {
                   
                }
                else
                {
                    console.log("p2")
                    let p1={
                        nomPat:user.patient[i].nomPat,
                        adresse:user.patient[i].adresse,
                        prenomPat:user.patient[i].prenomPat,
                        telephone:user.patient[i].telephone
                    }
                    req.user.patient.push(p1);
                    req.user.save()
                }
                res.redirect('/pat/consultation/'+user.patient[i].nomPat+'/'+user.patient[i].prenomPat+'/'+user.patient[i].adresse+'/'+user.patient[i].telephone);
            })
            
        }
        else
        { 
            errors.push({msg:'Patient inexistant'});
            res.render('dashboard',{
                errors,
                num,
                pat:req.user.patient
            })
        }
    })
}
else if(typeof num1!="undefined")
{
    if(num1<10000000 || num1>99999999)
    {
        errors.push({msg:"la longueur du numero est 8"});
        res.render('dashboard',{errors,pat:req.user.patient});
    }
    else if(req.user.patient.length==0)
    {

        errors.push({msg:"Il n'a pas de cosultaion "});
        res.render('dashboard',{errors,pat:req.user.patient});
    }
    else
    {
        const m=req.user.patient.length;
        let i;
        for(i=0;i<m;i++)
        {
            if(req.user.patient[i].telephone==num1)
            {
                
                   res.redirect('/pat/consultation/contenu/'+i);
                   i=m+1;
                break;
            }   
        }
        if(i>m)
        {
            errors.push({msg:"Il n'a pas de pateint avec se numero"});
            res.render('dashboard',{errors,pat:req.user.patient});
        }
            
    }
}
else
{
    if(num2<10000000 || num2>99999999)
    {
        errors.push({msg:"la longueur du numero est 8"});
        res.render('dashboard',{errors,pat:req.user.patient});
    }
    else
    {
        User.find({"patient.telephone":num2 , code:{$ne:req.user.code} })
        .then((users)=>{
            if(users.length>=1)
            {
                req.app.locals.docteurs=users;
                res.redirect("/pat/consultations/"+num2);
            }
            else
            {
                errors.push({msg:"Ce patient n'a pas de consultation chez d'autre docteurs"});
                res.render('dashboard',{errors,pat:req.user.patient});
            }
        })
    }
     
       
}
})

module.exports=router;