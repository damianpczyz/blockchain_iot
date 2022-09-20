pragma solidity >=0.4.22 <0.9.0;

contract Iot{
    uint lightCount = 1;

    struct Lights {
        uint id;
        bool on;
        uint bri;
        uint hue;
        uint sat;
    }
    mapping (uint => Lights) public allLights;

    event addNewLight(uint _id, bool _on, uint _bri, uint _hue, uint _sat);
    event modifyLightId(uint _id, bool _on, uint _bri, uint _hue, uint _sat);
    event getDeviceState(uint _id, bool _on, uint _bri, uint _hue, uint _sat);

function addLight(uint _id, bool _on, uint _bri, uint _hue, uint _sat)
    public
{
    allLights[_id] = Lights(_id, _on, _bri, _hue, _sat);
    emit addNewLight(_id, _on, _bri, _hue, _sat);
    lightCount++;
}

function getLightParams(uint _id)
    public view
returns(uint, bool, uint, uint, uint)
{
    return (allLights[_id].id, allLights[_id].on, allLights[_id].bri, allLights[_id].hue, allLights[_id].sat);
}

function modifyLight(uint _id, bool _on, uint _bri, uint _hue, uint _sat) public {
    allLights[_id].on = _on;
    allLights[_id].bri = _bri;
    allLights[_id].hue = _hue;
    allLights[_id].sat = _sat;
    emit modifyLightId(_id, allLights[_id].on, allLights[_id].bri, allLights[_id].hue, allLights[_id].sat);
}



// ---------------------------------- Sensor -----------------------------------------------------------------------

uint sensorCount = 1;

struct Sensors {
    uint id;
    string name;
    uint batteryLevel;
    bool on;
    uint duration;
    bool rechable;
    bool presence;
}
mapping (uint => Sensors) public allSensors;

event addNewSensor(uint _id, string _name, uint _batteryLevel, bool _on, uint _duration, bool _rechable, bool _presence);
event modifySensorId(uint _id, string _name, uint _batteryLevel, bool _on, uint _duration, bool _rechable, bool _presence);
event getDeviceState(uint _id, string _name, uint _batteryLevel, bool _on, uint _duration, bool _rechable, bool _presence);


function addSensor(uint _id, string memory _name, uint _batteryLevel, bool _on, uint _duration, bool _rechable, bool _presence) public 
{
    allSensors[_id] = Sensors(_id, _name, _batteryLevel, _on, _duration, _rechable, _presence);

    emit addNewSensor(_id, _name, _batteryLevel, _on, _duration, _rechable, _presence);
    sensorCount++;
}

function getSensorParams(uint _id) public view returns(uint, string memory, uint, bool, uint, bool, bool) 
{
    return (_id, allSensors[_id].name, allSensors[_id].batteryLevel, 
                 allSensors[_id].on, allSensors[_id].duration,  
                 allSensors[_id].rechable, allSensors[_id].presence);
}

function modifySensor(uint _id, string memory _name, uint _batteryLevel, bool _on, uint _duration, bool _rechable, bool _presence) public 
{
    allSensors[_id].name = _name;
    allSensors[_id].batteryLevel = _batteryLevel;
    allSensors[_id].on = _on;
    allSensors[_id].duration = _duration;
    allSensors[_id].rechable = _rechable;
    allSensors[_id].presence = _presence;

    emit modifySensorId(_id, allSensors[_id].name, allSensors[_id].batteryLevel, 
                             allSensors[_id].on, allSensors[_id].duration,  allSensors[_id].rechable, 
                             allSensors[_id].presence);
}

}
// ---------------------------------------------------------------------------------------------------------


    // // USERS
    // uint usersCount = 1;

    // struct Users {
    //     uint id;
    //     string username;
    //     string password;
    //     string apiKey;
    //     address accountId;
    // }

    // modifier userExist (address _accountId) {
    //     for (uint user=0; user < usersCount; user++)
    //     {
    //         require (allUsers[user].accountId != _accountId, "error-account-exist");
    //     }
    // _;
    // }

    // mapping (uint => Users) public allUsers;
    // event getUserData(uint _id, string _username, string _password, string _apiKey, address _accountId);
    // event checkPasswordEvent(bool isValid);

    // function addUser(string memory _username, string memory _password, string memory _apiKey, address _accountId) public userExist(_accountId){
    //     allUsers[usersCount] = Users(usersCount, sd