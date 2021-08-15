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
    let queryCinema = `SELECT * FROM rapphim`;

    conn.query(queryCinema, function(errorCinema, resultStatisticalCinema){
        if(errorCinema){
            console.log(errorCinema);

            res.json({statusCode: 0, message: 'Fail', resultCinema: null});
        } else {
            let queryStatistical = `Select COALESCE(SUM(DoanhThuRap.DoanhThu), 0) as 'DoanhThuThang', Thang 
                                    FROM (select COALESCE(SUM(hoadon.ThanhTienVe + COALESCE(hoadon_bapnuoc.ThanhTien, 0)), 0)as 'DoanhThu', MONTH(hoadon.Ngay) as 'Thang' ,rapphim.TenRap
                                    FROM rapphim left join vedat on rapphim.ID = vedat.ID_Rap
                                                        left join hoadon on hoadon.ID = vedat.ID_HoaDon
                                                        left join hoadon_bapnuoc on hoadon_bapnuoc.ID_HoaDon = hoadon.ID
                                    Group by  MONTH(hoadon.Ngay), rapphim.TenRap) as \`DoanhThuRap\` WHERE thang between 1 and 12 group by thang ORDER BY Thang`;

            conn.query(queryStatistical, function (error, result) {
                if (error) {
                    console.log(error);

                    res.json({ statusCode: 0, message: 'Fail', resultCinema: resultStatisticalCinema, resultStatistical: null });
                } else {
                    
                    res.json({ statusCode: 0, message: 'Success', resultStatistical: result, resultCinema: resultStatisticalCinema});
                }
            })
        }
    }) 
})

router.get("/statisticalPopcorn", function(req, res){
    let queryStatisticalPopcorn = `SELECT * FROM
                                   (SELECT  bapnuoc.TenCombo 
                                            , COALESCE(sum(hoadon_bapnuoc.ThanhTien), 0) as 'DoanhThu' 
                                            , 	Month(hoadon.Ngay) as 'Thang'
                                    FROM bapnuoc left join hoadon_bapnuoc on hoadon_bapnuoc.ID_BapNuoc = bapnuoc.ID left join hoadon on hoadon.ID = hoadon_bapnuoc.ID_HoaDon
                                    GROUP BY bapnuoc.TenCombo, Month(hoadon.Ngay))as \`DoanhThuBapNuoc\`
                                    WHERE Thang BETWEEN 1 and 12 group by thang, TenCombo`;

    conn.query(queryStatisticalPopcorn, function(error, result){
        if(error){
            console.log(error);

            res.json({ statusCode: 0, message: 'Fail', resultStatisticalPopcorn: null }); 
        }else{
            res.json({ statusCode: 1, message: 'Success', resultStatisticalPopcorn: result }); 
        }
    });

})

module.exports = router;