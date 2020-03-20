const express=require('express');
const expressLayouts=require('express-ejs-layouts');
const mongoose=require('mongoose');
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');
require('./config/passport')(passport);


const app=express();

//Connect DB
mongoose.connect('mongodb://localhost:27017/Project',{useNewUrlParser:true,useUnifiedTopology: true})
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err));


//EJS
app.use(expressLayouts);
app.set('view engine','ejs'); 

//body-parse
app.use(express.urlencoded({extended:false}));

//Express Session
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());



//connect flash
app.use(flash());


//varaible global
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//Routes
app.use('/',require('./routes/index'));
app.use('/med',require('./routes/med'));
app.use('/pat',require('./routes/pat'));



const PORT=process.env.PORT||5000;
app.listen(PORT,()=>{console.log(`the server is runing on the PORT ${PORT}`)});