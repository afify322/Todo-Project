const router=require('express').Router();
const user=require('../controller/user')
const { body, validationResult,check } = require('express-validator');
require('../middleware/images')
const parser=require('../middleware/images').parser
const passport=require('passport')
const User=require('../model/user');
const auth2=require('../middleware/auth').authGuard2
const auth=require('../middleware/auth').authGuard
const google=require('../middleware/passportGoogle').google



router.get('/logout',user.logout)
router.get('/reg',auth2,user.getReg);

router.get('/contReg',auth,user.getContReg);
router.post('/contReg',auth,parser,user.contReg);

router.get('/login',auth2,user.getLogin)

router.post('/login',auth2,
body('email').custom(value => {
  return User.findOne({email:value}).then(user => {
    if (!user) {
      return Promise.reject('E-mail doesn\'t exists');
    }
  });
}),
body('password').notEmpty()
,user.login)


//add image and bio
router.post('/contReg/:userId',parser,user.contReg)

//by google
    router.get('/auth/google',google,auth2,
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email'] }));

  router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/auth/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    req.session.user=req.user
    res.redirect('/todos/main');
  });  
  //by twitter
/*  router.get('/auth/twitter',twitter,
  passport.authenticate('twitter'));

  router.get('/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/auth/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    req.session.user=req.user
    res.redirect('/todos/main');
  });  */
// user
router.get('/user',auth2,user.getUsers);

router.post('/user',auth2,
body('email').custom(value => {
  return User.findOne({email:value}).then(user => {
    if (user) {
      console.log(user);

      return Promise.reject('E-mail already in use');
    }
  });
}),
body('email').isEmail().withMessage('email is invalid'),
check('password').notEmpty().withMessage('password is required'),
body('fname').notEmpty().withMessage('First name is required'),
body('lname').notEmpty().withMessage('Last name is required'),
body('password2').custom((value, { req }) => {
  if (value !== req.body.password) {
    throw new Error('Password confirmation does not match password');
  }

  // Indicates the success of this synchronous custom validator
  return true;
}),
user.insert);
router.patch('/user',auth2,user.edit)

module.exports=router