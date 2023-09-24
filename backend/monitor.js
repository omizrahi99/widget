const Web3 = require("web3");
const fb = require('./fb')
// const ethers = require('ethers');
// const signer = new ethers.Wallet("0xb857f3cbc74ef044a2e57cbc8696529db47f7f1684c7921f9d432478918ee33c", provider);
// const provider = new ethers.providers.InfuraProvider(
//         network,
//         "e302ac38a22645c4825ea31758a7ac08"
//       );

class MonitorEth {
  constructor(httpProvider) {
    this.web3 = new Web3(new Web3.providers.HttpProvider(httpProvider));
    this.lastSyncedBlock = null;
  }

  async initializeLastSyncedBlock() {
    this.lastSyncedBlock = await this.getLastBlockNumber();
    console.log(this.lastSyncedBlock)
  }

  async getBlock(blockNumber) {
    return this.web3.eth.getBlock(blockNumber, true);
  }

  async getLastBlockNumber() {
    return this.web3.eth.getBlockNumber();
  }

  async searchTransaction(to) {
    const lastBlock = await this.getLastBlockNumber();
    console.log(`Searching blocks: ${this.lastSyncedBlock + 1} - ${lastBlock}`);

    for (let blockNumber = this.lastSyncedBlock + 1; blockNumber <= lastBlock; blockNumber++) {
      const block = await this.getBlock(blockNumber);
      console.log(blockNumber)
      if (!block?.transactions) {
        continue;
      }

      for (const tx of block.transactions) {
        if (!tx?.to) {
          continue;
        }
        if (tx.to.toLowerCase() === to.toLowerCase()) {
          console.log(tx);
          fb.addTran({"tx":tx.from,"rx":tx.to,"amount":tx.value,"block":tx.blockNumber,hash:tx.hash})
        }
      }
    }
    this.lastSyncedBlock = lastBlock;
    console.log(
      `Finished searching blocks: ${this.lastSyncedBlock + 1} - ${lastBlock}`
    );
  }
}

module.exports = MonitorEth;
