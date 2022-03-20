const mongoose = require('mongoose');
const shortid = require('shortid');

const urlSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    longUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true,
        default: shortid.generate
    },
    date:{
        type: String,
        default: Date.now()
    },
    urlDescription: {
        type: String
    },
    clicks: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Url', urlSchema);