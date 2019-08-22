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
    conditionA = await hg.prepareCondition('Condition A', oracle, 2);
    [positionA1, positionA2] = await conditionA.fullSplit(collateral.address, 100);

    //Check the balances of user, pms
    (await collateral.balanceOf(user)).should.be.bignumber.equal('100');
    (await collateral.balanceOf(pms.address)).should.be.bignumber.equal('100');

    //Check the balances of newly created positionA1, positionA2
    (await positionA1.balanceOf(user)).should.be.bignumber.equal('100');
    (await positionA2.balanceOf(user)).should.be.bignumber.equal('100');

  });

  step("2. Let's create conditionB and fully split it to: positionB1 & position B2", async function () {
    conditionB = await hg.prepareCondition('Condition B', oracle, 2);
    [positionB1, positionB2] = await conditionB.fullSplit(collateral.address, 100);

    //Check the balances of user, pms
    (await collateral.balanceOf(user)).should.be.bignumber.equal('0');
    (await collateral.balanceOf(pms.address)).should.be.bignumber.equal('200');

    //Check the balances of newly created positionB1, positionB2
    (await positionB1.balanceOf(user)).should.be.bignumber.equal('100');
    (await positionB2.balanceOf(user)).should.be.bignumber.equal('100');
  });

  step("3. Let's split a half of the positionA1 (50 tokens) by conditionB", async function () {
    [positionA1B1, positionA1B2] = await positionA1.fullSplit(conditionB, 50);

    //Check the balance of the original position A1
    (await positionA1.balanceOf(user)).should.be.bignumber.equal('50');

    //Check the balances of the newly created positionA1B1 & positionA1B2
    (await positionA1B1.balanceOf(user)).should.be.bignumber.equal('50');
    (await positionA1B2.balanceOf(user)).should.be.bignumber.equal('50');
  });

  step("4. Let's split a quarter of the positionB1 (25 tokens) by conditionA", async function () {
    [positionB1A1, positionB1A2] = await positionB1.fullSplit(conditionA, 25);

    //Check the balance of the original position B1
    (await positionB1.balanceOf(user)).should.be.bignumber.equal('75');

    //Check the balances of the newly created positionB1A1 & positionB1A2
    (await positionB1A1.balanceOf(user)).should.be.bignumber.equal('75');
    (await positionB1A2.balanceOf(user)).should.be.bignumber.equal('25');
  });

  step("5. Let's report result 1 for condition A", async function () {
    await conditionA.receiveResult([1,0]);
  });

  step("6. Let's redeem collateral for positionA1", async function () {
    await positionA1.redeem();

    //Check the balance of the user and pms
    (await collateral.balanceOf(user)).should.be.bignumber.equal('50');
    (await collateral.balanceOf(pms.address)).should.be.bignumber.equal('150');
  });

  step("7. Let's redeem collateral for positionA1B1", async function () {
    //The redeem requires to pass the remaining collectionId (positionB1.collectionId, resolved condition, and result)
    await positionA1B1.redeem(positionB1.collectionId, conditionA, 1);

    //Check the balance of the positionB1
    (await positionB1.balanceOf(user)).should.be.bignumber.equal('150');

    //Check the balances of the positions: positionB1A1 & positionB1A2
    (await positionB1A1.balanceOf(user)).should.be.bignumber.equal('0');
    (await positionB1A2.balanceOf(user)).should.be.bignumber.equal('25');
  });

  step("8. Let's redeem collateral for positionA1B2", async function () {
    //The redeem requires to pass the remaining collectionId (positionB1.collectionId, resolved condition, and result)
    await positionA1B2.redeem(positionB2.collectionId, conditionA, 1);

    //Check the balance of the positionB2
    (await positionB2.balanceOf(user)).should.be.bignumber.equal('150');
  });


});
