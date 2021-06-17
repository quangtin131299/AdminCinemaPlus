let danhsachnhacungcap = [];
document.getElementById("btnhuy").onclick = function () {
    window.location.replace("danhsachnhacungcap?page=1")
}

$('#exampleModalCenter').on('hidden.bs.modal', function (e) {
    $("#exampleModalCenter").modal('hide');
})

$('#btnOK').click(function(){
    $('#myModal').modal('hide')
})

$('#btnsubmit').click(function() {
    let supplierName = $('#txtSupplierName').val();
    let address = $('#txtAddress').val();
    let phoneNumber = $('#txtPhoneNumber').val();
    let email = $('#txtEmail').val();

    showLoading();

    $.ajax({
        method: 'POST',
        url: '/nhacungcap/themnhacungcap',
        data: {
            supplierName: supplierName,
            address: address,
            phoneNumber: phoneNumber,
            email: email
        },
        success: function(data) {
            if(data){
                hideLoading();
                $('#modalTextMessage').html(data.messNotify);
                $('#notifyModal').modal('show')
            }
        },
        error: function(error) {
            console.log(error);
        }
    })

    
})

function hideLoading() {
    $("#exampleModalCenter").modal('hide');
}

function showLoading(){
   $('.modal').modal('show');
}