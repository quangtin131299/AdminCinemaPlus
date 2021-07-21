const express = require("express")
const conn = require("../db/connect")
const bodyParser = require("body-parser");
const multer = require("multer");
const { render } = require("pug");
const router = express.Router();

router.use(express.static("views"))
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

let fileNameImageCinema = '';
let fileImageCinemaUrlOld = '';

var storageImageCinema = multer.diskStorage({
    destination: function (req, file, cb) {
      if(file.fieldname == 'imgCinema'){
        cb(null, "views/img/Cinema");
      }
      
    },
    filename: function (req, file, cb) {
      if(file.fieldname == 'imgCinema'){
        fileNameImageCinema =  file.originalname ? file.originalname : '';
      }
      cb(null, file.originalname);
    },
});
  
const uploadImageCinema = multer({ storage: storageImageCinema });


router.get("/danhsachrapchieu", function(req, res){
	let queryslrap = `SELECT * FROM rapphim`
	let page = req.query.page;
	let vitribatdaulay = (page - 1)	* 5;
	
	conn.query(queryslrap, function(err, resul){
		if(err){
			console.log(err);
		}else{
			let ntrang = resul.length / 5
			let query = `select * from rapphim limit ${vitribatdaulay}, 5`
			conn.query(query, function(err, result){
				if(err){
					console.log(err);
				}else{
					res.render("rapchieu/danhsachrap", {danhsachrapchieu: result, pagerespon: page,soluongtrang: Math.ceil(ntrang)})
				}
			})
		}
	})
})

router.get("/themrapchieu", function(req, res){

    let queryRapChieuPhim = `select * from rapphim`;

    conn.query(queryRapChieuPhim, function(errorRapChieuPhim, resultRapChieuPhim){
        if(errorRapChieuPhim){
            console.log(errorRapChieuPhim);

            res.render("rapchieu/themrapchieu",{
                rapchieuphim: [],
               
            });
        } else{
            res.render("rapchieu/themrapchieu",{
                rapchieuphim: resultRapChieuPhim,
                
            });
        }
    })
});


let uploadImage = uploadImageCinema.fields([{ name: 'imgCinema', maxCount: 1 }])

router.post('/themrapchieu',uploadImage, function(req,res){
    let theaterName = req.body.txtTheaterName;
    let imgCinema = fileNameImageCinema && fileNameImageCinema != '' ? `${req.protocol}://${(req.hostname =='localhost' ? req.hostname + ':3000' : req.hostname )}/img/Cinema/${fileNameImageCinema}`: '' ;
    let cinemaAddress = req.body.txtCinemaAddress;
	let viDo = req.body.txtViDo;
	let kinhDo = req.body.txtKinhDo;

    let queryInsert = `INSERT INTO rapphim VALUES (NULL,?,?,?,?,?)`;

    conn.query(queryInsert, [theaterName
                            ,imgCinema
                            ,cinemaAddress
                            ,viDo
                            ,kinhDo], function(errorRapChieuPhim, resultRapChieuPhim){
        if(errorRapChieuPhim){
            console.log(errorRapChieuPhim);

            res.render("rapchieu/themrapchieu", {
                messNotify: 'Thêm thất bại'
            });
        } else{
            fileNameImageCinema = '';
            res.render("rapchieu/themrapchieu", {
                messNotify: 'Thêm thành công'
            });
        }
    })
})



router.get("/suarapchieu", function(req, res){
    let idCinema = req.query.idCinema;
    let messageEdit = '';
    let query =`SELECT rapphim.ID
                        , rapphim.TenRap
                        , rapphim.Hinh
                        , rapphim.DiaChi
                        , rapphim.ViDo
                        , rapphim.KinhDo
                FROM rapphim WHERE rapphim.ID = ?`;


    if(req.query.mess &&  req.query.mess == 1){
        messageEdit = "Sửa thành công";
    }else if(req.query.mess &&  req.query.mess == 0){
        messageEdit = "Sửa thất bại";
    }

    conn.query(query,[idCinema] ,function (err, result){
        if(err) {
            console.log(err);
        } else {
            fileImageCinemaUrlOld = result[0].Hinh;
            res.render("rapchieu/suarapchieu", {rapphim: result[0] , messNotify: messageEdit});
        }
    })
});

router.post("/suarapchieu", uploadImage, function(req, res){
    let maRap = req.body.maRap;
    let cinemaName = req.body.txtTheaterName;
    let imgCinema = fileNameImageCinema && fileNameImageCinema != '' ? `${req.protocol}://${(req.hostname =='localhost' ? req.hostname + ':3000' : req.hostname )}/img/Cinema/${fileNameImageCinema}`:  fileImageCinemaUrlOld;
    let cinemaAddress = req.body.txtCinemaAddress;
    let viDo = req.body.txtViDo;
    let kinhDo = req.body.txtKinhDo;
    let sqlquery = `UPDATE rapphim
                        SET rapphim.TenRap = ?, rapphim.Hinh = ?, rapphim.DiaChi = ?
                            , rapphim.ViDo = ?, rapphim.KinhDo = ?
                        WHERE rapphim.ID = ?`;
    
    conn.query(sqlquery,[cinemaName, imgCinema, cinemaAddress, viDo, kinhDo, maRap], function(err, result){
        if(err){
            console.log(err);

            res.redirect(`/rapchieu/suarapchieu?mess=0&idCinema=${maRap}`)
        } else {
            fileNameImageCinema = ''
            res.redirect(`/rapchieu/suarapchieu?mess=1&idCinema=${maRap}`)
        }
    })
});

router.get("/chitietrapchieu", function (req, res) {
    let idCinema = req.query.idCinema;
  
    let query = `SELECT rapphim.ID
                        , rapphim.TenRap
                        , rapphim.Hinh
                        , rapphim.DiaChi
                        , rapphim.KinhDo
                        , rapphim.ViDo
                        , phong.ID as 'ID_Phong'
                        , phong.TenPhong
                 FROM rapphim JOIN phong ON rapphim.ID = phong.ID_Rap
                 WHERE rapphim.ID = ?`;
    conn.query(query, [idCinema], function (err, result) {
      if (err) {
        console.log(err);
  
        res.redirect("/rapchieu/danhsachrap?page=1")
      } else {
          let resultCinema = [];
          let nameCinema = '';
          let rooms =[];
          let countCinema = result.length;

          for (let i = 0; i < countCinema; i++) {
              for (let j = i; j < countCinema; j++) {
                  if (result[i].TenRap == result[j].TenRap) {
                    rooms.push({
                        id: result[j].ID_Phong,
                        nameRoom: result[j].TenPhong
                    })
                  }
              }

              nameCinema = result[i].TenRap;
              resultCinema.push({
                ID: result[i].ID,
                TenRap: result[i].TenRap,
                Hinh:  result[i].Hinh,
                KinhDo:result[i].KinhDo,
                ViDo: result[i].ViDo,
                rooms :rooms
              })
              rooms = [];
              
          }

        res.render("rapchieu/chitietrapchieu", { cinema: resultCinema[0] });
      }
    });
  });
module.exports = router