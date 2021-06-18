let danhsachrapchieu = [];

$(document).ready(function(){
    let mess = $("#modalTextMessage").html();
    
    if(mess != ''){
        $('#notifyModal').modal('show');
    }
})

document.getElementById("btnhuy").onclick = function () {
    window.location.replace("danhsachrapchieu?page=1")
}

$('#exampleModalCenter').on('hidden.bs.modal', function (e) {
    $("#exampleModalCenter").modal('hide');
})

$('#btnOK').click(function () {
    $('#notifyModal').modal('hide')
})


$('#btnsubmit').click(function () {
    showLoading();
    $('#formAddCinema').submit();
})

function setFileImageCinema(elFileImageCinema) {

    var fullPath = elFileImageCinema.value;

    if (fullPath) {
        var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
        var filename = fullPath.substring(startIndex);
        if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
            filename = filename.substring(1);
        }
        $('.file-name-image-cinema').html(filename);
    }

    const [file] = elFileImageCinema.files

    if (file) {
        $("#imgCinemaPreview").attr("src", URL.createObjectURL(file));
    }
}


function hideLoading() {
    $("#exampleModalCenter").modal('hide');
}

function showLoading() {
    $('#exampleModalCenter').modal('show');
}