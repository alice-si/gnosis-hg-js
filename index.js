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


  function Position(condition, indexSet, collateralAddress, parent) {
    this.condition = condition;
    this.indexSet = indexSet;
    this.collateralAddress = collateralAddress;
    this.parent = parent;
    let parentCollectionId = parent ? parent.collectionId : ethers.constants.HashZero;
    this.collectionId = hgUtils.getCollectionId(parentCollectionId, condition.id, this.indexSet);
    this.id = hgUtils.getPositionId(this.collectionId, this.collateralAddress);

    this.balanceOf = async function(account) {
      let balance = await contract.balanceOf(account, this.id);
      return numberToBN(balance);
    }

    this.fullSplit = async function(condition, value) {
      return condition.fullSplit(this.collateralAddress, value, this);
    }

  }

  function Condition(oracle, questionId, outcomesSlotsCount) {
    this.oracle = oracle;
    this.questionId = questionId;
    this.outcomesSlotsCount = outcomesSlotsCount;
    this.id = hgUtils.getConditionId(oracle, questionId, outcomesSlotsCount);

    this.split = async function(collateralAddress, indexSet, value, parent) {
      let parentCollectionId = parent ? parent.collectionId : ethers.constants.HashZero;
      await contract.splitPosition(collateralAddress, parentCollectionId, this.id, indexSet, value);

      return indexSet.map( (index) => {
        return new Position(this, index, collateralAddress, parent);
      });
    };

    this.fullSplit = async function(collateralAddress, value, parent) {
      var indexSet = hgUtils.generateFullIndex(this.outcomesSlotsCount);
      return this.split(collateralAddress, indexSet, value, parent);
    };

    this.rawMerge = async function(collateralAddress, indexSet, value, parent) {
      await contract.mergePositions(collateralAddress, parent ? parent.collectionId : ethers.constants.HashZero, this.id, indexSet, value);
    }

    this.merge = async function(positions, value) {
      var collateralAddress = null;
      var indexSet = [];
      var fullIndexSet = (1 << this.outcomesSlotsCount) - 1;
      var freeIndexSet = fullIndexSet;
      positions.forEach( (position) => {
        if (collateralAddress && collateralAddress != position.collateralAddress) {
          throw "All of the positions to merge must have the same collateral";
        } else {
          collateralAddress = position.collateralAddress;
          indexSet.push(position.indexSet);
          freeIndexSet = freeIndexSet ^ position.indexSet;
        }
      });
      await this.rawMerge(collateralAddress, indexSet, value, positions[0].parent);
      return freeIndexSet == 0 ? (positions[0].parent ? positions[0].parent : null) : new Position(this, fullIndexSet ^ freeIndexSet, collateralAddress);


    }

    this.mergeAll = async function(collateralAddress, value) {
      var indexSet = hgUtils.generateFullIndex(this.outcomesSlotsCount);
      return this.rawMerge(collateralAddress, indexSet, value);
    }

    //For debug purposes
    this.printAllPositions = async function(address, collateralAddress) {
      for(var i=0; i<1<<outcomesSlotsCount; i++) {
        let position = new Position(this, i, collateralAddress);
        let b = await position.balanceOf(address);
        console.log(i + " : " + b.toString());
      }
    }
  }

};


module.exports = HG;
