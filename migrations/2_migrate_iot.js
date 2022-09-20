var Iot = artifacts.require("./Iot.sol");
module.exports = function(deployer) {
    deployer.deploy(Iot);
};