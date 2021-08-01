$('#exampleModalCenter').on('hidden.bs.modal', function (e) {
    $("#exampleModalCenter").modal('hide');
})

$('#notifyModal').on('shown.bs.modal', function (e) {
    $("#exampleModalCenter").modal("hide");
});

function hideLoading() {
    $("#exampleModalCenter").modal('hide');
}

function showLoading() {
    $('#exampleModalCenter').modal('show');
}

$('#formAddSeat').validate({
    rules: {
        txtNameSeat: {
            required: true,
            maxlength: 5
        },
    },
    messages: {
        txtNameSeat: {
            required: 'Tên ghế không được bỏ trống'
        },
    },
    errorPlacement: function (label, element) {
        label.insertAfter(element);
    },
    wrapper: 'span'
});

function search() {
    let tblSeat = $('#tblBodySeat');
    let keyWord = $('input[name=txtKeyWord]').val();
    let idRoom = $('input[name=txtIdRoom]').val();

    $.ajax({
        method: 'GET',
        url: '/ghe/timkiem',
        data: {
            idRoom: idRoom,
            keyWord: keyWord
        },
        success: function (data) {
            if (data) {
                tblSeat.html('');

                let countSeats = data.resultSeats.length;

                for (let i = 0; i < countSeats; i++) {
                    tblSeat.html(tblSeat.html() + `<tr>
                                                        <td>${data.resultSeats[i].ID}</td>
                                                        <td>${data.resultSeats[i].TenGhe}</td>
                                                        <td>
                                                            <select class="form-control">
                                                                <option value='Trống' selected>Trống</option>
                                                                <option value='Đã đặt'>Đã đặt</option>
                                                                <option value='Bị hư'>Bị hư</option>
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <button class="btn btn-success">Cập nhật</button>          
                                                        </td>
                                                    </tr>`);
                }
            }
        },
        error: function () {

        }
    });
}


function updateStatusSeat(idSeat, idRoom) {
    let status = $(`#seat${idSeat}`).val();

    if (status != 'Đã đặt') {
        showLoading();

        $.ajax({
            method: 'PUT',
            url: '/ghe/updateSeat',
            data: {
                idRoom: idRoom,
                idSeat: idSeat,
                status: status
            },
            success: function (data) {
                if (data) {
                    hideLoading();

                    $('#modalTextMessage').text(data.messgae);
                    $('#notifyModal').modal('show');
                }
            },
            error: function () {

            }
        })
    }else{
        $('#modalTextMessage').text('Không thể cập nhật trạng thái ghế đã đặt');
        $('#notifyModal').modal('show');
    }
}