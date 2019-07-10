const TestPMS = artifacts.require("TestPMS");
const CollateralToken = artifacts.require("CollateralToken");
const HG = require("../index.js");

require("./test-setup");

contract('Should fully split and merge', function ([owner, oracle]) {

  var pms;
  var collateral;
  var hg;
  var condition;
  var positions;
  var positions2Split;

  step("should create Prediction Market System & Collateral contracts", async function () {
    pms = await TestPMS.new();
    collateral = await CollateralToken.new();
  });

  step("should bind contracts", async function () {
    hg = new HG(pms.address);
    condition = await hg.prepareCondition('First Condition', oracle, 2);
  });

  step("should split first time", async function () {
    await collateral.mint(owner, 100);
    await collateral.approve(pms.address, 100);

    positions = await condition.fullSplit(collateral.address, 100);

    (await collateral.balanceOf(owner)).should.be.bignumber.equal('0');
    (await collateral.balanceOf(pms.address)).should.be.bignumber.equal('100');

    positions.length.should.be.equal(2);

    (await positions[0].balanceOf(owner)).should.be.bignumber.equal('100');
    (await positions[1].balanceOf(owner)).should.be.bignumber.equal('100');
  });

  step("should split second time", async function () {
    await collateral.mint(owner, 50);
    await collateral.approve(pms.address, 50);

    positions2Split = await condition.fullSplit(collateral.address, 50);

    (await collateral.balanceOf(owner)).should.be.bignumber.equal('0');
    (await collateral.balanceOf(pms.address)).should.be.bignumber.equal('150');

    positions2Split.length.should.be.equal(2);

    (await positions[0].balanceOf(owner)).should.be.bignumber.equal('150');
    (await positions[1].balanceOf(owner)).should.be.bignumber.equal('150');
  });

});
