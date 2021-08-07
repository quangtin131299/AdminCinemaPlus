// /phim/...
const express = require("express");
const multer = require("multer");
const axios = require('axios');
const conn = require("../db/connect");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const serviceAccount = require('../cinemaplus-f6e86-firebase-adminsdk-k5rs6-9127c0f4f5.json');

const urlSendNotify = 'https://fcm.googleapis.com/fcm/send';
const apiKey = 'key=AAAAci70i2E:APA91bHWdz71FyDIR_Ru-a-CAV7M7mSe2RwbCL8tZ7GlOceg3FYcrDZShkae6P88RNL0BXMSQDtj-EyTgQv2ypSU9KRdiGWSbigYpHBerEE4aIVVEhMHBiBeAXGFtSj6ZCQ0_g77O-LJ';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let fileNameImageMovie = '';
let fileNamePosterMovie = '';

var storageImageMovie = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname == 'imgMovie') {
      cb(null, "views/img/Movie/Avatar");
    }
    else if (file.fieldname == 'imgPoster') {
      cb(null, "views/img/Movie/Poster");
    }

  },
  filename: function (req, file, cb) {
    if (file.fieldname == 'imgMovie') {
      fileNameImageMovie = file.originalname ? file.originalname : '';
    }
    else if (file.fieldname == 'imgPoster') {
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
    "SELECT phim.ID, DATE_FORMAT(phim.NgayKhoiChieu, '%d/%m/%Y') as 'NgayKhoiChieu', phim.TenPhim, phim.Hinh, phim.TrangThai, phim.ThoiGian FROM phim where phim.isDelete = '0'";
  conn.query(query, function (err, result) {
    soluongtrang = result.length / 5;
    let query = `SELECT phim.ID
                      , DATE_FORMAT(phim.NgayKhoiChieu, '%d/%m/%Y') as 'NgayKhoiChieu'
                      , DATE_FORMAT(phim.NgayKetThuc, '%d/%m/%Y') as 'NgayKetThuc'
                      , phim.TenPhim
                      , phim.Hinh
                      , phim.TrangThai
                      , phim.ThoiGian
                      , quocgia.TenQuocGia
                 FROM phim JOIN quocgia ON phim.ID_QuocGia = quocgia.ID 
                 WHERE phim.isDelete = '0' ORDER BY phim.NgayKhoiChieu DESC LIMIT ${vitribatdaulay}, 5`;
    conn.query(query, function (err, result) {
      if (err) {
        res.send(err);
      } else {
        let temptenphim = "";
        let mangkq = [];
        for (let i = 0; i < result.length; i++) {
          if (result[i].TenPhim !== temptenphim) {
            for (let j = i; j < result.length; j++) {
              if (result[j].TenPhim === result[i].TenPhim) {
                result[i].TenLoai += ", " + result[j].TenLoai;
              }
            }
            temptenphim = result[i].TenPhim;
            mangkq.push(result[i]);
          }
        }
        let queryTheLoaiPhim = `SELECT * FROM loaiphim`;
        conn.query(queryTheLoaiPhim, function(errTheLoaiPhim,resultTheLoaiPhim){
          if(errTheLoaiPhim){
            res.send(errTheLoaiPhim);
          } else{
            let queryCinema = `SELECT * FROM rapphim`;
            conn.query(queryCinema, function(errCinema, resultCinema){
              if(errCinema){
                res.send(errCinema);
              } else{
                let queryQuocGia = `SELECT * FROM quocgia`;
                conn.query(queryQuocGia, function(errQuocGia, resultQuocGia){
                  if(errQuocGia){
                    res.send(errQuocGia);
                  } else {
                    res.render("phim/danhsachphim", {
                      pagerespon: page,
                      dataphimchieu: mangkq,
                      datatheloai: resultTheLoaiPhim,
                      dataCinema: resultCinema,
                      dataQuocGia: resultQuocGia,
                      soluongtrang: Math.ceil(soluongtrang),
                    });
                  }
                })
              }
            })
          }
        })
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
                      , phim.MoTa
                      , DATE_FORMAT(phim.NgayKetThuc, '%d/%m/%Y') as 'NgayKetThuc'
                      , DATE_FORMAT(phim.NgayKhoiChieu, '%d/%m/%Y') as 'NgayKhoiChieu'
                      , loaiphim.ID 
                      , loaiphim.TenLoai
                      , nhacungcap.TenNhaCungCap
               FROM phim JOIN phim_loaiphim ON phim.ID = phim_loaiphim.ID_Phim 
                         JOIN loaiphim ON phim_loaiphim.Id_Loai = loaiphim.ID 
                         JOIN nhacungcap on nhacungcap.ID = phim.ID_NhaCungCap
               WHERE phim.ID = ?`;
  conn.query(query, [idphim], function (err, result) {
    if (err) {
      console.log(err);

      res.redirect("/phim/danhsachphim?page=1")
    } else {

      let temptenphim = "";
      let mangkq = [];

      for (let i = 0; i < result.length; i++) {
        if (result[i].TenPhim !== temptenphim) {

          for (let j = i; j < result.length; j++) {

            if (result[j].TenPhim == result[i].TenPhim) {
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

  if (req.query.mess && req.query.mess == 1) {
    messAddMovie = 'Thêm thành công'
  } else if (req.query.mess && req.query.mess == -1) {
    messAddMovie = 'Thêm thất bại'
  }

  conn.query(queryMovieType, function (errorMovieType, resultMovieTypes) {
    if (errorMovieType) {
      console.log(errorMovieType);

      return res.render("phim/themphimmoi", { movieTypes: [], cinemas: [], suppliers: [] });
    } else {
      let queryCinema = `SELECT rapphim.ID, rapphim.TenRap FROM rapphim;`;

      conn.query(queryCinema, function (errorCinema, resultCinemas) {
        if (errorCinema) {
          console.log(errorCinema);

          return res.render("phim/themphimmoi", { movieTypes: resultMovieTypes, cinemas: [], });
        } else {
          let querySupplier = `SELECT nhacungcap.ID, nhacungcap.TenNhaCungCap FROM nhacungcap WHERE nhacungcap.isDelete = 0`;

          conn.query(querySupplier, function (errorSupplier, resultSuppliers) {
            if (errorSupplier) {
              console.log(errorSupplier);

              return res.render("phim/themphimmoi", { movieTypes: resultMovieTypes, cinemas: resultCinemas, suppliers: [] });
            } else {
              
              let queryCountry = `SELECT quocgia.ID, quocgia.Iso ,quocgia.TenQuocGia FROM quocgia`;

              conn.query(queryCountry, function(errorCountry, resultCountry){
                  if(errorCountry){
                    console.log(errorCountry);

                    return res.render("phim/themphimmoi", { movieTypes: resultMovieTypes
                                                            , cinemas: resultCinemas
                                                            , suppliers: resultSuppliers
                                                            , messNotify: messAddMovie
                                                            , countrys: [] });
                  }else{
                    return res.render("phim/themphimmoi", { movieTypes: resultMovieTypes
                                                            , cinemas: resultCinemas
                                                            , suppliers: resultSuppliers
                                                            , messNotify: messAddMovie
                                                            , countrys: resultCountry });
                  }
              })

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
    let description = req.body.area2;
    let like = 0;
    let idCountry = req.body.dropdownCountry;

    let queryDuplicateNameMovie = `SELECT * FROM phim where phim.TenPhim = ? `;

    conn.query(queryDuplicateNameMovie, [movieName], function(errorDuplicateNameMovie, resultNameMovie){
        if(errorDuplicateNameMovie){
          console.log(errorDuplicateNameMovie);

          return res.json({statusCode: 0, message: 'Không thể kiểm tra trùng tên phim'})
        }else{
          if(resultNameMovie.length == 0){
            let sqlquery = `INSERT INTO phim VALUES(NULL,?,?,?,?,?,?,?,?,?,?,?,?, '0')`;

            conn.query(sqlquery, [movieName
                                , ''
                                , ''
                                , status
                                , time
                                , idTrailer
                                , description
                                , openDate
                                , like
                                , idSupplier
                                , endDate
                                , idCountry
                                ]
                                , function (err, resultNewMovie) {
                if (err) {
                  console.log(err);
        
                  // res.redirect('/phim/themphimmoi?mess=0')
                  return res.json({statusCode: 0, message: 'Thêm phim thất bại!'})
                } else {
                  let queryType = `INSERT INTO phim_loaiphim VALUES(?,?)`;
        
                  if(typeof(idMovieTypes) == 'string'){
                      conn.query(queryType, [resultNewMovie.insertId,idMovieTypes], function (errorMovieType) {
                        if (errorMovieType) {
                          console.log(errorMovieType);
        
                          // return res.redirect("/phim/themphimmoi?mess=-1");
                          return res.json({statusCode: 0, message: 'Thêm phim thất bại!'})
                        }
                      });
                  }else{
                    let countMovieType = idMovieTypes.length;
        
                    for (let i = 0; i < countMovieType; i++) {
                      conn.query(queryType, [resultNewMovie.insertId, idMovieTypes[i]], function (errorMovieType) {
                        if (errorMovieType) {
                          console.log(errorMovieType);
                          
                          // return res.redirect('/phim/themphimmoi?mess=-1')
                          return res.json({statusCode: 0, message: 'Thêm phim thất bại!'});
                        }
                      })
                    }
                  }
                    
                  let queryCinema = `INSERT INTO phim_rapphim VALUES(?,?)`;
        
                  if(typeof(idCinemas) == 'string'){
                  
                    conn.query(queryCinema, [idCinemas, resultNewMovie.insertId],function(errorMovie){
                      if(errorMovie){
                        console.log(errorMovie);
                        // return res.redirect('/phim/themphimmoi?mess=-1')
                        return res.json({statusCode: 0, message: 'Thêm phim thất bại!'});
                      }
                    })
                  }else{
                    let countCinema = idCinemas.length;
        
                    for (let i = 0; i < countCinema; i++) {
                      conn.query(queryCinema, [idCinemas[i], resultNewMovie.insertId], function (errorCinema) {
                        if (errorCinema) {
                          console.log(errorCinema);
                          // return res.redirect('/phim/themphimmoi?mess=-1')
                          return res.json({statusCode: 0, message: 'Thêm phim thất bại!'})
                        }
                      })
                    }
                  }

                  setTimeout(function(){
                    const message = {
                      data: {
                        body : `Cinemaplus vừa ra phim ${movieName}`,
                        title : "Thông báo",
                      },
                      topic: 'NewMovie'
                    };
              
                    admin.messaging().send(message)
                    .then((response) => {
                      console.log('Successfully sent message:', response);
                    })
                    .catch((error) => {
                      console.log('Error sending message:', error);
                    });
              
                   },1000);
                  

                  // res.redirect('/phim/themphimmoi?mess=1')
                  res.json({statusCode: 1, message: 'Thêm phim thành công!', newIdMovie: resultNewMovie.insertId})
                }
            });
         
          }else{
            return res.json({statusCode: 0, message: 'Tên phim bị trùng lặp'})
          }
        }
    });
});

let fileImageMovieUrlOld = '';
let fileImagePosterUrlOld = '';

router.get("/suaphim", function (req, res) {
  let idphim = req.query.idphim;
  let query = `SELECT phim.ID
                      , phim.TenPhim
                      , phim.Hinh
                      , phim.AnhBia
                      , phim.TrangThai
                      , phim.ThoiGian
                      , phim.Trailer
                      , phim.MoTa
                      , DATE_FORMAT(phim.NgayKhoiChieu, '%Y-%m-%d') as 'NgayKhoiChieu'
                      , DATE_FORMAT(phim.NgayKetThuc, '%Y-%m-%d') as 'NgayKetThuc'
                      , rapphim.TenRap
               FROM phim JOIN phim_rapphim on phim.ID = phim_rapphim.ID_Phim 
                         JOIN rapphim on phim_rapphim.ID_Rap = rapphim.ID
               WHERE phim.ID = ?`;
               
  conn.query(query, [idphim], function (err, result) {
    if (err) {
      console.log(err);
    } else {
    
      fileImageMovieUrlOld = result[0].Hinh;
      fileImagePosterUrlOld = result[0].AnhBia;

      let mess = '';

      if(req.query.mess && req.query.mess == 0 ){
         mess = 'Sửa thất bại'
      }else if(req.query.mess && req.query.mess == 1){
         mess = 'Sửa thành công'
      }

      let queryCinema = `SELECT rapphim.ID, rapphim.TenRap FROM rapphim;`;

      conn.query(queryCinema, function (errorCinema, resultCinemas) {
        if(errorCinema){
          console.log(errorCinema);

          res.render("phim/suaphim", { phim: result[0], messNotify: mess, cinemas: [] });
        }else{
         
          let nameMovie = '';
          let resultMovie = [];
          let countMovie = result.length;
          let cinemasOfMovie = [];

          for (let i = 0; i < countMovie; i++) {

            if (result[i].TenPhim != nameMovie) {
              for (let j = i; j < countMovie; j++) {
                if (result[i].TenPhim == result[j].TenPhim) {
                  cinemasOfMovie.push({
                    id: result[j].ID,
                    tenRap: result[j].TenRap
                  })
                }
              }

              nameMovie = result[i].TenPhim;
              result[i].cinemas = cinemasOfMovie;
              resultMovie.push(result[i]);
              cinemasOfMovie = [];
            }
          }
          res.render("phim/suaphim", { phim: resultMovie[0], messNotify: mess, cinemas: resultCinemas });
        }
      })
    }
  });
});

router.post("/suattphim", uploadImage, function (req, res) {
  let maphim = req.body.maphim;
  let tenphim = req.body.txttenphim;
  let ngaykhoichieu = req.body.txtngaykhoichieu;
  let endDate = req.body.txtNgayKetThuc;
  let trangthai = req.body.cboxtrangthai;
  let thoigian = req.body.txtthoigian;
  let idtrailer = req.body.txtIDtrailer;
  let mota = req.body.txtmota;
  let idCinemas = req.body.chbCinema && typeof req.body.chbCinema == 'string' ? [req.body.chbCinema] : req.body.chbCinema;

  let queryMovieCinema = `SELECT * FROM phim_rapphim WHERE phim_rapphim.ID_Phim = ?`;

  conn.query(queryMovieCinema, [maphim] ,function(errorMovieCinema, resultMovieCinema){
      if(errorMovieCinema){
        console.log(errorMovieCinema);
      }else{

        let newIdCinema;
        let countNewIdCinema = idCinemas.length;
        let countOldMovieCinema = resultMovieCinema.length;

        let oldIdCinema = resultMovieCinema.map(x=> x.ID_Rap);

        for(let i = 0; i < countNewIdCinema; i++){
            let resultCinemasFilter = oldIdCinema.includes(parseInt(idCinemas[i]));
            
            //ID Mới
            if(resultCinemasFilter == false){
                newIdCinema = idCinemas[i];

                if(countNewIdCinema > countOldMovieCinema){
                   let insertNewIdCinema = `INSERT INTO phim_rapphim VALUES(?,?)`;
                  
                   conn.query(insertNewIdCinema, [newIdCinema, maphim], function(errorInsertIdCinema){
                   
                    if(errorInsertIdCinema){
                        console.log(errorInsertIdCinema);

                        res.redirect(`/phim/suaphim?mess=0&idphim=${maphim}`);
                      }
                   });
                }else{
                  let updateIdCinema = `UPDATE phim_rapphim 
                                        SET phim_rapphim.ID_Rap = ?
                                        WHERE phim_rapphim.ID_Phim = ? AND phim_rapphim.ID_Rap = ?`;

                  conn.query(updateIdCinema, [newIdCinema, maphim, oldIdCinema[i]], function(errorUpdateIdCinema){
                      if(errorUpdateIdCinema){
                        console.log(errorUpdateIdCinema);

                        res.redirect(`/phim/suaphim?mess=0&idphim=${maphim}`);
                      }
                  });
                }
            }else{     
              if(countNewIdCinema < countOldMovieCinema){
               
                for(let j = 0 ; j < countOldMovieCinema; j++){
                    if(idCinemas.includes(oldIdCinema[j].toString()) == false){
                      
                      let deleteIdCinema = `DELETE FROM phim_rapphim 
                                            WHERE phim_rapphim.ID_Phim = ? AND phim_rapphim.ID_Rap = ?`;

                        conn.query(deleteIdCinema, [maphim, oldIdCinema[j]], function (errorDeleteIdCinema) {
                          if (errorDeleteIdCinema) {
                            console.log(errorDeleteIdCinema);

                            res.redirect(`/phim/suaphim?mess=0&idphim=${maphim}`);
                          }
                        })
                    }
                }
              }
            }
        }
      
        let sqlquery = `UPDATE phim
                        SET phim.TenPhim = ?
                          , phim.TrangThai = ?
                          , phim.ThoiGian = ?
                          , phim.Trailer = ?
                          , phim.NgayKhoiChieu = ?
                          , phim.NgayKetThuc = ?
                          , phim.MoTa = ?
                        WHERE phim.ID = ?`;
        conn.query(
          sqlquery,
          [tenphim, trangthai, thoigian, idtrailer, ngaykhoichieu, endDate, mota, maphim],
          function (err, result) {
            if (err) {
              console.log(err);

              // res.redirect(`/phim/suaphim?mess=0&idphim=${maphim}`);
              res.json({status: 0, message: 'Cập nhật phim thất bại'});
            } else {
              // res.redirect(`/phim/suaphim?mess=1&idphim=${maphim}`);
              res.json({status: 1, message: 'Cập nhật phim thành công'})
            }
          }
        );
      }

  })
});

router.put("/updateLinkImage", function(req, res){
    let idMovie = req.body.idMovie;
    let urlImage = req.body.urlImage;

    let queryUpdate = `UPDATE phim 
                       SET phim.Hinh = ?
                       Where phim.ID = ?;`;

    conn.query(queryUpdate, [urlImage,idMovie],function(errorUpdate){
        if(errorUpdate){
            console.log(errorUpdate);

            res.json({statusCode: 0, message: 'Cập nhật ảnh thất bại!'})
        }

        res.json({statusCode: 1, message: 'Cap nhat anh thanh cong!'})
    })                       
});

router.put("/updateLinkPost", function(req, res){
    let idMovie = req.body.idMovie;
    let urlPoster = req.body.urlPoster;
    let queryUpdate = `UPDATE phim
                        SET phim.AnhBia = ?
                        WHERE phim.ID = ?`;

    conn.query(queryUpdate, [urlPoster,idMovie],function(errorUpdate){
        if(errorUpdate){
          console.log(errorUpdate);

          res.json({statusCode: 0, message: 'Cập nhật ảnh bìa thất bại!'})
        }

        res.json({statusCode: 1, message: 'Cập nhật ảnh bìa thành công !'})
    })               
})

router.get("/searchmovie", function(req, res){
  let page = req.query.pageSelect ? req.query.pageSelect : 1;
  let keyWord = req.query.keyWord;
  let type = req.query.idType;
  let country = req.query.idCountry;
  let cinema = req.query.idCinema;

  let querySearch = `SELECT DISTINCT phim.ID
                                  , phim.TenPhim
                                  , phim.TrangThai
                                  , phim.Hinh
                                  , DATE_FORMAT(phim.NgayKhoiChieu, '%d/%m/%Y') as 'NgayKhoiChieu'
                                  , phim.ThoiGian
                      FROM phim JOIN phim_loaiphim on phim.ID = phim_loaiphim.ID_Phim 
                                JOIN loaiphim on loaiphim.ID = phim_loaiphim.ID_Loai
                                JOIN quocgia on quocgia.ID = phim.ID_QuocGia
                                JOIN phim_rapphim on phim_rapphim.ID_Phim = phim.ID
                                JOIN rapphim on rapphim.ID = phim_rapphim.ID_Rap
                      WHERE (match(phim.TenPhim) against(?) or phim.TenPhim LIKE ?) 
                              AND (rapphim.TenRap like ? 
                              AND loaiphim.TenLoai like ? 
                              AND quocgia.TenQuocGia like ?)
                      ORDER BY phim.TenPhim`;

  conn.query(querySearch, [keyWord, `${keyWord}%`, `${cinema}%`, `${type}%`, `${country}%`], function(error, resultSearchMovie){
      if(error){
        console.log(error);

        res.json({statusCode: 0, message: 'Tìm kiếm thất bại'});
      }else{
        let numberPage = resultSearchMovie.length / 5;
        let position = (page - 1) * 5;

        let queryMoviePagging = `SELECT DISTINCT phim.ID
                                               , phim.TenPhim
                                               , phim.TrangThai
                                               , phim.Hinh,DATE_FORMAT(phim.NgayKhoiChieu, '%d/%m/%Y') as 'NgayKhoiChieu'
                                               , phim.ThoiGian
                                               , DATE_FORMAT(phim.NgayKetThuc, '%d/%m/%Y') as 'NgayKetThuc'
                                               , phim.ThoiGian
                                               , quocgia.TenQuocGia
                                  FROM phim JOIN phim_loaiphim on phim.ID = phim_loaiphim.ID_Phim 
                                            JOIN loaiphim on loaiphim.ID = phim_loaiphim.ID_Loai
                                            JOIN quocgia on quocgia.ID = phim.ID_QuocGia
                                            JOIN phim_rapphim on phim_rapphim.ID_Phim = phim.ID
                                            JOIN rapphim on rapphim.ID = phim_rapphim.ID_Rap
                                  WHERE (match(phim.TenPhim) against(?) or phim.TenPhim LIKE ?) 
                                          AND (rapphim.TenRap like ? 
                                          AND loaiphim.TenLoai like ? 
                                          AND quocgia.TenQuocGia like ?) LIMIT ?, 5`;
          conn.query(queryMoviePagging,[keyWord, `${keyWord}%`, `${cinema}%`, `${type}%`, `${country}%`, position], function(errorMoviePagging, resultMoviePagging){
              if(errorMoviePagging){
                console.log(errorMoviePagging);

                res.json({statusCode: 0, message: 'Không lấy được phim trong trang hiện tại'});
              }else{
                
                res.json({statusCode: 1, message: 'Tìm kiếm thành công', resultMovie: resultMoviePagging, totalNumber: Math.ceil(numberPage), currentPage:page});
              }
          })
      }
  });                         
})

router.post("/xoaphim", function (req, res){
  let idMovie = req.body.idMovie;
  
  let query =`SELECT phim.ID, phim.TenPhim, phim.TrangThai, vedat.ID ,vedat.TrangThai
              FROM phim JOIN vedat ON phim.ID = vedat.ID_Phim
              WHERE phim.ID = ? and vedat.TrangThai ='Đã đặt'`
  
  conn.query(query, [idMovie], function (errContrainMovie, resultContrainMovie){
    if(errContrainMovie){
      console.log(errContrainMovie);
    } else {
        if(resultContrainMovie.length == 0){
          let queryUpdateStatus = `UPDATE phim
                                   SET phim.isDelete = 1
                                   Where phim.ID  = ?`;
          
          conn.query(queryUpdateStatus, [idMovie], function(errorUpdate){
            if(errorUpdate){
              console.log(errorUpdate);
                
              return res.json({statusCode: 0, message: 'Xóa phim thất bại'});
           }    
              res.json({statusCode: 1, message: 'Xóa phim thành công'});
          })
        } else {
          res.json({statusCode: 0, message: 'Xóa phim thất bại! Phim đang có suất chiếu'});
        }
    }
  })
})




module.exports = router;
