const todos=require('../model/todos')

const moment=require('moment')
var nodemailer = require('nodemailer');


exports.check=async (req,res,next)=>{
    var newDateObj = moment(new Date()).add(150, 'm').toDate();
    var current=moment(new Date()).add(120, 'm').toDate();
    var t=await todos.expire(req.session.user,newDateObj,current);
    res.json(t)
}
exports.getHome=(req,res,next)=>{
    res.render('index');
}
exports.getTodos=async(req,res,next)=>{

    var result=await todos.test(req.session.user)
   if(!req.session.user.image){
    req.session.user.image='/../img/profile.jpg'
   }
    res.render('main',{data:result,user:req.session.user})
}

exports.getAddTodo=(req,res,next)=>{
   var list=req.params.list
    res.render('addTodo',{list:list})
}
exports.deleteTodo=async(req,res,next)=>{
    var id=req.params.id;
    await todos.delete(id)
    return res.redirect('/todos/main')

}


exports.add=async (req,res,next)=>{
    var {name,desc,list,expire}=req.body    
    
    await new todos(req.session.user._id,name,desc,list,false,expire).save()
    res.redirect('/todos/main')
}


exports.groupByMonth=async(req,res,next)=>{
    var {month}=req.params
    var list=await todos.month(month,req.session.user)
     res.render('main',{data:list,user:req.session.user})
}

exports.groupByDay=async(req,res,next)=>{
    var {day}=req.params
    var list=await todos.day(day,req.session.user);
  res.render('main',{data:list,user:req.session.user})
}

exports.groupByFinish=async(req,res)=>{
  var {finished}=req.params;
  var list=await todos.groupByFinished(finished=='inProgress' ? false : true,req.session.user);

  res.render('main',{data:list,user:req.session.user})
}


exports.updateTodo=async(req,res,next)=>{
  var {id}=req.params
  var modifiedAt=moment(new Date()).add(120, 'm').toDate();
  await todos.update(id,{modifiedAt:modifiedAt,finished:true})
 return res.redirect('/todos/main')
}

exports.calender=(req,res,next)=>{
    if(!req.session.user.image){
        req.session.user.image='/../img/profile.jpg'
       }
    res.render('calender',{user:req.session.user})
}

exports.groupByDate=async (req,res,next)=>{
  try {
    var list= await todos.groupByDate(req.session.user)
     return res.json(list)
    
  } catch (error) {
    return res.render('404')
  }
}

exports.sendEmail=(req,res,next)=>{
    

var transporter = nodemailer.createTransport({
  host:'smtp.gmail.com',
  port: 587,
  secure: false,
  auth:{
    user:'afify322@gmail.com',
    pass:process.env.EmailPassword
  } ,tls: {
    ciphers:'SSLv3'
}
});

var mailOptions = {
  from: 'afify322@gmail.com',
  to: req.session.user.email,
  subject: req.query.title,
  text: req.query.msg
};

transporter.sendMail(mailOptions, function(error, info){
    
  if (error) {
    return res.status(500).send(error)
  } else {
    return res.send(info.response)
  }
});  


}