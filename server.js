require('dotenv').config();
const express = require('express')
var cookieParser = require('cookie-parser');
const app = express()

// Routes
const routesApi = require('./routes/routes_api')
const routesFront = require('./routes/routes_front')
const routesAuth = require('./routes/routes_auth')

//Mongo
const mongodb = require('mongodb').MongoClient

//Web3 + Contracts
const Web3 = require('web3');
const contract = require('truffle-contract');
const artifacts = require('./build/Iot.json');

if (typeof web3 !== 'undefined') {
  var web3 = new Web3(web3.currentProvider)
} else {
  var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
}

const LMS = contract(artifacts)
LMS.setProvider(web3.currentProvider)

//Path
var path = require('path');
var http = require('http').Server(app);

// Express
var expressLayouts = require('express-ejs-layouts');
app.use(express.json())
app.use(cookieParser());
app.use('/public', express.static('public'));
app.get('/layouts/', function(req, res) {
  res.render('view');
});
app.use(express.urlencoded({extended: true}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

mongodb.connect('mongodb://127.0.0.1:27017', { useUnifiedTopology: true }, async(err, client) =>{
  const db = client.db('Iot_blockchain')

  const web3obj = await web3.eth.accounts;
  const accounts = await web3.eth.getAccounts();

  const lms = await LMS.deployed(); 
  routesAuth(app,db, accounts, lms, web3obj);
  routesApi(app,db, accounts, lms);
  routesFront(app,db, accounts, lms);

  
  app.listen(process.env.PORT || 8082, () => {
     console.log('listening on port '+ (process.env.PORT || 8082));
   })
})

