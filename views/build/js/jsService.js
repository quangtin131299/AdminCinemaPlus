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

let btnhuy = document.getElementById("btnhuy");
if (btnhuy) {
    btnhuy.onclick = function () {
        window.location.replace("danhsachdichvu?page=1")
    }
}

let editorDescriptionService;
ClassicEditor
    .create(document.querySelector('#txtDescribe'))
    .then(function (newEditor) {
        let description = $('#txtDescribe').data('description');
        editorDescriptionService = newEditor;

        if (description && description != '') {
            editorDescriptionService.setData(description);
        }
    })
    .catch(error => {
        console.error(error);
    });

$('#formService').validate({
    rules: {
        txtServiceName: {
            required: true
        },
        txtDescribe: {
            required: true
        },
        txtUnitPrice: {
            required: true
        }
    },
    messages: {
        txtServiceName: {
            required: 'Tên dịch vụ không được bỏ trống.'
        },
        txtDescribe: {
            required: 'Mô tả dịch vụ không được bỏ trống'
        },
        txtUnitPrice: {
            required: 'Đơn giá không được bỏ trống'
        }
    },
    errorPlacement: function (label, element) {
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

$('#notifyModal').on('shown.bs.modal', function (e) {
    $("#exampleModalCenter").modal("hide");
});

$('#btnOK').click(function () {
    window.location.replace('/dichvu/danhsachdichvu?page=1');
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

function btnSubmit(isAdd) {
    let form = $('#formService');
    let namePopcorn = $('input[name=txtServiceName]').val();
    let description = $(editorDescriptionService.getData()).text();
    let unitPrice = $('input[name=txtUnitPrice]').val();

    if (form.valid() == true) {
        showLoading();

        if (isAdd == true) {
            $.ajax({
                method: 'POST',
                url: '/dichvu/themdichvu',
                data: {
                    namePopcorn: namePopcorn,
                    description: description,
                    unitPrice: unitPrice,
                },
                success: async function (data) {
                    if (data) {
                        await uploadfile(data.newIdPopcorn);

                        hideLoading();

                        $('#modalTextMessage').text(data.messsage);
                        $('#notifyModal').modal('show');

                    }
                },
                error: function (error) {

                }
            })
        } else {
            let idPopcorn = $('input[name=txtIDPopcorn]').val();

            $.ajax({
                method: 'POST',
                url: '/dichvu/suadichvu',
                data: {
                    idPopcorn: idPopcorn,
                    namePopcorn: namePopcorn,
                    description: description,
                    unitPrice: unitPrice,
                },
                success: async function (data) {
                    if (data) {
                        await uploadfile(idPopcorn);

                        hideLoading();

                        $('#modalTextMessage').text(data.messsage);
                        $('#notifyModal').modal('show');

                    }
                },
                error: function (error) {

                }
            })
        }

    }
}


function hideLoading() {
    $("#exampleModalCenter").modal('hide');
}

function showLoading() {
    $('#exampleModalCenter').modal('show');
}

async function uploadfile(newIdPopcorn) {
    return new Promise(function (resolve, reject) {
        const storageRef = firebase.storage().ref()
        let task = null;
        let inputImage = $('input[name=imgService]').prop('files')[0];

        if (inputImage != null) {
            let final = storageRef.child(`popcorns/${newIdPopcorn}`)
            task = final.put(inputImage);

            task.on(
                "state_changed",
                // PROGRESS FUNCTION
                function progress(progress) { },
                function error(err) { reject(false) },
                async function completed() {
                    let url = await final.getDownloadURL()

                    await updateImage(newIdPopcorn, url);

                    resolve(true);
                }
            );
        }else{
            resolve(true);
        }
    });
}

async function updateImage(idPopCorn, url) {
    return new Promise(function(resolve, reject){
        $.ajax({
            method: 'PUT',
            url: '/dichvu/updateImage',
            data: {
                idPopcorn: idPopCorn,
                urlImage: url
            },
    
            success: function (data) {
                resolve(true);
            },
    
            error: function (error) {
                reject(false);
            }
        });
    });
}
