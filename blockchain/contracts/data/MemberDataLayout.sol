// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract MemberDataLayout {
//    uint256 internal _mintEnableCount;
    uint256 internal _currentId;
//    uint256 internal _timeRangeSec;
    mapping(uint256 => address) internal _ids;
    mapping(string => uint256) internal _userNameIds;
    mapping(uint256 => string) internal _idsUserName;
    mapping(uint256 => string) internal _metadataUrl;
    mapping(address => uint64) internal _mintCounts;
//    mapping(string => uint256) internal _names;
//    mapping(uint256 => MemberData) internal _members;
//    struct MemberData {
//        string name;
//        string icon;
//        address invited;
//    }
}
