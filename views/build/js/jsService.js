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

function btnSubmit(isAdd){
    let namePopcorn = $('input[name=txtServiceName]').val();
    let description = $('input[name=txtDescribe]').val();
    let unitPrice = $('input[name=txtUnitPrice]').val();

    showLoading();

    if(isAdd == true){
        $.ajax({
            method: 'POST',
            url: '/dichvu/themdichvu',
            data:{
                namePopcorn:namePopcorn,
                description:description,
                unitPrice:unitPrice,
            },
            success: async function(data){
                if(data){
                    hideLoading();

                    await uploadfile(data.newIdPopcorn);

                    $('#modalTextMessage').text(data.messsage);
                    $('#notifyModal').modal('show');

                }
            },
            error:function(error){

            }
        })
    }else{

    }

}


function hideLoading() {
    $("#exampleModalCenter").modal('hide');
}

function showLoading() {
    $('#exampleModalCenter').modal('show');
}

function uploadfile(newIdPopcorn) {
    const storageRef = firebase.storage().ref()
    let task = null;
    let inputImage = $('input[name=imgService]').prop('files')[0];
    
    let final = storageRef.child(`popcorns/${newIdPopcorn}`)
    task = final.put(inputImage);

    task.on(
        "state_changed",
        // PROGRESS FUNCTION
        function progress(progress) { },
        function error(err) { },
        function completed() {
            final.getDownloadURL()

                .then((url) => {
                    
                    updateImage(newIdPopcorn, url);
                });
        }
    );
}

function updateImage(idPopCorn, url) {
    $.ajax({
        method: 'PUT',
        url: '/dichvu/updateImage',
        data: {
            idPopcorn: idPopCorn,
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
   
}
