const HttpError = require('../models/http-error')
const uuid = require('uuid/v4')
const mongoose = require('mongoose')
const { validationResult } = require('express-validator')
const Place = require('../models/place')
const User = require('../models/user')
let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'EMpire STate Building',
        description: 'One of the most famous sky scrapers in the world!',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/250px-Empire_State_Building_%28aerial_view%29.jpg',
        address: 'Midtown Manhattan, New York City',
        location: {
            lat: 40.7484405,
            lng: -73.9878584
        },
        creator: 'u1'
    }
]

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid
    console.log('get request in places')
    let place
    // const place = DUMMY_PLACES.find(p => {
    //     return p.id === placeId
    // })
    try {
        place = await Place.findById(placeId)
    }
    catch (err) {
        error = new HttpError(
            'Something went wrong. Could not find a place', 500
        )
        return next(error)
    }
    if (!place) {
        throw new HttpError('COuldnt find the place', 404)
    }
    res.json({ place: place.toObject({ getters: true }) })
}

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid
    console.log('get request in users')
    let places
    // const place = DUMMY_PLACES.filter(p => {
    //     return p.creator === userId
    // })
    try {
        places = await Place.find({ creator: userId })
    }
    catch (err) {
        const error = new HttpError('Fetching places failed. Please try again later', 500)
        return next(error)
    }
    if (!places || places.length === 0) {
        return next(new HttpError('Couldnt find place', 404))
    }
    res.json({ places: places.map(place => place.toObject({ getters: true })) })
}

const createPlace = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors)
        throw new HttpError('Invlid inputs passed, please check your data', 422)
    }
    const { title, description, address, creator } = req.body;
    // const createdPlace = {
    //     id: uuid(),
    //     title,
    //     description,
    //     location: coordinates,
    //     address,
    //     creator
    // }
    const coordinates = {
        lat: 40.7484405,
        lng: -73.9878584
    }
    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/250px-Empire_State_Building_%28aerial_view%29.jpg',
        creator
    })
    let user
    try {
        user = await User.findById(creator)
    }
    catch (err) {
        console.log(err)
        const error = new HttpError('Creating failed', 500)
        return next(error)
    }

    if (!user) {
        return next(new HttpError('Could not find user', 404))
    }

    try {
        //DUMMY_PLACES.push(createdPlace)
        //await createdPlace.save()
        const sess = await mongoose.startSession()
        sess.startTransaction()
        await createdPlace.save({ session: sess })
        user.places.push(createdPlace)
        await user.save({ session: sess })
        await sess.commitTransaction()
    } catch (err) {
        console.log(err)
        const error = new HttpError('Creating failed, Please try again', 500)
        return next(error)
    }
    res.status(201).json({ place: createdPlace })
}


// const updatePlace = (req, res, next) => {
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) {
//         console.log(errors)
//         throw new HttpError('Invlid inputs passed, please check your data', 422)
//     }
//     const { title, description } = req.body;
//     const placeId = req.params.pid
//     const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId) }
//     const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId)
//     updatedPlace.title = title
//     updatedPlace.description = description
//     DUMMY_PLACES[placeIndex] = updatedPlace
//     res.status(200).json({ place: updatedPlace })
// }

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors)
        return next(new HttpError('Invlid inputs passed, please check your data', 422))
    }
    const { title, description } = req.body;
    const placeId = req.params.pid
    let place
    try {
        place = await Place.findById(placeId)

    }
    catch (err) {
        const error = new HttpError('Something went wrong. Could not update', 500)
        return next(error)
    }
    place.title = title
    place.description = description
    try {
        await place.save()
    }
    catch{
        return next(new HttpError('Something went wrong', 500))
    }

    res.status(200).json({ place: place.toObject({ getters: true }) })
}

// const deletePlace = (req, res, next) => {
//     const placeId = req.params.pid
//     if (!DUMMY_PLACES.find(p => p.id === placeId)) {
//         throw new HttpError('COuld not find place to delete', 404)
//     }
//     DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId)
//     res.status(200).json({ message: 'Deleted place' })
// }

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid
    let place
    try {
        place = await Place.findById(placeId).populate('creator') //
    }
    catch (err) {
        console.log(err)
        const error = new HttpError('Something went wrong', 500)
        return next(error)
    }

    if (!place) {
        const error = new HttpError('Could not find place', 404)
        return next(error)
    }

    try {
        //await place.remove()
        const sess = await mongoose.startSession()
        sess.startTransaction()
        await place.remove({ session: sess })
        place.creator.places.pull(place)
        await place.creator.save({ session: sess })
        await sess.commitTransaction()
    }
    catch (err) {
        const error = new HttpError('Something went wrong, Could not delete place ', 500)
        return next(error)
    }
    res.status(200).json({ message: 'Deleted place' })
}

exports.getPlaceById = getPlaceById
exports.getPlacesByUserId = getPlacesByUserId
exports.createPlace = createPlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace