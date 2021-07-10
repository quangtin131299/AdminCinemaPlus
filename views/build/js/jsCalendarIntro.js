
document.addEventListener('DOMContentLoaded', function () {



    initCalendarTimeLine(cinemasForCalendar);
   
})

function initdataCinema(){
    let resultCinema = [];
    let cinemas = $('#cinemas').data('cinemas');
    
    return resultCinema;
}

function initCalendarTimeLine(){

    let calendarEl = document.getElementById('calendar');

    let calendar = new FullCalendar.Calendar(calendarEl, {
       
    });

    calendar.setOption('locale', 'vi');

    calendar.render();

    
}


