var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ToiletSchema = new Schema({
    status: Number,
    timestamp: Date
    /*
     * ステータス一覧
     * 0: 満室
     * 1: 空室
     */
});

module.exports = mongoose.model('Toilet', ToiletSchema);
