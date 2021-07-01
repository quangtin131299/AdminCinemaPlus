const express = require("express");
const format = require("date-format");
const conn = require("../db/connect");
const bodyParser = require("body-parser");
const {
  route
} = require("./phim");

const router = express.Router();
router.use(express.static("views"));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

let soluongtrang = 0;
router.get("/danhsachlichchieu", function (req, res) {
  let page = req.query.page;
  let vitribatdaulay = (page - 1) * 5;
  if (soluongtrang == 0) {
    let querysl = `SELECT lichchieu.ID
                          , DATE_FORMAT(lichchieu.Ngay, '%d/%m/%Y') as 'Ngay'
                          , rapphim.ID as 'IDRapPhim'
                          , rapphim.TenRap 
                   FROM lichchieu JOIN rapphim ON lichchieu.ID_Rap = rapphim.ID`;
    conn.query(querysl, function (err, resultsl) {
      if (err) {
        res.send(err);
      } else {
        soluongtrang = resultsl.length / 5;
      }
    });
  }
  let query = `SELECT lichchieu.ID
                      , DATE_FORMAT(lichchieu.Ngay, '%d/%m/%Y') as 'Ngay'
                      , rapphim.ID as 'IDRapPhim', rapphim.TenRap 
               FROM lichchieu JOIN rapphim ON lichchieu.ID_Rap = rapphim.ID 
               ORDER BY lichchieu.Ngay limit ${vitribatdaulay}, 5 `;
  conn.query(query, function (err, result) {
    res.render("lichchieu/danhsachlichchieu", {
      pagerespon: page,
      soluongtrang: Math.ceil(soluongtrang),
      danhsachlichchieu: result,
    });
  });
});

router.get("/chitietlichchieu", function (req, res) {
  let idrap = req.query.idrap;
  let firstDate = req.query.fristDate;
  let lastDate = req.query.lastDate;
  let sqlquery = `SELECT DATE_FORMAT(lichchieu.Ngay, '%Y-%m-%d') as 'Ngay'
                         , suatchieu.gio
                         , phim.TenPhim
                         , phong.TenPhong
                         ,phim.ThoiGian
                  FROM lichchieu JOIN phim_lichchieu on lichchieu.ID = phim_lichchieu.ID_Lichchieu
                                 JOIN suatchieu on phim_lichchieu.ID_Suatchieu = suatchieu.ID
                                 JOIN rapphim on rapphim.ID = lichchieu.ID_Rap
                                 JOIN phim on phim.ID = phim_lichchieu.ID_Phim
                                 JOIN phim_phong_xuat on phim_phong_xuat.ID_Phim = phim.ID
                                 JOIN phong on phong.ID = phim_phong_xuat.ID_Phong AND suatchieu.ID = phim_phong_xuat.ID_XuatChieu
                  WHERE rapphim.ID = ? and (lichchieu.Ngay between ? and ?) AND (phim_phong_xuat.Ngay between ? and ?)`;

  conn.query(sqlquery, [idrap, firstDate, lastDate, firstDate, lastDate], function (err, result) {
    if (err) {
      console.log(err);
    } else {
      let arrShowTime = [];
      let arrrs = [];
      let date = '';
      let namemovie = "";

      if (result.length == 1) {

        arrShowTime.push({
          idsuat: result[0].ID,
          gio: result[0].Gio
        });

        arrrs.push(result[0]);

        arrrs[0].suatchieu = arrShowTime;

      } else {
        console.log(result);
        for (let k = 0; k < result.length; k++) {
          let schedule = result[k];
        
          if (schedule.Ngay != date) {
            
            schedule.phims = [];
            //Phim trong ngày
            for (let i = k ; i < result.length; i++) {
              if (result[i].TenPhim != namemovie && result[i].Ngay == schedule.Ngay) {
                // Suất chiếu của một phim trong một ngày
                for (let j = i; j < result.length; j++) {
                  if (result[i].TenPhim == result[j].TenPhim && result[j].Ngay == schedule.Ngay) {
                    arrShowTime.push({
                      tenphong: result[j].TenPhong,
                      idsuat: result[j].IdSuatChieu,
                      gio: result[j].gio,
                    });

                  }
                }
                  
                schedule.phims.push({
                    tenPhim: result[i].TenPhim,
                    suatchieus: arrShowTime
                })

                namemovie = result[i].TenPhim;
                
                arrShowTime = [];
              }
              
            }

            namemovie = '';
            let checkDateExist = arrrs.filter(x => x.Ngay == schedule.Ngay);
            if(checkDateExist.length == 0){
              arrrs.push(schedule);
            }
           
            date = schedule.Ngay;
            
          }      
        }
      }
      res.json(arrrs);
    }
  });
});

router.get("/themlichchieu", function (req, res) {
  let queryphim = "select * from phim where phim.TrangThai = N'Đang chiếu'";
  conn.query(queryphim, function (err, resultphim) {
    if (err) {
      console.log(err);
    } else {
      let queryrap = "select* from rapphim";
      conn.query(queryrap, function (err, resultrap) {
        if (err) {
          console.log(err);
        } else {
          res.render("lichchieu/themlichchieu", {
            danhsachphimdangchieu: resultphim,
            danhsachrap: resultrap,
          });
        }
      });
    }
  });
});

router.post("/xeplich", function (req, res) {
  let idrapphim = req.body.idcinema;
  let ngay = req.body.date;
  let gio = req.body.showtime;
  let idphong = req.body.idroom;
  let idphim = req.body.idmovie;

  let sqlquerytemplichcchieu = `SELECT * FROM lichchieu WHERE lichchieu.Ngay = ? AND lichchieu.ID_Rap = ?`;

  conn.query(sqlquerytemplichcchieu, [ngay, idrapphim], function (err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result.length == 0) {
        let querylichchieu = `INSERT INTO lichchieu VALUES (NULL, ?, ?)`;

        conn.query(querylichchieu, [ngay, idrapphim], function (err, resultlichchieu) {
          if (err) {
            console.log(err);
          } else {
            let querysuatchieu = `INSERT INTO suatchieu VALUES (NULL, ?)`;

            conn.query(querysuatchieu, [gio], function (err, reultsuatchieu) {
              if (err) {
                console.log(err);
              } else {
                let queryphimphongsuat = `INSERT INTO phim_phong_xuat VALUES(?,?,?,?)`;

                conn.query(
                  queryphimphongsuat,
                  [idphim, idphong, reultsuatchieu.insertId, ngay],
                  function (err) {
                    if (err) {
                      console.log(err);
                    }
                  }
                );

                let queryphonglichchieu = `INSERT INTO phim_lichchieu VALUES(?,?,?)`;

                conn.query(
                  queryphonglichchieu,
                  [idphim, resultlichchieu.insertId, reultsuatchieu.insertId],
                  function (err) {
                    if (err) {
                      console.log(err);
                    } else {

                      res.json({
                        message: 'Thêm lịch chiếu thành công.',
                        statusCode: 1
                      })
                    }
                  }
                );
              }
            });
          }
        });
      } else {

        let querysuatchieu = `INSERT INTO suatchieu VALUES (NULL, ?)`;

        conn.query(querysuatchieu, [gio], function (err, reultsuatchieu) {
          if (err) {
            console.log(err);
          } else {
            let queryphimphongsuat = `INSERT INTO phim_phong_xuat VALUES(?,?,?,?)`;

            conn.query(
              queryphimphongsuat,
              [idphim, idphong, reultsuatchieu.insertId, ngay],
              function (err) {
                if (err) {
                  console.log(err);
                }
              }
            );

            let queryphonglichchieu = `INSERT INTO phim_lichchieu VALUES(?,?,?)`;

            conn.query(
              queryphonglichchieu,
              [idphim, result[0].ID, reultsuatchieu.insertId],
              function (err) {
                if (err) {
                  console.log(err);
                } else {
                  console.log('thành công');
                  // res.redirect("/lichchieu/danhsachlichchieu?page=1");

                  res.json({
                    message: 'Thêm lịch chiếu thành công.',
                    statusCode: 1
                  })
                }
              }
            );
          }
        });

      }
    }
  });
});

router.get("/loadphongtheorap", function (req, res) {
  let idrap = req.query.idrap;
  let query = `SELECT phong.ID as 'ID_Phong', phong.TenPhong 
               FROM phong JOIN rapphim ON phong.ID_Rap = rapphim.ID 
               WHERE rapphim.ID = ${idrap}`;
  conn.query(query, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.send({
        dataphong: result
      });
    }
  });
});

router.get("/xeplichV2", function (req, res) {
  let queryrap = "select* from rapphim";
  conn.query(queryrap, function (err, resultrap) {
    if (err) {
      console.log(err);
    } else {
      res.render("lichchieu/xeplichv2", {
        danhsachrap: resultrap,
      });
    }
  });
})

router.get("/getMovieOfCinema", function (req, res) {
  let idCinema = req.query.id;

  let queryMovie = `SELECT phim.ID, phim.TenPhim, phim.ThoiGian
                    FROM phim JOIN phim_rapphim ON phim_rapphim.ID_Phim = phim.ID 
                              JOIN rapphim on phim_rapphim.ID_Rap = rapphim.ID
                    WHERE rapphim.ID = ?`

  conn.query(queryMovie, [idCinema], function (errMovie, resultMovie) {
    if (errMovie) {
      console.log(errMovie);

      res.json([])
    } else {
      res.json(resultMovie);
    }
  })
})

router.get("/getRoomOfCinema", function (req, res) {
  let idCinema = req.query.id;

  let queryRoom = `SELECT phong.ID, phong.TenPhong
                   FROM phong JOIN rapphim ON phong.ID_Rap = rapphim.ID 
                   WHERE rapphim.ID = ?`

  conn.query(queryRoom, [idCinema], function (errorRoom, resultRooms) {
    if (errorRoom) {
      console.log(errorRoom);

      res.json([])
    } else {
      res.json(resultRooms);
    }
  })
})

module.exports = router;
