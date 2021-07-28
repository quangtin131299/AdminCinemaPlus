let danhsachnhacungcap = [];

let btnhuy = document.getElementById("btnhuy");
if(btnhuy){
    btnhuy.onclick = function () {
        window.location.replace("danhsachnhacungcap")
    }
}

$(document).ready(function () {
    let mess = $("#modalTextMessage").html();

    if (mess != '') {
        $('#notifyModal').modal('show');
    }

    let inputAddress = $('#inputGroup-sizing-default-Address');

    if(inputAddress){
        $('input[name=txtAddress]').val(inputAddress.data('address'));
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

function btnSubmit(isAdd) {
    let supplierName = $('#txtSupplierName').val();
    let address = $('#txtAddress').val();
    let phoneNumber = $('#txtPhoneNumber').val();
    let email = $('#txtEmail').val();

    showLoading();
    if (validateNumberPhone() == true && validateEmail() == true && supplierName != '' && address != '') {
        if (isAdd == true) {

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
            let idSupplier = $('input[name=idSupplier]').val();

            $.ajax({
                method: 'PUT',
                url: '/nhacungcap/suanhacungcap',
                data: {
                    maSupplier: idSupplier,
                    supplierName: supplierName,
                    address: address,
                    phoneNumber: phoneNumber,
                    email: email
                },
                success: function (data) {
                    if (data) {
                        hideLoading();

                        $('#modalTextMessage').html(data.message);
                        $('#notifyModal').modal('show');
                    }
                },
                error: function (error) {
                    console.log(error);
                }
            })
        }
    } else {
        hideLoading();

        $("#modalTextMessage").html('Thông tin không hợp lệ')
        $('#notifyModal').modal('show');
    }


}


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
        container: '#txtAddress',
        placesReference: window.places,
    }),
]);

search.start();

goongjs.accessToken = 'sEWmdGHz9T3IEP2ND6KlMMX9QMgPGjjHHOpofqCT';

var map = new goongjs.Map({
    container: 'map',
    style: 'https://tiles.goong.io/assets/goong_map_web.json', // stylesheet location
    center: [106.67783681139827, 10.738047815253331], // starting position [lng, lat]
    zoom: 17 // starting zoom
});


function onBlur() {
    var api_key = '2a4d1678277d4f1689e79a1655298d59';

    var api_url = 'https://api.opencagedata.com/geocode/v1/json'

    var request_url = api_url +
        '?' +
        'key=' + api_key +
        '&q=' + encodeURIComponent($('#txtAddress').val()) +
        '&pretty=1' +
        '&no_annotations=1';

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