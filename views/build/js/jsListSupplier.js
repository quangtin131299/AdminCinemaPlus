let idSupplier = 0; 

$('#exampleModalCenter').on('hidden.bs.modal', function (e) {
    $("#exampleModalCenter").modal('hide');
})

$('#notifyModal').on('shown.bs.modal', function (e) {
    $("#exampleModalCenter").modal("hide");
});

function setIdSupplier(idSupplierDelete){
    idSupplier = idSupplierDelete;
}

function btnAccept(){
    $('#modalInforDelete').modal('hide');

    showLoading();

    $.ajax({
        method: 'POST',
        url: '/nhacungcap/xoanhacungcap',
        data: {
            idSupplier: idSupplier
        },
        success: function (data) {
            if (data) {
                hideLoading();

                $('#modalTextMessage').html(data.message);
                $('#notifyModal').modal('show')

                window.location.replace('/nhacungcap/danhsachnhacungcap?page=1')
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