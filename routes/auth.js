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
        const user = await new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        })
        await user.save();
        return res.send(user)
    } catch (error) {
        return res.status(500).json(error);
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
