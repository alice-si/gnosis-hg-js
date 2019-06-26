const {soliditySha3} = web3.utils;
const ethers = require('ethers');

const full256 = web3.utils.toBN(1).shln(256).sub(web3.utils.toBN(1));

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

  getCollectionId(parentCollecionId, conditionId, indexSet) {
    return web3.utils.padLeft(
      web3.utils.toHex(
        web3.utils.toBN(
          web3.utils.soliditySha3({
            t: 'bytes32',
            v: conditionId
          }, {
            t: 'uint',
            v: indexSet
          })
        ).add(
          web3.utils.toBN(parentCollecionId)
        ).and(full256)
      ), 64
    );
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
    var current = ethers.utils.bigNumberify(1);
    const factor = ethers.utils.bigNumberify(2);
    for(var i=0; i<count; i++) {
      arr.push(current);
      current = current.mul(factor);
    }
    return arr;
  }
};

module.exports = Utils;
