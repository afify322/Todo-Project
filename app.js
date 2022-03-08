const express=require('express');
const app=express();
const passport=require('passport')
require('dotenv').config();
const hbs=require('hbs')
require('./middleware/db-connect').main()
const bodyparser=require('body-parser');
const path=require('path');
const helmet=require('helmet')
const comperssion=require('compression');
const flash = require('connect-flash');
const session = require('express-session');
const cors=require('cors')
//app.use(helmet())
const morgan=require('morgan');
app.use(comperssion())
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'hbs');
app.set('views', 'views');
const todo=require('./controller/todos');
app.engine('html', require('hbs').__express);
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerPartial('header',"{{header}}")
hbs.registerPartial('sideBar',"{{sideBar}}")
hbs.registerPartial('settings',"{{settings}}")
hbs.registerPartial('footer',"{{footer}}")
hbs.registerPartials(__dirname + '/views/partials', function (err) {});
hbs.registerHelper('ifCond', function(v1, v2, options) {
  if(v1 == v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

const auth=require('./middleware/auth').authGuard
const MongoDBStore=require('connect-mongodb-session')(session)
app.use(morgan('combined'))
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'img-src': ["'self'", '*.cloudinary.com','*.my-2dos.herokuapp.com','https://lh3.googleusercontent.com'],
      'default-src':["'self'",'*.cloudinary.com','*.my-2dos.herokuapp.com','https://.lh3.googleusercontent.com'],
      'connect-src':["'self'",'*.cloudinary.com','https://my-2dos.herokuapp.com','*.lh3.googleusercontent.com']
    }
  })
)
const url='mongodb://localhost:27017';
const store=new MongoDBStore({
  uri:'mongodb+srv://first:6PhsjC3EuCp4z9oy@cluster0.kb4eg.mongodb.net/clinc?authSource=admin&replicaSet=atlas-spouhm-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true',
 collection:"session",
  databaseName:"todos"
})
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  store:store
  
}));
app.use(passport.initialize());
app.use(passport.session());



const port=process.env.PORT || 3000


const expressApp=app.listen(port,()=>{
  console.log(port);
  })


  const user=require('./routes/user')

const todos=require('./routes/todos')
app.use(flash());
app.use('/auth',user)
app.get('/todos/setCalender',todo.groupByDate)
app.use('/todos',auth,todos)
app.use('/',todo.getHome)
app.use((req,res)=>{
  res.render('404')
})
