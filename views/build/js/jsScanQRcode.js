$(document).ready(function(){
    let mess = $('#modalTextMessage').html();

    if(mess != ''){
        $('#notifyModal').modal('show');
    }
    scanQRcode();
})

function scanQRcode() {
    let scanner = new Instascan.Scanner({ video: document.getElementById('preview')});
    Instascan.Camera.getCameras().then(function(cameras){
        if(cameras.length > 0 ){
            scanner.start(cameras[0]);
        } else{
            alert('No cameras found');
        }
    }).catch(function(e) {
        console.error(e);
    });
    scanner.addListener('scan',function(c){
        document.getElementById('text').value=c;
        let id = $('#text').val();
        if (id != '') {
            $.ajax({
                method: 'POST',
                url: '/soatve/updateStatus',
                data: {
                    id: id
                },
                success: function (data) {
                    if (data) {
                        hideLoading();
                        $('#modalTextMessage').html(data.message);
                        $('#notifyModal').modal('show')
                    }
                },
                error: function (error) {
                    console.log(error);
                }
            })
        }
    });
}

$('#exampleModalCenter').on('hidden.bs.modal', function (e) {
    $("#exampleModalCenter").modal('hide');
})

function hideLoading() {
    $("#exampleModalCenter").modal('hide');
}

function showLoading(){
   $('#exampleModalCenter').modal('show');
}