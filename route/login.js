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
    let account = req.body.txtAcount;
    let password =md5(req.body.txtPassword);

    let queryLogin = `SELECT * FROM admin WHERE admin.TaiKhoan = ? AND admin.MatKhau = ?`;

    conn.query(queryLogin, [account, password] , function(errorLogin, resultLogin){
        if(errorLogin){
            console.log(errorLogin);

            res.render('login/login', {isLogin: 0});
        }else{
            if(resultLogin.length != 0){
                res.redirect(`/home?idAdmin=${resultLogin[0].ID}`)
            }else{
                res.render("login/login", {isLogin: 'Đăng nhập thất bại'})  
            }
        }
    })   
})


module.exports = router;