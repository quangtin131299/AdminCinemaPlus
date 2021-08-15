

function searchTicker(page){
    showLoading();

    let nameCustomer = $('input[name=txtNameCustomer]').val();
    let fromDate = $('input[name=txtFromDate]').val();
    let toDate = $('input[name=txtToDate]').val();
    let nameMovie = $('select[name=selectNameMovie]').val();

    $.ajax({
        url: '/ticker/searchticker',
        method: 'GET',
        data:{
            keyWord: nameCustomer,
            fromDate: fromDate,
            toDate: toDate,
            nameMovie: nameMovie,
            page: page
        },
        success: function(data){
            if(data){
                let tblTicker = $('#tblTicker');
                let navPagging = $('#listPage');

                tblTicker.html('');

                let countTicker = data.resultTicker.length;

                for(let i = 0; i < countTicker; i++){
                    tblTicker.html( tblTicker.html() + `<tr>
                                        <td>${data.resultTicker[i].ID}</td>
                                        <td>${data.resultTicker[i].NgayDat}</td>
                                        <td>${data.resultTicker[i].HoTen}</td>
                                        <td>${data.resultTicker[i].TrangThai}</td>
                                        <td>
                                        <a class='btn btn-info color-text-achor' onclick='redirectDetailTicker(${data.resultTicker[i].ID})'> Chi Tiết </a>
                                        </td>
                                    </tr>`);
                }

                navPagging.html(`<li class='page-item'>
                                    <a class='page-link ' onclick='searchTicker(${data.currentPage - 1})' >Previous</a>
                                </li>`)

                for(let i = 1; i <= data.numberPage; i++){
                    if(i == data.currentPage){
                        navPagging.html(navPagging.html() + `<li class='page-item active'>
                                                                <a class='page-link' onclick='searchTicker(${i})'>${i}</a>
                                                             </li>`)
                    }else{
                        navPagging.html(navPagging.html() + `<li class='page-item'>
                                                                <a class='page-link' onclick='searchTicker(${i})'>${i}</a>
                                                             </li>`)
                    }
                    
                }

                navPagging.html( navPagging.html() + `<li class='page-item'>
                                                        <a class='page-link' onclick='searchTicker(${data.currentPage+1})'>Next</a>
                                </li>`)

                hideLoading();
            }
            
        },
        error: function(error){
            
        }
    })
}

function hideLoading() {
    // $("#exampleModalCenter").modal('hide');
    $('#exampleModalCenter').on('shown.bs.modal', function (e) {
        $("#exampleModalCenter").modal('hide');
    })
}

function showLoading() {
    $('#exampleModalCenter').modal('show');
}

$(document).ready(function(){
    loadMovie();
});

function loadMovie(){
    let selectMovie = $('select[name=selectNameMovie]');

    showLoading();

    $.ajax({
        url: '/ticker/loadmovie',
        method: 'GET',
        success: function(data){
            if(data){

                let countMovie = data.ressultMovie.length;

                selectMovie.html(`<option value=''>Chọn phim</option>`);

                for(let i = 0; i < countMovie; i++){
                    selectMovie.html(selectMovie.html() + `<option value=${data.ressultMovie[i].TenPhim}>${data.ressultMovie[i].TenPhim}</option>`);
                }

                hideLoading();
            }
        },
        error: function(){

        }
    });
}

function redirectDetailTicker(idTicker){
    showLoading();

    window.location.replace(`/ticker/detailticker?idTicker=${idTicker}`);
}