const express=require('express');
const router=express.Router();
const  {ensureAuthenticated}=require('../config/auth');
const mongoose=require('mongoose');
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
        //unique
        User.findOne({"patient.telephone":telephone ,code:req.user.code})
        .then((user)=>{
            if(user)
            {
                errors.push({msg:'Patient deja existant'})
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
               User.findOne({"patient.telephone":telephone})
                .then((user)=>{
                    if(user)
                    { 
                        errors.push({msg:'Patient a etait ajouter par un autre Medecin'})
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
                            prenomPat:lastname,
                            adresse:adresse,
                            telephone:telephone,
                            consultation:[]
                           }
                        req.user.patient.push(Patient);
                        req.user.save();
                        res.redirect('/dashboard');
                    }
                })
            }
        })

    }
 })

router.get('/consultation/:nom/:prenom/:adresse/:telephone',ensureAuthenticated,(req,res)=>{
    res.render('cons',{
       nom:req.params.nom,
       prenom:req.params.prenom,
       adresse:req.params.adresse,
       tel:req.params.telephone
    });
})


router.post('/consultation/:id',ensureAuthenticated,(req,res)=>{
    const num=req.params.id;
    let i;
    let post;
    for(i=0;i<req.user.patient.length;i++)
    {
        if(req.user.patient[i].telephone==num)
         break;
    }
    post=i;
    let medicament=[];
    if(typeof req.body.NomMedicament!='undefined')
    {
        if(typeof req.body.NomMedicament=='string' )
        {
                
                medicament.push({NomMedica:req.body.NomMedicament,
                dure:req.body.duree,
                quantite:req.body.quantite});
                console.log(medicament);
        }else
        {
  
            const n=req.body.NomMedicament.length
            let i=0;
            for(i=0;i<n;i++)
            {
                medicament.push({NomMedica:req.body.NomMedicament[i],
                dure:req.body.duree[i],
                quantite:req.body.quantite[i]})
            }
            console.log(medicament);
        }
    }
    const newCon={
        date:Date.now(),
        compterendu:req.body.CompteRendu,
        medicament:medicament
    }
    req.user.patient[post].consultation.push(newCon);
    req.user.save();
    res.redirect('/dashboard');
})



router.get('/consultation/contenu/:id',ensureAuthenticated,(req,res)=>{
    res.render('cons_contenu',{
        nom:req.user.patient[req.params.id].nomPat,
        tel:req.user.patient[req.params.id].telephone,
        prenom:req.user.patient[req.params.id].prenomPat,
        adresse:req.user.patient[req.params.id].adresse,  
        consultations:req.user.patient[req.params.id].consultation,
        id:req.params.id
    });
});

router.get('/consultations/:id',ensureAuthenticated,(req,res)=>{
    //console.log(req.app.locals.docteurs);c
    let i=0;
    for(i=0;i<req.user.patient.length;i++)
    {
        if(req.user.patient[i].telephone==req.params.id)
           break;
    }
    res.render('consPat',{
        docs:req.app.locals.docteurs,        
        pat:req.user.patient[i]      
    })

})


router.get('/consultation/delete/:id/:id2',ensureAuthenticated,(req,res)=>{                
        req.user.patient[req.params.id].consultation.splice(req.params.id2,1)
        req.user.save();

        res.redirect('/pat/consultation/contenu/'+req.params.id);   
});

router.get('/consultation/update/:id/:id2',ensureAuthenticated,(req,res)=>{
    res.render('updatecons.ejs',{
        nom:req.user.patient[req.params.id].nomPat,
        prenom:req.user.patient[req.params.id].prenomPat,
        adresse:req.user.patient[req.params.id].adresse,
        tel:req.user.patient[req.params.id].telephone,
        compterendu:req.user.patient[req.params.id].consultation[req.params.id2].compterendu,
        medicament:req.user.patient[req.params.id].consultation[req.params.id2].medicament,
        id:req.params.id,
        i:req.params.id2
    })
})

router.post('/consultation/update/:id/:id2',(req,res)=>{
    const medicamentarray=[];
    const {compterendu,NouvNom,NouvDure,NouvQuantite,NomMedicament,quantite,duree}=req.body
    if(typeof NomMedicament!="undefined")
    {
        if(typeof NomMedicament=="string")
        {
                medicamentarray.push({NomMedica:NomMedicament,
                dure:duree,
                quantite:quantite});
                //console.log(medicamentarray);
        }
        else
        {
            const n=NomMedicament.length
            let i=0;
            for(i=0;i<n;i++)
            {
                medicamentarray.push({NomMedica:NomMedicament[i],
                dure:duree[i],
                quantite:quantite[i]})
            }
            //console.log(medicamentarray);   
        }
    }
    if(typeof NouvNom!="undefined")
    {
        if(typeof NouvNom=="string")
        {
                medicamentarray.push({NomMedica:NouvNom,
                dure:NouvDure,
                quantite:NouvQuantite});
                //console.log(medicamentarray);
        }
        else
        {
            const n=NouvNom.length
            let i=0;
            for(i=0;i<n;i++)
            {
                medicamentarray.push({NomMedica:NouvNom[i],
                dure:NouvDure[i],
                quantite:NouvQuantite[i]})
            }
            //console.log(medicamentarray);
        }
    }
    let con={
        date:req.user.patient[req.params.id].consultation[req.params.id2].date,
        compterendu:compterendu,
        medicament:medicamentarray,
    }
    console.log(con);
    req.user.patient[req.params.id].consultation[req.params.id2].compterendu=compterendu;
    req.user.patient[req.params.id].consultation[req.params.id2].medicament=[...medicamentarray];
    console.log(req.user.patient[req.params.id].consultation[req.params.id2]);
    req.user.save();
    res.redirect('/pat/consultation/contenu/'+req.params.id);
})



router.get('/consultations/:id/:Doc',(req,res)=>{
      let i;
      User.findOne({"code":req.params.Doc})
      .then(user=>{
          if(user)
          {
              let i;
              for(i=0;i<user.patient.length;i++)
              {
                  if(user.patient[i].telephone==req.params.id)
                    break;
              }
              res.render('consPatDoc.ejs',{
                  consultations:user.patient[i].consultation,
                  pat:user.patient[i]
              })
          }
      })
 })
module.exports=router;