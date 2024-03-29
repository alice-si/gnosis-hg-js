const TestPMS = artifacts.require("TestPMS");
const CollateralToken = artifacts.require("CollateralToken");
const HG = require("../index.js");
const hgUtils = require('../hg-utils.js');

require("./test-setup");

contract('Should partly split and merge', function ([owner, oracle]) {

  var pms;
  var collateral;
  var hg;
  var conditionA;
  var conditionB;
  var conditionC;

  var positionA1;

  var positionB1;

  var positionA1B1;
  var positionA1B1C1;
  var positionA1B1C2;

  var positionB1C1;
  var positionB1C2;

  step("should create Prediction Market System & Collateral contracts", async function () {
    pms = await TestPMS.new();
    collateral = await CollateralToken.new();
  });

  step("should bind contracts", async function () {
    hg = new HG(pms.address);
    conditionA = await hg.prepareCondition('A', owner, 2);
    conditionB = await hg.prepareCondition('B', owner, 2);
    conditionC = await hg.prepareCondition('C', owner, 2);
  });

  step("should split on condition A 1st level", async function () {
    await collateral.mint(owner, 10);
    await collateral.approve(pms.address, 10);

    let positions = await conditionA.fullSplit(collateral.address, 10);

    (await collateral.balanceOf(owner)).should.be.bignumber.equal('0');
    (await collateral.balanceOf(pms.address)).should.be.bignumber.equal('10');

    positionA1 = positions[0];

    (await positionA1.balanceOf(owner)).should.be.bignumber.equal('10');
  });

  step("should split on condition B 1st level", async function () {
    await collateral.mint(owner, 10);
    await collateral.approve(pms.address, 10);

    let positions = await conditionB.fullSplit(collateral.address, 10);

    (await collateral.balanceOf(owner)).should.be.bignumber.equal('0');
    (await collateral.balanceOf(pms.address)).should.be.bignumber.equal('20');

    positionB1 = positions[0];

    (await positionB1.balanceOf(owner)).should.be.bignumber.equal('10');
  });

  step("should split on condition C 2nd level (B1C)", async function () {
    let positions = await positionB1.fullSplit(conditionC, 10);

    positionB1C1 = positions[0];
    positionB1C2 = positions[1];

    (await positionB1C1.balanceOf(owner)).should.be.bignumber.equal('10');
    (await positionB1C2.balanceOf(owner)).should.be.bignumber.equal('10');
  });

  step("should split on condition B 2nd level (A1B)", async function () {
    let positions = await positionA1.fullSplit(conditionB, 10);

    positionA1B1 = positions[0];

    (await positionA1B1.balanceOf(owner)).should.be.bignumber.equal('10');
  });

  step("should split on condition C 3rd level (A1B1C)", async function () {
    let positions = await positionA1B1.fullSplit(conditionC, 10);

    positionA1B1C1 = positions[0];
    positionA1B1C2 = positions[1];

    (await positionA1B1C1.balanceOf(owner)).should.be.bignumber.equal('10');
    (await positionA1B1C2.balanceOf(owner)).should.be.bignumber.equal('10');
  });

  step("should report results", async function () {
    await conditionA.receiveResult([1,0]);
  });

  step("should redeem A1B1C1", async function () {
    (await positionA1B1C1.balanceOf(owner)).should.be.bignumber.equal('10');
    (await positionB1C1.balanceOf(owner)).should.be.bignumber.equal('10');

    await positionA1B1C1.redeem(positionB1C1.collectionId, conditionA, 1);

    (await positionA1B1C1.balanceOf(owner)).should.be.bignumber.equal('0');
    (await positionB1C1.balanceOf(owner)).should.be.bignumber.equal('20');
  });

  step("should redeem A1B1C2", async function () {
    (await positionA1B1C2.balanceOf(owner)).should.be.bignumber.equal('10');
    (await positionB1C2.balanceOf(owner)).should.be.bignumber.equal('10');

    await positionA1B1C2.redeem(positionB1C2.collectionId, conditionA, 1);

    (await positionA1B1C2.balanceOf(owner)).should.be.bignumber.equal('0');
    (await positionB1C2.balanceOf(owner)).should.be.bignumber.equal('20');
  });
});
