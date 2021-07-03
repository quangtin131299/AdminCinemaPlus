$('#formAddService').validate({
    rules: {
        txtServiceName: {
            required: true
        },
        txtDescribe: {
            required: true,
        },
        txtUnitPrice: {
            required: true
        }
    },
    messages: {
        txtServiceName: {
            required: 'Tên dịch vụ không được bỏ trống'
        },
        txtDescribe: {
            required: 'Thông tin mô tả dịch vụ không được bỏ trống'
        },
        txtUnitPrice: {
            required: 'Giá dịch vụ không được bỏ trống'
        }
    },
    errorPlacement: function(label, element) {
        label[0].children[0].id = element[0].name;
        label.insertAfter(element.parent("div"));
        
    },
    wrapper: 'span'
})

let danhsachdichvu = [];

$(document).ready(function () {
    let mess = $("#modalTextMessage").html();

    if (mess != '') {
        $('#notifyModal').modal('show');
    }
})

document.getElementById("btnhuy").onclick = function () {
    window.location.replace("danhsachdichvu")
}

$('#exampleModalCenter').on('hidden.bs.modal', function (e) {
    $("#exampleModalCenter").modal('hide');
})

$('#btnOK').click(function () {
    window.location.replace('/dichvu/danhsachdichvu');
})


$('#btnsubmit').click(function () {
    showLoading();
    $('#formAddService').submit();
})

$('#btnOKAddService').click(function () {
    $('#notifyModal').modal('hide')
})

function setFileImageService(elFileImageService) {

    var fullPath = elFileImageService.value;

    if (fullPath) {
        var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
        var filename = fullPath.substring(startIndex);
        if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
            filename = filename.substring(1);
        }
        $('.file-name-image-service').html(filename);
    }

    const [file] = elFileImageService.files

    if (file) {
        $("#imgServicePreview").attr("src", URL.createObjectURL(file));
    }
}


function hideLoading() {
    $("#exampleModalCenter").modal('hide');
}

function showLoading() {
    $('#exampleModalCenter').modal('show');
}