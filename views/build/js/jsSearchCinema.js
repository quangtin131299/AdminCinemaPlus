function hideLoading() {
    $("#exampleModalCenter").modal('hide'); 
}

function showLoading() {
    $('#exampleModalCenter').modal({backdrop: 'static', keyboard: false})

    $('#exampleModalCenter').modal('show');
}

function searchCinema(){
    let keyWord = $('input[name=txtKeyWord]').val();

    showLoading();

    $.ajax({
        url: '/rapchieu/searchcinema',
        method: 'GET',
        data:{
            keyWord: keyWord
        },
        success: function(data){

            if(data){
                console.log(data.resultCinema);
            }

            hideLoading();
        },
        error: function(){
            hideLoading();    
        }
    });

   
}

