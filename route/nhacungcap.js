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


module.exports = router;