const ethers = require('ethers');
const numberToBN = require('number-to-bn');
const hgUtils = require('./hg-utils.js');
const pmsContractJson = require('@gnosis.pm/hg-contracts/build/contracts/PredictionMarketSystem');


function HG(contractAddress, provider = new ethers.providers.Web3Provider(web3.currentProvider)) {

  var contract = new ethers.Contract(contractAddress, pmsContractJson.abi, provider.getSigner());

  this.prepareCondition = async function(name, oracle, outcomeSlotsCount) {
    let bytesName = ethers.utils.formatBytes32String(name);
    await contract.prepareCondition(oracle, bytesName, outcomeSlotsCount);
    return new Condition(oracle, bytesName, outcomeSlotsCount);
  };


  function Position(condition, indexSet, collateralAddress) {
    this.condition = condition;
    this.indexSet = indexSet;
    this.collateralAddress = collateralAddress;
    this.collectionId = hgUtils.getCollectionId(condition.id, this.indexSet);
    this.id = hgUtils.getPositionId(this.collectionId, this.collateralAddress);

    this.balanceOf = async function(account) {
      let balance = await contract.balanceOf(account, this.id);
      return numberToBN(balance);
    }

  }

  function Condition(oracle, questionId, outcomesSlotsCount) {
    this.oracle = oracle;
    this.questionId = questionId;
    this.outcomesSlotsCount = outcomesSlotsCount;
    this.id = hgUtils.getConditionId(oracle, questionId, outcomesSlotsCount);

    this.fullSplit = async function(collateralAddress) {
      var indexSet = hgUtils.generateFullIndex(this.outcomesSlotsCount);
      return this.split(collateralAddress, indexSet);
    };

    this.split = async function(collateralAddress, indexSet) {
      await contract.splitPosition(collateralAddress, ethers.constants.HashZero, this.id, indexSet, 100);
      return indexSet.map( (index) => {
        return new Position(this, index, collateralAddress);
      });
    };

    this.mergeAll = async function(collateralAddress) {
      var indexSet = hgUtils.generateFullIndex(this.outcomesSlotsCount);
      await contract.mergePositions(collateralAddress, ethers.constants.HashZero, this.id, indexSet, 100);
    }

  }

};


module.exports = HG;
