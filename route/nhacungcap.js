const express = require("express");
const conn = require("../db/connect");
const bodyParser = require("body-parser");
const router = express.Router();

router.use(express.static("views"));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/danhsachnhacungcap", function(req, res){
    
	let query = `select * from nhacungcap`
	conn.query(query, function(err, result){
	    if(err){
			console.log(err);
		}else{
			res.render("nhacungcap/danhsachnhacungcap", {danhsachnhacungcap: result})
		}
	})
		
})

router.get("/themnhacungcap", function(req, res){

    let querySupplier = `select * from nhacungcap`;

    conn.query(querySupplier, function(errorSupplier, resultSupplier){
        if(errorSupplier){
            console.log(errorSupplier);

            res.render("nhacungcap/themnhacungcap",{
                supplier: []
            });
        } else{
            res.render("nhacungcap/themnhacungcap",{
                supplier: resultSupplier
            });
        }
    })
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


module.exports = router;