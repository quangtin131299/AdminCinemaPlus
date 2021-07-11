var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
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
        },{
            label: 'Cinema Vivo City',
            data: [20000, 1900, 30000, 5020, 20050, 3000, 40000, 25000, 21000, 10060, 287000, 302000],
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


$(document).ready(function(){
    loadThongKePhim();
})

function loadThongKePhim() {
    $.ajax({
        method: 'GET',
        url: '/home/thongkephim',
        success: function (dataMovie) {
            console.log(dataMovie);
            if (dataMovie) {
                var countMovie = dataMovie.length;
                var labelValue = [];
                var datasetValue = [];
                for (let i = 0; i < countMovie; i++) {
                    var label = `${dataMovie[i].nameMovie}`;
                    var data = `${dataMovie[i].doanhthuphim}`;
                    data.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                    })
                    labelValue[i] = {
                        label: label
                    }
                    datasetValue[i] = {
                        label : label,
                        data : data,
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.2)'
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)'
                        ],
                        borderWidth: 1
                    }
                }
                var ctx1 = document.getElementById('myChart1').getContext('2d');
                var myChart1 = new Chart(ctx1, {
                    type: 'bar',
                    data: {
                        labels: labelValue,
                        datasets : datasetValue,
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
                myChart1.update();
            }
            
        },
        error: function (errDataMovie) {
            console.log(errDataMovie);
        }

    })
}