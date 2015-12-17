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
  rmStock: rmStock
};


function rmStock(stock, cb) {
  obj.Stock.findOneAndRemove({
    name: stock
  }, cb);
}

function newStock(stock, cb) {

  var stock = new obj.Stock({
    name: stock
  })
  stock.save(cb);
}


var dbUrl = process.env.dbUrl;
//mongo
mongoose.connect(dbUrl);

module.exports = obj;