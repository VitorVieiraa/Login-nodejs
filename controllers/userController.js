const User = require('../models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const userController = {
    register: async function (req, res) {

        const selectedUser = await User.findOne({ email: req.body.email })
        if (selectedUser) return res.status(400).send('Email exists')

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password)
        })

        try {
            const savedUser = await user.save()
            res.send(savedUser)
        } catch (error) {
            res.status(400).send(error)
        }

    },

    
    login: async function (req, res) {
        const selectedUser = await User.findOne({ email: req.body.email })
        if (!selectedUser) return res.status(400).send('Email or Passoword incorrect')

        const passwordAndUserMatch = bcrypt.compareSync(req.body.password, selectedUser.password)
        if(!passwordAndUserMatch) return res.status(400).send('Email or Passoword incorrect')

        const token = jwt.sign({_id: selectedUser._id}, process.env.TOKEN_SECRET, {expiresIn: 30})
        res.header('authorization-token',token)
        res.send("User logged")
    }
}

module.exports = userController