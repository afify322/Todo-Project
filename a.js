
var modal=document.getElementById('updateModal');
var form=document.getElementById('updateForm');
var btns=document.getElementsByClassName('update')
for(var i=0; i< btns.length; i++){
    btns[i].addEventListener('click',(e)=>{
      e.stopPropagation()
        var name=e.target.previousElementSibling
        var desc=e.target.parentNode.nextElementSibling.firstElementChild.textContent
        var id=e.target.value;
        form.action="/todos/updateTodo/"+id
        $('#updateTask').val(name.value)
        $('#updateDesc').val(desc.value)
      })
}
  document.getElementsByClassName('delete')[0].addEventListener('click',(e)=>{
    e.stopPropagation()
  })

