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
                message: 'Kh??ng th??? ki???m tra tr??ng t??n nh?? cung c???p phim'
            })
        } else {
            if (resultNameSupplier.length == 0) {
                let queryInsert = `INSERT INTO nhacungcap VALUES (NULL,?,?,?,?,'0')`;

                conn.query(queryInsert, [supplierName, address, phoneNumber, email], function (errorSupplier, resultSupplier) {
                    if (errorSupplier) {
                        console.log(errorSupplier);

                        res.json({
                            statusCode: 0,
                            message: 'Th??m th??ng tin th???t b???i'
                        });
                    } else {
                        res.json({
                            statusCode: 1,
                            message: 'Th??m th??ng tin th??nh c??ng'
                        });
                    }
                })
            } else {
                return res.json({statusCode: 0, message: 'T??n nh?? cung c???p phim ???? t???n t???i'})
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
                        , nhacungcap.S??T
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
                 SET nhacungcap.TenNhaCungCap = ?, nhacungcap.DiaChi = ?, nhacungcap.S??T = ?, nhacungcap.Email = ?
                 WHERE nhacungcap.ID = ?`

    conn.query(query, [supplierName, supplierAddress, sdt, email, maSupplier], function (err, result) {
        if (err) {
            console.log(err);

            // res.redirect(`/nhacungcap/suanhacungcap?mess=0&idSupplier=${maSupplier}`)
            res.json({
                statusCode: 0,
                message: 'C???p nh???t th??ng tin nh?? cung c???p Th???t b???i'
            });
        } else {
            res.json({
                statusCode: 1,
                message: 'C???p nh???t th??ng tin nh?? cung c???p th??nh c??ng'
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
                            message: 'X??a nh?? cung c???p th???t b???i'
                        });
                    }

                    res.json({
                        statusCode: 1,
                        message: 'X??a nh?? cung c???p th??nh c??ng'
                    });
                })
            } else {
                res.json({
                    statusCode: 0,
                    message: 'X??a th???t b???i! C?? phim ??ang c?? tr??n h??? th???ng do nh?? cung c???p ph??t h??nh'
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
            res.json({ statusCode: 0, message: 'T??m ki???m th???t b???i'});
        } else {
            let numberPage = resultSearchSupplier.length / 5;
            let position = (page - 1) * 5;

            let querySupplierPagging = `SELECT nhacungcap.*
                                        FROM nhacungcap 
                                        WHERE (match(nhacungcap.TenNhaCungCap) against(?) or nhacungcap.TenNhaCungCap LIKE ?) AND nhacungcap.isDelete = 0  LIMIT ?, 5`;
            
            conn.query(querySupplierPagging, [ keyWord, `${keyWord}%`, position], function(errorSupplierPagging, resultSupplierPagging){
                if(errorSupplierPagging){
                    console.log(errorSupplierPagging);
                    res.json({statusCode: 0, message: 'Kh??ng l???y ???????c trang phim trong t??m ki???m'})
                } else {
                    res.json({ statusCode: 1, message: 'T??m ki???m th??nh c??ng', resultSupplier: resultSupplierPagging, totalNumber: Math.ceil(numberPage), currentPage:page})
                }
            })
        }
    });
})


module.exports = router;