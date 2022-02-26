/**
 *
 * You can write your JS code here, DO NOT touch the default style file
 * because it will make it harder for you to update.
 * 
 */

"use strict";

$(document).ready(function (params) {
 /*  $('#updateModal')
  $('#updateForm')
 */
  

  $('body').on('click','.update',(function (e) {
    var id=$(this).val()
    var name=$(this).prev().text()
    var desc=$(this).parent().next().children(":first").text()
    var expire=$(this).parent().next().children(":first").next().attr('id')
    console.log(expire.replace(' ','T').replaceAll('/','-').substring(0,16));
    $('#updateDate').val(expire.replace(' ','T').replaceAll('/','-').substring(0,16))
    $('#updateForm').attr('action','/todos/updateTodo/'+id)
    $('#updateTask').val(name)
    $('#updateDesc').val(desc)
    
  }))

  $('body').on('click','.addTodo',function (e) {
    $('#addList').text($(this).prev().text())
  })

  $('#groupByDay').change(function () {

  var x=$(this).val();
  window.location.href='/todos/groupByDay/'+x;

  })

  $('#groupByMonth').change(function () {
    var x=$(this).val();
    window.location.href='/todos/groupByMonth/'+x;
  })
 // $('.update')
 

})

//href="/todos/addTodo/{{todo._id}}"
$("body").on('click','#swal-6',function (e) {
  e.stopPropagation()
 var id= $(this).val()
  swal({
    title: 'Are you sure?',
    text: 'You are deleting your todo',
    icon: 'warning',
    buttons: true,
    dangerMode: true,
  })
    .then((willDelete) => {
      if (willDelete) {
        swal('Poof! Your Todo has been deleted!', {
          icon: 'success',
        });
        setTimeout(()=>{

          window.location.href='/todos/delete/'+id;
        },1000)
        
      } else {
        swal('Your Todo is safe!');
      }
    });
});







 