$('#exampleModalCenter').on('shown.bs.modal', function (e) {
    $("#exampleModalCenter").modal('hide');
})

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
            let tblService =  $(`#tblService`);
            let listPage = $('#listPage');
            console.log(data);
            listPage.html(`<li class='page-item'>
                                 <a class='page-link' href='#'>Trang trước</a> 
                           </li>`)

            hideLoading();

            if(data){
                if(data.statusCode == 1){
                    let countService = data.resultService.length;

                    tblService.html('');

                    for(let i = 0 ; i < countService; i++){
                        tblService.html(tblService.html() + `<tr>
                                                            <td>${data.resultService[i].ID}
                                                            <td>${data.resultService[i].TenCombo}</td>
                                                            <td>
                                                                <img src=${data.resultService[i].Hinh} alt="photo", width=125, height=125 />
                                                            </td>
                                                            <td>${data.resultService[i].MoTa}</td>
                                                            <td>${data.resultService[i].DonGia + " VND"}</td>
                                                            <td>
                                                                <span><a class="btn btn-primary" href="/dichvu/suadichvu?idService=${data.resultService[i].ID}"> Sửa </a> </span>
                                                                <span>|</span>
                                                                <span><button class="btn btn-danger" onclick="setIdService(${data.resultService[i].ID})", data-toggle='modal', data-target="#modalInforDelete"> Xóa</button></span>                                                                     
                                                            </td>
                                                        </tr>`)
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