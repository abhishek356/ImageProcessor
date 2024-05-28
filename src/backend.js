"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require('path');
var cors = require('cors');
var express = require('express');
var multer = require('multer');
var morgan = require('morgan');
var app = express();
var processFile_1 = require("./processFile");
//app.use(express.static(__dirname, 'public'));
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
//app.use(express.static(__dirname, 'public'));
var port = 5500;
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + path.extname(file.originalname));
    }
});
var upload = multer({ storage: storage });
app.post('/', upload.single('file'), function (req, res) {
    console.log(req.body);
    var output = (0, processFile_1.processImage)();
    console.log("the final outcome", output);
    if (!output) {
        return res.json({ message: 'failure' });
    }
    else {
        return res.status(200).send({ message: 'success' });
    }
    console.log("Trying to pring the incoming image in the body", req.body);
    console.log("this is the home url");
    res.json({ message: "this is the main body" });
});
// app.get('/testing',(req: Request,res:Response)=>{
// console.log(`Inside testing`)
// res.status(200).json('hello')
// })
app.listen(port, function () {
    console.log("The server is running on port 5500");
});
