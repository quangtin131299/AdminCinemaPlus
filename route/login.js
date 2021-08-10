const express = require("express");
// const multer = require("multer");
const conn = require("../db/connect");
const md5 = require("md5");
const bodyParser = require("body-parser");
const router = express.Router();

router.use(express.static("views"));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", function(req, res){
    res.render("login/login");
})

router.post("/", function(req, res){
    let account = req.body.account;
    let password =md5(req.body.password);

    let queryLogin = `SELECT * FROM admin WHERE admin.TaiKhoan = ? AND admin.MatKhau = ?`;

    conn.query(queryLogin, [account, password] , function(errorLogin, resultLogin){
        if(errorLogin){
            console.log(errorLogin);

           res.json({statusCode: 0, message: 'Đăng nhập thất bại'});
        }else{
            if(resultLogin.length != 0){
                res.json({statusCode: 1, message: 'Đăng nhập thành công'});
            }else{

                res.json({statusCode: 0, message: 'Đăng nhập thất bại'});
            }
        }
    })   
})


module.exports = router;