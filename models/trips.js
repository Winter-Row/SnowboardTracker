const mongoose = require('mongoose');

const schemaDefinition = {
    resortName:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now()
    },
    timeSpent:{
        type: Number
    },
    spendings:{
        type: Number
    }
}

var mongooseSchema = new mongoose.Schema(schemaDefinition);

module.exports = mongoose.model('Trip',mongooseSchema);