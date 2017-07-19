var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('../app/models/user');
var Equipment = require('../app/models/equipment');

var RequestSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    equipment: {
        type: Schema.Types.ObjectId,
        ref: 'Equipment'
    },
    quantity: Number,
    remarks: String,
    url: String,
    timestamp: Date,
    status: Number
    /*
     * ステータス一覧
     * 1: 依頼
     * 2: 発注
     * 3: 完了
     * 4: 却下
     * 0: 論理削除
     */
});

module.exports = mongoose.model('Request', RequestSchema);
