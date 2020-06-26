// all files path is base on my file path stractur 
// mack your file and kipp that mind how the file stractur is 



const exp = require('express');
const path = require('path')
const app = exp()
const mongs = require('mongoose')
const smtTp = require('nodemailer-smtp-transport')
const bodyparser = require('body-parser')

const mail = require('nodemailer')

let transport = mail.createTransport(smtTp({
    service: 'gmail',
    auth: {
        user: 'whocansendmail@gmail.com',     // you using gmail pleas cheak for 2-step verification is off 
                                            // chack this on https://support.google.com/accounts/answer/185839?co=GENIE.Platform%3DAndroid&hl=en
        pass: 'yourps'
    }
}));

const port = 80;
const hostname = '127.0.0.1';

mongs.connect('mongodb://localhost/Transport', { useNewUrlParser: true, useUnifiedTopology: true });

const formschem = new mongs.Schema({
    firstname: String,
    lastname: String,
    email: String,
    subject: String, 
    maseege: String
});

const forminfo = mongs.model('contect_info', formschem);

const homeschem = new mongs.Schema({
    name: String,
    email: String,
});

const home_forminfo = mongs.model('home_form_info', homeschem);

// all usess 

app.use('/css', exp.static('css'));
app.use('/img', exp.static('img'));
app.use('/js',exp.static('js'));
app.use('/owlcarsousel', exp.static('owlcarsousel'));
app.use('/node_modules',exp.static('node_modules'));  // this is for aos.css and aos.js

 

app.use(bodyparser.urlencoded({ extended: true })); 
app.use(bodyparser.json())

// endpoint

app.get("/", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'html/home.html'));
});

app.get("/about", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'html/about.html'));
});

app.get("/blog", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'html/blog.html'));
});

app.get("/industries", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'html/industries.html'));
});

app.get("/service", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'html/service.html'));
});

app.get("/contect", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'html/contect.html'));
});

app.post("/contect", (req, res) => {
    
    // sending the contect form info  to my email 

    var mailOptions = {
        from: 'whocansendmail@gmail.com',
        to: 'receiveremail@gmail.com',
        subject: 'Sending Email using Node.js',
        text: `${JSON.stringify(req.body)}` // plaintext body  changin this object into string
    };

    // console.log(req.body)
    transport.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error); 
        }
        console.log('Message sent: ' + info.response);
    });

    // save data in database (mongodb)
    var mydata = new forminfo(req.body)
    mydata.save().then(() => {
        res.status(200).sendFile(path.join(__dirname, 'html/contect.html'));
    }).catch(() => {
        res.status(400).send('<h1> The file is note saved</h1>');
    });

});

app.post("/", (req, res) => {
    var mydata = new home_forminfo(req.body);
    mydata.save().then(() => {
        res.status(200).sendFile(path.join(__dirname, 'html/home.html'));
    }).catch(() => {
        res.status(400).send('<h1> The file is note saved');
    })
    console.log(req.body.email)

});




app.listen(port, hostname, () => {
    console.log(`Runnin on port ${hostname}:${port}`);
});