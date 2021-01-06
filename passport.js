const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const TwitterStrategy=require('passport-twitter').Strategy
const User = require('./models/user')

passport.use(new FacebookStrategy({
    clientID: '410198860101092',
    clientSecret: '3f5bba63673e54f6efc24fef7fe9ffa5',
    callbackURL: "http://localhost:4000/login/facebook/callback"
  },
  async (token, rt, profile, cb) =>{
    console.log(token)
    console.log(profile)
    let user = await User.findOne({
        fbID: profile.id
    })
    if(user) return cb(null,user)
    user = await User.create({fbID:profile.id, fbToken:token, name:profile.displayName})
    return cb(null,user)
  }
))

passport.use(new TwitterStrategy({
    consumerKey: '498866010190992',
    consumerSecret: '3f5bklv673e54f6etgc24feuh7fe9ff0o9',
    callbackURL: "http://127.0.0.1:4000/login/twitter/callback"
  },
  function(token, tokenSecret, profile, cb) {
    User.findOrCreate({ twitterId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));



passport.serializeUser((user,cb)=>{
    console.log('Serialize user')
    cb(null,user.id)
})


passport.deserializeUser((user,cb)=>{
    console.log('Deserialize user')
    User.findOne({user:user.id},(err,user)=>{
        if(err) return cb(err)
        console.log("User after deserialization ",user)
        return cb(null,user)
    })
})

module.exports = passport
