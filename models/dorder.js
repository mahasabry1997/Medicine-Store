const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dorderSchema = new Schema({
  created : {
    type:Date , default: Date.now
  },
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true },
      address: {type : String , required: true},
      mobile: {type : String , required: true},
    }
  ],
  user: {
    email: {
      type: String,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }  ,
  },
  created : {
    type:Date , default: Date.now
  }
});

module.exports = mongoose.model('Order', dorderSchema);
