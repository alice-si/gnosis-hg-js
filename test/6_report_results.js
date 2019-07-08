const TestPMS = artifacts.require("TestPMS");
const CollateralToken = artifacts.require("CollateralToken");
const HG = require("../index.js");

require("./test-setup");

contract('Should partly split and merge', function ([owner, oracle]) {

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
    condition = await hg.prepareCondition('Third Condition', owner, 3);
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

  step("should report results", async function () {
    await condition.receiveResult([1,0,0]);
  });

});
