$('#exampleModalCenter').on('hidden.bs.modal', function (e) {
    $("#exampleModalCenter").modal('hide');
})

$('#notifyModal').on('shown.bs.modal', function (e) {
    $("#exampleModalCenter").modal("hide");
});

/* initialize the external events
-----------------------------------------------------------------*/
function ini_events(ele) {
    ele.each(function () {
        // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
        // it doesn't need to have a start or end
        var eventObject = {
            title: $.trim($(this).text()) // use the element's text as the event title
        }
        // store the Event Object in the DOM element so we can get to it later
        $(this).data('eventObject', eventObject)
        // make the event draggable using jQuery UI
        $(this).draggable({
            zIndex: 1070,
            revert: true, // will cause the event to go back to its
            revertDuration: 0 //  original position after the drag
        })
    })
}
ini_events($('#external-events div.external-event'))
/* initialize the calendar
-----------------------------------------------------------------*/
//Date for the calendar events (dummy data)
var date = new Date()
var d = date.getDate(),
    m = date.getMonth(),
    y = date.getFullYear()
var Calendar = FullCalendar.Calendar;
// var Draggable = FullCalendarInteraction.Draggable;
var containerEl = document.getElementById('external-events');
var calendarEl = document.getElementById('calendar');
// initialize the external events
// -----------------------------------------------------------------
// new Draggable(containerEl, {
//     itemSelector: '.external-event',
//     eventData: function (eventEl) {
//         console.log(eventEl);
//         return {
//             title: eventEl.innerText,
//             backgroundColor: window.getComputedStyle(eventEl, null).getPropertyValue('background-color'),
//             borderColor: window.getComputedStyle(eventEl, null).getPropertyValue('background-color'),
//             textColor: window.getComputedStyle(eventEl, null).getPropertyValue('color'),
//         };
//     }
// });
let dtToday = new Date();
let month = dtToday.getMonth() + 1;
var day = dtToday.getDate();
var year = dtToday.getFullYear();
if (month < 10) {
    month = '0' + month.toString();
}
if (day < 10) {
    day = '0' + day.toString();
}
let maxDate = year + '-' + month + '-' + day;
$('input[name=txtNgayChieu]').attr('min', maxDate);

var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'timeGridDay',
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridWeek,timeGridDay,listMonth'
    },
    locale: 'vi',

    //Random default events 
    height: "auto",
    editable: true,
    droppable: true, // this allows things to be dropped onto the calendar !!!
});

calendar.render();

/* ADDING EVENTS */
var currColor = '#3c8dbc' //Red by default
//Color chooser button
var colorChooser = $('#color-chooser-btn')

$('#color-chooser > li > a').click(function (e) {
    e.preventDefault()
    //Save color
    currColor = $(this).css('color')
    //Add color effect to button
    $('#add-new-event').css({
        'background-color': currColor,
        'border-color': currColor
    })
})

// $('#add-new-event').click(function (e) {
//     e.preventDefault()
//     //Get value and make sure it is not null
//     var val = $('#new-event').val()
//     if (val.length == 0) {
//         return
//     }
//     //Create events
//     var event = $('<div />')

//     event.css({
//         'background-color': currColor,
//         'border-color': currColor,
//         'color': '#fff'
//     }).addClass('external-event')

//     event.html(val)

//     $('#external-events').prepend(event)
//     //Add draggable funtionality
//     ini_events(event)
//     //Remove event from text input
//     $('#new-event').val('')
// })

let movies = [];
let rooms = [];
function loadMovieOfCinema(element) {
    let idCinema = element.value;
    let fristDate = getFristDayWeek();
    let lastDate = getLastDayWeek();

    $.ajax({
        method: 'GET',
        url: '/lichchieu/chitietlichchieu',
        data: {
            idrap: idCinema,
            fristDate: fristDate,
            lastDate: lastDate
        },
        success: function (dataSchedule) {
            clearEvent();

            if (dataSchedule) {
                console.log(dataSchedule);
                
                let countMovie = dataSchedule.length;

                for (let i = 0; i < countMovie; i++) {

                    let countShoWTime = dataSchedule[i].phims.length;

                    for (let j = 0; j < countShoWTime; j++) {
                        

                        for (let k = 0; k < dataSchedule[i].phims[j].suatchieus.length; k++) {
                            
                            let title = `${dataSchedule[i].phims[j].tenPhim}  |  ${dataSchedule[i].phims[j].suatchieus[k].tenphong}`;
                            let endTime = calulatorEndTime(dataSchedule[i].phims[j].suatchieus[k].gio, dataSchedule[i].ThoiGian);

                            calendar.addEvent({
                                title: title,
                                start: `${dataSchedule[i].Ngay} ${dataSchedule[i].phims[j].suatchieus[k].gio}`,
                                end: `${dataSchedule[i].Ngay} ${endTime}`,
                                backgroundColor: '#3c8dbc',
                                borderColor: '#3c8dbc',
                            })
                        }

                    }

                }


            }
        },
        error: function (erroSchedule) {

        }
    })

    $.ajax({
        method: 'GET',
        url: '/lichchieu/getMovieOfCinema',
        data: {
            id: idCinema
        },
        success: function (data) {

            $("select[name=dropdownMovie]").html('')

            if (data) {
                movies = data;
                let countMovie = data.length;

                for (let i = 0; i < countMovie; i++) {
                    $("select[name=dropdownMovie]").html(
                        $("select[name=dropdownMovie]").html() + `<option value="${data[i].ID}">
                                                                        ${data[i].TenPhim}
                                                                  </option>`
                    )
                }

                $.ajax({
                    method: "GET",
                    url: '/lichchieu/getRoomOfCinema',
                    data: {
                        id: idCinema
                    },
                    success: function (data) {
                        $("select[name=dropdownRoom]").html('');

                        if (data) {
                            rooms = data;
                            let countRoom = data.length;

                            for (let i = 0; i < countRoom; i++) {
                                $("select[name=dropdownRoom]").html(
                                    $("select[name=dropdownRoom]").html() + `<option value="${data[i].ID}">${data[i].TenPhong}</option>`
                                )
                            }
                        }
                    },
                    error: function (error) {
                        console.log(error);
                    }
                })
            }
        },
        error: function (error) {
            console.log(error);
        }
    })
}

function calulatorEndTime(time, minuteMovie) {

    var dt = new Date();
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

// function formatDateToServer() {
//     let date = new Date();

//     dd = date.getDate().toString().padStart(2, '0');
//     mm = (date.getMonth() + 1).toString().padStart(2, '0');
//     yyyy = date.getFullYear().toString().padStart(2, '0');

//     return `${yyyy}-${mm}-${dd}`;
// }

function onSubmit() {
    let idCinema = $('select[name=dropdownCinema]').val();
    let idMovie = $('select[name=dropdownMovie]').val();
    let showTime = $('input[name=txtSuatChieu]').val();
    let idRoom = $('select[name=dropdownRoom]').val();
    let dateSchedule = $('input[name=txtNgayChieu]').val();
    let room = rooms.filter(room => room.ID == idRoom);
    let movie = movies.filter(movie => movie.ID == idMovie);
    let timeOfMoive = movie && movie.length != 0?  movie[0].ThoiGian: 0;

    // if(idCinema === '' || idMovie === '' || showTime == '' || idRoom == '' || dateSchedule == ''){
    //     alert('Thông tin không hợp lệ');
    //     return;
    // }

    showLoading();

    $.ajax({
        method: 'POST',
        url: '/lichchieu/xeplich',
        data: {
            idcinema: idCinema,
            date: dateSchedule,
            showtime: showTime,
            idroom: idRoom,
            idmovie: idMovie
        },
        success: function (data) {
            hideLoading();
            if (data.statusCode == 1) {
                let endTime = calulatorEndTime(`${showTime}:00`, timeOfMoive);
                let newEvent = {
                    title: `${movie[0].TenPhim} | ${room[0].TenPhong}`,
                    start: `${dateSchedule} ${showTime}`,
                    end: `${dateSchedule} ${endTime}`,
                    backgroundColor: '#3c8dbc',
                    borderColor: '#3c8dbc',
                };

                calendar.addEvent(newEvent)
            }
        },
        error: function (error) {

        }
    })
}

function clearEvent() {
    let eventSources = calendar.getEvents();
    let len = eventSources.length;
    for (var i = 0; i < len; i++) {
        eventSources[i].remove();
    }
}

function hideLoading() {
    $("#exampleModalCenter").modal('hide');
}

function showLoading() {
    $('#exampleModalCenter').modal('show');
}

function getFristDayWeek(){
    let curr = new Date; 
    let first = curr.getDate() - curr.getDay();
    let firstday = new Date(curr.setDate(first))

    let dateString =firstday.getUTCFullYear() + "-" + ("0" + (firstday.getUTCMonth() + 1)).slice(-2) + "-" + ("0" + firstday.getUTCDate()).slice(-2);

    return dateString;
}

function getLastDayWeek(){
    let curr = new Date; 
    let first = curr.getDate() - curr.getDay();
    let last = first + 6;
    let lastday = new Date(curr.setDate(last))

    let dateString = lastday.getUTCFullYear() + "-" + ("0" + (lastday.getUTCMonth() + 1)).slice(-2) + "-" + ("0" + lastday.getUTCDate()).slice(-2);

    return dateString;
}