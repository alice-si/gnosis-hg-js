const TestPMS = artifacts.require("TestPMS");
const CollateralToken = artifacts.require("CollateralToken");
const HG = require("../index.js");

require("../test/test-setup");

contract('Should fully split and merge', function ([user]) {

  var pms;
  var collateral;
  var hg;
  var condition;

  step("Let's deploy all of the necessary contracts", async function () {
    pms = await TestPMS.new();
    collateral = await CollateralToken.new();
  });

  step("1. We should bind the HG library to the contract address", async function () {

  });

  step("2. Let's create the first position", async function () {

  });


  //We can check the balance of collateral and position tokens afterwards
  step("3. Let's create the first split", async function () {
    //Beware of minting the collateral tokens
    //and making an allowance first by approving a desired value of collateral to the pms contract


    //Remember to pass the collateral amount to the split function

    //We can check the balance of collateral for the user and pms contract

    //We can also check the balances of the newly created positions
  });


  step("4. Let's fully merge the positions", async function () {
    //Remember of passing the desired amount of tokens to be merged

    //We can check the balance of collateral held by user and the pms contract
  });

});
