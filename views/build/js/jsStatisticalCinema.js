let staticalCinema  = new Chart($('#chart'), {
    type: 'bar',
    data: {
        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7','Tháng 8','Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12' ],
        datasets: [{
            label: 'Cinema Hùng Vương',
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

function loadStatistical(idCinema){

    $.ajax({
        method: 'GET',
        url: '/rapchieu/tinhtoanthongke',
        data: {
            idCinema: idCinema,
        },
        success: function(data){
            if(data){
                let countMonth = data.turnover.length;
                let arrayMonth = [];

                for(let i = 0; i <= 11; i++){
                    arrayMonth.push(0);
                }

                for(let i = 0 ; i < countMonth; i++){
                    for(let j = i ; j <= 12; j++){
                        if(j == data.turnover[i].Thang)
                        arrayMonth[data.turnover[i].Thang-1] = data.turnover[i].DoanhThu;
                    }
                }
               
                staticalCinema.data.datasets[0].data = arrayMonth;
                staticalCinema.update();
            }
        },
        error: function(){

        }
    })
}

$(document).ready(function(){
    let idCinema = $('input[name=txtIdCinema]').val();

    loadStatistical(idCinema);
})