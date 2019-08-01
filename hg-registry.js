const HG = require('./index.js');

function HGRegistry(contract, provider) {
  this.contract = contract;
  this.provider = provider;
  this.conditions = [];

  this.getConditions = async function() {
    provider.resetEventsBlock(0);
    let filter = contract.filters.ConditionPreparation();
    return new Promise(function(resolve, reject) {
      provider.getLogs(filter).then((result) => {
        this.conditions  = result;
      });
    });
  }
}

module.exports = HGRegistry;
