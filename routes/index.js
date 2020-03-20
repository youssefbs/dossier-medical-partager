const express=require('express');
const router=express.Router();
const  {ensureAuthenticated}=require('../config/auth');


router.get('/',(req,res)=>{
    res.render('welcome')
})

router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    res.render('dashboard',{
        id:req.user._id
    });
    console.log(req.user);
    
})

router.post('/dashboard',(req,res)=>{

    //update 

    res.render('/dashboard');
})

module.exports=router;