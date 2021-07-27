$('#exampleModalCenter').on('hidden.bs.modal', function (e) {
    $("#exampleModalCenter").modal('hide');
})

$('#notifyModal').on('shown.bs.modal', function (e) {
    $("#exampleModalCenter").modal("hide");
});

function ini_events(ele) {
    ele.each(function () {
        
        var eventObject = {
            title: $.trim($(this).text())
        }
        
        $(this).data('eventObject', eventObject)
        $(this).draggable({
            zIndex: 1070,
            revert: true,
            revertDuration: 0 
        })
    })
}
ini_events($('#external-events div.external-event'))

var date = new Date()
var d = date.getDate(),
    m = date.getMonth(),
    y = date.getFullYear()
var Calendar = FullCalendar.Calendar;

var containerEl = document.getElementById('external-events');
var calendarEl = document.getElementById('calendar');

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
    schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
    initialView: 'timeGridDay',
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridWeek,timeGridDay,listMonth'
    },
    locale: 'vi',

    height: "auto",
    editable: true,
    droppable: true,
});

calendar.render();

var currColor = '#3c8dbc' 
var colorChooser = $('#color-chooser-btn')

$('#color-chooser > li > a').click(function (e) {
    e.preventDefault()
    currColor = $(this).css('color')
    $('#add-new-event').css({
        'background-color': currColor,
        'border-color': currColor
    })
})

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

            $("select[name=dropdownMovie]").html(`<option value=''>Chọn phim</option>`)

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

function onSubmit() {
    let idCinema = $('select[name=dropdownCinema]').val();
    let idMovie = $('select[name=dropdownMovie]').val();
    let showTime = $('input[name=txtSuatChieu]').val();
    let idRoom = $('select[name=dropdownRoom]').val();
    let dateSchedule = $('input[name=txtNgayChieu]').val();
    let room = rooms.filter(room => room.ID == idRoom);
    let movie = movies.filter(movie => movie.ID == idMovie);
    let timeOfMoive = movie && movie.length != 0?  movie[0].ThoiGian: 0;

    

    if(checkTimeInvalid(showTime) == true){
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
    
                $('#modalTextMessage').text(data.message);
                $('#notifyModal').modal('show');
                
            },
            error: function (error) {
    
            }
        })
    }else{
        $('#modalTextMessage').text('Suất chiếu không hợp');
                $('#notifyModal').modal('show');
    }

    
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

function validateDateSchedule(movieSelect){
    let idMovie = movieSelect.value;

    let movie = movies.filter(x => x.ID == idMovie);

    let openDate = movie[0].NgayKhoiChieu;
    let endDate = movie[0].NgayKetThuc;
    let inputDateSchedule = $('input[name=txtNgayChieu]');
    let date = new Date(openDate);

    if(Date.now() >= date.getTime()){
        let currentDate = new Date();
        let year = currentDate.getFullYear();
        let moth = currentDate.getMonth() + 1;
        let date = currentDate.getDate();
    
        inputDateSchedule.prop('min', `${year}-${moth.toString().padStart('2','0')}-${date.toString().padStart('2','0')}`);
    }else{
        inputDateSchedule.prop('min', openDate);
    }

    inputDateSchedule.prop('max', endDate);
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

function checkTimeInvalid(time){
    let min = moment();
    min.hour(8);

    let max = moment();

    max.hour(21)
    max.minute(30);

    let partialTime = time.split(':');
    let timeSelected = moment();
    timeSelected.hour(parseInt(partialTime[0]));
    timeSelected.minute(parseInt(partialTime[1]));


    if (timeSelected.isBefore(min) == true ) {
        return false;
    }

    if(timeSelected.isAfter(max) == true){
        return false;
    }

    return true;
}

function checkTime(inputTime){
    let time = inputTime.value;
    let regEx = new RegExp('^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$');

    if(regEx.test(time) == false){
        inputTime.value = ''
    }
}