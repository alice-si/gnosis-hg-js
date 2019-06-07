# gnosis-hg-js
Javascript bindings for the gnosis mercury contracts

If you are a smart-contract veteran juggling bitwise operations and hex padding in memory there is absolutely no need
to use this library. For the rest of the mere mortals, this package should make your integration with the new release
of the Gnosis contracts much more comfortable.

### Using Gnosis Mercury in 5 lines of code

We assume that you previously deployed the Gnosis contract and a collateral token:

    const HG = require("gnosis-hg-js");
    let hg = new HG(<Your Prediction Market Contract address>);
    let condition = await hg.prepareCondition('First Condition', oracle, 2);
    await condition.split(<Your collateral token>, 100);
    await condition.mergeAll(<Your collateral token>, 100);

