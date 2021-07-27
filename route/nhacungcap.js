const express = require("express");
const conn = require("../db/connect");
const bodyParser = require("body-parser");
const router = express.Router();

router.use(express.static("views"));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/danhsachnhacungcap", function(req, res){
    
	let query = `select * from nhacungcap WHERE nhacungcap.isDelete = 0`
	conn.query(query, function(err, result){
	    if(err){
			console.log(err);
		}else{
			res.render("nhacungcap/danhsachnhacungcap", {danhsachnhacungcap: result})
		}
	})
		
})

router.get("/themnhacungcap", function(req, res){
    res.render("nhacungcap/themnhacungcap");
})

router.post('/themnhacungcap', function(req,res){
    let supplierName = req.body.supplierName;
    let address = req.body.address;
    let phoneNumber = req.body.phoneNumber;
    let email = req.body.email;

    let queryInsert = `INSERT INTO nhacungcap VALUES (NULL,?,?,?,?)`;

    conn.query(queryInsert, [supplierName, address, phoneNumber, email], function(errorSupplier, resultSupplier){
        if(errorSupplier){
            console.log(errorSupplier);

            res.json({message: 'False', statusCode: 0, messNotify: 'Thêm thất bại'})
        } else{
            res.json({message: 'Success', statusCode: 1, messNotify: 'Thêm thành công'})
        }
    })
})

router.get("/suanhacungcap", function (req, res){
    let idSupplier = req.query.idSupplier;
    let messageEdit = '';
    let query = `SELECT nhacungcap.ID
                        , nhacungcap.TenNhaCungCap
                        , nhacungcap.DiaChi
                        , nhacungcap.SĐT
                        , nhacungcap.Email
                FROM nhacungcap WHERE nhacungcap.ID = ?`;
    if( req.query.mess &&  req.query.mess == 1){
        messageEdit = "Sửa thành công";
    } else if( req.query.mess && req.query.mess == 0){
        messageEdit = "Sửa thất bại";
    }

    conn.query(query, [idSupplier], function (err, result){
        if(err){
            console.log(err);
        } else {
            res.render("nhacungcap/suanhacungcap", {nhacungcap: result[0], messNotify: messageEdit});
        }
    })
})

router.post("/suanhacungcap", function (req, res){
    let maSupplier = req.body.maSupplier;
    let supplierName = req.body.txtSupplierName;
    let supplierAddress = req.body.txtAddress;
    let sdt = req.body.txtPhoneNumber;
    let email = req.body.txtEmail;

    let query = `UPDATE nhacungcap
                    SET nhacungcap.TenNhaCungCap = ?, nhacungcap.DiaChi = ?,
                        nhacungcap.SĐT = ?, nhacungcap.Email = ?
                    WHERE nhacungcap.ID = ?`
    
    conn.query(query, [supplierName, supplierAddress, sdt, email, maSupplier], function (err, result){
        if(err){
            console.log(err);
            res.redirect(`/nhacungcap/suanhacungcap?mess=0&idSupplier=${maSupplier}`)
        } else {
            res.redirect(`/nhacungcap/suanhacungcap?mess=1&idSupplier=${maSupplier}`);
        }
    })
})

router.post("/xoanhacungcap", function (req, res){
    let idSupplier = req.body.idSupplier;
    console.log(idSupplier);
    let query = `SELECT phim.ID, phim.TenPhim, phim.ID_NhaCungCap, nhacungcap.ID, nhacungcap.TenNhaCungCap
                 FROM nhacungcap JOIN phim ON phim.ID_NhaCungCap = nhacungcap.ID
                 WHERE nhacungcap.ID = ?`;

    conn.query(query, [idSupplier], function (errContrainSupplier, resultContrainSupplier){
        if(errContrainSupplier){
            console.log(err);
        } else {
            if(resultContrainSupplier.length == 0){
                let queryUpdateStatus = `UPDATE nhacungcap
                                         SET nhacungcap.isDelete = 1
                                         Where nhacungcap.ID  = ?`;
                
                conn.query(queryUpdateStatus, [idSupplier], function(errorUpdate){
                    if(errorUpdate){
                        console.log(errorUpdate);

                        return res.json({statusCode: 0, message: 'Xóa nhà cung cấp thất bại'});
                    }

                    res.json({statusCode: 1, message: 'Xóa nhà cung cấp thành công'});
                })
            }else{
                res.json({statusCode: 0, message: 'Xóa nhà cung cấp thất bại'});
            }
            
            // res.render("nhacungcap/xoanhacungcap", {nhacungcap: result[0], messNotify: messageEdit});
        }
    })
})


module.exports = router;