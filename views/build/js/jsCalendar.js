$('#formSchedule').validate({
    rules: {
        dropdownMovie: {
            required: true
        },
        dropdownRoom:{
            required: true
        },
        txtSuatChieu:{
            required: true
        },
        txtNgayChieu: {
            required: true
        },
        txtEndDateSchedult:{
            required: true
        }
        
    },
    messages: {
        dropdownMovie: {
            required: 'Phim không được bỏ trống'
        },
        dropdownRoom:{
            required: 'Phòng không được bỏ trống'
        },
        txtSuatChieu:{
            required: 'Suất chiếu không được bỏ trống'
        },
        txtNgayChieu: {
            required: 'Ngày không được bỏ trống'
        },
        txtEndDateSchedult:{
            required: 'Ngày kết thúc không được để trống'
        }
        
    },
    errorPlacement: function (label, element) {
        label.insertAfter(element.parent("div"));

    },
    wrapper: 'span'
})

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

var dateCalendar= new Date()
var d = dateCalendar.getDate(),
    m = dateCalendar.getMonth(),
    y = dateCalendar.getFullYear()
var Calendar = FullCalendar.Calendar;

var containerEl = document.getElementById('external-events');
var calendarEl = document.getElementById('calendar');

let dtToday = new Date();
let moth = dtToday.getMonth() + 1;

dtToday.setDate(dtToday.getDate() + 1);

let day = dtToday.getDate();
let year = dtToday.getFullYear();

let minDate = `${year}-${moth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
$('input[name=txtNgayChieu]').prop('min', minDate);
$('input[name=txtEndDateSchedult]').prop('min', minDate);

var calendar = new FullCalendar.Calendar(calendarEl, {
    schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
    initialView: 'timeGridDay',
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridWeek,timeGridDay,listMonth'
    },
    locale: 'vi',

    height: '900px',
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
    let endDateSchedule = $('input[name=txtEndDateSchedult]').val();
    let room = rooms.filter(room => room.ID == idRoom);
    let movie = movies.filter(movie => movie.ID == idMovie);
    let timeOfMoive = movie && movie.length != 0?  movie[0].ThoiGian: 0;
    let form = $('#formSchedule');

    if(form.valid() == true){
        if(checkTimeInvalid(showTime,dateSchedule) == true){
            showLoading();
            $.ajax({
                method: 'POST',
                url: '/lichchieu/xeplich',
                data: {
                    idcinema: idCinema,
                    date: dateSchedule,
                    showtime: showTime,
                    idroom: idRoom,
                    idmovie: idMovie,
                    endDateSchedule: endDateSchedule
                },
                success: function (data) {
                    hideLoading();
                    
    
                    if (data.statusCode == 1) {
                        let endDate = new Date(endDateSchedule);
    
                        for(let date = new Date(dateSchedule); date.getTime() <= endDate.getTime(); date.setDate(date.getDate() + 1)){
                            
                            let yearIndex = date.getFullYear();
                            let monthIndex = date.getMonth() + 1;
                            let dateIndex = date.getDate() ;
                            let resultDateIndex = `${yearIndex.toString()}-${monthIndex.toString().padStart(2, '0')}-${dateIndex.toString().padStart(2, '0')}`;
    
                            let endTime = calulatorEndTime(`${showTime}:00`, timeOfMoive);
                            let newEvent = {
                                title: `${movie[0].TenPhim} | ${room[0].TenPhong}`,
                                start: `${resultDateIndex} ${showTime}`,
                                end: `${resultDateIndex} ${endTime}`,
                                backgroundColor: '#3c8dbc',
                                borderColor: '#3c8dbc',
                            };
    
                            calendar.addEvent(newEvent)
                        }     
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
    let inputEndDateSchedule = $('input[name=txtEndDateSchedult]')
    let date = new Date(openDate);

    if(Date.now() >= date.getTime()){
        let currentDate = new Date();
        let year = currentDate.getFullYear();
        currentDate.setDate(currentDate.getDate() + 1);

        let date = currentDate.getDate();
        
        let moth = currentDate.getMonth() + 1;
        
        inputDateSchedule.prop('min', `${year}-${moth.toString().padStart(2,'0')}-${date.toString().padStart(2,'0')}`);
        inputEndDateSchedule.prop('min', `${year}-${moth.toString().padStart(2,'0')}-${date.toString().padStart(2,'0')}`);
    }else{
        inputDateSchedule.prop('min', openDate);
        inputEndDateSchedule.prop('min', openDate);
    }

    inputDateSchedule.prop('max', endDate);
    inputEndDateSchedule.prop('max', endDate);
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

function checkTimeInvalid(time, date){
    let min = moment();
    min.hour(8);

    let max = moment();

    let dateInput = new Date(date);


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


$(document).ready(function(){
    let idCinema = $('select[name=dropdownCinema]').val();

    if(idCinema && idCinema != ''){
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
})


function setMinEndDate(inputDate){
    let dateSchedule = new Date(inputDate.value);

    let date = dateSchedule.getDate();
    let month = dateSchedule.getMonth() + 1;
    let year = dateSchedule.FullCalendar();

    $('input[name=txtEndDateSchedult]').prop('min', `${year.toString()}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`);
}