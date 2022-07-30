// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract ServiceDataLayout {
    uint256 internal _currentId;
    mapping(uint256 => ServiceCol) internal _metaDataUri;
    struct ServiceCol {
        string _termURI;
        string _termHash;
    }
}