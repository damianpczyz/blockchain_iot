const back = require("../logic/backend_blokchain");
const auth = require("../logic/auth")

function routesAuth(app, db, accounts, lms, web3obj){

    app.post('/register', (req,res)=>{
        let usernameid = accounts[0];
        let devicetypeid = req.body.devicetype;

        db.collection('users').findOne({usernameid}, (err, doc)=>{
            if(doc){
                res.status(400).json({"status":"Failed", "reason":"Already registered"})
            }else{
                db.collection('users').insertOne({usernameid})
                res.json({"status":"success","id":usernameid})

                axios
                    .post('http://192.168.100.100/api', {
                        username: usernameid,
                        devicetype : devicetypeid
                    })
                    .then(res => {
                        console.log(`statusCode: ${res.status}`);
                        console.log(res);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        });
    });

    app.post('/login', function(req, res)
    {
        let privKey =  req.body.username;

        try {
            let accountAddress = web3obj.privateKeyToAccount(privKey).address;
            console.log(accountAddress)
            console.log(accounts)

            if (accounts.indexOf(accountAddress) > -1)
            {
                var cookie = req.cookies.AccAddress;
                console.log(cookie)

                if (cookie === undefined) {
                    res.cookie('AccAddress',accountAddress, { maxAge: 900000, httpOnly: true });
                }else {
                    console.log('cookie exists', cookie);
                }

                res.redirect('dashboard');
            }
            else{
                res.redirect('login');
            }
        } catch (error){console.error(error)}

    });

    app.get('/logout', function(req, res)
    {
        try {
                res.clearCookie('AccAddress');
                res.redirect('login');

        } catch (error){console.error(error)}

    });

    app.post('/registerAccount', function(req, res)
    {
        back.addUsertoBlockchain(req.body.username, req.body.password, req.body.accountId, lms)
        .then((result)=> {
            res.locals = {  title: 'Register' };
            res.redirect('login');
        })
    })
}

module.exports = routesAuth