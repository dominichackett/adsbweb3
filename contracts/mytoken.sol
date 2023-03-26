// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract USDC is ERC20,Ownable {
    address minter;
    constructor() ERC20("USDC Token", "USDC") {
        minter = msg.sender;
    }

    function mintUSDC(address to, uint256 amount) public {
        require(msg.sender == minter,"Unauthorized Minter");  
        _mint(to, amount);
        
    }

    function burnUSDC(address from, uint256 amount) public {
        require(msg.sender == minter,"Unauthorized Minter");  
        _burn(from, amount);
        
    }

function decimals() public view virtual override returns (uint8) {
  return 6;
}

function setMinter(address _minter) external onlyOwner{
    minter = _minter;
  }
}