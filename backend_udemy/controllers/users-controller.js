const HttpError = require('../models/http-error')
const mongoose = require('mongoose')
const { validationResult } = require('express-validator')
const uuid = require('uuid/v4')
const User = require('../models/user')
let DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Yash',
        email: 'yash@gmail.com',
        password: 'yash1234'
    }
]

const getUsers = async (req, res, next) => {
    //res.json({ users: DUMMY_USERS })
    let users
    try {
        users = await User.find({}, '-password')
    }
    catch (err) {
        console.log(err)
        return next(new HttpError('Could not retrieve users. Please try again later', 500))
    }
    res.json(users.map(user => user.toObject({ getters: true })))
}

const signup = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors)
        return next(new HttpError('Invlid inputs passed, please check your data', 422))
    }
    const { name, email, password } = req.body

    let existingUser
    try {
        existingUser = await User.findOne({ email: email })
    }
    catch (err) {
        console.log(err)
        return next(new HttpError('SignUp failed', 500))
    }
    // const hasUser = DUMMY_USERS.find(u => u.email === email)
    // if (hasUser) {
    //     throw new Error('Email already exists', 422)
    // }
    //  const createUser = {
    //     id: uuid(),
    //     name,
    //     email,
    //     password
    // }


    if (existingUser) {
        return next(new HttpError('Email already exists', 422))
    }
    const createdUser = new User({
        name,
        email,
        image: req.file.path,
        password,
        places: []
    })
    try {
        createdUser.save()
    }
    catch (err) {
        return next(new HttpError('Could not create user', 500))
    }
    // DUMMY_USERS.push(createUser)
    res.status(201).json({ user: createdUser.toObject({ getters: true }) })
}

const login = async (req, res, next) => {
    const { email, password } = req.body
    // const identifiedUser = DUMMY_USERS.find(u => u.email === email)
    let existingUser
    try {
        existingUser = await User.findOne({ email: email })
    }
    catch (err) {
        console.log(err)
        return next(new HttpError('login failed', 500))
    }
    if (!existingUser || existingUser.password !== password) {
        return next(new HttpError('Could not identify user, credentials are wrong'))
    }
    // if (!identifiedUser || identifiedUser.password != password) {
    //     throw new HttpError('COuld not identify user, credentials are wrong')
    // }
    res.json({ message: 'logged in', user: existingUser.toObject({ getters: true }) })
}

exports.getUsers = getUsers
exports.signup = signup
exports.login = login