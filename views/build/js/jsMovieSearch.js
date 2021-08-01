$('#exampleModalCenter').on('shown.bs.modal', function (e) {
    $("#exampleModalCenter").modal('hide');
})

function searchMovie(page){
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
        success: function(data){
            let tblMovie =  $(`#tblMovie`);
            let listPage = $('#listPage');
            console.log(data);
            listPage.html(`<li class='page-item'>
                                 <a class='page-link' href='#'>Trang trước</a> 
                           </li>`)

            hideLoading();

            if(data){
                if(data.statusCode == 1){
                    let countMovie = data.resultMovie.length;

                    tblMovie.html('');

                    for(let i = 0 ; i < countMovie; i++){
                        tblMovie.html(tblMovie.html() + `<tr>
                                                            <td>${data.resultMovie[i].ID}
                                                            <td>${data.resultMovie[i].TenPhim}</td>
                                                            <td>
                                                                <img src=${data.resultMovie[i].Hinh} alt="photo", width=125, height=125 />
                                                            </td>
                                                            <td>${data.resultMovie[i].TrangThai}</td>
                                                            <td>${data.resultMovie[i].ThoiGian + " phút"}</td>
                                                            <td>${data.resultMovie[i].NgayKhoiChieu}</td>
                                                            <td>
                                                                <span><a class="btn btn-info" href="/phim/chitietphim?idphim=${data.resultMovie[i].ID}"> Chi Tiết </a> </span>
                                                                <span>|</span>
                                                                <span><a class="btn btn-primary" href="suaphim?idphim=${data.resultMovie[i].ID}"> Sửa </a> </span>
                                                                <span>|</span>
                                                                <span><button class="btn btn-danger" onclick="setIdMovie(${data.resultMovie[i].ID})", data-toggle='modal', data-target="#modalInforDelete"> Xóa</button></span>                                                     
                                                            </td>
                                                        </tr>`)
                    }

                    for(let i = 1; i <= data.totalNumber; i++){
                        if(i == data.currentPage){
                            listPage.html(listPage.html() + `<li class='page-item active'>
                                                                <a class='page-link' onclick="searchMovie(${i})">${i}</a>
                                                            </li> `); 
                        }else{
                            listPage.html(listPage.html() + `<li class='page-item'>
                                                                <a class='page-link' onclick="searchMovie(${i})">${i}</a>
                                                            </li> `); 
                        }             
                    }

                    listPage.html(listPage.html() + `<li class='page-item'>
                                         <a class='page-link' href='#'>Trang kế</a> 
                                    </li>`)
                }else{
                    $('#modalTextMessage').html(data.message);
                    $('#notifyModal').modal('show');
                }
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