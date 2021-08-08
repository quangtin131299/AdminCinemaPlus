let ctx = document.getElementById('myChart').getContext('2d');
let ctxMovie = document.getElementById('myChart1').getContext('2d');
let ctxPopcorn = document.getElementById('myChartPopcorn').getContext('2d');

let staticalCinema  = new Chart(ctx, {
    type: 'bar',
});

let staticalPopCorn  = new Chart(ctxPopcorn, {
    type: 'bar',
});

let staticalMovie = new Chart(ctxMovie,{
    type: 'bar',
})


$(document).ready(async function(){
    showLoading();

    await loadThongKePhim();

    await loadStatisticalCinema();

    await loadStatisticalPopcorn();

    hideLoading();
})

async function loadStatisticalPopcorn(){
    return new Promise(function(resolve, reject){
        $.ajax({
            url:'/home/statisticalPopcorn',
            method: 'GET',
            success: function(data){
                if(data){
                    console.log(data);
                    staticalPopCorn.data.datasets[0] = {
                        label: '',
                        data: [],
                        backgroundColor:[],

                        borderColor:[],
                    }

                    let color = '';

                    let countPopcorn = data.resultStatisticalPopcorn.length;

                    for(let i = 0 ; i < countPopcorn; i ++){
                        color = randColor();

                        staticalPopCorn.data.labels.push(data.resultStatisticalPopcorn[i].TenCombo);

                        staticalPopCorn.data.datasets[0].label = data.resultStatisticalPopcorn[i].TenCombo;

                        staticalPopCorn.data.datasets[0].data.push(data.resultStatisticalPopcorn[i].DoanhThu);     
                        
                        staticalPopCorn.data.datasets[0].backgroundColor.push(color);

                        staticalPopCorn.data.datasets[0].borderColor.push(color);
                    } 
                    
                }

                staticalPopCorn.update();     

                resolve(true);
            },
            error: function(error){
                reject(false);
            }
        })
    });
}

async function loadStatisticalCinema(){
    let date = new Date();

    let currentMonth = date.getMonth() + 1;

    return new Promise(function(resolve, reject){
        $.ajax({
            method: 'GET',
            url: '/home/statisticalCinema',
            data: {
                currentMonth: currentMonth
            },
            success: function(dataCinema){
                if(dataCinema){
                    let countCinema = dataCinema.resultCinema.length;
                    let countStatistical = dataCinema.resultStatistical.length;

                    staticalCinema.data.datasets[0] = {
                        label: '',
                        data: [],
                        backgroundColor:[],

                        borderColor:[],
                    }

                    let color = '';

                    for(let i = 0; i < countCinema; i++){
                        staticalCinema.data.labels.push(dataCinema.resultCinema[i].TenRap);
                    }

                    for(let i = 0; i < countStatistical; i++){
                        color = randColor();

                        staticalCinema.data.datasets[0].label = dataCinema.resultStatistical[i].TenRap;

                        staticalCinema.data.datasets[0].data.push(dataCinema.resultStatistical[i].DoanhThu);

                        staticalCinema.data.datasets[0].backgroundColor.push(color);

                        staticalCinema.data.datasets[0].borderColor.push(color);
                    }
                    
                    staticalCinema.update();          
                }

                resolve(true);
            },
            error: function(error){
                reject(false);
            }
        })
    })
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
                        backgroundColor:[],

                        borderColor:[],
                    }

                    let color = '';

                    for (let i = 0; i < countMovie; i++) {
                        color = randColor();

                        staticalMovie.data.labels.push(dataMovie[i].nameMovie);

                        staticalMovie.data.datasets[0].label = dataMovie[i].nameMovie;

                        staticalMovie.data.datasets[0].data.push(dataMovie[i].doanhthuphim);     
                        
                        staticalMovie.data.datasets[0].backgroundColor.push(color);

                        staticalMovie.data.datasets[0].borderColor.push(color);
                    }

                    staticalMovie.update();

                    resolve(true);
                }
                
            },
            error: function (errDataMovie) {

                reject(false);
            }

        })    
    });   
}

function randColor(){
    let dynamicColors = function() {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        return "rgb(" + r + "," + g + "," + b + ")";
    };

    return dynamicColors();
}

function hideLoading() {
    $("#exampleModalCenter").modal('hide');
}

function showLoading() {
    $('#exampleModalCenter').modal('show');
}