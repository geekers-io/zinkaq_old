const Zinkaq = artifacts.require("Zinkaq");
const {
    BN,           // Big Number support
    constants,    // Common constants, like the zero address and largest integers
    expectEvent,  // Assertions for emitted events
    expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');
const web3 = require("web3");

contract("Zinkaq", (accounts) => {
    it("balanceOf: get balance of minted member", async() => {
        const zinkaqInstance = await Zinkaq.deployed();
        const balance = await zinkaqInstance.balanceOf.call(accounts[0]);
        assert.equal(
            balance.toString(),
            "1",
            "balance not equal"
        );
    });
    it("balanceOf: get balance of no member", async() => {
        const memberInstance = await Zinkaq.deployed();
        const balance = await memberInstance.balanceOf.call(accounts[1]);
        assert.equal(
            balance.toString(),
            "0",
            "balance not equal"
        );
    });
    it("ownerOf: get owner of exist id", async() => {
        const memberInstance = await Zinkaq.deployed();
        const owner = await memberInstance.ownerOf.call(new BN("1"));
        assert.equal(
            owner,
            accounts[0],
            "balance not equal"
        );
    });
    it("ownerOf: get owner of not exist id", async() => {
        const memberInstance = await Zinkaq.deployed();
        const owner = await memberInstance.ownerOf.call(new BN("10000"));
        assert.equal(
            owner,
            "0x0000000000000000000000000000000000000000",
            "balance not equal"
        );
    });
    it("mint: exsisted userName", async() => {
        const memberInstance = await Zinkaq.deployed();
        await expectRevert(
            memberInstance.mint.call("sZma5a", "https://example.com"),
            "UserName is already existed."
        );
    });
    it("getIdByUserName: get collect id", async() => {
        const memberInstance = await Zinkaq.deployed();
        const ownerId = await memberInstance.getIdByUserName.call("sZma5a");
        assert.equal(
            ownerId.toString(),
            "1",
            "id not equal"
        );
    });
    it("getIdByUserName: not existed id", async() => {
        const memberInstance = await Zinkaq.deployed();
        const ownerId = await memberInstance.getIdByUserName.call("noExsistedUser");
        assert.equal(
            ownerId.toString(),
            "0",
            "id not equal"
        );
    });
    it("tokenURI: get collect url", async() => {
        const memberInstance = await Zinkaq.deployed();
        const url = await memberInstance.tokenURI.call(new BN("1"));
        assert.equal(
            url,
            "https://example.com",
            "url not equal"
        );
    });
    it("changeUserName: change username", async() => {
        const memberInstance = await Zinkaq.deployed();
        const url = await memberInstance.changeUserName(new BN("1"), "userName");
        const id = await memberInstance.getIdByUserName.call("userName");
        assert.equal(
            id.toString(),
            "1",
            "id not equal"
        );
    });
    it("changeUserName: not own user", async() => {
        const memberInstance = await Zinkaq.deployed();
        await expectRevert(
            memberInstance.changeUserName(new BN("1"), "userName", {from: accounts[1]}),
            "This is not your user."
        );
    });
    it("changeUserName: not own user", async() => {
        const memberInstance = await Zinkaq.deployed();
        await expectRevert(
            memberInstance.changeUserName(new BN("2"), "userName"),
            "This is not your user."
        );
    });
    it("changeUserName: existed userName", async() => {
        const memberInstance = await Zinkaq.deployed();
        const ownerId = await memberInstance.getIdByUserName("sZma5a");
        console.log(ownerId.toString());
        // await expectRevert(
        //     memberInstance.changeUserName(new BN("1"), "sZma5a"),
        //     "UserName is already existed."
        // );
    });



    // it("getZinkaqId: get id from minted member", async() => {
    //     const memberInstance = await Zinkaq.deployed();
    //     const id = await memberInstance.getZinkaqId.call(accounts[0])
    //     assert.equal(
    //         id.toString(),
    //         "1",
    //         "id not equal"
    //     );
    // });
    // it("getZinkaqId: get id from not member", async() => {
    //     const memberInstance = await Zinkaq.deployed();
    //     await expectRevert(
    //         memberInstance.getZinkaqId(accounts[1]),
    //         "This address is not member"
    //     )
    // });
    // it("getZinkaq: get ZinkaqData from minted member", async() => {
    //     const memberInstance = await Zinkaq.deployed();
    //     const data = await memberInstance.getZinkaq.call(new BN(1))
    //     assert.equal(
    //         data["name"],
    //         "testUser",
    //         "name not equal"
    //     );
    //     assert.equal(
    //         data["icon"],
    //         "https://example.com",
    //         "icon not equal"
    //     );
    //     assert.equal(
    //         data["invited"],
    //         "0x0000000000000000000000000000000000000000",
    //         "invited not equal"
    //     );
    // });
    // it("getZinkaq: get ZinkaqData from not member", async() => {
    //     const memberInstance = await Zinkaq.deployed();
    //     await expectRevert(
    //         memberInstance.getZinkaq.call(new BN(2)),
    //         "This id is not existed"
    //     );
    // });
    // it("getZinkaq: get ZinkaqData from not member", async() => {
    //     const memberInstance = await Zinkaq.deployed();
    //     await expectRevert(
    //         memberInstance.getZinkaq.call(new BN(0)),
    //         "ID 0 is not existed"
    //     );
    // });
    //
    // it("checkNameExisted: check existed name", async() => {
    //     const memberInstance = await Zinkaq.deployed();
    //     const data = await memberInstance.checkNameExisted.call("testUser");
    //     assert.equal(
    //         data,
    //         true,
    //         "bool error"
    //     );
    // })
    // it("checkNameExisted: check not existed name", async() => {
    //     const memberInstance = await Zinkaq.deployed();
    //     const data = await memberInstance.checkNameExisted.call("test");
    //     assert.equal(
    //         data,
    //         false,
    //         "bool error"
    //     );
    // });
    // it("join: check invite OK", async() => {
    //     web3.eth.getChainId().then(console.log);
    //     web3.eth.getNodeInfo().then(console.log);
    //     const memberInstance = await Zinkaq.deployed();
    //     const timestamp = Math.floor(Date.now() / 1000 / (60 * 60));
    //     const str = `${timestamp},${accounts[1].toLowerCase()}`;
    //     const sign = await web3.eth.sign(str, accounts[0]);
    //     const data = await memberInstance.join.call(
    //         sign, 'test2', 'http://example.jp', {from: accounts[1]}
    //     );
    //     assert.equal(
    //         data.toString(),
    //         "2",
    //         "id error"
    //     );
    // });
    // it("join: check invite NG same user", async() => {
    //     const memberInstance = await Zinkaq.deployed();
    //     const timestamp = Math.floor(Date.now() / 1000 / (60 * 60));
    //     const str = `${timestamp},${accounts[0].toLowerCase()}`;
    //     const sign = await web3.eth.sign(str, accounts[0]);
    //     await expectRevert(
    //         memberInstance.join.call(
    //             sign, 'test2', 'http://example.jp', {from: accounts[0]}
    //         ),
    //         "Cannot invite yourself"
    //     );
    // });

    // it("should put 10000 Zinkaq in the first account", async () => {
    //     const metaCoinInstance = await Zinkaq.deployed();
    //     const balance = await metaCoinInstance.getBalance.call(accounts[0]);
    //
    //     assert.equal(balance.valueOf(), 10000, "10000 wasn't in the first account");
    // });
    // it("should call a function that depends on a linked library", async () => {
    //     const metaCoinInstance = await Zinkaq.deployed();
    //     const metaCoinBalance = (
    //         await metaCoinInstance.getBalance.call(accounts[0])
    //     ).toNumber();
    //     const metaCoinEthBalance = (
    //         await metaCoinInstance.getBalanceInEth.call(accounts[0])
    //     ).toNumber();
    //
    //     assert.equal(
    //         metaCoinEthBalance,
    //         2 * metaCoinBalance,
    //         "Library function returned unexpected function, linkage may be broken"
    //     );
    // });
    // it("should send coin correctly", async () => {
    //     const metaCoinInstance = await Zinkaq.deployed();
    //
    //     // Setup 2 accounts.
    //     const accountOne = accounts[0];
    //     const accountTwo = accounts[1];
    //
    //     // Get initial balances of first and second account.
    //     const accountOneStartingBalance = (
    //         await metaCoinInstance.getBalance.call(accountOne)
    //     ).toNumber();
    //     const accountTwoStartingBalance = (
    //         await metaCoinInstance.getBalance.call(accountTwo)
    //     ).toNumber();
    //
    //     // Make transaction from first account to second.
    //     const amount = 10;
    //     await metaCoinInstance.sendCoin(accountTwo, amount, { from: accountOne });
    //
    //     // Get balances of first and second account after the transactions.
    //     const accountOneEndingBalance = (
    //         await metaCoinInstance.getBalance.call(accountOne)
    //     ).toNumber();
    //     const accountTwoEndingBalance = (
    //         await metaCoinInstance.getBalance.call(accountTwo)
    //     ).toNumber();
    //
    //     assert.equal(
    //         accountOneEndingBalance,
    //         accountOneStartingBalance - amount,
    //         "Amount wasn't correctly taken from the sender"
    //     );
    //     assert.equal(
    //         accountTwoEndingBalance,
    //         accountTwoStartingBalance + amount,
    //         "Amount wasn't correctly sent to the receiver"
    //     );
    // });
});