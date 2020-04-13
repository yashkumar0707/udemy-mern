const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const placesRoutes = require('./routes/places-routes')
const usersRoutes = require('./routes/users-routes')
const HttpError = require('./models/http-error')
const app = express()

app.use(bodyParser.json())
app.use('/api/users', usersRoutes)
app.use('/api/places', placesRoutes)
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route', 404)
    throw error
})
app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error)
    }
    res.status(error.code || 500)
    res.json({ message: error.message || 'An unknown error occurred' })
})

mongoose.connect('mongodb+srv://yash:yash1234@cluster0-jgkhw.mongodb.net/mern_udemy?retryWrites=true&w=majority').then(() => {
    app.listen(5000)
}).catch(err => {
    console.log(err)
})
