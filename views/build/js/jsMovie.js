let danhsachphim = [];
document.getElementById("btnhuy").onclick = function () {
    window.location.replace("danhsachphim?page=1")
}

let dtToday = new Date();
let month = dtToday.getMonth() + 1;
var day = dtToday.getDate();
var year = dtToday.getFullYear();
if (month < 10) {
    month = '0' + month.toString();
}
if (day < 10) {
    day = '0' + day.toString();
}
let maxDate = year + '-' + month + '-' + day;
$('#txtngaykhoichieu').attr('min', maxDate);
$('#txtNgayKetThuc').attr('min', maxDate);

let mess = $('#modalTextMessage').html();
if (mess && mess != '') {
    $('#exampleModal').modal('show')
}

$('#btnOK').click(function () {
    $('#notifyModal').modal('hide')
})

$(document).ready(function () {
    let mess = $("#modalTextMessage").html();

    if (mess != '') {
        $('#notifyModal').modal('show');
    }
})

function setFileImageMovie(elFileImageMovie) {

    var fullPath = elFileImageMovie.value;

    if (fullPath) {
        var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
        var filename = fullPath.substring(startIndex);
        if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
            filename = filename.substring(1);
        }
        $('.file-name-image-movie').html(filename);
    }

    const [file] = elFileImageMovie.files

    if (file) {
        $("#imgMoviePreview").attr("src", URL.createObjectURL(file));
    }
}

function setFileImagePoster(elFileImagePoster) {

    var fullPath = elFileImagePoster.value;

    if (fullPath) {
        var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
        var filename = fullPath.substring(startIndex);
        if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
            filename = filename.substring(1);
        }
        $('.file-name-image-poster').html(filename);
    }

    const [file] = elFileImagePoster.files

    if (file) {
        $("#imgMoviePoster").attr("src", URL.createObjectURL(file));
    }
}

function onSubmitEditMovie() {
    showLoading();
    $('#formEditMovie').submit();
}

function hideLoading() {
    $("#exampleModalCenter").modal('hide');
}

function showLoading() {
    $('#exampleModalCenter').modal('show');
}

function onSubmitAddMovie() {
    showLoading();
    $('#formAddMovie').submit();
}