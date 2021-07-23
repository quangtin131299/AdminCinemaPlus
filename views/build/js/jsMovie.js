let editorDescriptionMovie;
ClassicEditor
    .create( document.querySelector('#editor') )
    .then(function(newEditor){
        let description = $('#editor').data('description');
        editorDescriptionMovie = newEditor;

        if(description && description != ''){
            editorDescriptionMovie.setData(description);
        }    
       
    })
    .catch( error => {
        console.error(error);
    });

let firebaseConfig = {
    apiKey: "AIzaSyA1UFC_oKZFOqG5RYb49aGhqR_ZrRvYvrs",
    authDomain: "cinemaplus-f6e86.firebaseapp.com",
    projectId: "cinemaplus-f6e86",
    storageBucket: "cinemaplus-f6e86.appspot.com",
    messagingSenderId: "490414050145",
    appId: "1:490414050145:web:d7b6db72a8c690a0b65320",
    measurementId: "G-HHG6KKPKCL"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

$('#formAddMovie').validate({
    rules: {
        txttenphim: {
            required: true,
            maxlength: 100
        },
        txtngaykhoichieu: {
            required: true,
        },
        txtNgayKetThuc: {
            required: true,
        },
        txtthoigian: {
            required: true,
        },
        cboxtrangthai: {
            required: true,
        },
        dropdownCountry: {
            required: true,
        },
        dropdownNhaCungCap: {
            required: true,
        },
        chbloai: {
            required: true,
        },
        chbCinema: {
            required: true,
        }
    },
    messages: {
        txttenphim: {
            required: 'Tên phim không được bỏ trống',
            maxlength: 'Hãy nhập tối đa 100 ký tự'
        },
        txtngaykhoichieu: {
            required: 'Ngày khởi chiếu không được bỏ trống',
        },
        txtNgayKetThuc: {
            required: 'Ngày kết thúc không được bỏ trống',
        },
        txtthoigian: {
            required: 'Thời gian phim không được bỏ trống',
        },
        cboxtrangthai: {
            required: 'Trạng thái chưa được chọn',
        },
        dropdownCountry: {
            required: 'Quốc gia chưa được chọn',
        },
        chbloai: {
            required: 'Loại chưa được chọn',
        },
        chbCinema: {
            required: 'Rạp chiếu chưa được chọn',
        },
        dropdownNhaCungCap: {
            required: 'Nhà cung cấp chưa được chọn',
        }
    },
    errorPlacement: function (label, element) {
        label[0].children[0].id = element[0].name;

        if (element[0].name == 'chbloai' || element[0].name == 'chbCinema') {
            label.insertAfter(element.parent("div").parent('div').parent('div'));
        } else {
            label.insertAfter(element.parent("div"));
        }
    },
    wrapper: 'span'
})


let danhsachphim = [];
document.getElementById("btnhuy").onclick = function () {
    window.location.replace("danhsachphim?page=1")
}
// Ràng buộc ngày khởi chiếu
let dtKhoiChieu = new Date();
let monthKhoiChieu = dtKhoiChieu.getMonth() + 1;
var dayKhoiChieu = dtKhoiChieu.getDate() + 7;
var yearKhoiChieu = dtKhoiChieu.getFullYear();
if (monthKhoiChieu < 10) {
    monthKhoiChieu = '0' + monthKhoiChieu.toString();
}
if (dayKhoiChieu < 10) {
    dayKhoiChieu = '0' + dayKhoiChieu.toString();
}
let maxDateKhoiChieu = yearKhoiChieu + '-' + monthKhoiChieu + '-' + dayKhoiChieu;
$('#txtngaykhoichieu').attr('min', maxDateKhoiChieu);

//Ràng buộc ngày kết thúc
// $('#txtngaykhoichieu').change(function() {
//     var interval = 7;
  
//     function convertDateString(p) {
//       return (p < 10) ? '0' + p : p;
//     }
  
//     var txtngaykhoichieu = new Date($(this).val());
//     txtngaykhoichieu.setDate(txtngaykhoichieu.getDate() + interval);
//     $('#txtNgayKetThuc').val(txtngaykhoichieu.getFullYear() + '/' + convertDateString(txtngaykhoichieu.getMonth() + 1) + '/' + convertDateString(txtngaykhoichieu.getDate()));
//   });
// let dtKetThuc = new Date();
// let monthKetThuc = dtKetThuc.getMonth() + 1;
// var dayKetThuc = dayKhoiChieu.getDate() + 1;
// var yearKetThuc = dtKetThuc.getFullYear();
// if (monthKetThuc < 10) {
//     monthKetThuc = '0' + monthKetThuc.toString();
// }
// if (dayKetThuc < 10) {
//     dayKetThuc = '0' + dayKetThuc.toString();
// }
// let maxDateKetThuc = yearKetThuc + '-' + monthKetThuc + '-' + dayKetThuc;


let mess = $('#modalTextMessage').html();
if (mess && mess != '') {
    $('#exampleModal').modal('show')
}

$('#btnOK').click(function () {
    $('#notifyModal').modal('hide')
})

let imageMovieOld;
let posterMovieOld;

$(document).ready(function () {

    let imgPoster = $('#imgMoviePoster');
    let imgMovie = $('#imgMoviePreview');

    posterMovieOld = imgPoster.prop('src').includes('no-image-available-icon-vector.jpg') == true? '' : imgPoster.prop('src');
    imageMovieOld = imgMovie.prop('src').includes('no-image-available-icon-vector.jpg') == true ? '' : imgMovie.prop('src');
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

    let MovieId = $('input[name=maphim]').val();
    let movieName = $('input[name=txttenphim]').val();
    let openDate = $('input[name=txtngaykhoichieu]').val();
    let endDate = $('input[name=txtNgayKetThuc]').val();
    let time = $('input[name=txtthoigian]').val();
    let status = $('select[name=cboxtrangthai]').val();
    let description = editorDescriptionMovie.getData();
    let idTrailer = $('input[name=txtIDtrailer]').val();
    let idCinemas = $('input[name=chbCinema]:checked').map(function () {
        return $(this).val();
    }).get();

    $.ajax({
        method: 'POST',
        url:'/phim/suattphim',
        data:{
            maphim:MovieId,
            txttenphim:movieName,
            txtngaykhoichieu:openDate,
            txtNgayKetThuc:endDate,
            cboxtrangthai:status,
            txtthoigian:time,
            txtIDtrailer:idTrailer,
            txtmota: description,
            chbCinema:idCinemas
        },
        success: async function(data){
            if(data){
                hideLoading();

                let imgPoster = $('#imgMoviePoster');
                let imgMovie = $('#imgMoviePreview');

                let newPoster = imgPoster.prop('src').includes('no-image-available-icon-vector.jpg') == true ?  posterMovieOld: imgPoster.prop('src');
                let newImageMovie = imgMovie.prop('src').includes('no-image-available-icon-vector.jpg') == true ? imageMovieOld: imgMovie.prop('src');
        

                if(imageMovieOld != newImageMovie){
                    await uploadfile(MovieId, true);
                }

                if(newPoster != posterMovieOld){
                    await uploadfile(MovieId, false); 
                }

                $('#modalTextMessage').html(data.message);
                $('#notifyModal').modal('show');
            }
        },
        error: function(){

        }
    })

}

function hideLoading() {
    $("#exampleModalCenter").modal('hide');
}

function showLoading() {
    $('#exampleModalCenter').modal('show');
}

function onSubmitAddMovie() {
    let form = $('#formAddMovie');

    if (form.valid() == true) {
        showLoading();

        let movieName = $('input[name=txttenphim]').val();
        let openDate = $('input[name=txtngaykhoichieu]').val();
        let endDate = $('input[name=txtNgayKetThuc]').val();
        let time = $('input[name=txtthoigian]').val();
        let status = $('select[name=cboxtrangthai]').val();
        let idTrailer = $('input[name=txtIDtrailer]').val();
        let idSupplier = $('select[name=dropdownNhaCungCap]').val();
        let idMovieTypes = $('input[name=chbloai]:checked').map(function () {
            return $(this).val();
        }).get();
        let idCinemas = $('input[name=chbCinema]:checked').map(function () {
            return $(this).val();
        }).get();
        let description = editorDescriptionMovie.getData().replace( /(<([^>]+)>)/ig, '');
        let idCountry = $('select[name=dropdownCountry]').val();

        $.ajax({
            method: 'POST',
            url: '/phim/themphim',
            data: {
                txttenphim: movieName,
                txtngaykhoichieu: openDate,
                txtNgayKetThuc: endDate,
                txtthoigian: time,
                cboxtrangthai: status,
                txtIDtrailer: idTrailer,
                dropdownNhaCungCap: idSupplier,
                chbloai: idMovieTypes,
                chbCinema: idCinemas,
                area2: description,
                dropdownCountry: idCountry,
            },
            success: function (data) {
                if (data) {
                    hideLoading();

                    uploadfile(data.newIdMovie, true);

                    uploadfile(data.newIdMovie, false);

                    $('#modalTextMessage').html(data.message);
                    $('#notifyModal').modal('show');

                }
            },
            error: function (error) {

            }
        })
    }
    // $('#formAddMovie').submit();
}

function uploadfile(newIdMovie, isImage) {
    const storageRef = firebase.storage().ref()
    let task = null;

    if (isImage == true) {
        let inputImage = $('input[name=imgMovie]').prop('files')[0];

        if(inputImage){
            let final = storageRef.child(`movies/Image/${newIdMovie}`);

            task = final.put(inputImage);

            task.on(
                "state_changed",
                // PROGRESS FUNCTION
                function progress(progress) { },
                function error(err) { },
                function completed() {
                    final.getDownloadURL()
        
                        .then((url) => {
                        
                            updateImage(newIdMovie, url, true);
                        });
                }
            );
        }
        
    } else {
        let inputPoster = $('input[name=imgPoster]').prop('files')[0];

        if(inputPoster){
            let final = storageRef.child(`movies/posters/${newIdMovie}`)
            task = final.put(inputPoster);
    
            task.on(
                "state_changed",
                // PROGRESS FUNCTION
                function progress(progress) { },
                function error(err) { },
                function completed() {
                    final.getDownloadURL()
        
                        .then((url) => {
                           
                            updateImage(newIdMovie, url, false);
                        });
                }
            );
        }
       
    } 
}

function updateImage(idMovie, url,isImage) {
    if (isImage == true) {
        $.ajax({
            method: 'PUT',
            url: '/phim/updateLinkImage',
            data: {
                idMovie: idMovie,
                urlImage: url
            },

            success: function(data){
                // if(data){
                //     console.log(data);
                // }
                
            },

            error: function(error){

            }
        });
    }else{
        $.ajax({
            method: 'PUT',
            url: '/phim/updateLinkPost',
            data: {
                idMovie: idMovie,
                urlPoster: url
            },
            success: function(data){
                // if(data){
                   
                // }
            },

            error: function(error){
                console.log(error);
            }
        });
    }
}

$('input[name=checkAll]').change(function(){
    let isCheck = $(this).prop('checked');

    if(isCheck == true){
        $('input[name=chbCinema]').map(function(){
            this.checked = true
        });
    }else{
        $('input[name=chbCinema]').map(function(){
            this.checked = false
        });
    }
})
