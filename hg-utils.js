const {soliditySha3, toHex, padLeft, keccak256, asciiToHex, toBN, fromWei} = web3.utils;

const Utils = {
  getConditionId : function (oracle, questionId, slotsCount) {
    return soliditySha3({
      t: 'address',
      v: oracle
    }, {
      t: 'bytes32',
      v: questionId
    }, {
      t: 'uint',
      v: slotsCount
    });
  },

  getCollectionId(conditionId, indexSet) {
    return web3.utils.soliditySha3({
      t: 'bytes32',
      v: conditionId
    }, {
      t: 'uint',
      v: indexSet
    })
  },

  getPositionId(collectionId, collateral) {
    return web3.utils.soliditySha3({
      t: 'address',
      v: collateral
    }, {
      t: 'bytes32',
      v: collectionId
    });
  },

  generateFullIndex : function(count) {
    var arr = [];
    for(var i=0; i<count; i++) {
      arr.push(1 << i);
    }
    return arr;
  }
};

module.exports = Utils;
