function searchBill(page){
    let fromDate = $('input[name=txtFromDate]').val();
    let toDate = $('input[name=txtToDate]').val();
    let keyWord = $('input[name=txtNameCustomer]').val();

    $.ajax({
        url: '/hoadon/searchbill',
        method: 'GET',
        data:{
            keyWord: keyWord,
            fromDate: fromDate,
            toDate:toDate,
            page: page
        },
        success: function(data){
            console.log(data);
            if(data){
                let tblBill = $('#tblBill');
                let countBill = data.resultBill.length;

                tblBill.html('');

                for(let i = 0; i < countBill; i++){
                    tblBill.html(tblBill.html() + `<tr>
                                                        <td>${data.resultBill[i].ID}</td> 
                                                        <td>${data.resultBill[i].Ngay}</td> 
                                                        <td>${data.resultBill[i].HoTen}</td> 
                                                        <td>${data.resultBill[i].SoLuongVe}</td> 
                                                        <td>
                                                            <a class='btn btn-info' href='/hoadon/chitiethoadon?idhoadon=${data.resultBill[i].ID}'>Chi tiết</a>
                                                        </td>
                                                   </tr>`);
                }

                let listPage = $('#listPage');

                listPage.html(`<li class='page-item'>
                                    <a class='page-link' onclick='searchBill(${parseInt(data.currentPage) - 1})'>Trang trước</a>
                               </li>`);
                
                for(let i = 1; i <= data.numberPage; i++){
                    if(i == data.currentPage){
                        listPage.html( listPage.html() + `<li class='page-item active'>
                                                                <a class='page-link' onclick='searchBill(${i})'>${i}</a>
                                                            </li>`);
                    }else{
                        listPage.html(listPage.html() + `<li class='page-item'>
                                                             <a class='page-link' onclick='searchBill(${i})'>${i}</a>
                                                         </li>`);
                    }
                }

                listPage.html(listPage.html() + `<li class='page-item'>
                                                    <a class='page-link' onclick='searchBill(${parseInt(data.currentPage) + 1})'>Trang kế</a>
                                                 </li>`);
            }
        },
        error: function(){

        }
    })
}