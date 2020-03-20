const express=require('express');
const router=express.Router();


router.get('/register/:id',(req,res)=>{
    res.render('registerPat',{

    });
})

module.exports=router;