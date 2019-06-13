const TestPMS = artifacts.require("TestPMS");
const CollateralToken = artifacts.require("CollateralToken");
const HG = require("../index.js");

require("./test-setup");

contract('Should fully split and merge on 2 levels', function ([owner, oracle]) {

  var pms;
  var collateral;
  var hg;
  var condition;
  var positions;

  var condition2level;
  var positions2level;

  step("should create Prediction Market System & Collateral contracts", async function () {
    pms = await TestPMS.new();
    collateral = await CollateralToken.new();
  });

  step("should bind contracts", async function () {
    hg = new HG(pms.address);
    condition = await hg.prepareCondition('First questions', oracle, 2);
  });

  step("should split on 1st level", async function () {
    await collateral.mint(owner, 100);
    await collateral.approve(pms.address, 100);

    positions = await condition.fullSplit(collateral.address, 100);

    (await collateral.balanceOf(owner)).should.be.bignumber.equal('0');
    (await collateral.balanceOf(pms.address)).should.be.bignumber.equal('100');

    positions.length.should.be.equal(2);

    (await positions[0].balanceOf(owner)).should.be.bignumber.equal('100');
    (await positions[1].balanceOf(owner)).should.be.bignumber.equal('100');
  });

  step("should split on 2nd level", async function () {
    condition2level = await hg.prepareCondition('Second questions', oracle, 2);
    positions2level = await positions[0].fullSplit(condition2level, 10);

    positions2level.length.should.be.equal(2);

    (await positions[0].balanceOf(owner)).should.be.bignumber.equal('90');
    (await positions[1].balanceOf(owner)).should.be.bignumber.equal('100');

    (await positions2level[0].balanceOf(owner)).should.be.bignumber.equal('10');
    (await positions2level[1].balanceOf(owner)).should.be.bignumber.equal('10');
  });

  step("should merge 2nd level position", async function () {
    let mergedPosition = await condition2level.merge([positions2level[0], positions2level[1]], 10);

    mergedPosition.id.should.be.equal(positions[0].id);

    (await positions[0].balanceOf(owner)).should.be.bignumber.equal('100');
    (await positions[1].balanceOf(owner)).should.be.bignumber.equal('100');

    (await positions2level[0].balanceOf(owner)).should.be.bignumber.equal('0');
    (await positions2level[1].balanceOf(owner)).should.be.bignumber.equal('0');


    (await collateral.balanceOf(owner)).should.be.bignumber.equal('0');
    (await collateral.balanceOf(pms.address)).should.be.bignumber.equal('100');
  });

  step("should merge 1st level position", async function () {
    await condition.merge([positions[0], positions[1]], 100);


    (await positions[0].balanceOf(owner)).should.be.bignumber.equal('0');
    (await positions[1].balanceOf(owner)).should.be.bignumber.equal('0');

    (await collateral.balanceOf(owner)).should.be.bignumber.equal('100');
    (await collateral.balanceOf(pms.address)).should.be.bignumber.equal('0');
  });

});
