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

    let querySeat = ` SELECT ghe.* 
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

router.post('/themghe',function(req, res){
    let nameSeat = req.body.nameSeat;
    let idRoom = req.body.idRoom;
    let status = 'Trống';

    let queryCountSeat = `SELECT Count(*) as 'countSeat' FROM ghe WHERE ghe.ID_Phong = ?`

    let queryDuplicateNameSeat = ` SELECT * FROM ghe WHERE ghe.TenGhe = ? AND ghe.ID_Phong = ?`;

    conn.query(queryDuplicateNameSeat, [nameSeat, idRoom], function(errorDuplicateSeat, resultDuplicate){
        if(errorDuplicateSeat){
            console.log(errorDuplicateSeat);

            res.json({ messgae: 'Không thể kiểm tra ghê tồn tại', statusCode: 0 });
        }else{
            if(resultDuplicate.length == 0){
                conn.query(queryCountSeat, [idRoom], function(errorCountSeat, resultCountSeat){
                    if(errorCountSeat){
                        res.json({ messgae: 'Không thể kiểm tra số lượng ghế', statusCode: 0 });
                    }else{ 
                        if(resultCountSeat[0].countSeat < 68){
                            let queryInsertSeate = `INSERT INTO ghe values (NULL, ? , ? , ? )`;
            
                            conn.query(queryInsertSeate, [nameSeat, idRoom, status], function (error, resultSeat) {
                                if (error) {
                                    console.log(error);
            
                                    res.json({ messgae: 'Thêm ghế thất bại', statusCode: 0 });
                                } else {
                                    res.json({ messgae: 'Thêm ghế thành công', statusCode: 1, newIdSeat:  resultSeat.insertId});
                                }
                            })
                        }else{
                            res.json({ messgae: 'Phòng đã đủ số lượng ghế', statusCode: 0 });
                        }
                    }
                }); 
            }else{
                res.json({ messgae: 'Tên ghế đã tồn tại', statusCode: 0 });
            }
            
        }
    });  
})

router.get('/timkiem', function(req, res){
    let idRoom = req.query.idRoom;
    let keyWord = req.query.keyWord;

    let querySearchSeat = `SELECT * FROM ghe WHERE ghe.TenGhe LIKE ? AND ghe.ID_Phong = ?`;

    conn.query(querySearchSeat, [`${keyWord}%`,idRoom],function(error, resultSearch){
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