const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User.js');
require('dotenv').config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));

await mongoose.connect(procrss.env.MONGO_URL);

app.get('/test', (req, res) => {
    res.json('test ok');
});

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userDoc = await User.create({
            name, email, password: bcrypt.hashSync(password, bcryptSalt),
        });
        res.json(userDoc);
    } catch (e) {
        res.status(422).json(e);
    }

});

app.post('/login', async (req,res)=>{
    const {email,password} = req.body;
    const userDoc = await User.findOne({email});
    if (userDoc){
        const passOk =  bcrypt.compareSync(password, userDoc.password);
        if(passOk){
            res.json('password ok');
        }else{
            res.json('password not ok')
        }
    }else{
        res.json('not found');
    }
});

app.listen(4000);