// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "../data/ServiceDataLayout.sol";

contract Service is Initializable, ERC721Upgradeable, ServiceDataLayout {
    function initialize() initializer public {
        __ERC721_init("ZinkaqService", "ZKQSR");
    }

    function termURI(uint256 serviceId) public view returns (ServiceCol memory) {
        return _metaDataUri[serviceId];
    }

    function mint(string calldata _uri, string calldata _hash) public returns (uint256) {
        _currentId += 1;
        uint256 newItemId = _currentId;
        _safeMint(_msgSender(), newItemId);
        _metaDataUri[newItemId] = ServiceCol(
            _uri, _hash
        );
        return newItemId;
    }
}