// /phim/...
const express = require("express");
// const multer = require("multer");
const conn = require("../db/connect");
const bodyParser = require("body-parser");

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "img");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

const router = express.Router();
router.use(express.static("views"));
// parse application/json
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/danhsachphim", function (req, res) {
  let page = req.query.page;
  let vitribatdaulay = (page - 1) * 5;
  let soluongtrang = 0;
  let query =
    "SELECT phim.ID, phim.TenPhim, phim.Hinh, phim.TrangThai, phim.ThoiGian, phim.Trailer FROM phim";
  conn.query(query, function (err, result) {
    soluongtrang = result.length / 5;
    let query = `SELECT phim.ID, phim.TenPhim, phim.Hinh, phim.TrangThai, phim.ThoiGian, phim.Trailer FROM phim limit ${vitribatdaulay}, 5`;
    conn.query(query, function (err, result) {
      if (err) {
        //Coi lai
        res.send(err);
      } else {
        let temptenphim = "";
        let mangkq = [];
        for (let i = 0; i < result.length; i++) {
          if (result[i].TenPhim !== temptenphim) {
            for (let j = i + 1; j < result.length; j++) {
              if (result[j].TenPhim === result[i].TenPhim) {
                result[i].TenLoai += ", " + result[j].TenLoai;
              }
            }
            temptenphim = result[i].TenPhim;
            mangkq.push(result[i]);
          }
        }
        res.render("phim/danhsachphim", {
          pagerespon: page,
          dataphimchieu: mangkq,
          soluongtrang: Math.ceil(soluongtrang),
        });
      }
    });
  });
});

router.get("/chitietphim", function (req, res) {
  let idphim = req.query.idphim;
  let query = `SELECT phim.ID, phim.TenPhim, phim.Hinh, phim.TrangThai, phim.ThoiGian, phim.Trailer, phim_loaiphim.MoTa, DATE_FORMAT(phim_loaiphim.NgayKhoiChieu, '%d/%m/%Y') as 'NgayKhoiChieu', loaiphim.ID ,loaiphim.TenLoai FROM phim JOIN phim_loaiphim ON phim.ID = phim_loaiphim.ID_Phim JOIN loaiphim ON phim_loaiphim.Id_Loai = loaiphim.ID where phim.ID = ${idphim}`;
  conn.query(query, function (err, result) {
    if (err) {
      //Coi lai
      res.send(err);
    } else {
      let temptenphim = "";
      let mangkq = [];
      for (let i = 0; i < result.length; i++) {
        if (result[i].TenPhim !== temptenphim) {
          for (let j = i + 1; j < result.length; j++) {
            if (result[j].TenPhim === result[i].TenPhim) {
              result[i].TenLoai += ", " + result[j].TenLoai;
            }
          }
          temptenphim = result[i].TenPhim;
          mangkq.push(result[i]);
        }
      }
      res.render("phim/chitietphim", { phim: mangkq[0] });
    }
  });
});

router.get("/themphimmoi", function (req, res) {
  let query = "Select * from loaiphim";
  conn.query(query, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.render("phim/themphimmoi", { danhsachloaiphim: result });
    }
  });
});

router.post(
  "/themphim",
  function (req, res, next) {
    let arrayphim = Array.from(req.body.dataphim);
    
    let soluongphim = arrayphim.length;
    let host = req.get("host");
    let dataphim = [];
    for (let i = 0; i < soluongphim; i++) {
      let tenphim = arrayphim[i].tenphim;
      let hinhphim = `http://${host}/img/${arrayphim[i].tenhinhanh}`;
      let trangthai = arrayphim[i].trangthai;
      let thoigian = arrayphim[i].thoigianchieu;
      let idtrailer = arrayphim[i].idtrailer;
      let mota = arrayphim[i].mota;
      let ngaykhoichieu = arrayphim[i].ngaykhoichieu;
      let arrloaiphim = arrayphim[i].loai.split(",").map(function (x) {
        return Number(x);
      });
      let arrttphim = [
        tenphim,
        hinhphim,
        trangthai,
        thoigian,
        idtrailer,
        mota,
        ngaykhoichieu,
        arrloaiphim,
      ];
      let sl = arrttphim.length;
      for (let i = 0; i < sl; i++) {
        if (!arrttphim[i]) {
          return res.redirect("/phim/danhsachphim?page=1");
        }
      }
      dataphim.push(arrttphim);
    }
    res.locals.dataphim = dataphim;
    next();
  },
  function (req, res) {
    let dataphim = res.locals.dataphim;
    let sl = dataphim.length;
    for (let i = 0; i < sl; i++) {
      let sqlquery = `INSERT INTO phim VALUES(NULL,'${dataphim[i][0]}','${dataphim[i][1]}','${dataphim[i][2]}','${dataphim[i][3]}','${dataphim[i][4]}')`;
      conn.query(sqlquery, function (err, result) {
        if (err) {
          res.send(err);
        } else {
          let idphim = result.insertId;
          for (let index = 0; index < dataphim[i][7].length; index++) {
            let idloai = dataphim[i][7][index];
            let queryphimloai = `INSERT INTO phim_loaiphim VALUES(?, ? , ?, ?)`;
            conn.query(
              queryphimloai,
              [idphim, idloai, dataphim[i][5], dataphim[i][6]],
              function (err) {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Thành công");
                  res.redirect("/themphimmoi");
                }
              }
            );
          }
        }
      });
    }
  }
);

router.get("/suaphim", function (req, res) {
  let idphim = req.query.idphim;
  let query = `SELECT phim.ID, phim.TenPhim, phim.Hinh, phim.TrangThai, phim.ThoiGian, phim.Trailer, phim_loaiphim.MoTa, DATE_FORMAT(phim_loaiphim.NgayKhoiChieu, '%Y-%m-%d') as 'NgayKhoiChieu', loaiphim.ID as 'Id_Loai' ,loaiphim.TenLoai FROM phim JOIN phim_loaiphim ON phim.ID = phim_loaiphim.ID_Phim JOIN loaiphim ON phim_loaiphim.Id_Loai = loaiphim.ID where phim.ID =${idphim}`;
  conn.query(query, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      let temptenphim = "";
      let mangkq = [];
      let mangtheloai = [];
      for (let i = 0; i < result.length; i++) {
        if (result[i].TenPhim !== temptenphim) {
          for (let j = i; j < result.length; j++) {
            if (result[j].TenPhim === result[i].TenPhim) {
              mangtheloai.push({
                ID: result[j].Id_Loai,
                TenLoai: result[j].TenLoai,
              });
            }
          }
          result[i].theloai = mangtheloai;
          temptenphim = result[i].TenPhim;
          mangkq.push(result[i]);
          mangtheloai = [];
        }
      }
      res.render("phim/suaphim", { phim: mangkq[0] });
    }
  });
});

router.post("/suattphim", function (req, res) {
  let maphim = req.body.maphim;
  let tenphim = req.body.txttenphim;
  let hinhphim = "Chưa cập nhật";
  let ngaykhoichieu = req.body.txtngaykhoichieu;
  let trangthai = req.body.cboxtrangthai;
  let thoigian = req.body.txtthoigian;
  let idtrailer = req.body.txtIDtrailer;
  let mota = req.body.txtmota;

  let sqlquery = `UPDATE phim
  SET phim.TenPhim = ?, phim.Hinh = ?, phim.TrangThai = ?, phim.ThoiGian = ?, phim.Trailer = ?
  WHERE phim.ID = ?`;
  conn.query(
    sqlquery,
    [tenphim, hinhphim, trangthai, thoigian, idtrailer, maphim],
    function (err, result) {
      if (err) {
        res.send(err);
      } else {
        let queryupdatephimloaiphim = `UPDATE phim_loaiphim
        SET phim_loaiphim.MoTa = ?, phim_loaiphim.NgayKhoiChieu = ?
        WHERE phim_loaiphim.ID_Phim = ? AND phim_loaiphim.ID_Loai = ?`;
        conn.query(
          queryupdatephimloaiphim,
          [mota, ngaykhoichieu],
          function (err, result) {
            if (err) {
              res.status(501);
            } else {
              res.redirect("/phim/danhsachphim?page=1");
            }
          }
        );
      }
    }
  );
});

module.exports = router;
