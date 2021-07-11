const express = require("express");
const conn = require("../db/connect");
const router = express.Router();

router.use(express.static("views"))

router.get("/", function(req, res){
    res.render("index");
})

router.get("/thongkephim", function (req, res){
    let sqlquery = `SELECT phim.ID, phim.TenPhim, phim.TrangThai, ID_Phim, GiaVe, SUM(GiaVe) AS "DoanhThuPhim"
                    FROM phim JOIN vedat ON phim.ID = vedat.ID_Phim
                    WHERE phim.TrangThai = N'Đang chiếu' AND vedat.TrangThai = N'Đã thanh toán'
                    GROUP BY phim.TenPhim`
    
    conn.query(sqlquery,function(err, result){
        if(err){
            console.log(err);
        } else {

            let arrMovie = [];
            for( let i = 0; i < result.length; i++ ){
                
                arrMovie.push({
                    nameMovie : result[i].TenPhim,
                    doanhthuphim : result[i].DoanhThuPhim,
                });
            }
            res.json(arrMovie);
        }
       
    });
});

module.exports = router;