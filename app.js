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
app.use(helmet())
app.use(comperssion())
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'hbs');
app.set('views', 'views');

app.engine('html', require('hbs').__express);
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerPartial('header',"{{header}}")
hbs.registerPartial('sideBar',"{{sideBar}}")
hbs.registerPartial('settings',"{{settings}}")
hbs.registerPartial('footer',"{{footer}}")
hbs.registerPartials(__dirname + '/views/partials', function (err) {});

const auth=require('./middleware/auth').authGuard
const MongoDBStore=require('connect-mongodb-session')(session)


const store=new MongoDBStore({
  uri:'mongodb+srv://first:6PhsjC3EuCp4z9oy@cluster0.kb4eg.mongodb.net/clinc?authSource=admin&replicaSet=atlas-spouhm-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true',
  collection:"session",
  databaseName:"todos"
})
app.use(cors())
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

app.use('/todos',auth,todos)
  
app.use((req,res)=>{
  res.render('404')
})
