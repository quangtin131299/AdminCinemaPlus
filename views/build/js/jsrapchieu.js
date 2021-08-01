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


$('#formCinema').validate({
    rules: {
        txtTheaterName: {
            required: true
        },
        txtCinemaAddress: {
            required: true
        },
        txtViDo:{
            required: true
        },
        txtKinhDo:{
            required: true
        }
    },
    messages: {
        txtTheaterName: {
            required: 'Tên rạp chiếu không được bỏ trống.'
        },
        txtCinemaAddress: {
            required: 'Địa chỉ rạp chiếu không được bỏ trống'
        },
        txtViDo:{
            required: 'Vĩ độ không được bỏ trống'
        }
        ,
        txtKinhDo:{
            required: 'Kinh độ không được bỏ trống'
        }
    },
    errorPlacement: function (label, element) {
        if(element[0].name === 'txtCinemaAddress'){
            label.insertAfter(element.parent('span').parent('div'));
        }else{
            label.insertAfter(element.parent("div"));
        }
        
    },
    wrapper: 'span'
})



let danhsachrapchieu = [];

$(document).ready(function () {
    let mess = $("#modalTextMessage").html();

    if (mess != '') {
        $('#notifyModal').modal('show');
    }

    
})

document.getElementById("btnhuy").onclick = function () {
    window.location.replace("danhsachrapchieu?page=1")
}


$('#exampleModalCenter').on('hidden.bs.modal', function (e) {
    $("#exampleModalCenter").modal('hide');
})

$('#notifyModal').on('shown.bs.modal', function (e) {
    $("#exampleModalCenter").modal("hide");
});


$('#btnOK').click(function () {
    window.location.replace('/rapchieu/danhsachrapchieu?page=1');
})

$('#btnOKAddMovie').click(function () {
    $('#notifyModal').modal('hide')
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

function btnSubmit(isAdd){
    let nameCinema = $('input[name=txtTheaterName]').val();
    let address = $('input[name=txtCinemaAddress]').val();
    let lng = $('input[name=txtKinhDo]').val();
    let lat = $('input[name=txtViDo]').val();
    let formAddCinema = $('#formCinema');

    
    if(formAddCinema.valid() == true){
        showLoading();
        if(isAdd){
            $.ajax({
                method: 'POST',
                url: '/rapchieu/themrapchieu',
                data:{
                    nameCinema: nameCinema,
                    address:address,
                    lng:lng,
                    lat:lat
                },
                success: async function(data){
                    if(data){
                        hideLoading();
    
                        await uploadfile(data.newIdCinema);
    
                        $('#modalTextMessage').text(data.message);
                        $('#notifyModal').modal('show');
                    }
                },
                error:function(error){
    
                }
            })
        }else{
            let idCinema= $('input[name=txtIdCinema]').val();
    
            $.ajax({
                method: 'POST',
                url: '/rapchieu/suarapchieu',
                data:{
                    idCinema: idCinema,
                    nameCinema: nameCinema,
                    address:address,
                    lng:lng,
                    lat:lat
                },
                success: async function(data){
                    if(data){
                        hideLoading();
    
                        await uploadfile(idCinema);
    
                        $('#modalTextMessage').text(data.message);
                        $('#notifyModal').modal('show');
                    }
                },
                error:function(error){
    
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

const searchClient = algoliasearch(
    'latency',
    '6be0576ff61c053d5f9a3225e2a90f76'
);


const search = instantsearch({
    indexName: 'airports',
    searchClient,
});

const index = searchClient.initIndex("airports");

search.addWidgets([
    instantsearch.widgets.places({
        container: 'input[name=txtCinemaAddress]',
        placesReference: window.places,
    }),
]);

search.start();

goongjs.accessToken = 'sEWmdGHz9T3IEP2ND6KlMMX9QMgPGjjHHOpofqCT';

var map = new goongjs.Map({
    container: 'map',
    style: 'https://tiles.goong.io/assets/goong_map_web.json', // stylesheet location
    center: [106.67783681139827, 10.738047815253331], // starting position [lng, lat]
    zoom: 17// starting zoom
});

function onBlur(){
    var api_key = '2a4d1678277d4f1689e79a1655298d59';

    var api_url = 'https://api.opencagedata.com/geocode/v1/json'

    var request_url = api_url
        + '?'
        + 'key=' + api_key
        + '&q=' + encodeURIComponent($('#txtAddress').val())
        + '&pretty=1'
        + '&no_annotations=1';

    $.ajax({
        method: 'GET',
        url: request_url,
        success: function (dataResult) {
            if (dataResult) {
                $('#txtViDo').val(dataResult.results[0].geometry.lat);
                $('#txtKinhDo').val(dataResult.results[0].geometry.lng)

                map.jumpTo({
                    center: [dataResult.results[0].geometry.lng, dataResult.results[0].geometry.lat],
                    zoom: 17
                })

                var marker = new goongjs.Marker()
                    .setLngLat([dataResult.results[0].geometry.lng, dataResult.results[0].geometry.lat])
                    .addTo(map);


            }
        },
        error: function (error) {
            console.log(error);
        }
    })
}

function getLatLng() {
    searchLngLat();
}

function searchLngLat() {
    var api_key = '2a4d1678277d4f1689e79a1655298d59';


    var api_url = 'https://api.opencagedata.com/geocode/v1/json'

    var request_url = api_url
        + '?'
        + 'key=' + api_key
        + '&q=' + encodeURIComponent($('#txtCinemaAddress').val())
        + '&pretty=1'
        + '&no_annotations=1';

    $.ajax({
        method: 'GET',
        url: request_url,
        success: function (dataResult) {
            if (dataResult) {
                $('#txtViDo').val(dataResult.results[0].geometry.lat);
                $('#txtKinhDo').val(dataResult.results[0].geometry.lng)

                // map.setCenter([dataResult.results[0].geometry.lng, dataResult.results[0].geometry.lat])
                
                map.jumpTo({
                    center: [dataResult.results[0].geometry.lng, dataResult.results[0].geometry.lat],
                    zoom: 17
                })

                var marker = new goongjs.Marker()
                    .setLngLat([dataResult.results[0].geometry.lng, dataResult.results[0].geometry.lat])
                    .addTo(map);


            }
        },
        error: function (error) {

        }
    })
}

function uploadfile(newIdCinema) {
    const storageRef = firebase.storage().ref()
    let task = null;
    let inputImage = $('input[name=imgCinema]').prop('files')[0];

    if(inputImage != null){
        let final = storageRef.child(`cinemas/${newIdCinema}`)
        task = final.put(inputImage);
    
        task.on(
            "state_changed",
            // PROGRESS FUNCTION
            function progress(progress) { },
            function error(err) { },
            function completed() {
                final.getDownloadURL()
    
                    .then((url) => {
                        
                        updateImage(newIdCinema, url);
                    });
            }
        );
    }  
}

function updateImage(idCinema, url) {
    $.ajax({
        method: 'PUT',
        url: '/rapchieu/updateImage',
        data: {
            idCinema: idCinema,
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

