// $('#exampleModalCenter').on('shown.bs.modal', function (e) {
//     $("#exampleModalCenter").modal('hide');
// })

function searchService(page){
    let keyWord = $('input[name=txtKeyWord]').val();
    showLoading();
    console.log(keyWord);
    
    $.ajax({
        method: 'GET',
        url: '/dichvu/searchService',
        data: {
            keyWord: keyWord,
            pageSelect: page
        },
        success: function(data){
            let tblService =  $(`#listService`);
            let listPage = $('#listPage');
           
            listPage.html(`<li class='page-item'>
                                 <a class='page-link' href='#'>Trang trước</a> 
                           </li>`)

            hideLoading();

            if(data){
                if(data.statusCode == 1){
                    
                    let countService = data.resultService.length;

                    tblService.html('');
 
                    for(let i = 0 ; i < countService; i++){
                        tblService.html(tblService.html() + `<div class='card card-service'>
                                                                <div class='infor-movie-container'>
                                                                    <div>
                                                                        <img class='card-img-movie' src='${data.resultService[i].Hinh}' />
                                                                    </div>
                                                                    <div class='infor-movie'>     
                                                                        <div>
                                                                            <h2 class='text-content-name-movie'>${data.resultService[i].TenCombo}</h2>
                                                                            <br/>
                                                                        </div>
                                                                        <div>
                                                                            <label class='text-content-label-movie'>Đơn giá: &nbsp&nbsp</label>
                                                                            <span class='text-content-movie'>${data.resultService[i].DonGia}</span>
                                                                        </div>
                                                                        <div class='description-popcorn'>
                                                                            <label class='text-content-label-movie'>Mô tả: &nbsp&nbsp</label>
                                                                            <span class='text-content-movie'>${data.resultService[i].MoTa}</span>
                                                                        </div>
                                                                        <div class='action-container-service'>
                                                                            <a href='suadichvu?idService=${data.resultService[i].ID}' class='btn btn-primary'>Sửa</a>
                                                                            <button id='linkDelete' onClick='setIdService(${data.resultService[i].ID})' data-toggle='modal', data-target="#modalInforDelete" class='btn btn-danger'>Xóa</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>`)
                    }

                    for(let i = 1; i <= data.totalNumber; i++){
                        if(i == data.currentPage){
                            listPage.html(listPage.html() + `<li class='page-item active'>
                                                                <a class='page-link' onclick="searchService(${i})">${i}</a>
                                                            </li> `); 
                        }else{
                            listPage.html(listPage.html() + `<li class='page-item'>
                                                                <a class='page-link' onclick="searchService(${i})">${i}</a>
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