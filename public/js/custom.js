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

  $('body').on('submit','#AddListForm',function(e) {
    if(!$('#AddList').val() || !$('#taskList').val() || !$('#expireList').val()||!$('#descList').val()){

      e.preventDefault();
    }

     if(!$('#AddList').val()){
      $('#AddListDateError').css({
        'display':'block'
      })
    }
    else
    $('#AddListDateError').css({
      'display':'none'
    }) 
    if(!$('#descList').val()){
      $('#descListError').css({
        'display':'block'
      })
    }
    else
    $('#descListError').css({
      'display':'none'
    }) 

    if(!$('#expireList').val()){
      $('#expireListError').css({
        'display':'block'
      })
    }
    else{
      $('#expireListError').css({
        'display':'none'
      })
    }


    if(!$('#taskList').val()){
      $('#taskListError').css({
        'display':'block'
      })
    }
    else
    $('#taskListError').css({
      'display':'none'
    })
  })

  $('body').on('click','.update',(function (e) {
    var id=$(this).val()
    var name=$(this).prev().text()
    var desc=$(this).parent().next().children(":first").next().text()
    var expire=$(this).parent().next().children(":last").attr('id')
    console.log(id,name,desc,expire);
    $('#updateDate').val(expire.replace(' ','T').replaceAll('/','-').substring(0,16))
    $('#UpadteForm').attr('action','/todos/updateTodo/'+id)
    $('#updateTask').val(name)
    $('#updateDesc').val(desc)
    
  }))

  $('body').on('click','.addTodo',function (e) {
    $('#addList').val($(this).prev().text())
  })

  $('body').on('submit','#AddForm',function(e) {
    if(!$('#dateAddFrom').val() || !$('#desc').val()||!$('#task').val()){

      e.preventDefault();
    }

     if(!$('#dateAddFrom').val()){
      $('#expireError').css({
        'display':'block'
      })
    }
    else
    $('#expireError').css({
      'display':'none'
    }) 
    if(!$('#task').val()){
      $('#taskError').css({
        'display':'block'
      })
    }
    else{
      $('#taskError').css({
        'display':'none'
      })
    }

    if(!$('#desc').val()){
      $('#descError').css({
        'display':'block'
      })
    }
    else
    $('#descError').css({
      'display':'none'
    })
  })
  $('body').on('submit','#UpadteForm',function(e) {
    if(!$('#updateDate').val() || !$('#updateDesc').val()||!$('#updateTask').val()){

      e.preventDefault();
    }

     if(!$('#updateDate').val()){
      $('#updateExpireError').css({
        'display':'block'
      })
    }
    else
    $('#updateExpireError').css({
      'display':'none'
    }) 
    if(!$('#updateTask').val()){
      $('#updateTaskError').css({
        'display':'block'
      })
    }
    else{
      $('#updateTaskError').css({
        'display':'none'
      })
    }

    if(!$('#updateDesc').val()){
      $('#updateDescError').css({
        'display':'block'
      })
    }
    else
    $('#updateDescError').css({
      'display':'none'
    })
  })

  $('#groupByDay').change(function () {

  var x=$(this).val();
  window.location.href='/todos/groupByDay/'+x;

  })
  $('#groupByFinish').change(function () {

    var x=$(this).val();
    window.location.href='/todos/groupByFinish/'+x;
  
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

$("body").on('click','#swal-7',function (e) {
  e.stopPropagation()
 var id= $(this).val()
  swal({
    title: 'Finished your Task?',
    text: '',
    icon: 'success',
    buttons: true,
    dangerMode: true,
  })
    .then((willDelete) => {
      if (willDelete) {
        swal('Great Work', {
          icon: 'success',
        });
        setTimeout(()=>{
          window.location.href='/todos/finishTodo/'+id;
        },1000)
        
      } else {
        swal('Keep Motivated !');
      }
    });


});







 