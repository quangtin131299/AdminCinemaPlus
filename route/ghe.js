const express = require("express")
const conn = require("../db/connect")
const router = express.Router()

router.use(express.static("views"))

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
            res.render("ghe/danhsachghe", {seats: resultSeat});
        }
    });
})

router.get("/themghe",function(req, res){
    res.render("ghe/themghe")
})

module.exports = router;