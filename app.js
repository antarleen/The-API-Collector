const axios = require('axios');
const mongoose = require('mongoose')
const ApiSchema = require('./models/api_schema')
const express = require('express')
const session = require('express-session')
const app = express()

const sessionOptions = { secret: 'Postman Pat', saveUninitialized: false, resave: false }
app.use(session(sessionOptions))
app.use(express.json())




const dbUrl = 'mongodb://mongohost:27017/post-man-crawl'

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Mongo Connection Opened !!')
    })
    .catch(err => {
        console.log("Mongo Connection ERROR !!")
    })




class APIGatherer {
    constructor(req, res) {
        this.req = req
        this.res = res
    }

    async getToken(req) {
        try {
            const config = { headers: { Accept: 'application/json' } }
            const res = await axios.get(`https://public-apis-api.herokuapp.com/api/v1/auth/token`, config)
            req.session.token = res.data.token
            req.session.genTime = Date.now();
        } catch (e) {
            console.log(e)
        }
    }

    async tokenRenewer(req) {
        let currentTime = Date.now()
        if ((currentTime - req.session.genTime) > 290000) {
            await new Promise(resolve => {
                setTimeout(resolve, 20000)
            })
            console.log('Token Has been renewed !')
            return true

        }
        return false
    }


    async getApiCats(req) {
        try {
            await this.getToken(req)
            let token = req.session.token
            req.session.cats = []

            for (let i = 1; i < 6; i++) {
                if (await this.tokenRenewer(req)) {
                    await this.getToken(req)
                    token = req.session.token
                }
                const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }, params: { page: i } }
                const res = await axios.get(`https://public-apis-api.herokuapp.com/api/v1/apis/categories`, config)
                if (res.headers['x-ratelimit-remaining'] === '1') {
                    await new Promise(resolve => {
                        setTimeout(resolve, 60000)
                    })
                }
                req.session.cats.push(...res.data.categories)
            }

        } catch (e) {
            console.log(e)
        }

    }


    async getApiCatsData(req, res) {
        try {
            await this.getApiCats(req)
            for (let category of req.session.cats) {
                // console.log(category)
                let token = req.session.token
                for (let i = 1; i < 7; i++) {
                    if (await this.tokenRenewer(req)) {
                        await this.getToken(req)
                        token = req.session.token
                    }
                    const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }, params: { page: i, category } }
                    const res = await axios.get(`https://public-apis-api.herokuapp.com/api/v1/apis/entry`, config)
                    for (let api of res.data.categories) {
                        const new_api = new ApiSchema(api)
                        console.log(new_api)
                        await new_api.save()
                    }
                    if (res.headers['x-ratelimit-remaining'] === '1') {
                        await new Promise(resolve => {
                            setTimeout(resolve, 60000)
                        })
                    }
                }

            }
        } catch (e) {
            console.log(e)
        }
    }
}


app.get('/', async(req, res) => {
    console.log('APIs are being collected. Please do not refresh.')
    const aG = new APIGatherer
    await aG.getApiCatsData(req, res)
    console.log('APIs collection completed.')
})


app.listen(3000, () => {
    console.log('Listening on PORT 3000 !')
})