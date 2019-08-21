# gnosis-hg-js
Javascript bindings for the gnosis mercury contracts

If you are a smart-contract veteran juggling bitwise operations and hex padding in memory there is absolutely no need
to use this library. For the rest of the mere mortals, this package should make your integration with the new release
of the Gnosis contracts much more comfortable.

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

### HG wrapper

| Function | Description |
| --- | --- |
| _new HG(contract_address)_ | Creates a binding wrapper for a deployed prediction market system |
| _prepareCondition(id, oracle_address, number_of_outcome_slots)_ | Creates a new condition |

### Condition

| Function | Description |
| --- | --- |
| _split(collateralAddress, indexSet, amount)_ | Creates a first split on the given condition locking the _amount_ of collateral tokens |
| _fullSplit(collateralAddress, amount)_ | Creates a new condition |
| _merge(positions, amount)_ | Merges the given _positions_ up to the _amount_ of collateral|
| _mergeAll(collateralAddress, amount)_ | Merges all of the _positions_ created on a given condition up to the _amount_ of collateral |


### Position

