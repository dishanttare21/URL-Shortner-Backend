const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Url = require('./models/Url');
const cors = require('cors');
const validUrl = require('valid-url');
require('dotenv').config();
const authRouter = require('./routes/auth');
const userRouter = require('./routes/users');

const baseUrl = process.env.BASE_URL;
const port = process.env.PORT;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

//routes
app.use('/auth', authRouter);
app.use('/users', userRouter);

app.post('/all', async (req, res) => {
    try {
        const urls = await Url.find({userId: req.body.userId}).sort({ date: -1 });
        res.send(urls);
    } catch (error) {
        res.send(error);
    }
})
app.post('/shorten', async (req, res) => {
    let url = req.body.longUrl;
    let urlDescription = req.body.urlDescription;
    if (!validUrl.isUri(url))
        return res.status(401).json({ data: false })

    try {
        await Url.create({
            userId: req.body.userId,
            longUrl: req.body.longUrl,
            urlDescription: urlDescription
        });
        shortnedUrl = await Url.findOne({ longUrl: req.body.longUrl });
        const data = {
            userId: shortnedUrl.userId,
            shortUrl: baseUrl + shortnedUrl.shortUrl,
            urlDescription: shortnedUrl.urlDescription,
            clicks: shortnedUrl.clicks
        }
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json(error);
    }
    // res.redirect('/');
})
app.get('/:shortUrl', async (req, res) => {
    try {
        const url = await Url.findOne({ shortUrl: req.params.shortUrl });
        if (url == null)
            return res.sendStatus(404);
        let urlClicks = url.clicks;
        urlClicks++;
        url.clicks = urlClicks;
        url.save();
        // res.status(200).json(url)
        return res.status(200).redirect(url.longUrl);
    } catch (error) {
        return res.status(500).json(error);
    }
})

const DB_URI = process.env.DB_URI;

mongoose.connect(DB_URI, () => {
    console.log('Connected to DB');
})

app.listen(port || 8080, () => {
    console.log(`server running at ${baseUrl}`);
})

