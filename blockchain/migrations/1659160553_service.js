const Service = artifacts.require("Service")

module.exports = function(_deployer) {
  // Use deployer to state migration tasks.
    _deployer.deploy(Service);
};
