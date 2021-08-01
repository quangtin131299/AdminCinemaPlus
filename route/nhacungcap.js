const express = require("express");
const conn = require("../db/connect");
const bodyParser = require("body-parser");
const router = express.Router();

router.use(express.static("views"));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/danhsachnhacungcap", function(req, res){
    let page = req.query.page;
    let vitribatdaulay = (page - 1)	* 5;
    let soluongtrang = 0;
	let query = `select * from nhacungcap WHERE nhacungcap.isDelete = 0`

	conn.query(query, function(err, result){
        soluongtrang = result.length / 5;
        let query = `select * from nhacungcap WHERE nhacungcap.isDelete = 0 Limit ${vitribatdaulay}, 5`;
	    conn.query(query, function (err,result){
            if(err){
                console.log(err);
            }else{
    
                res.render("nhacungcap/danhsachnhacungcap", {pagerespon: page, danhsachnhacungcap: result,soluongtrang: Math.ceil(soluongtrang),})
            }
        })
	})
		
})

router.get("/themnhacungcap", function (req, res) {
    let querySupplier = `select * from nhacungcap`;

    conn.query(querySupplier, function (errorSupplier, resultSupplier) {
        if (errorSupplier) {
            console.log(errorSupplier);

            res.render("nhacungcap/themnhacungcap", {
                supplier: []
            });
        } else {
            res.render("nhacungcap/themnhacungcap", {
                supplier: resultSupplier
            });
        }
    })
})

router.post('/themnhacungcap', function (req, res) {
    let supplierName = req.body.supplierName;
    let address = req.body.address;
    let phoneNumber = req.body.phoneNumber;
    let email = req.body.email;

    let queryDuplicateNameSupplier = `SELECT * FROM nhacungcap where nhacungcap.TenNhaCungCap = ? `;

    conn.query(queryDuplicateNameSupplier, [supplierName], function (errorDuplicateNameSupplier, resultNameSupplier) {
        if (errorDuplicateNameSupplier) {
            console.error(errorDuplicateNameSupplier);
            return res.json({
                statusCode: 0,
                message: 'Không thể kiểm tra trùng tên nhà cung cấp phim'
            })
        } else {
            if (resultNameSupplier.length == 0) {
                let queryInsert = `INSERT INTO nhacungcap VALUES (NULL,?,?,?,?,'0')`;

                conn.query(queryInsert, [supplierName, address, phoneNumber, email], function (errorSupplier, resultSupplier) {
                    if (errorSupplier) {
                        console.log(errorSupplier);

                        res.json({
                            statusCode: 0,
                            message: 'Thêm thông tin thất bại'
                        });
                    } else {
                        res.json({
                            statusCode: 1,
                            message: 'Thêm thông tin thành công'
                        });
                    }
                })
            } else {
                return res.json({statusCode: 0, message: 'Tên nhà cung cấp phim đã tồn tại'})
            }
        }
    })
})

router.get("/suanhacungcap", function (req, res) {
    let idSupplier = req.query.idSupplier;
    let messageEdit = '';
    let query = `SELECT nhacungcap.ID
                        , nhacungcap.TenNhaCungCap
                        , nhacungcap.DiaChi
                        , nhacungcap.SĐT
                        , nhacungcap.Email
                FROM nhacungcap WHERE nhacungcap.ID = ?`;

    conn.query(query, [idSupplier], function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.render("nhacungcap/suanhacungcap", {
                nhacungcap: result[0]
            });
        }
    })
})

router.put("/suanhacungcap", function (req, res) {
    let maSupplier = req.body.maSupplier;
    let supplierName = req.body.supplierName;
    let supplierAddress = req.body.address;
    let sdt = req.body.phoneNumber;
    let email = req.body.email;

    let query = `UPDATE nhacungcap
                 SET nhacungcap.TenNhaCungCap = ?, nhacungcap.DiaChi = ?, nhacungcap.SĐT = ?, nhacungcap.Email = ?
                 WHERE nhacungcap.ID = ?`

    conn.query(query, [supplierName, supplierAddress, sdt, email, maSupplier], function (err, result) {
        if (err) {
            console.log(err);

            // res.redirect(`/nhacungcap/suanhacungcap?mess=0&idSupplier=${maSupplier}`)
            res.json({
                statusCode: 0,
                message: 'Cập nhật thông tin nhà cung cấp Thất bại'
            });
        } else {
            res.json({
                statusCode: 1,
                message: 'Cập nhật thông tin nhà cung cấp thành công'
            });
        }
    })
})

router.post("/xoanhacungcap", function (req, res) {
    let idSupplier = req.body.idSupplier;

    let query = `SELECT phim.ID, phim.TenPhim, phim.ID_NhaCungCap, nhacungcap.ID, nhacungcap.TenNhaCungCap
                 FROM nhacungcap JOIN phim ON phim.ID_NhaCungCap = nhacungcap.ID
                 WHERE nhacungcap.ID = ?`;

    conn.query(query, [idSupplier], function (errContrainSupplier, resultContrainSupplier) {
        if (errContrainSupplier) {
            console.log(err);
        } else {
            if (resultContrainSupplier.length == 0) {
                let queryUpdateStatus = `UPDATE nhacungcap
                                         SET nhacungcap.isDelete = 1
                                         Where nhacungcap.ID  = ?`;

                conn.query(queryUpdateStatus, [idSupplier], function (errorUpdate) {
                    if (errorUpdate) {
                        console.log(errorUpdate);

                        return res.json({
                            statusCode: 0,
                            message: 'Xóa nhà cung cấp thất bại'
                        });
                    }

                    res.json({
                        statusCode: 1,
                        message: 'Xóa nhà cung cấp thành công'
                    });
                })
            } else {
                res.json({
                    statusCode: 0,
                    message: 'Xóa thất bại! Có phim đang có trên hệ thống do nhà cung cấp phát hành'
                });
            }

            // res.render("nhacungcap/xoanhacungcap", {nhacungcap: result[0], messNotify: messageEdit});
        }
    })
})

router.get("/searchSupplier", function (req, res){
    let page = req.query.pageSelect ? req.query.pageSelect : 1;
    let keyWord = req.query.keyWord;

    let querySearch =`SELECT nhacungcap.*
                      FROM nhacungcap 
                      WHERE (match(nhacungcap.TenNhaCungCap) against(?) or nhacungcap.TenNhaCungCap LIKE ?) AND nhacungcap.isDelete = 0`;

    conn.query( querySearch, [keyWord, `${keyWord}%`], function (err, resultSearchSupplier){
        if(err){
            console.log(err);
            res.json({ statusCode: 0, message: 'Tìm kiếm thất bại'});
        } else {
            let numberPage = resultSearchSupplier.length / 5;
            let position = (page - 1) * 5;

            let querySupplierPagging = `SELECT nhacungcap.*
                                        FROM nhacungcap 
                                        WHERE (match(nhacungcap.TenNhaCungCap) against(?) or nhacungcap.TenNhaCungCap LIKE ?) AND nhacungcap.isDelete = 0  LIMIT ?, 5`;
            
            conn.query(querySupplierPagging, [ keyWord, `${keyWord}%`, position], function(errorSupplierPagging, resultSupplierPagging){
                if(errorSupplierPagging){
                    console.log(errorSupplierPagging);
                    res.json({statusCode: 0, message: 'Không lấy được trang phim trong tìm kiếm'})
                } else {
                    res.json({ statusCode: 1, message: 'Tìm kiếm thành công', resultSupplier: resultSupplierPagging, totalNumber: Math.ceil(numberPage), currentPage:page})
                }
            })
        }
    });
})


module.exports = router;