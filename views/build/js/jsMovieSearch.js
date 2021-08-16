$('#exampleModalCenter').on('shown.bs.modal', function (e) {
    $("#exampleModalCenter").modal('hide');
})

function searchMovie(page) {
    let keyWord = $('input[name=txtKeyWord]').val();
    let idType = $('select[name=dropdownTheLoaiPhim]').val();
    let idCountry = $('select[name=dropdownQuocGia]').val();
    let idCinema = $('select[name=dropdownCinema]').val();

    showLoading();

    $.ajax({
        method: 'GET',
        url: '/phim/searchmovie',
        data: {
            keyWord: keyWord,
            idType: idType,
            idCountry: idCountry,
            idCinema: idCinema,
            pageSelect: page
        },
        success: function (data) {
            let tblMovie = $(`#listMovie`);
            let listPage = $('#listPage');

            listPage.html(`<li class='page-item'>
                                 <a class='page-link' href='#'>Trang trước</a> 
                           </li>`)

            hideLoading();

            if (data) {
                if (data.statusCode == 1) {
                    let countMovie = data.resultMovie.length;

                    tblMovie.html('');

                    for (let i = 0; i < countMovie; i++) {
                        tblMovie.html(tblMovie.html() + `
                                                        <div class="card card-movie">
                                                            <div class='infor-movie-container'>
                                                                <div class="img-movie-container">
                                                                    <img class="card-img-movie" src="${data.resultMovie[i].Hinh}" />
                                                                </div>
                                                                <div class="infor-movie">
                                                                    <div>
                                                                        <h2 class="text-content-name-movie">${data.resultMovie[i].TenPhim}</h2>
                                                                    </div>
                                                                    <br>
                                                                    <div>
                                                                        <label class="text-content-label-movie">Ngày khởi chiếu: &nbsp&nbsp</label>
                                                                        <span class="text-content-movie">${data.resultMovie[i].NgayKhoiChieu}</span>
                                                                    </div>
                                                                    <div>
                                                                        <label class="text-content-label-movie">Ngày kết thúc: &nbsp&nbsp</label>
                                                                        <span class="text-content-movie">${data.resultMovie[i].NgayKetThuc}</span>
                                                                    </div>
                                                                    <div>
                                                                        <label class="text-content-label-movie">Thời gian: &nbsp&nbsp</label>
                                                                        <span class="text-content-movie">${data.resultMovie[i].ThoiGian} phút</span>
                                                                    </div>
                                                                    <div>
                                                                        <label class="text-content-label-movie">Trạng thái: &nbsp&nbsp</label>
                                                                        <span class="text-content-movie">${data.resultMovie[i].TrangThai}</span>
                                                                    </div>
                                                                    <div>
                                                                        <label class="text-content-label-movie">Quốc gia: &nbsp&nbsp</label>
                                                                        <span class="text-content-movie">${data.resultMovie[i].TenQuocGia}</span>
                                                                    </div>
                                                                   
                                                                    <div class="action-container">
                                                                        <a class="btn btn-info btn-action" href="/phim/chitietphim?idphim=${data.resultMovie[i].ID}">Xem chi tiết</a>
                                                                        <a class="btn btn-info btn-action" href="suaphim?idphim=${data.resultMovie[i].ID}">Sửa</a>
                                                                        <button id="linkDelete" class="btn btn-danger btn-action" onclick="setIdMovie(${data.resultMovie[i].ID})", data-toggle='modal', data-target="#modalInforDelete">Xóa</button>
                                                                    </div>
                                                                    
                                                                </div>
                                                                
                                                            </div>
                                                        </div>
                                            
                                                        `)
                    }

                    for (let i = 1; i <= data.totalNumber; i++) {
                        if (i == data.currentPage) {
                            listPage.html(listPage.html() + `<li class='page-item active'>
                                                                <a class='page-link' onclick="searchMovie(${i})">${i}</a>
                                                            </li> `);
                        } else {
                            listPage.html(listPage.html() + `<li class='page-item'>
                                                                <a class='page-link' onclick="searchMovie(${i})">${i}</a>
                                                            </li> `);
                        }
                    }

                    listPage.html(listPage.html() + `<li class='page-item'>
                                         <a class='page-link' href='#'>Trang kế</a> 
                                    </li>`)
                } else {
                    $('#modalTextMessage').html(data.message);
                    $('#notifyModal').modal('show');
                }
            }
        },
        error: function () {

        }
    })
}

function hideLoading() {
    $("#exampleModalCenter").modal('hide');
}

function showLoading() {
    $('#exampleModalCenter').modal('show');
}