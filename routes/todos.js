const router = require('express').Router();
const todo = require('../controller/todos');

router.post('/updateTodo/:id', todo.updateTodo);
router.get('/finishTodo/:id', todo.finishTodo);
router.get('/main', todo.getTodos);
router.get('/addTodo/:list', todo.getAddTodo);
router.get('/delete/:id', todo.deleteTodo);
router.post('/addTodo', todo.add);
router.get('/groupByMonth/:month', todo.groupByMonth);
router.get('/groupByDay/:day', todo.groupByDay);
router.get('/groupByFinish/:finished', todo.groupByFinish);
router.get('/calender', todo.calender);
router.get('/checkExpire', todo.check);
router.get('/sendEmail', todo.sendEmail);
router.get('/chat', todo.chat);

module.exports = router;
