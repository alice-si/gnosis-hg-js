/*
Implements ERC20 Token Standard: https://github.com/ethereum/EIPs/issues/20
*/

pragma solidity ^0.5.2;

import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol';

contract CollateralToken is ERC20Mintable {

    string public name = "TestCollateralToken";
    uint8 public decimals = 2;
    string public symbol = "COL";
    string public version = 'COL 1.0';


}
