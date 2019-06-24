const TestPMS = artifacts.require("TestPMS");
const CollateralToken = artifacts.require("CollateralToken");
const HG = require("../index.js");

require("./test-setup");

contract('Split & merge 2 slots', function ([owner, oracle]) {

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
  });

  step("should split & merge 2 positions", async function () {
    condition = await hg.prepareCondition('2 slots condition', oracle, 2);
    await collateral.mint(owner, 100);
    await collateral.approve(pms.address, 100);

    positions = await condition.fullSplit(collateral.address, 100);

    await condition.merge(positions, 100);
  });

  step("should split & merge 4 positions", async function () {
    condition = await hg.prepareCondition('4 slots condition', oracle, 4);
    await collateral.mint(owner, 100);
    await collateral.approve(pms.address, 100);

    positions = await condition.fullSplit(collateral.address, 100);

    await condition.merge(positions, 100);
  });

  step("should split & merge 8 positions", async function () {
    condition = await hg.prepareCondition('8 slots condition', oracle, 8);
    await collateral.mint(owner, 100);
    await collateral.approve(pms.address, 100);

    positions = await condition.fullSplit(collateral.address, 100);

    await condition.merge(positions, 100);
  })

  step("should split & merge 16 positions", async function () {
    condition = await hg.prepareCondition('16 slots condition', oracle, 16);
    await collateral.mint(owner, 100);
    await collateral.approve(pms.address, 100);

    positions = await condition.fullSplit(collateral.address, 100);

    await condition.merge(positions, 100);
  });

  step("should split 32 positions", async function () {
    condition = await hg.prepareCondition('32 slots condition', oracle, 32);
    await collateral.mint(owner, 100);
    await collateral.approve(pms.address, 100);

    positions = await condition.fullSplit(collateral.address, 100);
  });

  step("should split 64 positions", async function () {
    condition = await hg.prepareCondition('64 slots condition', oracle, 64);
    await collateral.mint(owner, 100);
    await collateral.approve(pms.address, 100);

    positions = await condition.fullSplit(collateral.address, 100);
  });

  step("should split 128 positions", async function () {
    condition = await hg.prepareCondition('128 slots condition', oracle, 128);
    await collateral.mint(owner, 100);
    await collateral.approve(pms.address, 100);

    positions = await condition.fullSplit(collateral.address, 100);
  });

  step("should split 256 positions", async function () {
    condition = await hg.prepareCondition('128 slots condition', oracle, 256);
    await collateral.mint(owner, 100);
    await collateral.approve(pms.address, 100);

    positions = await condition.fullSplit(collateral.address, 100);
  });


});
