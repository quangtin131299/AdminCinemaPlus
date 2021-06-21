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
    let querysl = `SELECT lichchieu.ID, DATE_FORMAT(lichchieu.Ngay, '%d/%m/%Y') as 'Ngay', rapphim.ID as 'IDRapPhim', rapphim.TenRap FROM lichchieu JOIN rapphim ON lichchieu.ID_Rap = rapphim.ID`;
    conn.query(querysl, function (err, resultsl) {
      if (err) {
        res.send(err);
      } else {
        soluongtrang = resultsl.length / 5;
      }
    });
  }
  let query = `SELECT lichchieu.ID, DATE_FORMAT(lichchieu.Ngay, '%d/%m/%Y') as 'Ngay', rapphim.ID as 'IDRapPhim', rapphim.TenRap FROM lichchieu JOIN rapphim ON lichchieu.ID_Rap = rapphim.ID ORDER BY lichchieu.Ngay limit ${vitribatdaulay}, 5 `;
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
  let ngay = req.query.ngay;
  let arr = ngay.split("/");
  let ngayresult = arr[2] + "-" + arr[1] + "-" + arr[0];
  let sqlquery = `SELECT phim.Hinh,suatchieu.ID as 'IdSuatChieu', suatchieu.Gio, phim.TenPhim, phim.ID from phim_phong_xuat JOIN suatchieu ON phim_phong_xuat.ID_XuatChieu = suatchieu.ID JOIN lichchieu on lichchieu.ID = suatchieu.ID_LichChieu JOIN rapphim on rapphim.ID = lichchieu.ID_Rap JOIN phim ON phim_phong_xuat.ID_Phim = phim.ID WHERE rapphim.ID = ${idrap} AND lichchieu.Ngay = '${ngayresult}' AND phim_phong_xuat.Ngay = '${ngayresult}'`;
  conn.query(sqlquery, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      let arrtemp = [];
      let arrrs = [];
      let namemovie = "";
      if (result.length == 1) {
        arrtemp.push({
          idsuat: result[0].ID,
          gio: result[0].Gio
        });
        arrrs.push(result[0]);
        arrrs[0].suatchieu = arrtemp;
        console.log(arrrs);
      } else {
        for (let i = 0; i < result.length; i++) {
          let temp = result[i];
          if (temp.TenPhim != namemovie) {
            for (let j = i + 1; j < result.length; j++) {
              if (temp.TenPhim == result[j].TenPhim) {
                arrtemp.push({
                  idsuat: result[j].IdSuatChieu,
                  gio: result[j].Gio,
                });
              }
            }
            arrtemp.unshift({
              idsuat: temp.IdSuatChieu,
              gio: temp.Gio
            });
            temp.suatchieu = arrtemp;
            namemovie = temp.TenPhim;
            arrrs.push(temp);
            arrtemp = [];
          }
        }
      }
      res.render("lichchieu/chitietlichchieu", {
        danhsachphimsuat: arrrs
      });
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
  let idrapphim = req.body.rdorap;
  let ngay = req.body.txtngaylichchieu;
  // let gio = req.body.txtsuatchieu;
  // let idphong = req.body.rdophong;
  // let idphim = req.body.rdophim;
  let arraythoigian = Array.from(req.body.datathoigian);
  let slthoigian = arraythoigian.length;
  let sqlquerytemplichcchieu = `SELECT * FROM lichchieu WHERE lichchieu.Ngay = '${ngay}'`;
  conn.query(sqlquerytemplichcchieu, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result.length == 0) {
        let querylichchieu = `INSERT INTO lichchieu VALUES (NULL, '${ngay}', '${idrapphim}')`;
        conn.query(querylichchieu, function (err, resultlichchieu) {
          if (err) {
            console.log(err);
          } else {
            for (let i = 0; i < slthoigian; i++) {
              let querysuatchieu = `INSERT INTO suatchieu VALUES (NULL, '${arraythoigian[i].thoigian}', '${resultlichchieu.insertId}')`;
              conn.query(querysuatchieu, function (err, reultsuatchieu) {
                if (err) {
                  console.log(err);
                } else {
                  let queryphimphongsuat = `INSERT INTO phim_phong_xuat VALUES('${arraythoigian[i].idphim}','${arraythoigian[i].idphong}','${reultsuatchieu.insertId}','${ngay}')`;
                  conn.query(
                    queryphimphongsuat,
                    function (err, resultphimphongxuat) {
                      if (err) {
                        console.log(err);
                      } else {
                        let queryphonglichchieu = `INSERT INTO phim_lichchieu VALUES('${rraythoigian[i].idphong}','${resultlichchieu.insertId}','${gio}')`;
                        conn.query(
                          queryphonglichchieu,
                          function (err, resultphimlichchieu) {
                            if (err) {
                              console.log(err);
                            } else {
                              // console.log("Thành công");
                              res.redirect("/lichchieu/danhsachlichchieu?page=1");
                            }
                          }
                        );
                      }
                    }
                  );
                }
              });
            }
          }
        });
      } else {
        for (let i = 0; i < slthoigian; i++) {
          let querysuatchieu = `INSERT INTO suatchieu VALUES (NULL, '${arraythoigian[i].thoigian}', '62')`;
          conn.query(querysuatchieu, function (err, reultsuatchieu) {
            if (err) {
              console.log(err);
            } else {
              let queryphimphongsuat = `INSERT INTO phim_phong_xuat VALUES('${arraythoigian[i].idphim}','${arraythoigian[i].idphong}','${reultsuatchieu.insertId}','${ngay}')`;
              conn.query(
                queryphimphongsuat,
                function (err, resultphimphongxuat) {
                  if (err) {
                    console.log(err);
                  } else {
                    let queryphonglichchieu = `INSERT INTO phim_lichchieu VALUES('${arraythoigian[i].idphim}','62','${arraythoigian[i].thoigian}')`;
                    conn.query(
                      queryphonglichchieu,
                      function (err, resultphimlichchieu) {
                        if (err) {
                          console.log(err);
                        } else {
                          console.log("Thành công");
                          // res.redirect("/lichchieu/danhsachlichchieu?page=1");
                        }
                      }
                    );
                  }
                }
              );
            }
          });
        }
      }
    }
  });
});

router.get("/loadphongtheorap", function (req, res) {
  let idrap = req.query.idrap;
  let query = `SELECT phong.ID as 'ID_Phong', phong.TenPhong FROM phong JOIN rapphim ON phong.ID_Rap = rapphim.ID WHERE rapphim.ID = ${idrap}`;
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
  
  let queryMovie = `select * 
                    from phim JOIN phim_rapphim ON phim_rapphim.ID_Phim = phim.ID 
                              JOIN rapphim on phim_rapphim.ID_Rap = rapphim.ID
                    where phim.TrangThai = N'Đang chiếu' and phim.TrangThai = N'Sắp chiếu' and rapphim.ID = ?`

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

  let queryRoom = `SELECT *
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
