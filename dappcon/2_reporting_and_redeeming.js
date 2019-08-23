const TestPMS = artifacts.require("TestPMS");
const CollateralToken = artifacts.require("CollateralToken");
const HG = require("../index.js");

require("../test/test-setup");

contract('Should fully split and merge', function ([user, oracle]) {

  var pms, hg, collateral, condition, positions;

  step("Let's prepare the HG contract and positions", async function () {
    pms = await TestPMS.new();
    collateral = await CollateralToken.new();
    hg = new HG(pms.address);
    condition = await hg.prepareCondition('First Condition', oracle, 2);
    await collateral.mint(user, 100);
    await collateral.approve(pms.address, 100);
    positions = await condition.fullSplit(collateral.address, 100);
  });

  step("1. Let's report the results", async function () {
    //Pass the result as an array with the size equal to the outcome slots number
    //putting 1 as a winner and 0 as a looser

  });

  step("2. Let's try to redeem the collateral on a loosing position", async function () {
    //You should use the redeem method

    //We can check the balance of collateral held by the user and pms contract

    //We can also check the position balance

  });

  step("3. Let's try to redeem the collateral on a winning position", async function () {
    //You should use the redeem method

    //We can check the balance of collateral held by the user and pms contract

    //We can also check the position balance
  });

});
