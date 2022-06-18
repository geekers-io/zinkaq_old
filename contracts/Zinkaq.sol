// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Zinkaq is Initializable, ERC721Upgradeable {
  function initialize() initializer public {
    __ERC721_init("Zinkaq", "ZKQ");
  }
}
