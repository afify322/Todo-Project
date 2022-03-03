const user=require('../model/user')
const bcryprt= require('bcrypt')
const {validationResult}=require('express-validator')
const cookie = require('cookie')


exports.getLogin=(req,res)=>{
    res.render('login')
}
exports.getReg=(req,res)=>{

    res.render('reg')
}
exports.insert=async(req,res)=>{
    const errors = validationResult(req);
    //var {fname,lname,password,email,password2}=req.body
    var obj={};
    if (!errors.isEmpty()) {
    errors.array().forEach((e)=>{
      obj[e.param]=e.msg;
    })
      return res.render('reg',{errors:obj,body:req.body});
    }

   var newPassword =await bcryprt.hash(req.body.password,8)
    try {
        var obj=new user(req.body.fname,req.body.lname,req.body.email,newPassword)
        var x=await obj.save()
       return res.redirect('/auth/login')
        
    } catch (error) {
        if(error.code==11000){
           return res.status(400).json({status:400,msg:"email already exists"})
        }
        else
        return  res.send({status:400,msg:error})   
    }
}


exports.getContReg=(req,res)=>{
    
    res.render('image');
}
exports.contReg=async (req,res)=>{
    const {_id}=req.session.user
    if(req.file){

        const path = req.file.path;
         await user.update(_id,{image:path});
         req.session.user.image=path
    
      return  res.redirect('/todos/main') 
    }
    return res.render('image',{errors:{image:"image is required"}})

    }


exports.getUsers=async(req,res)=>{
    var users=await user.findOne()
    //res.render('login.hbs',{users:users})
    res.send(users)
} 
exports.edit=async(req,res)=>{
    var id=req.params.id
    var data=req.body
    await user.update(data)
    //go to page
}

exports.login=async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        var obj={}
        errors.array().forEach((e)=>{
            obj[e.param]=e.msg;
          })
      return res.render('login',{errors:obj,body:req.body})
    }
        var userData =await user.findOne({email:req.body.email})
        var password=await bcryprt.compare(req.body.password,userData.password)
       if(password)
       {    
           req.session.user=userData
           if(userData.image==null){
            return res.redirect('/auth/contReg')
           }
           return res.redirect('/todos/main')
       }
       else
       return res.render('login',{errors:{password:"invalid password"},body:{email:req.body.email}})


}

exports.logout=((req,res)=>{
    req.session.destroy();
    res.redirect('/auth/login')
})