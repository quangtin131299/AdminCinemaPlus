const express = require("express");
const conn = require("../db/connect");
const bodyParser = require("body-parser");
const moment = require('moment');
const router = express.Router();
router.use(express.static("views"));


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/hienthisoatve", function (req, res) {
  res.render("soatve/hienthisoatve");
})

router.post("/updateStatus", function (req, res) {
  let id = req.body.id;

  let queryBill = `SELECT DATE_FORMAT(NgayDat, '%Y-%m-%d') as 'NgayDat' , Gio 
                   FROM hoadon JOIN vedat ON hoadon.ID = vedat.ID_HoaDon
                               JOIN suatchieu ON vedat.Id_Suat = suatchieu.ID
                   WHERE hoadon.ID = ?`;

  conn.query(queryBill, [id], function (error, resultBill) {
    if (error) {
      console.log(error);

      return res.json({ message: 'Lỗi kết nối !', statusCode: 0 });
    } else {
      let partialDateBooking = resultBill[0].NgayDat.split('-');
      let showTime = resultBill[0].Gio.split(':');
      let currentDate = new Date();
      let dateBooking = new Date();

      dateBooking.setDate(partialDateBooking[2]);
      dateBooking.setMonth(parseInt(partialDateBooking[1]) - 1);
      dateBooking.setFullYear(partialDateBooking[0]);

      if (currentDate.getTime() === dateBooking.getTime()) {
        let dateBookingMoment = moment({ hour: showTime[0], minute: showTime[1] })
        let currentDateMoment = moment({ hour: currentDate.getHours(), minute: currentDate.getMinutes() })
        let hour = Math.abs(parseInt(moment.duration(dateBookingMoment.diff(currentDateMoment)).hours()));
        let minute = Math.abs(parseInt(moment.duration(dateBookingMoment.diff(currentDateMoment)).minutes()));


        if (currentDateMoment.isBefore(dateBookingMoment) == true) {
          if (hour == 0 && minute <= 15) {
            let sqlquery = `UPDATE vedat JOIN hoadon on vedat.ID_HoaDon = hoadon.ID
                    SET vedat.TrangThai = 'Đã nhận vé'
                    WHERE hoadon.ID = ?`;
            conn.query(
              sqlquery, [id], function (err, result) {
                if (err) {
                  console.log(err);

                  return res.json({ message: 'Soát vé thất bại', statusCode: 0 });
                } else {
                  return res.json({ message: 'Soát vé thành công', statusCode: 1 });
                }
              }
            );
            // return res.json({ message: 'Soát vé thành công', statusCode: 1 });
          } else {
            return res.json({ message: 'Phim chưa mở soát vé', statusCode: 0 });
          }
        } else if (currentDateMoment.isAfter(dateBookingMoment) == true) {
          if (hour == 0 && minute <= 30) {
            let sqlquery = `UPDATE vedat JOIN hoadon on vedat.ID_HoaDon = hoadon.ID
                    SET vedat.TrangThai = 'Đã nhận vé'
                    WHERE hoadon.ID = ?`;
            conn.query(
              sqlquery, [id], function (err, result) {
                if (err) {
                  console.log(err);

                  return res.json({ message: 'Soát vé thất bại', statusCode: 0 });
                } else {
                  return res.json({ message: 'Soát vé thành công', statusCode: 1 });
                }
              }
            );
          } else {
            return res.json({ message: 'Trễ giờ chiếu', statusCode: 0 });
          }
        } else {
          return res.json({ message: 'Trễ giờ chiếu', statusCode: 0 });
        }

        // return res.json({ message: 'Phim chưa mở soát vé', statusCode: 0 });

      } else {
        return res.json({ message: 'Phim chưa mở soát vé', statusCode: 0 });
      }
    }
  })
})

module.exports = router