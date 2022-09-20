const app = require("./backend_app.js");

//Blockchain part
async function addLightToBlockchain(state, id, cookie, lms){
    if(!state.hue) state.hue = 0;
    if(!state.sat) state.sat = 0;

    return lms.addLight(id, state.on, state.bri, state.hue, state.sat, {from: cookie})
    .then((result)=> {return result.logs[0].args})
}

async function modifyLightStateInBlochchain(id, on, bri, hue, sat, cookie, lms){
    return lms.modifyLight(parseInt(id), on, parseInt(bri), parseInt(hue),  parseInt(sat), {from: cookie})
        .then((result)=>{ return result.logs[0].args;})
}
//-----------------------------------------------------------------------------------------------------------
// Sensors

async function addSensorToBlockchain(state, id, cookie, lms)
{
    return lms.addSensor(id, state.name, state.bri, state.batteryLevel, 
	state.on, state.duration , state.rechable , state.presence, {from: cookie})
	.then((result)=> {return result.logs[0].args})
}

async function modifySensorStateInBlochchain
(id, batteryLevel, on, duration, rechable, presence, cookie, lms)
{

    return lms.modifySensor(parseInt(id), on, parseInt(batteryLevel), parseInt(duration),
	rechable,  presence, {from: cookie})
    .then((result)=>{ return result.logs[0].args;})
}
//-----------------------------------------------------------------------------------------------------------
async function addUsertoBlockchain(username, password, accountId, lms){
    let apiKey = app.generateApiKey(40);
    return lms.addUser(username, password, apiKey, accountId, {from: accountId})
    .then((result)=> {return result.logs[0].args})
}

async function checkCredentials(account, password, lms, accounts){
    return await lms.checkPassword(password, {from: account})
}

module.exports = {  addUsertoBlockchain, checkCredentials, modifyLightStateInBlochchain, addLightToBlockchain, addSensorToBlockchain,  modifySensorStateInBlochchain};