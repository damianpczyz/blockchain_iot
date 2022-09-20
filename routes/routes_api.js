const back = require("../logic/backend_app");

function routesApi(app, db, accounts, lms){

    app.get('/api/add/:id', (request,response)=>{
        let id = request.params.id;

        back.addLight(id, accounts, lms)
        .then((result)=> {
            response.send(`{"Success": 200,
                            "DeviceId": ${result[0]},
                            "on": ${result[1]},
                            "bri": ${result[2]},
                            "hue": ${result[3]},
                            "sat": ${result[4]}
                        }`)
            response.locals = { bri: result.bri }
            response.render('Forms/lights');
        })
    })

    app.post('/api/modify/:id', (req,res)=>{
        let cookie = req.cookies.AccAddress;
        let id = req.params.id
        let on = req.body.on;
        let bri = req.body.bri;
        let hue = req.body.hue;
        let sat = req.body.sat;
        // console.log(req.body.bri + " " + req.body.hue + " " + req.body.sat + " ")
        let isOn = false;

        if(on) isOn = true;


        back.modifyDevice(id, on, bri, hue, sat, cookie, lms)
        .then((result) => {console.log(result.data)})
        res.redirect('/lights');
    })

    app.get('/api/get/:id', (req,res)=>{
        const id = parseInt(req.params.id);

        lms.getLightParams(id, {from: accounts[3]})
        .then(async(_id, _on, _bri, _hue, _sat)=>{
            console.log(`'Id': '${_on}`)
            res.json({  "status":"success",
                        id : parseInt(_id[0]),
                        on : _id[1],
                        bri : parseInt(_id[2]),
                        hue : parseInt(_id[3]),
                        sat : parseInt(_id[4])})
        })
    })
}

module.exports = routesApi