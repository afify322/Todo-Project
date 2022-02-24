$(document).ready(function (params) {
    /*  $('#updateModal')
     $('#updateForm')
    */
   $.ajax({
     url:'http://localhost:3000/todos/setCalender',
     method:"get",
     success:function (e) {
       var arr=e.map((e)=>{
         return {title:e.name,start:new Date(e.cyear, e.cmonth-1, e.cday, e.chour, e.cminutes),end:new Date(e.year, e.month-1, e.day+1, e.hour+1, e.minutes),backgroundColor: getRandomColor()}
       })
       var calendar
       return calendar = $('#myEvent').fullCalendar({
         height: 'auto',
         defaultView: 'month',
         editable: true,
         selectable: true,
         header: {
           left: 'prev,next today',
           center: 'title',
           right: 'month,agendaWeek,agendaDay,listMonth'
         },
         events: arr
       });
     }
   })
     
  })
  
  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  