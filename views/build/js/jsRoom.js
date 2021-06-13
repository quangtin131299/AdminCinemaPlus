function sendIdCinema(){
    let idCinema = $('#inputGroupSelect02').val();

    showLoading();
    
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
                                        <th scope='row'>1</th>
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
            if(data && data.statusCode == 1){
                hideLoading();
            }else{
                hideLoading();
            }
        },
        error: function(error) {

        }
    })
   
})

function hideLoading() {
    $('#exampleModalCenter').on('shown.bs.modal', function (e) {
        $("#exampleModalCenter").modal('hide');
    })
}

function showLoading(){
   $('.modal').modal('show');
}