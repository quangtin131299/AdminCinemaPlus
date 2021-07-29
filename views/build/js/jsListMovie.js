let idMovie = 0; 

$('#exampleModalCenter').on('hidden.bs.modal', function (e) {
    $("#exampleModalCenter").modal('hide');
})

$('#notifyModal').on('shown.bs.modal', function (e) {
    $("#exampleModalCenter").modal("hide");
});

function setIdMovie(idServiceDelete){
    idMovie = idServiceDelete;
}

function btnAccept(){
    $('#modalInforDelete').modal('hide');

    showLoading();

    $.ajax({
        method: 'POST',
        url: '/phim/xoaphim',
        data: {
            idMovie: idMovie
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


function hideLoading() {
    $("#exampleModalCenter").modal('hide');
}

function showLoading() {
    $('#exampleModalCenter').modal('show');
}