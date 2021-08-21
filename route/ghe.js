const express = require("express");
const bodyParser = require("body-parser");
const conn = require("../db/connect");
const router = express.Router()

router.use(express.static("views"))
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/danhsachghe", function(req,res){
    let idRoom = req.query.idRoom;
    let idCinema = req.query.idCinema;

    let querySeat = ` SELECT ghe.ID, ghe.ID_Phong, ghe.TenGhe, ghe.TrangThai , rapphim.TenRap, phong.TenPhong
                       FROM ghe JOIN phong ON phong.ID = ghe.ID_Phong 
                                JOIN rapphim ON rapphim.ID = phong.ID_Rap
                       WHERE rapphim.ID = ? and phong.ID = ?`;

    conn.query(querySeat, [idCinema, idRoom],function(error, resultSeat){
        if(error){
            console.log(error);

            res.render("ghe/danhsachghe", {seats: []});
        }else{
            res.render("ghe/danhsachghe", {seats: resultSeat, idRoom: idRoom});
        }
    });
})


router.get('/timkiem', function(req, res){
    let idRoom = req.query.idRoom;
    let keyWord = req.query.keyWord;
    let stateSeat = req.query.stateSeat;
    
    let querySearchSeat = `SELECT * FROM ghe 
                           WHERE ghe.TenGhe LIKE ? AND ghe.ID_Phong = ? AND ghe.TrangThai LIKE ?`;

    conn.query(querySearchSeat, [`%${keyWord}%`,idRoom, `${stateSeat}%`],function(error, resultSearch){
        if(error){
            console.log(error);

            res.json({ resultSeats: []});
        }else{
            res.json({ resultSeats: resultSearch});
        }
    });
});

router.put('/updateSeat', function(req, res){
    let idRoom = req.body.idRoom;
    let idSeat = req.body.idSeat;
    let status = req.body.status;

    let updateSeat = `UPDATE ghe
                      SET ghe.TrangThai = ?
                      WHERE ghe.ID = ? AND ghe.ID_Phong = ?`;

    conn.query(updateSeat, [status,idSeat, idRoom], function(error){
        if(error){
            console.log(error);

            res.json({ messgae: 'Cập nhật trạng thái thất bại', statusCode: 0 })
        }else{
            res.json({ messgae: 'Cập nhật tráng thái thành công', statusCode: 1 })
        }
    })                      
});

module.exports = router;