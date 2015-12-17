var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var stockSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  }
  
});

var obj = {
  Stock: mongoose.model('stocks', stockSchema),
  newStock: newStock,
  getStock: getStock,
  rmStock: rmStock
};


function getStock(query, cb) {
  obj.Stock.aggregate({
      $group: {
        _id:"$name" 
      }
  });
  
}


function rmStock(query, cb) {
  obj.Stock.findOneRemove({
    name: query.name
  }, cb);
}

function newStock(query, cb) {

  var stock = new obj.Stock({
    name: query.name
  })
  stock.save(cb);
}


var dbUrl = process.env.dbUrl;
//mongo
mongoose.connect(dbUrl);

module.exports = obj;