const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.get('/', (req,res) => {
    res.send('Auth')
})

//Register route
router.post('/register', async (req,res) => {
    try {
        //Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //Create User
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        })

        // const user = await User.findOne({email: req.body.email});
        // if(user != null){
        //     res.statusCode = 501;
        //     return res.send("email already exists")
        // }
        return res.send(newUser);
    } catch (error) {
        res.statusCode = 500;
        res.statusMessage = "email exists";
        return res.send(error);
    }
})

//Login Route
router.post('/login', async (req,res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(user == null)
            return res.status(404).json('User Not found');
        
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if(!validPassword)
            return res.status(400).json('Wrong Password');
        
        return res.status(200).json(user);
    } catch (error) {
        console.log(error)
    }
})


module.exports = router;
