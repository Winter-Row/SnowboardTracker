const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

//create schema for a user
const schemaDefinitionObj = {
    username: {
        type: String
    },
    password: {
        type: String
    }
}

var mongooseSchema = new mongoose.Schema(schemaDefinitionObj);
mongooseSchema.plugin(plm);
module.exports = mongoose.model('User',mongooseSchema);