const HG = require('./index.js');

function HGRegistry(contract, provider) {
  this.contract = contract;
  this.provider = provider;
  this.conditions = [];

  this.getConditions = function() {
    // Create a filter for 'ConditionPreparation' event
    if (web3.version.network != 42) {
      this.provider.resetEventsBlock(0);
      let condition = listenForConditions(this.contract);
      this.conditions.push(condition);
    }

    console.log(this.conditions);
  }
}

function listenForConditions(contract) {
  let filter = contract.filters.ConditionPreparation();
  contract.on(filter, (id, oracle, questionId, slots) => {
    console.log("id: ");
    console.log(id);
    return ({
      conditionId: id,
      oracle: oracle,
      questionId: questionId,
      outcomesSlotCount: slots
    })
  })
}

module.exports = HGRegistry;
