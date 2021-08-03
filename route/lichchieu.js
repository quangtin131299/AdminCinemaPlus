const express = require("express");
const format = require("date-format");
const moment = require('moment');
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


router.get("/danhsachlichchieu", function (req, res) {
  let queryCinema = `SELECT rapphim.ID , rapphim.TenRap, phong.ID as 'ID_Phong', phong.TenPhong 
                     FROM rapphim JOIN phong ON rapphim.ID = phong.ID_Rap`;

  conn.query(queryCinema, function(error, resultCinema){
      if(error){
        console.log(error);

        res.render("lichchieu/danhsachlichchieu", {cinemas: []});
      }else{
        let resultCinemaRoom = [];
        let arrayRoom = [];
        let cinemaName = '';
        let countCinema = resultCinema.length;

        for (let i = 0; i < countCinema; i++) {

          if(resultCinema[i].TenRap != cinemaName){
            for(let j = i; j < countCinema; j++){
              if(resultCinema[i].TenRap ==  resultCinema[j].TenRap){
                arrayRoom.push({
                  id: resultCinema[j].ID_Phong,
                  nameRoom: resultCinema[j].TenPhong,
                  movies:[]
                })
              }
            }
            
            resultCinemaRoom.push({
              idCinema: resultCinema[i].ID,
              nameCinema: resultCinema[i].TenRap,
              rooms: arrayRoom
            })

            cinemaName = resultCinema[i].TenRap;
            arrayRoom = [];
          }
        }

        let queryScheduleAllCinema = `SELECT DATE_FORMAT(lichchieu.Ngay, '%Y-%m-%d') as 'Ngay'
                                              , suatchieu.gio
                                              , phim.TenPhim
                                              , phong.ID as 'ID_Phong'
                                              , phong.TenPhong
                                              , phim.ThoiGian
                                              , rapphim.ID
                                              , rapphim.TenRap
                                      FROM lichchieu JOIN phim_lichchieu on lichchieu.ID = phim_lichchieu.ID_Lichchieu
                                                      JOIN suatchieu on phim_lichchieu.ID_Suatchieu = suatchieu.ID
                                                      JOIN rapphim on rapphim.ID = lichchieu.ID_Rap
                                                      JOIN phim on phim.ID = phim_lichchieu.ID_Phim
                                                      JOIN phim_phong_xuat on phim_phong_xuat.ID_Phim = phim.ID
                                                      JOIN phong on phong.ID = phim_phong_xuat.ID_Phong AND suatchieu.ID = phim_phong_xuat.ID_XuatChieu
                                      WHERE lichchieu.Ngay = ?`;//2021-07-10

        conn.query(queryScheduleAllCinema, [getCurrentDate()],function (error, resultSchedultCinema){
          if(error){
            console.log(error);

            res.render("lichchieu/danhsachlichchieu", {cinemas: []});
          }else{

              let movies = [];
              let showTimeOfmovie = [];
              let countCinemaResult = resultCinemaRoom.length;
              let countSchedultCinema = resultSchedultCinema.length;
            if (countSchedultCinema != 0 && countCinemaResult != 0) {
              let nameMovieApproved = '';
              //Rap
              for (let k = 0; k < countCinemaResult; k++) {

                resultCinemaRoom[k].date = resultSchedultCinema[0].Ngay;
                let countRoom = resultCinemaRoom[k].rooms.length;
                //Phong
                for (let i = 0; i < countRoom; i++) {
                  // resultCinemaRoom[k].rooms[i].movies = [];
                  //phim
                  for (let j = 0; j < countSchedultCinema; j++) {

                    if (resultSchedultCinema[j].TenPhim != nameMovieApproved
                      && resultSchedultCinema[j].ID_Phong == resultCinemaRoom[k].rooms[i].id
                      && resultSchedultCinema[j].TenRap == resultCinemaRoom[k].nameCinema) {

                      for (let z = j; z < countSchedultCinema; z++) {
                        if (resultSchedultCinema[j].TenPhim == resultSchedultCinema[z].TenPhim
                          && resultSchedultCinema[z].ID_Phong == resultCinemaRoom[k].rooms[i].id
                          && resultSchedultCinema[z].TenRap == resultCinemaRoom[k].nameCinema) {
                          showTimeOfmovie.push({
                            showtime: resultSchedultCinema[z].gio
                          })
                        }
                      }

                      movies.push({
                        nameMovie: resultSchedultCinema[j].TenPhim,
                        duration: resultSchedultCinema[j].ThoiGian,
                        showTime: showTimeOfmovie
                      })

                      nameMovieApproved = resultSchedultCinema[j].TenPhim;
                      showTimeOfmovie = [];
                    }

                  }
                  resultCinemaRoom[k].rooms[i].movies = movies;
                  movies = [];

                }

              }
            }
                  
              res.render("lichchieu/danhsachlichchieu", {cinemas: resultCinemaRoom});
          }

        })
        
        
      }
  })
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
                  WHERE rapphim.ID = ?` ;

  conn.query(sqlquery, [idrap], function (err, result) {
    if (err) {
      console.log(err);
    } else {
      let arrShowTime = [];
      let arrrs = [];
      let date = '';
      let namemovie = "";
        
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
  let endDateSchedule = req.body.endDateSchedule;

  let queryTime = `SELECT DATE_FORMAT(phim_phong_xuat.Ngay, '%Y-%m-%d') as 'Ngay', phim.ThoiGian, suatchieu.Gio 
                   FROM phim_phong_xuat JOIN suatchieu ON phim_phong_xuat.ID_XuatChieu = suatchieu.ID 
                                        JOIN phim ON phim_phong_xuat.ID_Phim = phim.ID
                   WHERE phim_phong_xuat.ID_Phong = ? 
                         AND phim_phong_xuat.Ngay BETWEEN ? and  ?`;

  conn.query(queryTime, [idphong, ngay, endDateSchedule], function (error, result) {
    if (error) {
      console.log(error);
    } else {
      let partialNewShowTime = gio.split(':');
      let newShowTime = moment();
      newShowTime.hour(parseInt(partialNewShowTime[0]));
      newShowTime.minute(parseInt(partialNewShowTime[1]));

      if (result.length != 0) {
        let countDetailRoom = result.length;

        for (let i = 0; i < countDetailRoom; i++) {
          let parialTimeOfRoom = result[i].Gio.split(':');
          let endTimeOfRoom = moment();

          endTimeOfRoom.hour(parseInt(parialTimeOfRoom[0]));
          endTimeOfRoom.minute(parseInt(parialTimeOfRoom[1]) + result[i].ThoiGian);

          if (newShowTime.isAfter(endTimeOfRoom) == true) {
            let duration = moment.duration(newShowTime.diff(endTimeOfRoom))
            let hours = duration.hours();
            let minute = duration.minutes();

            if (hours == 0 && minute < 30) {
              return res.json({
                message: 'Thời gian cách thời gian kết thúc là 30 phút',
                statusCode: 0
              });
            }
          } else {
            return res.json({
              message: 'Suất chiếu bị trùng',
              statusCode: 0
            });
          }
        }
      }

      new Promise(function(resolve, reject){
        let endDate = new Date(endDateSchedule);

        for (let date = new Date(ngay); date.getTime() <= endDate.getTime(); date.setDate(date.getDate() + 1)) {
          let yearIndex = date.getFullYear();
          let monthIndex = date.getMonth() + 1;
          let dateIndex = date.getDate();

          let resultDateIndex = `${yearIndex.toString()}-${monthIndex.toString().padStart(2, '0')}-${dateIndex.toString().padStart(2, '0')}`;

          let sqlquerytemplichcchieu = `SELECT * FROM lichchieu WHERE lichchieu.Ngay = ? AND lichchieu.ID_Rap = ?`;

          conn.query(sqlquerytemplichcchieu, [resultDateIndex, idrapphim], function (err, result) {
            if (err) {
              console.log(err);
            } else {
              if (result.length == 0) {
                let querylichchieu = `INSERT INTO lichchieu VALUES (NULL, ?, ?)`;

                conn.query(querylichchieu, [resultDateIndex, idrapphim], function (err, resultlichchieu) {
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
                          [idphim, idphong, reultsuatchieu.insertId, resultDateIndex],
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

                              // res.json({
                              //   message: 'Thêm lịch chiếu thành công.',
                              //   statusCode: 1
                              // })
                              resolve(true);
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
                      [idphim, idphong, reultsuatchieu.insertId, resultDateIndex],
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

                          // res.json({
                          //   message: 'Thêm lịch chiếu thành công.',
                          //   statusCode: 1
                          // })

                          resolve(true);

                        }
                      }
                    );
                  }
                });

              }
            }
          });

        }

      }).then(function(result){

        res.json({
          message: 'Thêm lịch chiếu thành công',
          statusCode: 1
        })
        
      }).catch(function(){
        res.json({
          message: 'Thêm lịch chiếu thất bại',
          statusCode: 0
        })
      })
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
  let idCinema = req.query.idCinema;
  let queryCinema;

  if(idCinema){
    queryCinema =`SELECT * FROM rapphim WHERE rapphim.ID = ${idCinema}`;
  }else{
    queryCinema =`SELECT * FROM rapphim`;
  }

  conn.query(queryCinema, function (err, resultrap) {
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

  let queryMovie = `SELECT phim.ID, phim.TenPhim, phim.ThoiGian, DATE_FORMAT(phim.NgayKhoiChieu, '%Y-%m-%d') as 'NgayKhoiChieu',  DATE_FORMAT(phim.NgayKetThuc, '%Y-%m-%d') as 'NgayKetThuc'
                    FROM phim JOIN phim_rapphim ON phim_rapphim.ID_Phim = phim.ID 
                              JOIN rapphim on phim_rapphim.ID_Rap = rapphim.ID
                    WHERE rapphim.ID = ? AND (phim.TrangThai = 'Đang chiếu' OR phim.TrangThai = 'Sắp chiếu') AND phim.isDelete = '0'`

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

function getCurrentDate(){
    let currentDate = new Date();

    let day = currentDate.getDate().toString().padStart(2,'0');
    let moth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    let year = currentDate.getFullYear();

    return `${year}-${moth}-${day}`;
}

module.exports = router;
