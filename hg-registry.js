const HG = require('./index.js');

function HGRegistry(contract, provider) {
  this.contract = contract;
  this.provider = provider;
  this.conditions = [];

  this.getConditions = async function() {
    let cons = [];
    provider.resetEventsBlock(0);
    let filter = contract.filters.ConditionPreparation();
    return new Promise(function(resolve, reject) {
      provider.on(filter, (result) => {
        cons.push(result);
        return resolve(cons);
      });
    }).then((cons) => {
      this.conditions = cons;
    });
  }
}

module.exports = HGRegistry;
