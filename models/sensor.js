const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sensorSchema = new Schema({
  created : {
    type:Date , default: Date.now
  },
  value: Object
});

module.exports = mongoose.model('Sensor', sensorSchema);
