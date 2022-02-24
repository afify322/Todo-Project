const router=require('express').Router();
const todo=require('../controller/todos');




router.get('/main',todo.getTodos)
router.get('/addTodo/:list',todo.getAddTodo)
router.get('/delete/:id',todo.deleteTodo)
router.post('/updateTodo/:id',todo.updateTodo)
router.post('/addTodo',todo.add)
router.get('/groupByMonth/:month',todo.groupByMonth)
router.get('/groupByDay/:day',todo.groupByDay)
router.get('/calender',todo.calender)
router.get('/setCalender',todo.groupByDate)
router.get('/checkExpire',todo.check)
router.get('/sendEmail',todo.sendEmail)

module.exports=router