const TestPMS = artifacts.require("TestPMS");
const CollateralToken = artifacts.require("CollateralToken");
const HG = require("../index.js");

require("../test/test-setup");

contract('Should fully split and merge', function ([user, oracle]) {

  var pms;
  var collateral;
  var hg;
  var condition;
  var positions;

  before("Let's deploy all of the necessary contracts", async function () {
    pms = await TestPMS.new();
    collateral = await CollateralToken.new();
  });

  step("1. We should bind the HG library to the contract address", async function () {
    hg = new HG(pms.address);
    hg.should.be.not.null;
  });

  step("2. Let's create the first condition", async function () {
    condition = await hg.prepareCondition('First condition', oracle, 2);
    condition.should.be.not.null;
  });


  //We can check the balance of collateral and position tokens afterwards
  step("3. Let's create the first split", async function () {
    //Beware of minting the collateral tokens
    //and making an allowance first by approving a desired value of collateral to the pms contract
    await collateral.mint(user, 100);
    await collateral.approve(pms.address, 100);

    //Remember to pass the collateral amount to the split function
    let positions = await condition.fullSplit(collateral.address, 100);

    positions.length.should.be.equal(2);

    //We can check the balance of collateral for the user and pms contract
    (await collateral.balanceOf(user)).should.be.bignumber.equal('0');
    (await collateral.balanceOf(pms.address)).should.be.bignumber.equal('100');

    //We can also check the balances of the newly created positions
    (await positions[0].balanceOf(user)).should.be.bignumber.equal('100');
    (await positions[1].balanceOf(user)).should.be.bignumber.equal('100');
  });


  step("4. Let's fully merge the positions", async function () {
    //Remember of passing the desired amount of tokens to be merged
    await condition.mergeAll(collateral.address, 100);

    //We can check the balance of collateral held by user and the pms contract
    (await collateral.balanceOf(user)).should.be.bignumber.equal('100');
    (await collateral.balanceOf(pms.address)).should.be.bignumber.equal('0');
  });

});
