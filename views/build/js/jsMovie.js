let danhsachphim = [];
document.getElementById("btnhuy").onclick = function () {
    window.location.replace("danhsachphim?page=1")
}

let mess = $('#modalTextMessage').html();
if (mess && mess != '') {
    $('#exampleModal').modal('show')
}

$('#btnOK').click(function(){
    $('#myModal').modal('hide')
})