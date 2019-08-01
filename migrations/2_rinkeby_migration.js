const PMS = artifacts.require("TestPMS");

module.exports = function(deployer, network, accounts) {
 deployer.deploy(PMS, {from: accounts[0]});
};
