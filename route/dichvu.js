const express = require("express")
const conn = require("../db/connect")
const bodyParser = require("body-parser");
const multer = require("multer");
const {
    render
} = require("pug");
const router = express.Router();

router.use(express.static("views"))
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

let fileNameImageService = '';
let fileImageCinemaUrlOld = '';

var storageImageService = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname == 'imgService') {
            cb(null, "views/img/ImageService");
        }

    },
    filename: function (req, file, cb) {
        if (file.fieldname == 'imgService') {
            fileNameImageService = file.originalname ? file.originalname : '';
        }
        cb(null, file.originalname);
    },
});
  
const uploadImageService = multer({ storage: storageImageService });

router.get("/danhsachdichvu", function(req, res){
    let page = req.query.page;
    let vitribatdaulay = (page - 1)	* 5;
    let soluongtrang = 0;
	let query = `SELECT * FROM bapnuoc WHERE bapnuoc.isDelete = 0`
	
	conn.query(query, function(err, resul){
        soluongtrang = resul.length / 5;
        let query = `SELECT * FROM bapnuoc WHERE bapnuoc.isDelete = 0 limit ${vitribatdaulay}, 5`;
        conn.query(query, function(err, resul){
            if(err){
                console.log(err);
            }else{
                res.render("dichvu/danhsachdichvu", {pagerespon: page, danhsachdichvu: resul ,soluongtrang: Math.ceil(soluongtrang),});
            }
        })
	})
})

router.get("/themdichvu", function (req, res) {

    let queryDichVu = `select * from bapnuoc`;

    conn.query(queryDichVu, function (errorDichVu, resultDichVu) {
        if (errorDichVu) {
            console.log(errorDichVu);

            res.render("dichvu/themdichvu", {
                dichvu: [],

            });
        } else {
            res.render("dichvu/themdichvu", {
                dichvu: resultDichVu,

            });
        }
    })
});

let uploadImage = uploadImageService.fields([{
    name: 'imgService',
    maxCount: 1
}])

router.post('/themdichvu', uploadImage, function (req, res) {
    let serviceName = req.body.namePopcorn;
    let describe = req.body.description;
    let unitPrice = req.body.unitPrice;

    let queryDuplicateNameService = `SELECT * FROM bapnuoc where bapnuoc.TenCombo = ? `;

    conn.query(queryDuplicateNameService, [serviceName], function (errorDuplicateNameService, resultNameService) {
        if (errorDuplicateNameService) {
            console.log(errorDuplicateNameService);
            return res.jsonp({
                statusCode: 0,
                message: 'Không thể kiểm tra trùng tên dịch vụ'
            })
        } else {
            if (resultNameService.length == 0) {
                let queryInsert = `INSERT INTO bapnuoc VALUES (NULL,?,?,?,?,'0')`;

                conn.query(queryInsert, [serviceName, unitPrice, describe, ''],
                    function (errorService, resultService) {
                        if (errorService) {
                            console.log(errorService);

                            res.json({
                                statusCode: 0,
                                messsage: 'Thêm dịch vụ thất bại',
                                newIdPopcorn: 0
                            })
                        } else {
                            res.json({
                                statusCode: 1,
                                messsage: 'Thêm dịch vụ thành công',
                                newIdPopcorn: resultService.insertId
                            })
                        }
                    })
            } else {
                return res.json({statusCode: 0, messsage: 'Tên dịch vụ đã tồn tại'})
            }
        }
    })

})

router.get("/suadichvu", function (req, res) {
    let idService = req.query.idService;
    let messageEdit = '';
    let query = `SELECT bapnuoc.ID
                        , bapnuoc.TenCombo
                        , bapnuoc.DonGia
                        , bapnuoc.MoTa
                        , bapnuoc.Hinh
                FROM bapnuoc WHERE bapnuoc.ID = ?`;


    conn.query(query, [idService], function (err, result) {
        if (err) {
            console.log(err);

            res.render("dichvu/suadichvu", {
                bapnuoc: null
            });
        } else {

            res.render("dichvu/suadichvu", {
                bapnuoc: result[0]
            });
        }
    })
});

router.post("/suadichvu", uploadImage, function (req, res) {
    let maService = req.body.idPopcorn;
    let serviceName = req.body.namePopcorn;
    let describe = req.body.description;
    let unitPrice = req.body.unitPrice;
    let sqlquery = `UPDATE bapnuoc
                        SET bapnuoc.TenCombo = ?
                            , bapnuoc.DonGia = ?
                            , bapnuoc.MoTa = ?
                        WHERE bapnuoc.ID = ?`;

    conn.query(sqlquery, [serviceName, unitPrice, describe, maService], function (err, result) {
        if (err) {
            console.log(err);

            res.json({
                statusCode: 0,
                messsage: 'Cập nhật dịch vụ thất bại'
            });
        } else {
            res.json({
                statusCode: 1,
                messsage: 'Cập nhật dịch vụ thành công'
            });
        }
    })
});

router.put("/updateImage", function (req, res) {
    let idPopCorn = req.body.idPopcorn;
    let urlImagePopcorn = req.body.urlImage;

    let queryUpdate = `UPDATE bapnuoc
                       SET bapnuoc.Hinh = ?
                       WHERE bapnuoc.ID = ? `;

    conn.query(queryUpdate, [urlImagePopcorn, idPopCorn], function (errorPopcorn) {
        if (errorPopcorn) {
            return res.json({
                statusCode: 0,
                message: 'Upload hình ảnh thất bại'
            });
        }

        return res.json({
            statusCode: 1,
            message: 'Upload hình ảnh thành công.'
        });
    })
})

router.get("/searchService", function (req, res){
    let page = req.query.pageSelect ? req.query.pageSelect : 1;
    let keyWord = req.query.keyWord;

    let querySearch =`SELECT bapnuoc.*
                      FROM bapnuoc 
                      WHERE  bapnuoc.TenCombo LIKE ? AND bapnuoc.isDelete = 0`;

    conn.query( querySearch, [`%${keyWord}%`], function (err, resultSearchService){
        if(err){
            console.log(err);
            res.json({ statusCode: 0, message: 'Tìm kiếm thất bại'});
        } else {
            let numberPage = resultSearchService.length / 5;
            let position = (page - 1) * 5;

            let queryServicePagging = `SELECT bapnuoc.*
                                        FROM bapnuoc 
                                        WHERE (match(bapnuoc.TenCombo) against(?) or bapnuoc.TenCombo LIKE ?) LIMIT ?, 5`;
            
            conn.query(queryServicePagging, [ keyWord, `${keyWord}%`, position], function(errorServicePagging, resultServicePagging){
                if(errorServicePagging){
                    console.log(errorServicePagging);
                    res.json({statusCode: 0, message: 'Không lấy được trang phim trong tìm kiếm'})
                } else {
                    res.json({ statusCode: 1, message: 'Tìm kiếm thành công', resultService: resultServicePagging, totalNumber: Math.ceil(numberPage), currentPage:page})
                }
            })
        }
    });
})

router.post("/xoadichvu", function (req, res) {
    let idService = req.body.idService;

    let query = `SELECT bapnuoc.ID, bapnuoc.TenCombo, bapnuoc.isDelete, vedat.ID, vedat.TrangThai, hoadon_bapnuoc.ID_HoaDon
                 FROM bapnuoc JOIN hoadon_bapnuoc ON hoadon_bapnuoc.ID_BapNuoc = bapnuoc.ID
                              JOIN vedat ON vedat.ID_HoaDon = hoadon_bapnuoc.ID_HoaDon
                 WHERE bapnuoc.ID = ? and vedat.TrangThai = 'Đã đặt'`

    conn.query(query, [idService], function (errContrainService, resultContrainService) {
        if (errContrainService) {
            console.log(errContrainService);
        } else {
            if (resultContrainService.length == 0) {
                let queryUpdateStatus = `UPDATE bapnuoc
                                         SET bapnuoc.isDelete = 1
                                         Where bapnuoc.ID  = ?`

                conn.query(queryUpdateStatus, [idService], function (errorUpdate) {
                    if (errorUpdate) {
                        console.log(errorUpdate);

                        return res.json({
                            statusCode: 0,
                            message: 'Xóa dịch vụ thất bại'
                        });
                    }

                    res.json({
                        statusCode: 1,
                        message: 'Xóa dịch vụ thành công'
                    });
                })
            } else {
                res.json({
                    statusCode: 0,
                    message: 'Xóa dịch vụ thất bại! Dịch vụ đang tồn tại trên hóa đơn chưa nhận'
                });
            }
        }
    })


})

module.exports = router