var express=require('express')
var blogroute=express.Router()
var Post=require('../models/posts')
var User=require('../models/user')
var Reply=require('../models/replies')


//create post route
blogroute.get('/createpost',async (req,res)=>{
    if(!req.session.userId){
        res.redirect('/login')
    }
    else{
        let auth=false;
        let email=null;
        if(req.session.userId){
            auth=true;
            email=await User.findOne({_id:req.session.userId},{});
            
        }
        res.render('createpost',{auth:auth,authoremail:email.email,authorname:email.name})
    }
})


//'post' request route to save post
blogroute.post('/createpost',async (req,res)=>{
    if(req.body.topic && req.body.authoremail && req.body.authorname && req.body.content){
        try{var postData=new Post({
            content:req.body.content,
            authoremail:req.body.authoremail,
            authorname:req.body.authorname,
            topic:req.body.topic,
            like:0,
            dislike:0
       })
        
      const result=await postData.save();
      console.log(result);
      res.redirect('/myposts');

       }
       catch(error){
           var err=new Error('Error while creating and saving post');
           res.render('error',{err:err,url:'/createpost'});
       }
   }

   else{
       var err=new Error('Please enter all fields');
       err.status=404;
       res.render('error',{err:err,url:'/createpost'});
   }
})



//route to get all posts of current user.
blogroute.get('/myposts',async (req,res)=>{
    if(!req.session.userId){
        res.redirect('/login')
    }
    else{
        let auth=false;
        let email=null;
        if(req.session.userId){
            auth=true;
            email=await User.findOne({_id:req.session.userId},{_id:0,email:1});
            
        }
        const myposts=await Post.find({authoremail:email.email})
       res.render('myposts',{auth:auth,posts:myposts})
    }
    
})


//route to like the post 
blogroute.post('/like',async(req,res)=>{
    if(!req.session.userId){
        res.redirect('/login')
    }
    else{
        let auth=false;
        if(req.session.userId){
            auth=true;
        }
        const mypost=await Post.findOne({_id:req.body.id})
     
        var likenew=mypost.like+1;
  
        const likepost=await Post.findOneAndUpdate({_id:req.body.id},{$set:{like:likenew}},{new:true,useFindAndModify:false})
   
        res.redirect('/myposts')
    }
})


//route to dislike the post 
blogroute.post('/dislike',async(req,res)=>{
    if(!req.session.userId){
        res.redirect('/login')
    }
    else{
        let auth=false;
        if(req.session.userId){
            auth=true;
        }
        const mypost=await Post.findOne({_id:req.body.id})
      
        var dislikenew=mypost.dislike+1;

        const dislikepost=await Post.findOneAndUpdate({_id:req.body.id},{$set:{dislike:dislikenew}},{new:true,useFindAndModify:false})
  
        res.redirect('/myposts')
    }
})


// reply route
blogroute.post('/reply',async(req,res)=>{
    const user=await User.findById(req.session.userId)
    console.log(user.name)
    try{var replyData=new Reply({
        content:req.body.content,
        postid:req.body.postid,
        authorname:user.name,
        like:0,
        dislike:0
   })

    
  const result=await replyData.save();

  res.redirect('/myposts');

   }
   catch(error){
       var err=new Error('Error while creating and saving post');
       res.render('error',{err:err,url:'/myposts'});
   }
})

//route to get details of the particular post and get all comments/replies on that post.
blogroute.get('/postdetails/:id',async(req,res)=>{
    if(!req.session.userId){
        res.redirect('/login')
    }
    else{
        let auth=false;
        if(req.session.userId){
            auth=true;
        }
        const postdetails=await Post.findOne({_id:req.params.id})
        const replies=await Reply.find({postid:req.params.id})
       
  
        res.render('postdetails',{auth:auth,postdetails:postdetails,replies:replies});
    }
})

//route to like the particular comment 
blogroute.post('/likecomment',async(req,res)=>{
    if(!req.session.userId){
        res.redirect('/login')
    }
    else{
        let auth=false;
        if(req.session.userId){
            auth=true;
        }
        const mycomments=await Reply.findOne({_id:req.body.id})
        const postid=mycomments.postid;
        var likenew=mycomments.like+1;
  
        const likepost=await Reply.findOneAndUpdate({_id:req.body.id},{$set:{like:likenew}},{new:true,useFindAndModify:false})
        res.redirect('/postdetails/'+postid);
    }
})

//route to dislike the particular comment
blogroute.post('/dislikecomment',async(req,res)=>{
    if(!req.session.userId){
        res.redirect('/login')
    }
    else{
        let auth=false;
        if(req.session.userId){
            auth=true;
        }
        const mycomments=await Reply.findOne({_id:req.body.id})
        const postid=mycomments.postid;
        var dislikenew=mycomments.dislike+1;
  
        const likepost=await Reply.findOneAndUpdate({_id:req.body.id},{$set:{dislike:dislikenew}},{new:true,useFindAndModify:false})
        res.redirect('/postdetails/'+postid);
    }
})



module.exports=blogroute;
