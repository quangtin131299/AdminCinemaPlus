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

module.exports = router;