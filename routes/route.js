var express=require('express')
var route=express.Router();
var User=require('../models/user')
var passport=require('passport')


//home page route
route.get('/',(req,res)=>{
    let auth=false;
    if(req.session.userId){
        auth=true;
    }
    res.render('index',{title:'Index',auth:auth})
 })
 
//signup page route
route.get('/register',(req,res)=>{
    
    res.render('register',{title:'SignUp'})
})

//signup post route
route.post('/register',async(req,res)=>{
    if(req.body.email && req.body.password && req.body.name){
        try{var userData=new User({
             name:req.body.name,
             email:req.body.email,
             password:req.body.password
        })
         
       const result=await userData.save();
       req.session.userId=result._id;
       res.redirect('/');

        }
        catch(error){
            var err=new Error('User already exists');
            res.render('error',{err:err,url:'/register'});
        }
    }

    else{
        var err=new Error('Please enter all fields');
        err.status=404;
        res.render('error',{err:err,url:'/register'});
    }
})


//login page route
route.get('/login',(req,res)=>{
    if(req.session.userId){
        res.redirect('/profile')
    }
    else{
        res.render('login',{title:'Login'})
    }
   
})


//login page post route
route.post('/login',async (req,res)=>{
    if(req.body.email && req.body.password){
        try {
            const resultUser = await User.findOne({ email: req.body.email });
            if (resultUser == null) {
                var err = new Error('user not exists...please signup');
                res.render('error', { err: err, url: '/register' });
            }
            const result = await User.findOne({ $and: [{ email: req.body.email }, { password: req.body.password }] });
            req.session.userId = await result._id;
            res.redirect('/');

        }
          catch(error){
            var err=new Error('wrong password or username');  
            res.render('error',{err:err,url:'/login'});
          }
    }
    else{
        var err=new Error('Please enter all fields');
        err.status=404;
        res.render('error',{err:err,url:'/login'});
    }
})


//logout
route.get('/logout',async(req,res)=>{
    try{
        await req.session.destroy();
        res.redirect('/');
    }
    catch(error){
        var err=new Error('error');
        res.render('error',{err:err,url:'/logout'});
    }
})


//login through facebook
route.get('/login/facebook',passport.authenticate('facebook'))

// GET '/facebook/callback
route.get('/facebook/callback',passport.authenticate('facebook',{
    failureRedirect:'/login',
    successRedirect:'/'
}))


//login through twitter
route.get('/login/twitter',
  passport.authenticate('twitter'));

// GET '/twitter/callback
route.get('/login/twitter/callback', passport.authenticate('twitter', { 
    failureRedirect: '/login' ,
    successRedirect:'/'
}));  

module.exports=route;