const {
  loadFixture,
  setBalance,
} = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");
const { ethers } = require("hardhat");
const { utils } = ethers;

describe("Game5", function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory("Game5");
    const game = await Game.deploy();

    return { game };
  }
  it("should be a winner", async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);

    // good luck
    const threshold = parseInt(
      "0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf",
      16
    );
    let sender;
    let i = 0;
    while (++i) {
      const wallet = ethers.Wallet.createRandom();
      const { address } = await wallet;
      if (parseInt(address, 16) < threshold) {
        console.log(i, address);
        sender = wallet.connect(ethers.provider);
        await setBalance(address, utils.parseEther("1"));
        break;
      }
    }
    await game.connect(sender).win();

    // leave this assertion as-is
    assert(await game.isWon(), "You did not win the game");
  });
});
