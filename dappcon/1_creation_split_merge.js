const TestPMS = artifacts.require("TestPMS");
const CollateralToken = artifacts.require("CollateralToken");
const HG = require("../index.js");

require("../test/test-setup");

contract('Should fully split and merge', function ([owner, oracle]) {

  var pms;
  var collateral;
  var hg;
  var condition;

  step("Let's deploy all of the necessary contracts", async function () {
    pms = await TestPMS.new();
    collateral = await CollateralToken.new();
  });

  step("1. We should bind the HG library to the contract address", async function () {
    hg = new HG(pms.address);

  });

  step("2. Let's create the first position", async function () {
    condition = await hg.prepareCondition('First Condition', oracle, 2);
  });

  //Beware of making an allowance first by approving a desired value of collateral to the pms contract
  //We can check the balance of collateral and position tokens afterwards
  step("3. Let's create the first split", async function () {
    await collateral.mint(owner, 100);
    await collateral.approve(pms.address, 100);

    let positions = await condition.fullSplit(collateral.address, 100);

    (await collateral.balanceOf(owner)).should.be.bignumber.equal('0');
    (await collateral.balanceOf(pms.address)).should.be.bignumber.equal('100');

    positions.length.should.be.equal(2);

    (await positions[0].balanceOf(owner)).should.be.bignumber.equal('100');
    (await positions[1].balanceOf(owner)).should.be.bignumber.equal('100');
  });

  //We can check the balance of collateral and position tokens afterwards
  step("3. Let's fully merge the positions", async function () {
    await condition.mergeAll(collateral.address, 100);

    (await collateral.balanceOf(owner)).should.be.bignumber.equal('100');
    (await collateral.balanceOf(pms.address)).should.be.bignumber.equal('0');
  });

});
