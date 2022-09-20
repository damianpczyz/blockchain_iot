const axios = require('axios');
const back = require("../logic/backend_blokchain");
const main = require("../logic/backend_app.js");
const auth = require("../logic/auth")

function routesFront(app, db, accounts, lms){
 
    app.get('/', function (req, res) {

        let cookie = req.cookies.AccAddress;
        if (cookie === undefined)
            res.redirect('login');
        else
            res.redirect('dashboard')
    })

    app.get('/dashboard', auth(accounts), function (req, res) {
        res.locals = {  title: 'Dashboard' };
        res.render('Dashboard/dashboard');
    })

    app.get('/lights', auth(accounts), function (req, res) {
        let id = 1;
        main.getLightData(id)
        .then((result)=> {
            setLightCookies(result.bri, result.hue, result.sat, res);
            res.locals = { title: "Lights", bri: result.bri, hue: result.hue, sat: result.sat}
            res.render('Forms/lights');
        })
    })

    app.get('/switches', auth(accounts), function (req, res) {
        res.locals = {  title: 'Form Advanced' };
        res.render('Forms/lights');
    })

    app.get('/sensors', auth(accounts), function (req, res) {
        let id = 5;
        main.getSensorData(id)
        .then((result)=> {
            console.log(result)
            res.locals = { title: "Sensor", name: result.name, battery: result.config.battery, 
                                            duration: result.config.duration, on: result.config.on, 
                                            reachable: result.config.reachable, presence: result.state.presence}
            res.render('Forms/sensors');
        })
    })

    app.post('/setLightOnSensor', auth(accounts), (req,res) =>{

        var cookies = req.cookies;
        let sensorOn = req.body.sensorOn;

if(sensorOn == "on"){
    main.getSensorData(5)
    .then((result)=> {

        if (cookies === undefined) {
            console.log('No cookies found in header')
        }else {
            let bri = cookies.bri;
            let hue = cookies.hue;
            let sat = cookies.sat;
            let account = cookies.AccAddress;

            if (result.state.presence){
                main.modifyDevice(1, true, bri, hue, sat, account, lms)
                .then((result) => {console.log(result)})
            }else{
                main.modifyDevice(1, false, bri, hue, sat, account, lms)
                .then((result) => {console.log(result)})
            }
        }


                res.locals = { title: "Lights", name: result.name, battery: result.config.battery, 
                                                duration: result.config.duration, on: result.config.on, 
                                                reachable: result.config.reachable, presence: result.state.presence}
                res.render('Forms/lights');
            })
        }


    })

    app.get('/login', function(req, res)
    {
        res.locals = {  title: 'Login' };
        res.render('Auth/login');
    });

    app.get('/register', function(req, res)
    {
        res.locals = {  title: 'Register' };
        res.render('Auth/register');
    })

    app.post('/setLightOnTime', auth(accounts), (req,res) =>{
        let startTime = req.body.start;
        let stopTime = req.body.stop;

        let startH = parseInt(startTime.substr(0, 2))
        let startM = parseInt(startTime.substr(3, 5))
        let startS = parseInt(startTime.substr(6, 8))

        let stoptH = parseInt(stopTime.substr(0, 2))
        let stopM = parseInt(stopTime.substr(3, 5))
        let stopS = parseInt(stopTime.substr(6, 8))

var now = new Date();
var millisTillStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startH, startM, startS, 0) - now;
var millisTillStop = new Date(now.getFullYear(), now.getMonth(), now.getDate(), stoptH, stopM, stopS, 0) - now;

setTimeout(function(){automateStart(req)}, millisTillStart)
setTimeout(function(){automateStop(req)}, millisTillStop)

main.getLightData(1)
.then((result)=> {
    res.locals = { bri: result.bri, hue: result.hue, sat: result.sat, title: "Lights"}
    res.render('Forms/lights');
})
    })
    
    function automateStart(req){
        var cookies = req.cookies;
        let id = 1;
        let on = true;

if (cookies === undefined) {
    console.log('No session cookie found')
}else {
    let bri = cookies.bri;
    let hue = cookies.hue;
    let sat = cookies.sat;
    let account = cookies.AccAddress;

    main.modifyDevice(id, on, bri, hue, sat, account, lms)
    .then((result) => {console.log(result)})
}
    }
   
    function automateStop(req){
        var cookies = req.cookies;
        let id = 1;
        let on = false;

        if (cookies === undefined) {
            console.log('No cookies found')
        }else {
            let bri = cookies.bri;
            let hue = cookies.hue;

            let sat = cookies.sat;
            let account = cookies.AccAddress;

            main.modifyDevice(id, on, bri, hue, sat, account, lms)
            .then((result) => {console.log(result)})
        }
    }

    function setLightCookies(bri, hue, sat, res){
        try {
                res.cookie('bri',bri, { maxAge: 90000000, httpOnly: true });
                res.cookie('hue',hue, { maxAge: 90000000, httpOnly: true });
                res.cookie('sat',sat, { maxAge: 90000000, httpOnly: true });
            } catch (error){console.error(error)}
    }

}

module.exports = routesFront