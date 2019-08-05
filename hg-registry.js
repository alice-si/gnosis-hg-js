const HG = require('./index.js');
const ethers = require('ethers');

function HGRegistry(contract, provider) {
  this.contract = contract;
  this.provider = provider;
  this.conditions = [];

  this.getConditions = async function() {
    let parent = this;
    let eventAbi = this.contract.interface.abi.find(function(element) {
      return (element.name === 'ConditionPreparation' && element.type === 'event');
    });
    let iface = new ethers.utils.Interface([eventAbi]);
    let filter = contract.filters.ConditionPreparation();
    filter.fromBlock = 0;
    return new Promise(function(resolve, reject) {
      provider.getLogs(filter).then((result) => {
        if(result) {
          result.forEach((event, i) => {
            result[i] = iface.parseLog(event);
          });
          parent.conditions = result;
          resolve();
        }
        else {
          reject('ERROR: Conditions returned undefined!');
        }
      });
    });
  }
}

module.exports = HGRegistry;
