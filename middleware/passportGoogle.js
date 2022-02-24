
exports.google=(req,res,next)=>{
    var GoogleStrategy = require('passport-google-oauth20').Strategy;
    var user=require('../model/user');
    const passport=require('passport')

    passport.use(new GoogleStrategy({
        clientID:process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback"
      },
      async function(accessToken, refreshToken, profile, cb) {
        var x= await user.findOne({email:profile.emails[0].value});
        if(x){
            return cb(null, x);
        }
        else{
            let client=new user(profile.name.givenName,profile.name.familyName,profile.emails[0].value,null,'google',profile.id,profile.photos[0].value)
            let x= client.save()
            return cb(null, client);
        }
      }
    ));
    
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    
    passport.deserializeUser((userId, done) => {
        user.findOne({_id:userId})
            .then((user) => {
                done(null, user);
            })
            .catch(err => done(err))
    });
    next();
}
