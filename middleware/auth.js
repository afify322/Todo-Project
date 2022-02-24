

exports.authGuard=((req,res,next)=>{
if(!req.session.user){
  return res.redirect('/auth/login')
}
next();
})
exports.authGuard2=((req,res,next)=>{
    if(req.session.user){
     return  res.redirect('/todos/main')
    }
    else{
        next()
    }
   
    })