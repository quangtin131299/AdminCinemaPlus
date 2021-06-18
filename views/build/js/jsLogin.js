$(document).ready(function(){
    
    let mess = $('#modalTextMessage').html();

    if(mess != ''){
        $('#notifyModal').modal('show');
    }
})

$('#exampleModalCenter').on('hidden.bs.modal', function (e) {
    $("#exampleModalCenter").modal('hide');
})

function onSubmitLogin(){
    // let account = $('input[name=txtAcount]').val();
    // let password = $('input[name=txtPassword]').val();
    showLoading();
    $('#formLogin').submit();
}


function hideLoading() {
    $("#exampleModalCenter").modal('hide');
}

function showLoading(){
   $('#exampleModalCenter').modal('show');
}


