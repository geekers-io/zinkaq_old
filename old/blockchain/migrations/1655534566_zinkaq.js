const Zinkaq = artifacts.require("Zinkaq");

module.exports = function(deployer) {
  // Use deployer to state migration tasks.
  deployer.deploy(Zinkaq);
};
