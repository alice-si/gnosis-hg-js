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
  var positionA1;
  var positionA2;
  var positionB1;
  var positionB2;

  var positionA1B1;
  var positionA1B2;

  step("should create Prediction Market System & Collateral contracts", async function () {
    pms = await TestPMS.new();
    collateral = await CollateralToken.new();
  });

  step("should bind contracts", async function () {
    hg = new HG(pms.address);
    conditionA = await hg.prepareCondition('A', owner, 2);
    conditionB = await hg.prepareCondition('B', owner, 2);
  });

  step("should split on condition A 1st level", async function () {
    await collateral.mint(owner, 10);
    await collateral.approve(pms.address, 10);

    let positions = await conditionA.fullSplit(collateral.address, 10);

    (await collateral.balanceOf(owner)).should.be.bignumber.equal('0');
    (await collateral.balanceOf(pms.address)).should.be.bignumber.equal('10');

    positionA1 = positions[0];
    positionA2 = positions[1];

    (await positionA1.balanceOf(owner)).should.be.bignumber.equal('10');
    (await positionA2.balanceOf(owner)).should.be.bignumber.equal('10');
  });

  step("should split on condition B 1st level", async function () {
    await collateral.mint(owner, 10);
    await collateral.approve(pms.address, 10);

    let positions = await conditionB.fullSplit(collateral.address, 10);

    (await collateral.balanceOf(owner)).should.be.bignumber.equal('0');
    (await collateral.balanceOf(pms.address)).should.be.bignumber.equal('20');

    positionB1 = positions[0];
    positionB2 = positions[1];

    (await positionB1.balanceOf(owner)).should.be.bignumber.equal('10');
    (await positionB2.balanceOf(owner)).should.be.bignumber.equal('10');
  });

  step("should split on 2nd level AB", async function () {
    let positions = await positionA1.fullSplit(conditionB, 10);

    positionA1B1 = positions[0];
    positionA1B2 = positions[1];

    (await positionA1.balanceOf(owner)).should.be.bignumber.equal('0');
    (await positionA1B1.balanceOf(owner)).should.be.bignumber.equal('10');
    (await positionA1B2.balanceOf(owner)).should.be.bignumber.equal('10');
  });

  step("should report results", async function () {
    await conditionA.receiveResult([1,0]);
  });

  step("should redeem A1B1", async function () {
    (await positionA1B1.balanceOf(owner)).should.be.bignumber.equal('10');
    (await positionA1B2.balanceOf(owner)).should.be.bignumber.equal('10');
    (await positionB1.balanceOf(owner)).should.be.bignumber.equal('10');

    await positionA1B1.redeem(positionB1.collectionId, conditionA);

    (await positionA1B1.balanceOf(owner)).should.be.bignumber.equal('0');
    (await positionA1B2.balanceOf(owner)).should.be.bignumber.equal('10');
    (await positionB1.balanceOf(owner)).should.be.bignumber.equal('20');
    (await positionB2.balanceOf(owner)).should.be.bignumber.equal('10');

  });

  step("should redeem A1B2", async function () {
    (await positionA1B1.balanceOf(owner)).should.be.bignumber.equal('0');
    (await positionA1B2.balanceOf(owner)).should.be.bignumber.equal('10');
    (await positionB1.balanceOf(owner)).should.be.bignumber.equal('20');
    (await positionB2.balanceOf(owner)).should.be.bignumber.equal('10');

    await positionA1B2.redeem(positionB2.collectionId, conditionA, 1);

    (await positionA1B1.balanceOf(owner)).should.be.bignumber.equal('0');
    (await positionA1B2.balanceOf(owner)).should.be.bignumber.equal('0');
    (await positionB1.balanceOf(owner)).should.be.bignumber.equal('20');
    (await positionB2.balanceOf(owner)).should.be.bignumber.equal('20');

  });


  //col(A1, B, 1) = A1 + keccak(B, 1) = keccak(A, 1) + keccak(B, 1)
  //col(B1, A, 1) = B1 + keccak(A, 1) = keccak(B, 1) + keccak(A, 1)

  //col(A1, B, 2) = A1 + keccak(B, 2) = keccak(A, 1) + keccak(B, 2)
  //col(B2, A, 1) = B2 + keccak(A, 1) = keccak(B, 2) + keccak(A, 1)

  //col(A1B1, C, 1) = A1B1 + keccak(C, 1)

});
