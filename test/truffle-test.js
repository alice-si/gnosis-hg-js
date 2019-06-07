const TestPMS = artifacts.require("TestPMS");
const CollateralToken = artifacts.require("CollateralToken");
const HG = require("../index.js");

const {toHex, padLeft, keccak256, asciiToHex, toBN, fromWei} = web3.utils;

require("./test-setup");

contract('Conditional Coupon', function ([owner, oracle, donor, hacker]) {


  contract('Should split and merge', async function () {

    var pms;
    var collateral;
    var hg;
    var condition;

    step("should create Prediction Market System & Collateral contracts", async function () {
      pms = await TestPMS.new();
      collateral = await CollateralToken.new();
    });

    step("should bind contracts", async function () {
      hg = new HG(pms.address);
      condition = await hg.prepareCondition('First Condition', oracle, 2);
    });

    step("should split", async function () {
      await collateral.mint(owner, 100);
      await collateral.approve(pms.address, 100);

      await condition.split(collateral.address, 100);

      (await collateral.balanceOf(owner)).should.be.bignumber.equal('0');
      (await collateral.balanceOf(pms.address)).should.be.bignumber.equal('100');

    });

    step("should merge position", async function () {
      await condition.mergeAll(collateral.address, 100);

      (await collateral.balanceOf(owner)).should.be.bignumber.equal('100');
      (await collateral.balanceOf(pms.address)).should.be.bignumber.equal('0');
    });

  });

});
