const axios = require('axios');
const blockchain = require("./backend_blokchain.js");

const gatewayIp = '192.168.100.100';
const apiKey = '96B62B11D0';

async function getLightInfoReq(id){
    return axios.get('http://'+gatewayIp+'/api/96B62B11D0/lights/'+id).then(res => { return res.data.state;})
}

async function getSensorInfoReq(id){
    return axios.get('http://'+gatewayIp+'/api/96B62B11D0/sensors/'+id).then(res => { return res.data;})
}

async function modifyDeviceState(emit){
    return axios.put('http://'+gatewayIp+'/api/'+apiKey+'/lights/'+emit[0].words[0]+'/state',{
                 on : emit[1],
                 bri: emit[2].words[0],
                 hue: emit[3].words[0],
                 sat: emit[4].words[0]
             }).then(res => { return res})
}


async function addLight(id, accounts, lms) {   
    const state = await getLightInfoReq(id);
    const data = await blockchain.addLightToBlockchain(state, id, accounts, lms);
    return data;
}

async function modifyDevice(id, on, bri, hue, sat, cookie, lms){
    const emitResult = await blockchain.modifyLightStateInBlochchain(id, on, bri, hue, sat, cookie, lms);
    const result = await modifyDeviceState(emitResult);
    return result
}


function generateApiKey(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

async function getLightData(id){
    return await getLightInfoReq(id);
}

async function getSensorData(id){
    return await getSensorInfoReq(id);
}

module.exports = { modifyDevice, addLight, modifyDeviceState, getLightInfoReq, generateApiKey, getLightData, getSensorData };