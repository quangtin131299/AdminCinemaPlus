const express = require("express");
// const multer = require("multer");
const conn = require("../db/connect");
const bodyParser = require("body-parser");
const { route } = require("./phim");

const router = express.Router();
router.use(express.static("views"));


router.get("/danhsachphong", function(req, res){
    
    let queryRoom = `select * from phong`;

    conn.query(queryRoom, function(error, result){
        if(error){
            console.log(error);
        }else{
            let queryCinema = `select * from rapphim`;
            
            conn.query(queryCinema, function(errorCinema, resultCinema){

                res.render("phong/danhsachphong", {
                    danhsachphong: result,
                    danhsachrap: resultCinema
                });
            }) 
        }
    })
})

router.get("/xepphong", function(req, res){
    res.render("phong/xepphong")
})

router.get("/themphong", function(req, res){
    // res.render("phong/themphong");
    
    let queryCinema = `select * from rapphim`;
        conn.query(queryCinema, function(errorCinema, resultCinema){
            res.render("phong/themphong", {
                danhsachrap: resultCinema
            });
        }) 
})

router.get("/getroombycinemaid", function(req, res){
    let idCinema = req.query.id;
    res.json({mess: 'Đã lên đây rôi !', idCinemaRequested: idCinema});
})

module.exports = router