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

$('#btnOK').click(function () {
    window.location.replace('/rapchieu/danhsachrapchieu?page=1');
})


$('#btnsubmit').click(function () {
    showLoading();
    $('#formAddCinema').submit();
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
        container: '#txtCinemaAddress',
        placesReference: window.places,
    }),
    instantsearch.widgets.geoSearch({
        container: '#maps',
        googleReference: window.google,
    }),
]);

search.start();

function getLatLng() {
    searchLngLat();
}

function searchLngLat() {
    var api_key = '2a4d1678277d4f1689e79a1655298d59';
    var latitude = '51.0';
    var longitude = '7.0';

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
            }
        },
        error: function (error) {

        }
    })
}

