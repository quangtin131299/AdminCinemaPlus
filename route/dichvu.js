const express = require("express")
const conn = require("../db/connect")
const bodyParser = require("body-parser");
const multer = require("multer");
const { render } = require("pug");
const router = express.Router();

router.use(express.static("views"))
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

let fileNameImageService = '';
let fileImageCinemaUrlOld = '';

var storageImageService = multer.diskStorage({
    destination: function (req, file, cb) {
      if(file.fieldname == 'imgService'){
        cb(null, "views/img/ImageService");
      }
      
    },
    filename: function (req, file, cb) {
      if(file.fieldname == 'imgService'){
        fileNameImageService =  file.originalname ? file.originalname : '';
      }
      cb(null, file.originalname);
    },
});
  
const uploadImageService = multer({ storage: storageImageService });

router.get("/danhsachdichvu", function(req, res){
	let queryslrap = `SELECT * FROM bapnuoc`
	
	conn.query(queryslrap, function(err, resul){
		if(err){
			console.log(err);
		}else{
			res.render("dichvu/danhsachdichvu", {danhsachdichvu: resul})
		}
	})
})

router.get("/themdichvu", function(req, res){

    let queryDichVu = `select * from bapnuoc`;

    conn.query(queryDichVu, function(errorDichVu, resultDichVu){
        if(errorDichVu){
            console.log(errorDichVu);

            res.render("dichvu/themdichvu",{
                dichvu: [],
               
            });
        } else{
            res.render("dichvu/themdichvu",{
                dichvu: resultDichVu,
                
            });
        }
    })
});

let uploadImage = uploadImageService.fields([{ name: 'imgService', maxCount: 1 }])

router.post('/themdichvu',uploadImage, function(req,res){
    let serviceName = req.body.txtServiceName;
    let imgService = fileNameImageService && fileNameImageService != '' ? `${req.protocol}://${(req.hostname =='localhost' ? req.hostname + ':3000' : req.hostname )}/img/ImageService/${fileNameImageService}`: '' ;
    let describe = req.body.txtDescribe;
	let unitPrice = req.body.txtUnitPrice;

    let queryInsert = `INSERT INTO bapnuoc VALUES (NULL,?,?,?,?)`;

    conn.query(queryInsert, [serviceName
                            ,unitPrice
                            ,describe
                            ,imgService],
                            function(errorService, resultService){
        if(errorService){
            console.log(errorService);

            res.render("dichvu/themdichvu", {
                messNotify: 'Thêm thất bại'
            });
        } else{
            fileNameImageService = '';
            res.render("dichvu/themdichvu", {
                messNotify: 'Thêm thành công'
            });
        }
    })
})

router.get("/suadichvu", function(req, res){
    let idService = req.query.idService;
    let messageEdit = '';
    let query =`SELECT bapnuoc.ID
                        , bapnuoc.TenCombo
                        , bapnuoc.DonGia
                        , bapnuoc.MoTa
                        , bapnuoc.Hinh
                FROM bapnuoc WHERE bapnuoc.ID = ?`;


    if(req.query.mess &&  req.query.mess == 1){
        messageEdit = "Sửa thành công";
    }else if(req.query.mess &&  req.query.mess == 0){
        messageEdit = "Sửa thất bại";
    }

    conn.query(query,[idService] ,function (err, result){
        if(err) {
            console.log(err);
        } else {
            fileImageServiceUrlOld = result[0].Hinh;
            res.render("dichvu/suadichvu", {bapnuoc: result[0] , messNotify: messageEdit});
        }
    })
});

router.post("/suadichvu", uploadImage, function(req, res){
    let maService = req.body.maService;
    let serviceName = req.body.txtServiceName;
    let imgService = fileNameImageService && fileNameImageService != '' ? `${req.protocol}://${(req.hostname =='localhost' ? req.hostname + ':3000' : req.hostname )}/img/ImageService/${fileNameImageService}`:  fileImageServiceUrlOld;
    let describe = req.body.txtDescribe;
    let unitPrice = req.body.txtUnitPrice;
    let sqlquery = `UPDATE bapnuoc
                        SET bapnuoc.TenCombo = ?
                            , bapnuoc.DonGia = ?
                            , bapnuoc.MoTa = ?
                            , bapnuoc.Hinh = ?
                        WHERE bapnuoc.ID = ?`;
    
    conn.query(sqlquery,[serviceName, unitPrice, describe, imgService, maService], function(err, result){
        if(err){
            console.log(err);

            res.redirect(`/dichvu/suadichvu?mess=0&idService=${maService}`)
        } else {
            fileNameImageService = ''
            res.redirect(`/dichvu/suadichvu?mess=1&idService=${maService}`)
        }
    })
});

module.exports = router