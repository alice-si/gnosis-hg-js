const HG = require('./index.js');
const hgUtils = require('./hg-utils.js');
const numberToBN = require('number-to-bn');

function HGRegistry(contract) {
  this.getEvents = async function(condition) {
    let conditions = [];
    let conditionId = condition.id;
    let oracle = condition.oracle;

    let slotCount = await contract.getOutcomeSlotCount(conditionId);

    // Create a filter for 'ConditionPreparation' event
    let filter = contract.filters.ConditionPreparation(conditionId);

    // Listen for our filtered results
    await contract.on(filter, (conditionId) => {
      console.log("found one");
      conditions.push(condition);
    });
    return conditions;
  }

}

module.exports = HGRegistry;
