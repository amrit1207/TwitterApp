var express=require('express')
var app=express()
var mongoose=require('mongoose')
var session=require('express-session')
var route=require('./routes/route')
var post=require('./routes/post')
var home=require('./routes/home')
var passport=require('./passport')


mongoose.connect('mongodb://localhost:27017/social',{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true})
.then(()=>{
    console.log("connection succesfully");
})
.catch((err)=>{
    console.log(err);
 })


app.use(session({
    secret:'jhjhjhakjhkj',
    resave:false,
    saveUninitialized:true
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(__dirname+'/static'));
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.set('view engine','hbs')
app.use('/',route);
app.use('/',post);
app.use('/',home);




app.get('*',(req,res)=>{
    res.render('error',{err:'Page Not Found',url:'/'})
})
app.listen(4000,()=>{
    console.log('server started')
})
