const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

//create schema for a user
const schemaDefinitionObj = {
    username: {
        type: String
    },
    password: {
        type: String
    },
    oauthId:{
        type: String
    },
    oauthProvider:{
        type: String
    },
    created: {
        type: Date
    }
}

var mongooseSchema = new mongoose.Schema(schemaDefinitionObj);
mongooseSchema.plugin(plm);
module.exports = mongoose.model('User',mongooseSchema);