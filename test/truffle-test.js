const TestPMS = artifacts.require("TestPMS");
const CollateralToken = artifacts.require("CollateralToken");
const HG = require("../index.js");

const {toHex, padLeft, keccak256, asciiToHex, toBN, fromWei} = web3.utils;

require("./test-setup");

contract('Conditional Coupon', function ([owner, oracle]) {


  contract('Should fully split and merge', async function () {

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

    step("should split merge", async function () {
      await collateral.mint(owner, 100);
      await collateral.approve(pms.address, 100);

      let positions = await condition.fullSplit(collateral.address, 100);

      (await collateral.balanceOf(owner)).should.be.bignumber.equal('0');
      (await collateral.balanceOf(pms.address)).should.be.bignumber.equal('100');

      positions.length.should.be.equal(2);

      (await positions[0].balanceOf(owner)).should.be.bignumber.equal('100');
      (await positions[1].balanceOf(owner)).should.be.bignumber.equal('100');
    });

    step("should merge position", async function () {
      await condition.mergeAll(collateral.address, 100);

      (await collateral.balanceOf(owner)).should.be.bignumber.equal('100');
      (await collateral.balanceOf(pms.address)).should.be.bignumber.equal('0');
    });

  });

  contract('Should split and merge using positions api', async function () {

    var pms;
    var collateral;
    var hg;
    var condition;
    var positions;

    step("should create Prediction Market System & Collateral contracts", async function () {
      pms = await TestPMS.new();
      collateral = await CollateralToken.new();
    });

    step("should bind contracts", async function () {
      hg = new HG(pms.address);
      condition = await hg.prepareCondition('Second Condition', oracle, 3);
    });

    step("should split merge", async function () {
      await collateral.mint(owner, 100);
      await collateral.approve(pms.address, 100);

      positions = await condition.fullSplit(collateral.address, 100);

      (await collateral.balanceOf(owner)).should.be.bignumber.equal('0');
      (await collateral.balanceOf(pms.address)).should.be.bignumber.equal('100');

      positions.length.should.be.equal(3);

      (await positions[0].balanceOf(owner)).should.be.bignumber.equal('100');
      (await positions[1].balanceOf(owner)).should.be.bignumber.equal('100');
      (await positions[2].balanceOf(owner)).should.be.bignumber.equal('100');
    });

    step("should merge position", async function () {
      await condition.merge(positions, 100);

      (await collateral.balanceOf(owner)).should.be.bignumber.equal('100');
      (await collateral.balanceOf(pms.address)).should.be.bignumber.equal('0');
    });

  });

  contract('Should split and partly merge using positions api', async function () {

    var pms;
    var collateral;
    var hg;
    var condition;
    var positions;

    step("should create Prediction Market System & Collateral contracts", async function () {
      pms = await TestPMS.new();
      collateral = await CollateralToken.new();
    });

    step("should bind contracts", async function () {
      hg = new HG(pms.address);
      condition = await hg.prepareCondition('Third Condition', oracle, 3);
    });

    step("should split merge", async function () {
      await collateral.mint(owner, 100);
      await collateral.approve(pms.address, 100);

      positions = await condition.fullSplit(collateral.address, 100);

      (await collateral.balanceOf(owner)).should.be.bignumber.equal('0');
      (await collateral.balanceOf(pms.address)).should.be.bignumber.equal('100');

      positions.length.should.be.equal(3);

      (await positions[0].balanceOf(owner)).should.be.bignumber.equal('100');
      (await positions[1].balanceOf(owner)).should.be.bignumber.equal('100');
      (await positions[2].balanceOf(owner)).should.be.bignumber.equal('100');
    });

    step("should merge position", async function () {
      let mergedPosition = await condition.merge([positions[0], positions[1]], 10);

      (await positions[0].balanceOf(owner)).should.be.bignumber.equal('90');
      (await positions[1].balanceOf(owner)).should.be.bignumber.equal('90');
      (await positions[2].balanceOf(owner)).should.be.bignumber.equal('100');
      (await mergedPosition.balanceOf(owner)).should.be.bignumber.equal('10');

      (await collateral.balanceOf(owner)).should.be.bignumber.equal('0');
      (await collateral.balanceOf(pms.address)).should.be.bignumber.equal('100');
    });

  });

});
