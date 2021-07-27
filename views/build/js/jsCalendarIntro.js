let calendarCinema = [];

document.addEventListener('DOMContentLoaded', function () {

    let allcinema = $('#cinemas').data('cinemas');

    console.log(allcinema);

    initCalendarTimeLine(allcinema);
   
})

function initCalendarTimeLine(cinemas){

    let lengthCinema = cinemas.length;

    for(let i = 0; i < lengthCinema; i++){
        let showTimeOfMovie = [];

        let lengthRoom = cinemas[i].rooms.length;

        for(let j = 0; j < lengthRoom; j++){

            let lengthMovie = cinemas[i].rooms[j].movies.length;

            for(let z = 0; z < lengthMovie; z++){
                
                let lengthShowTime = cinemas[i].rooms[j].movies[z].showTime.length;

                for(let k = 0; k < lengthShowTime; k++){
                    let endTime = calulatorEndTime(cinemas[i].rooms[j].movies[z].showTime[k].showtime, cinemas[i].rooms[j].movies[z].duration);

                    showTimeOfMovie.push({
                        title: `${cinemas[i].rooms[j].movies[z].nameMovie} | ${cinemas[i].rooms[j].nameRoom}`,
                        start: `${cinemas[i].date} ${cinemas[i].rooms[j].movies[z].showTime[k].showtime}`,
                        end: `${cinemas[i].date} ${endTime}`,
                        backgroundColor: '#3c8dbc',
                        borderColor: '#3c8dbc',
                    })
                }
            
            }

        }

        let divCalendar = document.getElementById(`calendar${cinemas[i].idCinema}`);

        calendarCinema.push({
            idCinema: cinemas[i].idCinema, 
            calendar: new FullCalendar.Calendar(divCalendar, {
                                                    schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
                                                    headerToolbar: {
                                                        right: 'timeGridDay,listMonth',
                                                        left: 'prev,next today',
                                                        center: 'title',                                                        
                                                    },
                                                    initialView: 'timeGridDay',
                                                    height: '500px',
                                                    width:'500px',
                                                    events: showTimeOfMovie
        })})
    }
   
    calendarCinema.map(function(el){
        el.calendar.setOption('locale', 'vi');
        el.calendar.render();
    });
}

function calulatorEndTime(time, minuteMovie) {
    let dt = new Date();
    let hh = '';
    let mm = '';
    let ss = '';

    if (time != '') {
        let arrTime = time.split(':');

        dt.setHours(arrTime[0])
        dt.setMinutes(arrTime[1]);
        dt.setSeconds(arrTime[2]);
        dt.setMinutes(dt.getMinutes() + minuteMovie);


        hh = dt.getHours().toString().padStart(2, '0');
        mm = dt.getMinutes().toString().padStart(2, '0');
        ss = dt.getSeconds().toString().padStart(2, '0');
    }

    return `${hh}:${mm}:${ss}`;;
}

