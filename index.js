const ethers = require('ethers');
const hgUtils = require('./hg-utils.js');
const pmsContractJson = require('@gnosis.pm/hg-contracts/build/contracts/PredictionMarketSystem');


function HG(contractAddress, provider = new ethers.providers.Web3Provider(web3.currentProvider)) {

  var contract = new ethers.Contract(contractAddress, pmsContractJson.abi, provider.getSigner());

  this.prepareCondition = async function(name, oracle, outcomeSlotsCount) {
    let bytesName = ethers.utils.formatBytes32String(name);
    await contract.prepareCondition(oracle, bytesName, outcomeSlotsCount);
    return new Condition(oracle, bytesName, outcomeSlotsCount);
  };

  function Condition(oracle, questionId, outcomesSlotsCount) {
    this.oracle = oracle;
    this.questionId = questionId;
    this.outcomesSlotsCount = outcomesSlotsCount;
    this.id = hgUtils.getConditionId(oracle, questionId, outcomesSlotsCount);

    this.split = async function(collateralAddress) {
      var indexSet = hgUtils.generateFullIndex(this.outcomesSlotsCount);
      await contract.splitPosition(collateralAddress, ethers.constants.HashZero, this.id, indexSet, 100);
    };

    this.mergeAll = async function(collateralAddress) {
      var indexSet = hgUtils.generateFullIndex(this.outcomesSlotsCount);
      await contract.mergePositions(collateralAddress, ethers.constants.HashZero, this.id, indexSet, 100);
    }

  }

};


module.exports = HG;
