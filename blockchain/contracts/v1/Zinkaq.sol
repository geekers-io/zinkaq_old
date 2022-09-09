// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "../data/MemberDataLayout.sol";

contract Zinkaq is MemberDataLayout {
  using SafeMathUpgradeable for uint256;
  using ECDSAUpgradeable for bytes32;

  constructor(
    string memory _userName,
    string memory _metadataUrl
  ) public {
    _currentId = 0;
    mint(_userName, _metadataUrl);
  }

  modifier ownOnly(uint256 _id) {
    require(_ids[_id] == msg.sender, "This is not your user.");
    _;
  }

  function mint(string memory _userName, string memory _metadataUrl) public returns (uint256) {
    return _mint(_userName, _metadataUrl);
  }

  function changeUserName(uint256 _id, string memory _userName) public ownOnly(_id) {
    _changeUserName(_id, _userName);
  }

  function changeMetadataUrl(uint256 _id, string memory _metadataUrl) public ownOnly(_id) {
    _changeMetadataUrl(_id, _metadataUrl);
  }

  function existUserName(string memory _userName) public view returns(bool) {
    return _userNameIds[_userName] != 0;
  }

  function getIdByUserName(string memory _userName) public view returns (uint256) {
    return _userNameIds[_userName];
  }

  function _mint(string memory _userName, string memory _url) private returns (uint256) {
    require(!existUserName(_userName), "UserName is already existed.");
    _currentId += 1;
    _ids[_currentId] = msg.sender;
    _mintCounts[msg.sender] += 1;
    _userNameIds[_userName] = _currentId;
    _metadataUrl[_currentId] = _url;
    _idsUserName[_currentId] = _userName;
    return _currentId;
  }

  function getUserIds() public view returns (uint256[] memory) {
    uint256[] memory ids = new uint256[](_mintCounts[msg.sender]);
    uint256 count = 0;
    for (uint256 i = 1; i <= _currentId; i++) {
      if (_ids[i] == msg.sender) {
        ids[count] = i;
        count += 1;
      }
      if (count == _mintCounts[msg.sender]) {
        break;
      }
    }
    return ids;
  }

  function _changeUserName(uint256 _id, string memory _userName) private {
    require(!existUserName(_userName), "UserName is already existed.");
    string memory oldUserName = _idsUserName[_id];
    _userNameIds[oldUserName] = 0;
    _userNameIds[_userName] = _id;
    _idsUserName[_id] = _userName;
  }

    function _changeMetadataUrl(uint256 _id, string memory _url) private {
      _metadataUrl[_id] = _url;
    }

  // Like ERC-721  Functions
  function ownerOf(uint256 _tokenId) external view returns (address) {
    return _ids[_tokenId];
  }

  function balanceOf(address _owner) external view returns (uint256) {
    return _mintCounts[_owner];
  }

  function tokenURI(uint256 _id) public view returns (string memory) {
    return _metadataUrl[_id];
  }
}
