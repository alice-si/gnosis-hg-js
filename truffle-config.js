var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "spoon uncle park ritual alarm journey matter water apart warrior weird soap";

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // Match any network id
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/4151b2d00d774670adf72249002fae04");
      },
      network_id: 4,
      gas: 6000000,
      gasPrice: 10000000000,
    },
  },
  compilers: {
    solc: {
      version: "0.5.2"  // ex:  "0.4.20". (Default: Truffle's installed solc)
    }
  }
};
