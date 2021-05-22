const express = require("express");
const multer = require("multer");
const conn = require("../db/connect");
const bodyParser = require("body-parser");
const { response } = require("express");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "img");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();
router.use(express.static("views"));
// parse application/json
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


router.get("/upload", function(req, res){
    res.render("uploadanh/upload")
})


router.post("/upload", upload.array("txtfile", 10), function(req, res){
    res.render("uploadanh/upload",  {message: "Upload thành công"})
})


module.exports = router;