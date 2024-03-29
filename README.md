# gnosis-hg-js
Javascript bindings for the gnosis mercury contracts

If you are a smart-contract veteran, juggling bitwise operations and hex padding in memory, there is absolutely no need
to use this library. For the rest of us mere mortals, this package should make your integration with the new release
of the Gnosis Mercury contracts (HG) much more comfortable.

### Getting started

In order to play with the binding library it's good to have a node environment with the npm package manager.
You will also need [truffle](https://github.com/trufflesuite/truffle) and [ganache-cli](https://github.com/trufflesuite/ganache-cli) to compile the contracts and run tests.

### Dappcon playground

We prepared a set templates to demonstrate how the library works in practice
and let you learn how to use it in an interactive fashion:

    truffle test ./dappcon/*

### Using Gnosis Mercury in 5 lines of code

We assume that you previously deployed the Gnosis contract and a collateral token:

    const HG = require("gnosis-hg-js");
    let hg = new HG(<Your Prediction Market Contract address>);
    let condition = await hg.prepareCondition('Two options', oracle, 2);
    await condition.fullSplit(<Your collateral token>, 100);
    await condition.mergeAll(<Your collateral token>, 100);

### More advanced operation on positions
    const HG = require("gnosis-hg-js");
    let hg = new HG(<Your Prediction Market Contract address>);
    let condition = await hg.prepareCondition('Three options', oracle, 3);
    let positions = await condition.fullSplit(<Your collateral token>, 100);
    let groupedCondition = await condition.merge([position[0], position[1], 10);

### Available functions

#### HG wrapper

| Function | Description |
| --- | --- |
| _new HG(contract_address)_ | Creates a binding wrapper for a deployed prediction market system |
| _prepareCondition(id, oracle_address, number_of_outcome_slots)_ | Creates a new condition |

#### Condition

| Function | Description |
| --- | --- |
| _fullSplit(collateralAddress, amount)_ | Creates a first split on the given condition locking the _amount_ of collateral tokens The message sender needs to create an allowance on the collateral for the Prediction Market (token.allow(prediction_markets_address, amount) |
| _merge(positions, amount)_ | Merges the given _positions_ up to the _amount_ of collateral|
| _mergeAll(collateralAddress, amount)_ | Merges all of the _positions_ created on a given condition up to the _amount_ of collateral |
| _receiveResult(result)_ | Submits results from an oracle account as an array of values per every outcome slot |


#### Position

| Function | Description |
| --- | --- |
| _fullSplit(condition, amount)_ | Creates a secondary split on an existing position up to the _amount_ of collateral held based on a _condition_ |
| _redeem()_ | Merges the given _positions_ up to the _amount_ of collateral|
| _balanceOf()_ | Returns the amount of tokens held by the position |

