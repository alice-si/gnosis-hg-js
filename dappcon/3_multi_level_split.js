const TestPMS = artifacts.require("TestPMS");
const CollateralToken = artifacts.require("CollateralToken");
const HG = require("../index.js");

require("../test/test-setup");

contract('Should fully split and merge', function ([user, oracle]) {

  var pms, hg, collateral;
  var conditionA, conditionB;
  var positionA1, positionA2, positionB1, positionB2;
  var positionA1B1, positionA1B2, positionA2B1, positionA2B2;
  var positionB1A1, positionB1A2, positionB2A1, positionB2A2;

  step("Let's prepare the HG and collateral", async function () {
    pms = await TestPMS.new();
    collateral = await CollateralToken.new();
    hg = new HG(pms.address);
    await collateral.mint(user, 200);
    await collateral.approve(pms.address, 200);
  });

  step("1. Let's create conditionA and fully split it to: positionA1 & position A2 ", async function () {
    //Try calling prepareCondition and then fullSplit methods

    //Check the balances of user, pms


    //Check the balances of newly created positionA1, positionA2
  });

  step("2. Let's create conditionB and fully split it to: positionB1 & position B2", async function () {


    //Check the balances of user, pms

    //Check the balances of newly created positionB1, positionB2
  });

  step("3. Let's split a half of the positionA1 (50 tokens) by conditionB", async function () {
    //Try calling the fullSplit method directly on the position object

    //Check the balance of the original position A1

    //Check the balances of the newly created positionA1B1 & positionA1B2
  });

  step("4. Let's split a quarter of the positionB1 (25 tokens) by conditionA", async function () {


    //Check the balance of the original position B1

    //Check the balances of the newly created positionB1A1 & positionB1A2
  });

  step("5. Let's report result 1 for condition A", async function () {

  });

  step("6. Let's redeem collateral for positionA1", async function () {

    //Check the balance of the user and pms

  });

  step("7. Let's redeem collateral for positionA1B1", async function () {
    //The redeem requires to pass the remaining collectionId (positionB1.collectionId, resolved condition, and result)

    //Check the balance of the positionB1

    //Check the balances of the positions: positionB1A1 & positionB1A2
  });

  step("8. Let's redeem collateral for positionA1B2", async function () {

    //Check the balance of the positionB2

  });


});
