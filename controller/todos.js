const Todos = require('../model/todos');
const redisClient = require('../middleware/redis').client;
const moment = require('moment');
const nodemailer = require('nodemailer');

/* async function setRedisData(name, value) {
  const redis = await redisClient();
  const result = await redis.set(name, value);
  return result;
}
async function getRedisData(name) {
  const redis = await redisClient();
  const result = await redis.get(name);
  return result;
} */

exports.check = async (req, res, _next) => {
  const newDateObj = moment(new Date()).add(150, 'm').toDate();
  const current = moment(new Date()).add(120, 'm').toDate();
  const t = await Todos.expire(req.session.user, newDateObj, current);
  res.json(t);
};
exports.getHome = async (req, res, next) => {
  res.render('index');
};
exports.chat = async (req, res, next) => {
  const { session: { user } } = req;

  res.render('chat',{user});
};
exports.getTodos = async (req, res, _next) => {
  const { session: { user } } = req;

  if (!user.image) {
    user.image = '/../img/profile.jpg';
  }
 /*  const redisData = await getRedisData(`${user._id}todos`);

  if (redisData) {
    return res.render('main', { data: JSON.parse(redisData), user });
  } */

  const result = await Todos.getTodos(user);
  //await setRedisData(`${user._id}todos`, JSON.stringify(result));
  return res.render('main', { data: result, user });
};

exports.getAddTodo = (req, res, _next) => {
  const { parmas: { list } } = req;
  res.render('addTodo', { list });
};

exports.deleteTodo = async (req, res, _next) => {
  const { params: { id }, session: { user } } = req;
  await Todos.delete(id);
 // const lists = await Todos.getTodos(user);
  //await setRedisData(`${user._id}todos`, JSON.stringify(lists));
  return res.redirect('/todos/main');
};

exports.add = async (req, res, _next) => {
  const { session: { user } } = req;
  const {
    name, desc, list, expire,
  } = req.body;
  await new Todos(user._id, name, desc, list, false, expire).save();
 // const todoLists = await Todos.getTodos(user);
 // await setRedisData(`${user._id}todos`, JSON.stringify(todoLists));
  res.redirect('/todos/main');
};

exports.groupByMonth = async (req, res, _next) => {
  const { session: { user } } = req;
  const { params: { month } } = req;
  const list = await Todos.month(month, user);
  res.render('main', { data: list, user });
};

exports.groupByDay = async (req, res) => {
  const { session: { user } } = req;
  const { params: { day } } = req;
  const list = await Todos.day(day, user);
  res.render('main', { data: list, user });
};

exports.groupByFinish = async (req, res) => {
  const { session: { user } } = req;
  const { params: { finished } } = req;
  const list = await Todos.groupByFinished(finished !== 'inProgress', user);

  res.render('main', { data: list, user: req.session.user });
};

exports.finishTodo = async (req, res, _next) => {
  const { params: { id } } = req;
 
  const { session: { user } } = req;
  const modifiedAt = moment(new Date()).add(120, 'm').toDate();
  await Todos.update(id, { modifiedAt, finished: true });
  //const todoLists = await Todos.getTodos(user);
 // await setRedisData(`${user._id}todos`, JSON.stringify(todoLists));
  return res.redirect('/todos/main');
};

exports.updateTodo= async (req,res)=>{
  const { params : { id } } = req;
  let { body } = req;
  const { session: { user } } = req;
  const modifiedAt = moment(new Date()).add(120, 'm').toDate();
  body.modifiedAt=modifiedAt;
  body.expire=moment(new Date(body.expire)).add(120, 'm').toDate();
  await Todos.update(id, body );
 // const todoLists = await Todos.getTodos(user);
 // await setRedisData(`${user._id}todos`, JSON.stringify(todoLists));
  return res.redirect('/todos/main');
}

exports.calender = (req, res, _next) => {
  const { session: { user } } = req;
  if (!user.image) {
    user.image = '/../img/profile.jpg';
  }
  res.render('calender', { user });
};

exports.groupByDate = async (req, res, _next) => {
  const { session: { user } } = req;
  try {
    const list = await Todos.groupByDate(user);
    return res.json(list);
  } catch (error) {
    return res.render('404');
  }
};

exports.sendEmail = (req, res, _next) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'afify322@gmail.com',
      pass: process.env.EmailPassword,
    },
    tls: {
      ciphers: 'SSLv3',
    },
  });

  const mailOptions = {
    from: 'afify322@gmail.com',
    to: req.session.user.email,
    subject: req.query.title,
    text: req.query.msg,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error);
    }
    return res.send(info.response);
  });
};
