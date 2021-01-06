var express=require('express')
var homeroute=express.Router()
var Post=require('../models/posts')
const User = require('../models/user')
const Reply=require('../models/replies')



// route to show all posts on the explore feed page
homeroute.get('/explorefeed',async(req,res)=>{
    if(!req.session.userId){
        res.redirect('/login')
    }
    else{
        let auth=false;
        let email=null;
        if(req.session.userId){
            auth=true;
        }
        const allposts=await Post.find()
       res.render('explore',{auth:auth,allposts:allposts})
    }
})

//like the paricular post on explore feed page
homeroute.post('/likeexplore',async(req,res)=>{
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
        res.redirect('/explorefeed')
    }
})

//dislike the particular post on explore feed page
homeroute.post('/dislikeexplore',async(req,res)=>{
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

        res.redirect('/explorefeed')
    }
})


// follow user route...it show all the users to current user so that current user can follow other users.
homeroute.get('/follow',async (req,res)=>{
    if(!req.session.userId){
        res.redirect('/login')
    }
    else{
        let auth=false;
        if(req.session.userId){
            auth=true;
           
        }
        const users=await User.find();
        const followuserlist=[];
        const finalfollowuserlist=[];

        for(let i =0;i<users.length;i++){
            if(users[i]._id!=req.session.userId){
                followuserlist.push(users[i])
            }
        }
        const currentUser=await User.findOne({_id:req.session.userId})
        for(let i=0;i<followuserlist.length;i++){
            var check=false;
            for(let j=0;j<currentUser.followings.length;j++){
                if(followuserlist[i]._id==currentUser.followings[j]){
                    check=true;
                }
            }
            if(check==false){
                finalfollowuserlist.push(followuserlist[i]);
            }
        }
       res.render('follow',{auth:auth,users:finalfollowuserlist})
    }
})


//follow particular user route
homeroute.get('/followuser/:id',async (req,res)=>{
    if(!req.session.userId){
        res.redirect('/login')
    }
    else{
        let auth=false;
        if(req.session.userId){
            auth=true;
           
        }
        try{
            const userUpdated=await User.findOneAndUpdate({_id:req.session.userId},{$push:{followings:req.params.id}},{new:true,useFindAndModify:false})
            const userUpdated2=await User.findOneAndUpdate({_id:req.params.id},{$push:{followers:req.session.userId}},{new:true,useFindAndModify:false})
            console.log(userUpdated)
            console.log(userUpdated2)
            res.redirect('/follow')
        }
        catch(error){
            var err=new Error('Error while creating and saving post');
            res.render('error',{err:err,url:'/follow'});
        }
        
    }
})


//route to show all the posts of the users follow by the current user.
homeroute.get('/homeuser',async(req,res)=>{
    if(!req.session.userId){
        res.redirect('/login')
    }
    else{
        let auth=false;
        if(req.session.userId){
            auth=true;
           
        }
        try{
            const followingusersId=await User.findOne({_id:req.session.userId},{_id:0,followings:1})
            const followingusersposts=[]
            for(let i=0;i<followingusersId.followings.length;i++){
                const user=await User.findOne({_id:followingusersId.followings[i]},{_id:0,email:1})
                const posts=await Post.find({authoremail:user.email});
                for(let j=0;j<posts.length;j++){
                    followingusersposts.push(posts[j])
                }
            }
            res.render('homefeed',{posts:followingusersposts,auth:auth});
        }
        catch(error){
            var err=new Error('Error while getting your following users post');
            res.render('error',{err:err,url:'/homeuser'});
        }
        
    }
})

//like the paricular post on home feed page
homeroute.post('/likehome',async(req,res)=>{
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
       
        res.redirect('/homeuser')
    }
})

//dislike the particular post on home feed page
homeroute.post('/dislikehome',async(req,res)=>{
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
        res.redirect('/homeuser')
    }
})



//route to get all the followers of the current user.
homeroute.get('/followers',async(req,res)=>{
    if(!req.session.userId){
        res.redirect('/login')
    }
    else{
        let auth=false;
        if(req.session.userId){
            auth=true;
           
        }
        try{
            const followersusersId=await User.findOne({_id:req.session.userId},{_id:0,followers:1})
            const followersusers=[]
            for(let i=0;i<followersusersId.followers.length;i++){
                const user=await User.findOne({_id:followersusersId.followers[i]})
                followersusers.push(user);

            }
           res.render('followers',{followers:followersusers,auth:auth});
        }
        catch(error){
            var err=new Error('Error ...');
            res.render('error',{err:err,url:'/followers'});
        }
        
    }
})

// details of the particular follower users of the current user.
homeroute.get('/followerdetails/:id',async(req,res)=>{
    if(!req.session.userId){
        res.redirect('/login')
    }
    else{
        let auth=false;
        if(req.session.userId){
            auth=true;
           
        }
        try{
            const user=await User.findOne({_id:req.params.id})
            var userPost=null;
            if(user!=null){
                userPost =await Post.find({authoremail:user.email})
            }
            
            res.render('followersdetails',{auth:auth,user:user,userpost:userPost});
        }
        catch(error){
            var err=new Error('Error ....');
            res.render('error',{err:err,url:'/followers'});
        }
        
    }
})

// route to get list of all the followings users by the current user
homeroute.get('/followings',async(req,res)=>{
    if(!req.session.userId){
        res.redirect('/login')
    }
    else{
        let auth=false;
        if(req.session.userId){
            auth=true;
           
        }
        try{
            const followingsusersId=await User.findOne({_id:req.session.userId},{_id:0,followings:1})
            const followingsusers=[]
            for(let i=0;i<followingsusersId.followings.length;i++){
                const user=await User.findOne({_id:followingsusersId.followings[i]})
                followingsusers.push(user);

            }
           res.render('followings',{followings:followingsusers,auth:auth});
        }
        catch(error){
            var err=new Error('Error while following the user');
            res.render('error',{err:err,url:'/followings'});
        }
        
    }
})

// details of the particular followings of the current user.
homeroute.get('/followingsdetails/:id',async(req,res)=>{
    if(!req.session.userId){
        res.redirect('/login')
    }
    else{
        let auth=false;
        if(req.session.userId){
            auth=true;
           
        }
        try{
            const user=await User.findOne({_id:req.params.id})
            var userPost=null;
            if(user!=null){
                userPost =await Post.find({authoremail:user.email})
            }
            
            res.render('followingsdetails',{auth:auth,user:user,userpost:userPost});
        }
        catch(error){
            var err=new Error('Error ...');
            res.render('error',{err:err,url:'/followings'});
        }
        
    }
})



//route to unfollow the user by the current user
homeroute.get('/unfollow/:id',async(req,res)=>{
    if(!req.session.userId){
        res.redirect('/login')
    }
    else{
        let auth=false;
        if(req.session.userId){
            auth=true;
           
        }
        try{
            const user1=await User.findOne({_id:req.session.userId});
            const user2=await User.findOne({_id:req.params.id});
            const useremail1=user1.email;
            const useremail2=user2.email;
            const userUpdated=await User.findOneAndUpdate({email:useremail1},{$pull:{followings:req.params.id}},{new:true,useFindAndModify:false})
            const userUpdated2=await User.findOneAndUpdate({email:useremail2},{$pull:{followers:req.session.userId}},{new:true,useFindAndModify:false})
            
            console.log(userUpdated)
            console.log(userUpdated2)
            res.redirect('/followings')
        }
        catch(error){
            var err=new Error('Error while unfollow the user');
            res.render('error',{err:err,url:'/followings'});
        }
        
    }
})

//route to post replies on the home feed
homeroute.post('/homereply',async(req,res)=>{
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

  res.redirect('/homeuser');

   }
   catch(error){
       var err=new Error('Error while saving the reply');
       res.render('error',{err:err,url:'/homeuser'});
   }
})

//route to post replies on the explore feed
homeroute.post('/explorereply',async(req,res)=>{
    const user=await User.findById(req.session.userId)
    console.log(user.name);
    try{var replyData=new Reply({
        content:req.body.content,
        postid:req.body.postid,
        authorname:user.name,
        like:0,
        dislike:0
   })


  const result=await replyData.save();

  res.redirect('/explorefeed');

   }
   catch(error){
       var err=new Error('Error while saving the reply.');
       res.render('error',{err:err,url:'/explorefeed'});
   }
})


//route to get the details of the particular post of the home feed page post.
homeroute.get('/homepostdetails/:id',async(req,res)=>{
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
       
  
        res.render('homepostdetails',{auth:auth,postdetails:postdetails,replies:replies});
    }
})


//route to get the details of the particular post of the explore feed page post.
homeroute.get('/explorepostdetails/:id',async(req,res)=>{
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
       
  
        res.render('explorepostdetails',{auth:auth,postdetails:postdetails,replies:replies});
    }
})


//route to like the comment on the particular post post of the home feed page post.
homeroute.post('/homelikecomment',async(req,res)=>{
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
        res.redirect('/homepostdetails/'+postid);
    }
})

//route to dislike the comment on the particular post of the home feed page post.
homeroute.post('/homedislikecomment',async(req,res)=>{
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
        res.redirect('/homepostdetails/'+postid);
    }
})

//route to like the comment on the particular post of the explore feed page post.
homeroute.post('/explorelikecomment',async(req,res)=>{
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
        res.redirect('/explorepostdetails/'+postid);
    }
})


//route to dislike the comment on the particular post of the explore feed page post.
homeroute.post('/exploredislikecomment',async(req,res)=>{
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
        res.redirect('/explorepostdetails/'+postid);
    }
})


module.exports=homeroute;