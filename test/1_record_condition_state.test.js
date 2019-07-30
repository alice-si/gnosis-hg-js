const TestPMS = artifacts.require("TestPMS");
const CollateralToken = artifacts.require("CollateralToken");
const HG = require('../index.js');

require('./test-setup.js');

contract('Should persist state', function([owner, oracle]) {
  var pms;
  var collateral;
  var hg;
  var hgRegistry;
  var condition;
  var conditions;

  step("should create Prediction Market System & Collateral contracts", async function () {
    pms = await TestPMS.new();
    collateral = await CollateralToken.new();
  });

  step("should create new HG Contract & HG Registry", async function() {
    hg = new HG(pms.address);
    hgRegistry = await hg.createRegistry();
  });

  step("should create Condition, send condition to hgRegistry to track and save state", async function() {
    condition = await hg.prepareCondition('Test State', oracle, 2);
    conditions = await hgRegistry.getEvents(condition);
    conditions.length.should.be.equal(1);
  })
})


// getEvents().forEach.push
