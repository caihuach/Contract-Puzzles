const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");

describe("Game3", function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory("Game3");
    const game = await Game.deploy();

    // Hardhat will create 10 accounts for you by default
    // you can get one of this accounts with ethers.provider.getSigner
    // and passing in the zero-based indexed of the signer you want:
    const signer = ethers.provider.getSigner(0);

    // you can get that signer's address via .getAddress()
    // this variable is NOT used for Contract 3, just here as an example
    const address = await signer.getAddress();

    return { game, signer };
  }

  it("should be a winner", async function () {
    const { game, signer } = await loadFixture(deployContractAndSetVariables);
    const s2 = signer;
    // you'll need to update the `balances` mapping to win this stage
    const s1 = ethers.provider.getSigner(1);
    const s3 = ethers.provider.getSigner(2);
    // to call a contract as a signer you can use contract.connect
    await game.connect(s2).buy({ value: "3" });
    await game.connect(s1).buy({ value: "2" });
    await game.connect(s3).buy({ value: "1" });

    // TODO: win expects three arguments
    await game.win(
      await s1.getAddress(),
      await s2.getAddress(),
      await s3.getAddress()
    );

    // leave this assertion as-is
    assert(await game.isWon(), "You did not win the game");
  });
});
