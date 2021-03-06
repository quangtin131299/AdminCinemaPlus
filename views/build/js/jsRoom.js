document.getElementById("btnhuy").onclick = function () {
    window.location.replace("danhsachphong")
}

$(document).ready(function () {
    let mess = $("#modalTextMessage").html();

    if (mess != ''){
        $('#notifyModal').modal('show');
    }
})

$('#exampleModalCenter').on('hidden.bs.modal', function (e) {
    $("#exampleModalCenter").modal('hide');
})

$('#notifyModal').on('shown.bs.modal', function (e) {
    $("#exampleModalCenter").modal("hide");
});


$('#btnOK').click(function () {
    $('#notifyModal').modal('hide')
})

function sendIdCinema(){
    let idCinema = $('#inputGroupSelect02').val();
    
    $.ajax({
      method: "GET",
      url: '/phong/getroombycinemaid',
      data: {
        id: idCinema
      },
      success: function(data){
        let tblBody = $('#tblBody');
        
        tblBody.html('');

        if(data){
            
            hideLoading();
            let countRoom = data.length;

            for(let i = 0; i < countRoom; i++){
                tblBody.html(tblBody.html() 
                                + ` <tr>
                                        <td> ${data[i].ID}</td>
                                        <td> ${data[i].TenPhong}</td>
                                    </tr>
                                `)
            }
        }else{
            hideLoading();
        }
      },
      error: function(error){
        hideLoading();
      }
    })
}

$('#btnsubmit').click(function(){
    let idCinema = $('#inputGroupSelect02').val();
    let roomName = $('#txtRoomName').val();

    showLoading();

    $.ajax({
        method: "POST",
        url: '/phong/themphong',
        data: {
            cinemaId: idCinema,
            nameRoom: roomName
        },
        success: function(data){
            if(data){
                hideLoading();        
                $('#modalTextMessage').html(data.messNotify);
                $('#notifyModal').modal('show')
            }
        },
        error: function(error) {
            hideLoading();   
            console.log(error);
        }
    })
   
})

function hideLoading() {
    $("#exampleModalCenter").modal('hide');
}

function showLoading() {
   $('#exampleModalCenter').modal('show');
}