let ctx = document.getElementById('myChart').getContext('2d');
let ctxMovie = document.getElementById('myChart1').getContext('2d');
let ctxPopcorn = document.getElementById('myChartPopcorn').getContext('2d');

let staticalCinema  = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7','Tháng 8','Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12' ],
        datasets: [{
            label: 'Cinema Hùng Vương',
            data: [120000, 19000, 300000, 50020, 2000, 30000, 400000, 250000, 210000, 10000, 280000, 300000],
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

let staticalPopCorn  = new Chart(ctxPopcorn, {
    type: 'bar',
    data: {
        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7','Tháng 8','Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12' ],
        datasets: [{
            label: 'Cinema Hùng Vương',
            data: [120000, 19000, 300000, 50020, 2000, 30000, 400000, 250000, 210000, 10000, 280000, 300000],
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

let staticalMovie = new Chart(ctxMovie,{
    type: 'bar',
})


$(document).ready(function(){
    loadThongKePhim();
})

function loadStatistical(){
   
}

async function loadThongKePhim() {
   return new Promise(function(resolve, reject){
        $.ajax({
            method: 'GET',
            url: '/home/thongkephim',
            success: function (dataMovie) {
                
                if (dataMovie) {
                    var countMovie = dataMovie.length;
                
                    staticalMovie.data.datasets[0] = {
                        label: '',
                        data: [],
                    
                    }

                    for (let i = 0; i < countMovie; i++) {
                        staticalMovie.data.labels.push(dataMovie[i].nameMovie);

                        staticalMovie.data.datasets[0].label = dataMovie[i].nameMovie;

                        staticalMovie.data.datasets[0].data.push(dataMovie[i].doanhthuphim);                    
                    }

                    staticalMovie.update();
                }
                
            },
            error: function (errDataMovie) {
                console.log(errDataMovie);
            }

        })    
    });
    
}