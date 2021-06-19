let danhsachnhacungcap = [];
document.getElementById("btnhuy").onclick = function () {
    window.location.replace("danhsachnhacungcap?page=1")
}


$(document).ready(function () {
    let mess = $("#modalTextMessage").html();

    if (mess != '') {
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

$('#btnsubmit').click(function () {
    let supplierName = $('#txtSupplierName').val();
    let address = $('#txtAddress').val();
    let phoneNumber = $('#txtPhoneNumber').val();
    let email = $('#txtEmail').val();

    showLoading();

    if (validateNumberPhone() == true && validateEmail() == true && supplierName != '' && address != '') {
        $.ajax({
            method: 'POST',
            url: '/nhacungcap/themnhacungcap',
            data: {
                supplierName: supplierName,
                address: address,
                phoneNumber: phoneNumber,
                email: email
            },
            success: function (data) {
                if (data) {
                    hideLoading();
                    $('#modalTextMessage').html(data.messNotify);
                    $('#notifyModal').modal('show')
                }
            },
            error: function (error) {
                console.log(error);
            }
        })


    } else {

        hideLoading();

        $("#modalTextMessage").html('Thông tin không hợp lệ')
        $('#notifyModal').modal('show');
    }

})

function hideLoading() {
    $("#exampleModalCenter").modal('hide');
}

function showLoading() {
    $('#exampleModalCenter').modal('show');
}

function validateNumberPhone() {
    var vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    var mobile = $('#txtPhoneNumber').val();
    if (mobile !== '') {
        if (vnf_regex.test(mobile) == false) {
            return false;
        }
    }

    return true;
}

function validateEmail() {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test($('#txtEmail').val())) {
        return true;
    }
   
    return false;
}