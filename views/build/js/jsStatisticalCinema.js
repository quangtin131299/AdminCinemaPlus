let staticalCinema  = new Chart($('#chart'), {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Cinema Hùng Vương',
            data: [],
            backgroundColor: [
                
            ],
            borderColor: [
                
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
                let currentDate = new Date();

                currentDate.setMonth(currentDate.getMonth() + 1);

                let currentMonth = currentDate.getMonth();
              
                for(let i = 0; i < currentMonth; i++){
                    staticalCinema.data.labels.push(`Tháng ${i+1}`);

                    staticalCinema.data.datasets[0].data.push(0);

                    staticalCinema.data.datasets[0].backgroundColor.push(randColor());
                }

                let countTurnOver = data.turnover.length;

                for(let i = 0 ; i < countTurnOver  ; i++){
                    for(let j = i ; j <= currentMonth; j++){
                        if(j == data.turnover[i].Thang){
                            // arrayMonth[data.turnover[i].Thang-1] = data.turnover[i].DoanhThu;
                            staticalCinema.data.datasets[0].data[data.turnover[i].Thang-1] = data.turnover[i].DoanhThu;

                            
                        }  
                    }
                }
               
              
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

function randColor(){
    let dynamicColors = function() {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        return "rgb(" + r + "," + g + "," + b + ")";
    };

    return dynamicColors();
}