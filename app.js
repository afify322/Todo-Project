const express = require('express');

const app = express();
const passport = require('passport');
require('dotenv').config();
require('./middleware/db-connect').main();
const bodyparser = require('body-parser');
const path = require('path');
const comperssion = require('compression');
const morgan = require('morgan');
const hbs = require('hbs');
const { session } = require('./helpers/session');
const { security } = require('./helpers/security');
const socket=require("socket.io");

const http=require('http');
const server=http.Server(app);
const io = socket(server);

app.use(comperssion());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'hbs');
app.set('views', 'views');
const todo = require('./controller/todos');
app.engine('html', require('hbs').__express);

hbs.registerPartials(`${__dirname}/views/partials`);
hbs.registerPartial('header', '{{header}}');
hbs.registerPartial('sideBar', '{{sideBar}}');
hbs.registerPartial('settings', '{{settings}}');
hbs.registerPartial('footer', '{{footer}}');
hbs.registerPartials(`${__dirname}/views/partials`, (err) => {});
hbs.registerHelper('ifCond', function (v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});


const auth = require('./middleware/auth').authGuard;

//app.use(morgan('combined'));
app.use(security);
app.use(session);
app.use(passport.initialize());
app.use(passport.session());

const port = process.env.PORT || 3000;


const user = require('./routes/user');
const todos = require('./routes/todos');


app.use('/auth', user);
app.get('/todos/setCalender', todo.groupByDate);
app.use('/todos', auth, todos);
app.use('/', todo.getHome);
app.use((req, res) => {
  res.render('404');
});
server.listen(port,()=>console.log("4000"));
const tech = io.of('/tech');

tech.on('connection', (socket) => {
    socket.on('join', (data) => {
        socket.join(data.room);
       // tech.in(data.room).emit('message', `New user joined ${data.room} room!`);
    })

    socket.on('message', (data) => {
        tech.in(data.room).emit('message', data);
    });

    socket.on('disconnect', () => {
       // tech.emit('message', 'user disconnected');
    })
})


