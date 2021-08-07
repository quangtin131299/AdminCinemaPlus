const express = require("express");
const conn = require("../db/connect");
const router = express.Router();

router.use(express.static("views"))

router.get("/", function(req, res){
    res.render("index");
})

router.get("/thongkephim", function (req, res){
    let sqlquery = `SELECT phim.TenPhim, SUM(GiaVe) AS "DoanhThuPhim"
                    FROM phim LEFT JOIN vedat ON phim.ID = vedat.ID_Phim
                    where phim.Trangthai = 'Đang chiếu'
                    GROUP BY phim.ID`
    
    conn.query(sqlquery,function(err, result){
        if(err){
            console.log(err);
        } else {

            let arrMovie = [];
            
            for( let i = 0; i < result.length; i++ ){
                
                arrMovie.push({
                    nameMovie : result[i].TenPhim,
                    doanhthuphim : result[i].DoanhThuPhim ? result[i].DoanhThuPhim : 0 ,
                });
            }

            res.json(arrMovie);
        }
       
    });
});

router.get("/statisticalCinema", function(req, res){
    let currentMonth = req.query.currentMonth;

    let queryCinema = `SELECT * FROM rapphim`;

    conn.query(queryCinema, function(errorCinema, resultStatistical){
        if(errorCinema){
            console.log(errorCinema);

            res.json({statusCode: 0, message: 'Fail', resultStatistical: null});
        } else {
            let queryStatistical = `SELECT rapphim.ID
                                            , rapphim.TenRap 
                                            , COALESCE(SUM(hoadon.ThanhTienVe + COALESCE(hoadon_bapnuoc.ThanhTien, 0)), 0) as 'DoanhThu' 
                                    FROM rapphim left join vedat on rapphim.ID = vedat.ID_Rap
                                                        LEFT JOIN hoadon on hoadon.ID = vedat.ID_HoaDon
                                                        LEFT JOIN hoadon_bapnuoc on hoadon_bapnuoc.ID_HoaDon = hoadon.ID
                                    WHERE Month(hoadon.Ngay) = ? GROUP BY rapphim.TenRap`;

            conn.query(queryStatistical, [currentMonth],function (error, result) {
                if (error) {
                    console.log(error);

                    res.json({ statusCode: 0, message: 'Fail', resultCinema: resultStatistical, resultStatistical: null });
                } else {

                    res.json({ statusCode: 0, message: 'Fail', resultStatistical: result, resultCinema: resultStatistical});
                }
            })
        }
    }) 
})



module.exports = router;