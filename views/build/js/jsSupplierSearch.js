$('#exampleModalCenter').on('shown.bs.modal', function (e) {
    $("#exampleModalCenter").modal('hide');
})

function searchSupplier(page){
    let keyWord = $('input[name=txtKeyWord]').val();
    showLoading();
    
    $.ajax({
        method: 'GET',
        url: '/nhacungcap/searchSupplier',
        data: {
            keyWord: keyWord,
            pageSelect: page
        },
        success: function(data){
            let tblSupplier =  $(`#tblSupplier`);
            let listPage = $('#listPage');
            console.log(data);
            listPage.html(`<li class='page-item'>
                                 <a class='page-link' href='#'>Trang trước</a> 
                           </li>`)

            hideLoading();

            if(data){
                if(data.statusCode == 1){
                    let countSupplier = data.resultSupplier.length;

                    tblSupplier.html('');

                    for(let i = 0 ; i < countSupplier; i++){
                        tblSupplier.html(tblSupplier.html() + `<tr>
                                                            <td>${data.resultSupplier[i].ID}
                                                            <td>${data.resultSupplier[i].TenNhaCungCap}</td>
                                                            <td>${data.resultSupplier[i].DiaChi}</td>
                                                            <td>${data.resultSupplier[i].SĐT}</td>
                                                            <td>${data.resultSupplier[i].Email}</td>
                                                            <td>
                                                                <span><a href="/nhacungcap/suanhacungcap?idSupplier=${data.resultSupplier[i].ID}"> Sửa </a> </span>
                                                                <span>|</span>
                                                                <span><a href="/nhacungcap/xoanhacungcap?idSupplier=${data.resultSupplier[i].ID}"> Xóa</span>                                                                     
                                                            </td>
                                                        </tr>`)
                    }

                    for(let i = 1; i <= data.totalNumber; i++){
                        if(i == data.currentPage){
                            listPage.html(listPage.html() + `<li class='page-item active'>
                                                                <a class='page-link' onclick="searchSupplier(${i})">${i}</a>
                                                            </li> `); 
                        }else{
                            listPage.html(listPage.html() + `<li class='page-item'>
                                                                <a class='page-link' onclick="searchSupplier(${i})">${i}</a>
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