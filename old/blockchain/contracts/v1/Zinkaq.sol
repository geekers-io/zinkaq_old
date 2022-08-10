// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "../data/ZinkaqDataLayout.sol";

contract Zinkaq is Initializable, ERC721EnumerableUpgradeable, ZinkaqDataLayout {

  function initialize() initializer public {
    __ERC721_init("Zinkaq", "ZKQ");
  }

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    return _metaDataUri[tokenId];
  }

  function mint(string calldata _uri) public returns (uint256) {
    _currentId += 1;
    uint256 newItemId = _currentId;
    _safeMint(_msgSender(), newItemId);
    _metaDataUri[newItemId] = _uri;
    return newItemId;
  }
}
