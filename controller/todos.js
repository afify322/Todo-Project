const todos=require('../model/todos')

const moment=require('moment')
var nodemailer = require('nodemailer');


exports.check=async (req,res)=>{
    var newDateObj = moment(new Date()).add(30, 'm').add(2,'h').toDate();
    var t=await todos.expire(req.session.user,newDateObj);
    res.json(t)
}
exports.getHome=(req,res)=>{
    res.render('index');
}
exports.getTodos=async(req,res)=>{

    var result=await todos.test(req.session.user)
   if(!req.session.user.image){
    req.session.user.image='/../img/profile.jpg'
   }
    res.render('main',{data:result,user:req.session.user})
}

exports.getAddTodo=(req,res)=>{
   var list=req.params.list
    res.render('addTodo',{list:list})
}
exports.deleteTodo=async(req,res)=>{
    var id=req.params.id;
    await todos.delete(id)
    return res.redirect('/todos/main')

}


exports.add=async (req,res)=>{
    var {name,desc,list,expire}=req.body    
    await new todos(req.session.user._id,name,desc,list,false,expire).save()
    res.redirect('/todos/main')
}


exports.groupByMonth=async(req,res)=>{
    var {month}=req.params
    var list=await todos.month(month,req.session.user)
     res.render('main',{data:list})
}

exports.groupByDay=async(req,res)=>{
    var {day}=req.params
    var list=await todos.day(day,req.session.user);
  res.render('main',{data:list})
}

exports.updateTodo=async(req,res)=>{
    var {id}=req.params
    req.body.expire=new Date(req.body.expire)
    await todos.update(id,req.body)
   return res.redirect('/todos/main')
}
exports.calender=(req,res)=>{
    if(!req.session.user.image){
        req.session.user.image='/../img/profile.jpg'
       }
    res.render('calender',{user:req.session.user})
}

exports.groupByDate=async (req,res)=>{
   var list= await todos.groupByDate(req.session.user)
    return res.json(list)
}

exports.sendEmail=(req,res)=>{
    

var transporter = nodemailer.createTransport({
  host:'smtp.gmail.com',
  port: 465,
  secure: true,
  auth:{
    user:'afify322@gmail.com',
    pass:process.env.EmailPassword
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