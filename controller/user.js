const bcryprt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../model/user');

exports.getLogin = (req, res) => {
  res.render('login');
};
exports.getReg = (req, res) => {
  res.render('reg');
};
exports.insert = async (req, res) => {
  const errors = validationResult(req);
  // var {fname,lname,password,email,password2}=req.body
  let { body: { fname , lname , email , password } } = req;
  var obj = {};
  if (!errors.isEmpty()) {
    errors.array().forEach((e) => {
      obj[e.param] = e.msg;
    });
    return res.render('reg', { errors: obj, body: req.body });
  }

  const newPassword = await bcryprt.hash(password, 8);
  try {
    var obj = new User(fname, lname, email, newPassword);
    await obj.save();
    return res.redirect('/auth/login');
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ status: 400, msg: 'email already exists' });
    }
    return res.send({ status: 400, msg: error });
  }
};

exports.getContReg = (req, res) => {
  res.render('image');
};
exports.contReg = async (req, res) => {
  const { session: { user: { _id } } } = req;
  if (req.file) {
    const { file: { path } } = req;
    await User.update(_id, { image: path });
    req.session.user.image = path;

    return res.redirect('/todos/main');
  }
  return res.render('image', { errors: { image: 'image is required' } });
};

exports.getUsers = async (req, res) => {
  const users = await User.findOne();
  res.send(users);
};
/* exports.edit = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  await user.update(data);
  // go to page
}; */

exports.login = async (req, res) => {
  const errors = validationResult(req);
  const { body } = req;
  let { session: { user } } = req;

  if (!errors.isEmpty()) {
    const obj = {};
    errors.array().forEach((e) => {
      obj[e.param] = e.msg;
    });

    return res.render('login', { errors: obj, body });
  }
  const userData = await User.findOne({ email: body.email });
  const password = await bcryprt.compare(body.password, userData.password);
  if (password) {
    req.session.user = userData;
    if (userData.image == null) {
      return res.redirect('/auth/contReg');
    }
    return res.redirect('/todos/main');
  }
  return res.render('login', { errors: { password: 'invalid password' }, body: { email: body.email } });
};

exports.logout = ((req, res) => {
  req.session.destroy();
  res.redirect('/auth/login');
});
