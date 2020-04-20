const express=require('express');
const router=express.Router();
const  {ensureAuthenticated}=require('../config/auth');
const User=require('../models/User');

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

router.get('/consultation/:id',ensureAuthenticated,(req,res)=>{
    const num =req.params.id;

    res.render('cons',{
        tel:num,
        nom:req.user.patient[num].nomPat,
        prenom:req.user.patient[num].pernomPat,
        adresse:req.user.patient[num].adresse,
    });
})


router.post('/consultation/:id',ensureAuthenticated,(req,res)=>{
    const num=req.params.id;
    let medicament=[];
    if(typeof req.body.NomMedicament!='undefined')
    {
        if(typeof req.body.NomMedicament=='string' )
        {
                
                medicament.push({NomMedica:req.body.NomMedicament,
                duree:req.body.duree,
                quantite:req.body.quantite});
        }else
        {
  
            const n=req.body.NomMedicament.length
            let i=0;
            for(i=0;i<n;i++)
            {
                medicament.push({NomMedica:req.body.NomMedicament[i],
                duree:req.body.duree[i],
                quantite:req.body.quantite[i]})
            }
        }
    }
    const newCon={
        date:Date.now(),
        compterendu:req.body.CompteRendu,
        medicament:medicament
    }
    req.user.patient[num].consultation.push(newCon);
    req.user.save();
    res.redirect('/dashboard');
})



router.get('/cosultation/contenu/:id',ensureAuthenticated,(req,res)=>{
    res.render('cons_contenu',{
        nom:req.user.patient[req.params.id].nomPat,
        tel:req.user.patient[req.params.id].telephone,
        prenom:req.user.patient[req.params.id].pernomPat,
        adresse:req.user.patient[req.params.id].adresse,  
        consultations:req.user.patient[req.params.id].consultation,
        id:req.params.id
    });
});


router.get('/consultation/delete/:id/:id2',ensureAuthenticated,(req,res)=>{
    req.user.patient[req.params.id].consultation[].splice(req.params.id,1);
    res.redirect('/pat/consultation/contenu/'+req.params.id);    
});


module.exports=router;