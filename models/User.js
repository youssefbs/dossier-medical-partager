const mongoose=require('mongoose')
//const Patient=require('./Patient')

/*const MedicaSchema=new mongoose.Schema({
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
    pernom:{
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
})*/


const UserSchema=new mongoose.Schema({


    nom:{
        type:String
    },
    pernom:{
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
    patient:[{
        nomPat:{
            type:String
        },
        prenomPat:{
            type:String
        },
        adresse:{
            type:String
        },
        telephone:{
            type:String
        },
        consultation:[{
            date:{
                type:Date
            },
            compterendu:{
                type:String
            },
            medicament:[{
                NomMedica:{
                    type:String
                },
                dure:{
                    type:Number
                },
                quantite:{
                    type:Number
                }
            }]        
        }]
    }]
});

/*const Consultation=mongoose.model('Consultation',ConsSchema);
const Medicament=mongoose.model('Medicament',MedicaSchema);
const Patient=mongoose.model('Patient',PatSchema);*/
const User=mongoose.model('User',UserSchema);
module.exports=User;