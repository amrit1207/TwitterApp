var mongoose=require('mongoose')

const PostSchema=mongoose.Schema({
    content:{
        type:String,
        required:true,
        trim:true,
    },
    authoremail:{
        type:String,
        required:true,
        trim:true
    },
    authorname:{
        type:String,
        required:true,
    },
    topic:{
        type:String,
        required:true,
    },
    like:{
        type:Number,
        
    },
    dislike:{
        type:Number
    }

})
const Post=mongoose.model('Post',PostSchema);

module.exports=Post;