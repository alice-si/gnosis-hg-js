const web3Gnosis = require('web3');
const { soliditySha3, padLeft, toHex } = web3Gnosis.utils;
const ethers = require('ethers');

const full256 = web3Gnosis.utils.toBN(1).shln(256).sub(web3Gnosis.utils.toBN(1));

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
    return web3Gnosis.utils.padLeft(
      web3Gnosis.utils.toHex(
        web3Gnosis.utils.toBN(
          web3Gnosis.utils.soliditySha3({
            t: 'bytes32',
            v: conditionId
          }, {
            t: 'uint',
            v: indexSet
          })
        ).add(
          web3Gnosis.utils.toBN(parentCollecionId)
        ).and(full256)
      ), 64
    );
  },

  getPositionId(collectionId, collateral) {
    return web3Gnosis.utils.soliditySha3({
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
  },

  formatResult : function(result) {
    return toHex(
      result.reduce( (acc, item) => {
        return acc + padLeft(item, 64).substr(2);
      }, "0x")
    );
  },
};

module.exports = Utils;
