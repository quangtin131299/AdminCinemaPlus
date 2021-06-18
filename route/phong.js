const express = require("express");
const conn = require("../db/connect");
const bodyParser = require("body-parser");
const router = express.Router();

router.use(express.static("views"));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/themphong", function (req, res) {

    let queryCinema = `select * from rapphim`;

    conn.query(queryCinema, function (errorCinema, resultCinema) {
        if(errorCinema){
            console.log(errorCinema);
            
            res.render("phong/themphong", {
                cinemas: []
            });
            
        }else{
            res.render("phong/themphong", {
                cinemas: resultCinema
            });
        }      
    })

})

router.post('/themphong', function(req, res){
    let idCinema = req.body.cinemaId;
    let roomName = req.body.nameRoom;

    let queryInsert = `INSERT INTO phong VALUES(NULL,?,?)`;

    conn.query(queryInsert, [roomName, idCinema] ,function(errorRoom, resultRoom){
        if(errorRoom){
            console.log(errorRoom);
            
            res.json({message: 'Fail', statusCode: 0, messNotify: 'Thêm thất bại'})
        }else{
            res.json({message: 'Success', statusCode: 1, messNotify: 'Thêm thành công'})
        }
    })
})

router.get("/danhsachphong", function (req, res) {

    let queryCinema = `SELECT * FROM rapphim`;

    conn.query(queryCinema, function (errorCinema, resultCinema) {
        if (errorCinema) {
            console.log(errorCinema);

            res.render("phong/danhsachphong", {
                cinemas: [],
                rooms: []
            });
        } else {
            let queryRoom = `SELECT phong.ID, phong.TenPhong FROM phong JOIN rapphim ON phong.ID_Rap = rapphim.ID WHERE rapphim.ID = 1`

            conn.query(queryRoom, function (errorRoom, resultRooms) {
                if (errorRoom) {
                    console.log(errorRoom);

                    res.render("phong/danhsachphong", {
                        cinemas: resultCinema,
                        rooms: []
                    });
                } else {
                    res.render("phong/danhsachphong", {
                        cinemas: resultCinema,
                        rooms: resultRooms
                    });
                }
            })
        }


    })
})

router.get("/getroombycinemaid", function (req, res) {
    let idCinema = req.query.id;

    let queryRoom = `SELECT phong.ID, phong.TenPhong FROM phong JOIN rapphim ON phong.ID_Rap = rapphim.ID WHERE rapphim.ID = ?`

    conn.query(queryRoom, [idCinema], function (errorRoom, resultRooms) {
        if (errorRoom) {
            console.log(errorRoom);

            res.json([])
        } else {
            res.json(resultRooms);
        }
    })
})

module.exports = router