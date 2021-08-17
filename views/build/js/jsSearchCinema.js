function searchCinema(page){
    let keyWord = $('input[name=txtKeyWord]').val();

    showLoading();

    $.ajax({
        url: '/rapchieu/searchcinema',
        method: 'GET',
        data:{
            keyWord: keyWord,
            page: page
        },
        success: function(data){
            if(data){
                let listCinema = $('#listCinema');

                listCinema.html('');

                let countCinema = data.resultCinema.length;

                for(let i = 0 ; i < countCinema; i++){
                    listCinema.html(listCinema.html() + `<div class='card card-item-cinema'>
                                                            <img class='img-cinema' src='${data.resultCinema[i].Hinh}'/>
                                                            <div class='card-body'>
                                                                <h5>${data.resultCinema[i].TenRap}</h5>
                                                                <p class='card-text'>${data.resultCinema[i].DiaChi}</p>
                                                            </div>
                                                            <div class='card-footer-item'>
                                                                <a href='/rapchieu/chitietrapchieu?idCinema=${data.resultCinema[i].ID}' class='btn btn-info'>Chi tiết</a>
                                                                <a href='/suarapchieu?idCinema=${data.resultCinema[i].ID}' class='btn btn-primary'>Sửa</a>
                                                                <a href='#' class='btn btn-danger'>Xóa</a>
                                                                <a href='/rapchieu/thongkerap?id=${data.resultCinema[i].ID}' class='btn btn-secondary'>Doanh thu</a>
                                                            </div>
                                                         </div>`);
                }

                let listPage = $('#listpage');

                listPage.html(`<li class='page-item'>
                                    <a onclick='searchCinema(${data.currentPage + 1})' class='page-link'>Trang trước</a>
                              </li>`)

                for(let i = 1; i <= data.numberPage; i++){
                    if(i == data.currentPage){
                        listPage.html(listPage.html() + `<li class='page-item active'>
                                                        <a onclick='searchCinema(${i})' class='page-link'>${i}</a>
                                                    </li>`)
                    }else{
                        listPage.html(listPage.html() + `<li class='page-item'>
                                                            <a onclick='searchCinema(${i})' class='page-link'>${i}</a>
                                                        </li>`)
                    }
                    
                }

                listPage.html(listPage.html() + `<li class='page-item'>
                                                    <a onclick='searchCinema(${data.currentPage + 1})' class='page-link'>Trang kế</a>
                                                 </li>`)


              
            }

            hideLoading();   
        },
        error: function(){
            hideLoading();    
        }
    });
}

function hideLoading() {
    // $("#exampleModalCenter").on('shown.bs.modal',function(e){
        $("#exampleModalCenter").modal('hide'); 
    // })
}

function showLoading() {
    $('#exampleModalCenter').modal({backdrop: 'static', keyboard: false})

    $('#exampleModalCenter').modal('show');
}

