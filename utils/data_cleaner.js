console.log('Hi Postman !!')
const axios = require('axios');
const mongoose = require('mongoose')
const path = require('path')
const ApiSchema = require('../models/api_schema')
const express = require('express')
    // const ExpressError = require('./utils/ExpressErrors')
    // const axiosAuthRefresh = require('axios-auth-refresh')



const dbUrl = 'mongodb://mongohost:27017/post-man-crawl'

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Mongo Connection Opened !!')
    })
    .catch(err => {
        console.log("Mongo Connection ERROR !!")
    })


const seedDB = async() => {
    await ApiSchema.deleteMany({})
}

seedDB().then(() => {
        mongoose.connection.close()
    })
    .catch(() => {
        console.log('Cannot close database!')
    })