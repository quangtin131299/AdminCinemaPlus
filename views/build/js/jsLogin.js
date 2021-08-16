
$('#exampleModalCenter').on('hidden.bs.modal', function (e) {
    $("#exampleModalCenter").modal('hide');
})

$('#notifyModal').on('shown.bs.modal', function(e){
    $("#exampleModalCenter").modal('hide');
})

async function onSubmitLogin(){
    let account = $('input[name=txtAcount]').val();
    let password = $('input[name=txtPassword]').val();

    showLoading();

    $.ajax({
        url: '/login',
        method: 'POST',
        data:{
            account: account,
            password: password
        },
        success: function(data){
            hideLoading();

            if(data){

                if(data.statusCode == 1){
                    window.location.replace('/home');
                }else{
                    $('#modalTextMessage').text(data.message);

                    $('#notifyModal').modal('show');
                }
            }
        },
        error: function(){
            hideLoading();
        }
    });
}

function onClickBtnOk(){
    $('#notifyModal').modal('hide');
}

function hideLoading() {
    $("#exampleModalCenter").modal('hide');
}

function showLoading(){
    $('#exampleModalCenter').modal({backdrop: 'static', keyboard: false})

   $('#exampleModalCenter').modal('show');
}


