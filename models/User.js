const mongoose=require('mongoose');

const MedicaSchema=new mongoose.Schema({
    NomMedica:{
        type:String
    },
    dure: {
        type:Number
    },
    quantite:{
        type:Number
    }
});


const ConsSchema=new mongoose.Schema({
     date:
     {
         type:Date,
         default:Date.now
     },
     compterendu:{
         type:String
     },
     medicament:[MedicaSchema]
});

const PatSchema=new mongoose.Schema({
    nomPat:{
        type:String
    },
    pernomPat:{
        type:String
    },    
    adresse:{
        type:String
    },
    telephone:{
        type:Number
    },
    consultation:[ConsSchema]
});

const UserSchema=new mongoose.Schema({

    nom:{
        type:String
    },
    prenom:{
         type:String
    },
    email:{
        type:String
    },
    code:{
        type:String
    },
    password:{
        type:String
    },
    patient:[PatSchema]
});

const User=mongoose.model('User',UserSchema);
module.exports=User;