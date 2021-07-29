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
    let serviceName = req.body.namePopcorn;
    // let imgService = fileNameImageService && fileNameImageService != '' ? `${req.protocol}://${(req.hostname =='localhost' ? req.hostname + ':3000' : req.hostname )}/img/ImageService/${fileNameImageService}`: '' ;
    let describe = req.body.description;
	let unitPrice = req.body.unitPrice;

    let queryInsert = `INSERT INTO bapnuoc VALUES (NULL,?,?,?,?,'0')`;

    conn.query(queryInsert, [serviceName
                            ,unitPrice
                            ,describe
                            ,''],
                            function(errorService, resultService){
        if(errorService){
            console.log(errorService);

            res.json({statusCode: 0, messsage: 'Thêm dịch vụ thất bại', newIdPopcorn: 0})
        } else{
            res.json({statusCode: 1, messsage: 'Thêm dịch vụ thành công', newIdPopcorn: resultService.insertId})
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


    conn.query(query,[idService] ,function (err, result){
        if(err) {
            console.log(err);

            res.render("dichvu/suadichvu", {bapnuoc: null});
        } else {
           
            res.render("dichvu/suadichvu", {bapnuoc: result[0]});
        }
    })
});

router.post("/suadichvu", uploadImage, function(req, res){
    let maService = req.body.idPopcorn;
    let serviceName = req.body.namePopcorn;
    let describe = req.body.description;
    let unitPrice = req.body.unitPrice;
    let sqlquery = `UPDATE bapnuoc
                        SET bapnuoc.TenCombo = ?
                            , bapnuoc.DonGia = ?
                            , bapnuoc.MoTa = ?
                        WHERE bapnuoc.ID = ?`;
    
    conn.query(sqlquery,[serviceName, unitPrice, describe, maService], function(err, result){
        if(err){
            console.log(err);

            res.json({statusCode: 0, messsage: 'Cập nhật dịch vụ thất bại'});
        } else {
            res.json({statusCode: 1, messsage: 'Cập nhật dịch vụ thành công'});
        }
    })
});

router.put("/updateImage", function(req, res){
    let idPopCorn = req.body.idPopcorn;
    let urlImagePopcorn = req.body.urlImage;

    let queryUpdate = `UPDATE bapnuoc
                       SET bapnuoc.Hinh = ?
                       WHERE bapnuoc.ID = ? `;

    conn.query(queryUpdate, [urlImagePopcorn, idPopCorn] ,function(errorPopcorn){
        if(errorPopcorn){
            return res.json({statusCode: 0, message: 'Upload hình ảnh thất bại'});
        }

        return res.json({statusCode: 1, message: 'Upload hình ảnh thành công.'});
    })
})

module.exports = router