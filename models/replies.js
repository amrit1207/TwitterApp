var mongoose=require('mongoose')

const RepliesSchema=mongoose.Schema({
    content:{
        type:String,
        required:true,
        trim:true,
    },
    postid:{
        type:String,
        required:true,
        trim:true
    },
    authorname:{
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
const Reply=mongoose.model('Reply',RepliesSchema);

module.exports=Reply;