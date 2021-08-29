const mongoose = require('mongoose')
const Schema = mongoose.Schema


const apiSchema = new Schema({
    API: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: false
    },
    Auth: {
        type: String,
        required: false
    },
    HTTPS: {
        type: Boolean,
        required: false
    },
    CORS: {
        type: String,
        required: false
    },
    Link: {
        type: String,
        required: true
    },
    Category: {
        type: String,
        required: true
    }

})

const API = mongoose.model('API', apiSchema)
module.exports = API