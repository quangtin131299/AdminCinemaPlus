let danhsachrapchieu = [];
document.getElementById("btnhuy").onclick = function () {
    window.location.replace("danhsachrapchieu?page=1")
}

$('#exampleModalCenter').on('hidden.bs.modal', function (e) {
    $("#exampleModalCenter").modal('hide');
})

$('#btnOK').click(function () {
    $('#myModal').modal('hide')
})

$('#inputGroupFile01').on('change', function () {


})


$('#btnsubmit').click(function () {
    // let theaterName = $('#txtTheaterName').val();
    // let imgCinema =$('#inputGroupFile01').val();
    // let cinemaAddress = $('#txtCinemaAddress').val();
    // let viDo = $('#txtViDo').val();
    // let kinhDo = $('#txtKinhDo').val();

    showLoading();
    $('#formAddCinema').submit();

    // $.ajax({
    //     method: 'POST',
    //     url: '/rapchieu/themrapchieu',
    //     data: {
    //         theaterName: theaterName,
    //         imgCinema: imgCinema,
    //         cinemaAddress: cinemaAddress,
    //         viDo: viDo,
    //         kinhDo: kinhDo,
    //     },
    //     success: function(data) {
    //         if(data){
    //             hideLoading();
    //             $('#modalTextMessage').html(data.messNotify);
    //             $('#notifyModal').modal('show')
    //         }
    //     },
    //     error: function(error) {
    //         console.log(error);
    //     }
    // })        
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
    $('.modal').modal('show');
}