$('#exampleModalCenter').on('hidden.bs.modal', function (e) {
    $("#exampleModalCenter").modal('hide');
})

$('#notifyModal').on('shown.bs.modal', function (e) {
    $("#exampleModalCenter").modal("hide");
});

goongjs.accessToken = 'sEWmdGHz9T3IEP2ND6KlMMX9QMgPGjjHHOpofqCT';

var map = new goongjs.Map({
    container: 'map',
    style: 'https://tiles.goong.io/assets/goong_map_web.json', // stylesheet location
    center: [106.67783681139827, 10.738047815253331], // starting position [lng, lat]
    zoom: 17// starting zoom
});


map.jumpTo({
    center: [$('#inputLng').val(), $("#inputLat").val()],
    zoom: 17
})

var marker = new goongjs.Marker()
    .setLngLat([$('#inputLng').val(), $("#inputLat").val()])
    .addTo(map);


function hideLoading() {
    $("#exampleModalCenter").modal('hide');
}

function showLoading() {
    $('#exampleModalCenter').modal('show');
}

function onSubmitRoom(){
    let idCinema = $('input[name=txtIdCinema]').val();
    let nameRoom = $('input[name=txtNameRoom]').val();

    showLoading();
    
    $.ajax({
        method: 'POST',
        url: '/rapchieu/themphong',
        data:{
            nameRoom: nameRoom,
            idCinema:idCinema
        },
        success: function(data){
            if(data){
                hideLoading();
                
                let roomContainer = $('#accordion');

                if(data.statusCode == 1){
                    roomContainer.html(roomContainer.html() + `<div class="card">
                                                                    <div class="card-header" id="headingOne">
                                                                        <div class="row">
                                                                            <div class="col-md-6 container-infor-room">
                                                                                <h5 class="mb-0">
                                                                                    Mã Phòng: &ensp; <span id="idRoom">${data.Id_Room}</span>
                                                                                    &emsp; - &emsp;
                                                                                    Tên Phòng: &ensp; <span>${nameRoom}</span>
                                                                                </h5>
                                                                            </div>
                                                                            <div class="col-md-6 container-btn-show-seat">
                                                                                <a class="btn btn-primary" href="/ghe/danhsachghe?idRoom=${data.Id_Room}&idCinema=${idCinema}">Xem ghế</a>
                                                                            </div>
                                                                        </div>            
                                                                    </div>
                                                                </div>`)
                }

                $('#modalTextMessage').html(data.message);
                $('#notifyModal').modal('show');               
            }
        },
        error: function(){

        }

    }) 
}



