const Zinkaq = artifacts.require("Zinkaq");

module.exports = function(_deployer) {
    // Use deployer to state migration tasks.
    _deployer.deploy(Zinkaq, "sZma5a", "https://example.com");
};
