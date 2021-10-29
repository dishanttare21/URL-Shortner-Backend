const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Url = require('./models/Url');
const cors = require('cors');
const validUrl = require('valid-url');
require('dotenv').config()


const baseUrl = process.env.BASE_URL;
const port = process.env.PORT;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())


app.get('/', async (req,res) =>{
    try {
        const urls = await Url.find({}).sort({date: 1});
        res.send(urls);
    } catch (error) {
        res.send(error);
    }
})
app.post('/shorten', async (req,res) =>{
    let url = req.body.longUrl;
    
    try {
        if(!validUrl.isUri(url))
            return res.send({data: false})
            
        let shortnedUrl = await Url.findOne({longUrl: req.body.longUrl});
        if(shortnedUrl != null){
            res.send({data: baseUrl+shortnedUrl.shortUrl});
        }
        else{
            await Url.create({longUrl: req.body.longUrl});
            shortnedUrl = await Url.findOne({longUrl: req.body.longUrl});
            return res.send({data: baseUrl+shortnedUrl.shortUrl});
        }        
    } catch (error) {
        console.log(error);
    }
    // res.redirect('/');
})
app.get('/:shortUrl',async(req,res) =>{
    const url = await Url.findOne({shortUrl: req.params.shortUrl});
    if(url == null)
        res.sendStatus(404);
    res.redirect(url.longUrl);
})

const DB_URI = process.env.DB_URI;

mongoose.connect(DB_URI,() => {
    console.log('Connected to DB');
})

app.listen(port || 8080, () =>{
    console.log(`server running at ${baseUrl}`);
})

