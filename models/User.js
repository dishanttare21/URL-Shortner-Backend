const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        Max: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        Min: 6
    },
},
{timestamps: true}
)

module.exports = mongoose.model('User', UserSchema);