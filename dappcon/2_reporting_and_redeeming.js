const TestPMS = artifacts.require("TestPMS");
const CollateralToken = artifacts.require("CollateralToken");
const HG = require("../index.js");

require("../test/test-setup");

contract('Should fully split and merge', function ([owner, oracle]) {

  var pms, hg, collateral, condition, positions;

  step("Let's prepare the HG contract and positions", async function () {
    pms = await TestPMS.new();
    collateral = await CollateralToken.new();
    hg = new HG(pms.address);
    condition = await hg.prepareCondition('First Condition', oracle, 2);
    await collateral.mint(owner, 100);
    await collateral.approve(pms.address, 100);
    positions = await condition.fullSplit(collateral.address, 100);
  });

  step("1. Let's report the results", async function () {
    await condition.receiveResult([1,0]);
  });

  step("2. Let's try to redeem the collateral on a loosing position", async function () {
    await positions[1].redeem();

    (await positions[1].balanceOf(owner)).should.be.bignumber.equal('0');
    (await collateral.balanceOf(owner)).should.be.bignumber.equal('0');
    (await collateral.balanceOf(pms.address)).should.be.bignumber.equal('100');
  });

  step("3. Let's try to redeem the collateral on a winning position", async function () {
    //Successful
    await positions[0].redeem();
    (await positions[0].balanceOf(owner)).should.be.bignumber.equal('0');
    (await collateral.balanceOf(owner)).should.be.bignumber.equal('100');
    (await collateral.balanceOf(pms.address)).should.be.bignumber.equal('0');
  });


});
