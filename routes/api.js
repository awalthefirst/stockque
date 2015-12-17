var mongo = require("mongoose")
var express = require('express');
var router = express.Router();

/*Get data.*/
router.get('/', function (req, res, next) {

 var db = mongo.model('stocks');
 db.aggregate({
  $group: {
   _id: "$name"
  }
 }, function (err, data) {
  if (err) {
   next();
  } else {
   var arr = [];
   data.forEach(function (ele) {
    arr.push(ele._id)
   });
  res.json(arr);
  }
  
 })

});

module.exports = router;
