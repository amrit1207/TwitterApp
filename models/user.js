var mongoose=require('mongoose')

const UserSchema=mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true 
    },
    password:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    fbID:{
        type:String
    },
    fbToken:{
        type:String
    },
    followers:[],
    followings:[]

})
const User=mongoose.model('User',UserSchema);

module.exports=User;