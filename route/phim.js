// /phim/...
const express = require("express");
const multer = require("multer");
const conn = require("../db/connect");
const bodyParser = require("body-parser");

let fileNameImageMovie = '';
let fileNamePosterMovie = '';

var storageImageMovie = multer.diskStorage({
  destination: function (req, file, cb) {
    if(file.fieldname == 'imgMovie'){
      cb(null, "img/Movie/Avatar");
    }
    else if(file.fieldname == 'imgPoster'){
      cb(null, "img/Movie/Poster");
    }
    
  },
  filename: function (req, file, cb) {
    if(file.fieldname == 'imgMovie'){
      fileNameImageMovie =  file.originalname ? file.originalname : '';
    }
    else if(file.fieldname == 'imgPoster'){
      fileNamePosterMovie = file.originalname ? file.originalname : ''
    }
    cb(null, file.originalname);
  },
});

const uploadImageAvatar = multer({ storage: storageImageMovie });

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
    let query = `SELECT phim.ID, phim.TenPhim, phim.Hinh, phim.TrangThai, phim.ThoiGian, phim.Trailer 
                 FROM phim limit ${vitribatdaulay}, 5`;
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
  let query = `SELECT phim.ID
                      , phim.TenPhim
                      , phim.Hinh
                      , phim.TrangThai
                      , phim.ThoiGian
                      , phim.Trailer
                      , phim_loaiphim.MoTa
                      , DATE_FORMAT(phim_loaiphim.NgayKhoiChieu, '%d/%m/%Y') as 'NgayKhoiChieu'
                      , loaiphim.ID 
                      ,loaiphim.TenLoai 
               FROM phim JOIN phim_loaiphim ON phim.ID = phim_loaiphim.ID_Phim JOIN loaiphim ON phim_loaiphim.Id_Loai = loaiphim.ID 
               WHERE phim.ID = ${idphim}`;
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
  let queryMovieType = "SELECT * FROM loaiphim";
  let messAddMovie = '';

  if(req.query.mess && req.query.mess == 1){
    messAddMovie = 'Thêm thành công'
  }else if(req.query.mess &&req.query.mess == -1){
    messAddMovie = 'Thêm thất bại'
  }


  conn.query(queryMovieType, function (errorMovieType, resultMovieTypes) {
    if (errorMovieType) {
      console.log(errorMovieType);

      return res.render("phim/themphimmoi", { movieTypes : [] , cinemas: [], suppliers: []});
    } else {
      let queryCinema = `SELECT rapphim.ID, rapphim.TenRap FROM rapphim;`;

      conn.query(queryCinema, function(errorCinema, resultCinemas){
        if(errorCinema){
          console.log(errorCinema);

          return res.render("phim/themphimmoi", { movieTypes : resultMovieTypes , cinemas: [], });
        }else{
          let querySupplier = `SELECT nhacungcap.ID, nhacungcap.TenNhaCungCap FROM nhacungcap`;
          
          conn.query(querySupplier, function(errorSupplier, resultSuppliers){
              if(errorSupplier){
                console.log(errorSupplier);

                return res.render("phim/themphimmoi", { movieTypes : resultMovieTypes , cinemas: resultCinemas , suppliers: []});
              }else{
                return res.render("phim/themphimmoi", { movieTypes : resultMovieTypes , cinemas: resultCinemas, suppliers: resultSuppliers, messNotify: messAddMovie});
              }
          })
        }
      }); 
    }
  });
});

let uploadImage = uploadImageAvatar.fields([{ name: 'imgMovie', maxCount: 1 }, { name: 'imgPoster', maxCount: 1 }])

router.post(
  "/themphim",
  uploadImage,
  function (req, res) {
    let movieName = req.body.txttenphim;
    let openDate = req.body.txtngaykhoichieu;
    let endDate = req.body.txtNgayKetThuc;
    let time = req.body.txtthoigian;
    let status = req.body.cboxtrangthai;
    let idTrailer = req.body.txtIDtrailer;
    let idSupplier = req.body.dropdownNhaCungCap;
    let idMovieTypes = req.body.chbloai;
    let idCinemas = req.body.chbCinema;
    let description = req.body.txtDescription;
    let like = 0;
    let imagMovie = fileNameImageMovie && fileNameImageMovie != '' ? `${req.protocol}://${(req.hostname =='localhost' ? req.hostname + ':3000' : req.hostname )}/img/Movie/Avatar/${fileNameImageMovie}`: '' ;
    let imagPoster = fileNamePosterMovie && fileNameImageMovie != '' ? `${req.protocol}://${(req.hostname =='localhost' ? req.hostname + ':3000' : req.hostname )}/img/Movie/Poster/${fileNamePosterMovie}`: '' ;

    
    let sqlquery = `INSERT INTO phim VALUES(NULL,?,?,?,?,?,?,?,?,?,?,?)`;
    conn.query(sqlquery, [movieName
                          ,imagMovie
                          ,imagPoster
                          ,status
                          ,time
                          ,idTrailer
                          ,description
                          ,openDate
                          ,like
                          ,idSupplier
                          ,endDate ],function (err,resultNewMovie) {
      if (err) {
        console.log(err);
        res.redirect('/phim/themphimmoi?mess=0')
      } else {
        let countMovieType = idMovieTypes.length;
        let queryType = `INSERT INTO phim_loaiphim VALUES(?,?)`;

        for (let i = 0; i < countMovieType; i++) {
            conn.query(queryType, [resultNewMovie.insertId, idMovieTypes[i]], function(errorMovieType){
                if(errorMovieType){
                  console.log(errorMovieType);
                  return res.redirect('/phim/themphimmoi?mess=-1') 
                }
            })
        }

        let countCinema = idCinemas.length;
        let queryCinema = `INSERT INTO phim_rapphim VALUES(?,?)`;

        for (let i = 0; i < countCinema; i++) {
            conn.query(queryCinema, [idCinemas[i], resultNewMovie.insertId], function(errorCinema){
                if(errorCinema){
                  console.log(errorCinema);
                  return res.redirect('/phim/themphimmoi?mess=-1') 
                }
            })
        }

        res.redirect('/phim/themphimmoi?mess=1')   
      }
    });
  }
);

router.get("/suaphim", function (req, res) {
  let idphim = req.query.idphim;
  let query = `SELECT phim.ID
                      , phim.TenPhim
                      , phim.Hinh
                      , phim.TrangThai
                      , phim.ThoiGian
                      , phim.Trailer
                      , phim.MoTa
                      , DATE_FORMAT(phim.NgayKhoiChieu, '%Y-%m-%d') as 'NgayKhoiChieu'
                      , DATE_FORMAT(phim.NgayKetThuc, '%Y-%m-%d') as 'NgayKetThuc'
               FROM phim WHERE phim.ID = ?`;
  conn.query(query,[idphim],function (err, result) {
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
