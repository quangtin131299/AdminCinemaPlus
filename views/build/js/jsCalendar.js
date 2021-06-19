$(function () {
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
    var Draggable = FullCalendarInteraction.Draggable;
    var containerEl = document.getElementById('external-events');
    var calendarEl = document.getElementById('calendar');
    // initialize the external events
    // -----------------------------------------------------------------
    new Draggable(containerEl, {
        itemSelector: '.external-event',
        eventData: function (eventEl) {
            console.log(eventEl);
            return {
                title: eventEl.innerText,
                backgroundColor: window.getComputedStyle(eventEl, null).getPropertyValue('background-color'),
                borderColor: window.getComputedStyle(eventEl, null).getPropertyValue('background-color'),
                textColor: window.getComputedStyle(eventEl, null).getPropertyValue('color'),
            };
        }
    });
    var calendar = new Calendar(calendarEl, {
        plugins: ['bootstrap', 'interaction','timeGrid'],
        initialView: 'timeGridDay',
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek,timeGridDay'
        },
        'themeSystem': 'bootstrap',
        //Random default events 
        events: [{
            title: 'Tiệc trăng máu | Phòng 3',
            start: new Date(y, m, 1),
            backgroundColor: '#f56954', //red
            borderColor: '#f56954', //red
            allDay: true
        },
        {
            title: 'Ròm | Phòng 4',
            start: new Date(y, m, d - 5, 10, 30),
            end: new Date(y, m, d - 5, 13, 00),
            backgroundColor: '#f39c12', //yellow
            borderColor: '#f39c12' //yellow
        },
        {
            title: 'Ròm | Phòng 4',
            start: new Date(y, m, d, 10, 30),
            end: new Date(y, m, d , 12, 30),
            allDay: false,
            backgroundColor: '#0073b7', //Blue
            borderColor: '#0073b7' //Blue
        },
        {
            title: 'Quái vật săn đêm | Phòng 2',
            start: new Date(y, m, d, 13, 0),
            end: new Date(y, m, d, 15, 0),
            allDay: false,
            backgroundColor: '#00c0ef', //Info (aqua)
            borderColor: '#00c0ef' //Info (aqua)
        },
        {
            title: 'Cô gái đến từ hôm qua | Phòng 1',
            start: new Date(y, m, d + 1, 19, 0),
            end: new Date(y, m, d + 1, 22, 30),
            allDay: false,
            backgroundColor: '#00a65a', //Success (green)
            borderColor: '#00a65a' //Success (green)
        },
        {
            title: 'Click for Google',
            start: new Date(y, m, 28),
            end: new Date(y, m, 29),
            url: 'http://google.com/',
            backgroundColor: '#3c8dbc', //Primary (light-blue)
            borderColor: '#3c8dbc' //Primary (light-blue)
        }
        ],
        editable: true,
        droppable: true, // this allows things to be dropped onto the calendar !!!
    });
    calendar.render();
    $('#calendar').fullCalendar()
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
    $('#add-new-event').click(function (e) {
        e.preventDefault()
        //Get value and make sure it is not null
        var val = $('#new-event').val()
        if (val.length == 0) {
            return
        }
        //Create events
        var event = $('<div />')
        event.css({
            'background-color': currColor,
            'border-color': currColor,
            'color': '#fff'
        }).addClass('external-event')
        event.html(val)
        $('#external-events').prepend(event)
        //Add draggable funtionality
        ini_events(event)
        //Remove event from text input
        $('#new-event').val('')
    })
})

function loadMovieOfCinema(element){
    let idCinema = element.value;

    $.ajax({
        method: 'GET',
        url: '/lichchieu/getMovieOfCinema',
        data: {
            id: idCinema
        },
        success: function(data){
            
            $("select[name=dropdownMovie]").html('')

            if(data){
                let countMovie = data.length;

                for(let i = 0; i < countMovie; i ++ ){
                    $("select[name=dropdownMovie]").html(
                        $("select[name=dropdownMovie]").html() + `<option value="${data[i].ID}">${data[i].TenPhim}</option>`
                        
                    )
                }
                $.ajax({
                    method: "GET",
                    url:'/lichchieu/getRoomOfCinema',
                    data: {
                        id: idCinema
                    },
                    success: function(data){
                        $("select[name=dropdownRoom]").html('');
                        if( data){
                            let countRoom = data.length;

                            for(let i = 0; i< countRoom ; i++){
                                $("select[name=dropdownRoom]").html(
                                    $("select[name=dropdownRoom]").html() + `<option value="${data[i].ID}">${data[i].TenPhong}</option>`                    
                                )
                            }
                        }
                    },
                    error: function(error){
                        console.log(error);
                    }
                })      
            }
        },
        error: function(error){
            console.log(error);
        }
    })
}
