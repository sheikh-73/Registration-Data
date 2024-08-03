const port = 4444;

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const path = require("path");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { connect } = require("http2");
const User = require("./models/users");

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static("uploads"));

// database connect:
mongoose.connect("mongodb://localhost:27017/registration-data");

const storage = multer.diskStorage({
    destination: (req, file, CB) => {
        CB(null, "uploads");
    },
    filename: (req, file, CB) => {
        CB(null, Date.now()+path.extname(file.originalname));
    }
});

const upload = multer({storage: storage});

// API:
app.get("/", (req, res) => {
    res.send("server conected...");
})


app.post("/user/registration", upload.single("file"), async (req, res) => {
    const hashPass = await bcrypt.hash(req.body.password, 10);
    const prevData = await User.findOne({email: req.body.email});
    if(prevData)
    {
        res.json("This email has a account.");
    }
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        profession: req.body.profession,
        gender: req.body.gender,
        password: hashPass,
        image: req.file.filename
    });

    await user.save().then(result => res.json("Registration Successful.")).catch(error => res.json(error));
});

app.post("/user/login", async (req, res) => {
    const email = req.body.email;
    const pass = req.body.password;

    //console.log(email);
    //console.log(pass);

    const data = await User.findOne({email: email});
    //console.log(data);

    try
    {
        if(data)
        {
            const comparePass = await bcrypt.compare(pass, data.password);
            if(comparePass===true)
            {
                const token = jwt.sign({_id: data._id}, "key", {expiresIn: "30min"});
                res.cookie("token", token, {secure: true, maxAge: 30*60*1000});
                res.send("Login Successful.");
            }
            else
            {
                res.send("Invalid Password !");
            }
        }
        else
        {
            res.send("Invalid email!");
        }
    }
    catch(error)
    {
        console.log(error);
        res.send(error);
    }
});







app.listen(port, (error) => {
    if(!error)
    {
        console.log("server connect...");
    }
    else
    {
        console.log("Error: "+error);
    }
})