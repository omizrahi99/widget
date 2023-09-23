const Web3 = require('web3');

// Replace YOUR_INFURA_PROJECT_ID with your actual project ID from Infura
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'));

const myAddress = 'YOUR_ETHEREUM_ADDRESS';  // Replace with the Ethereum address you're interested in

async function getPayersFromLastBlock() {
    const latestBlock = await web3.eth.getBlockNumber();
    const block = await web3.eth.getBlock(latestBlock, true);
    
    const payers = new Set();  // To ensure unique addresses

    block.transactions.forEach(tx => {
        if (tx.to && tx.to.toLowerCase() === myAddress.toLowerCase()) {
            payers.add(tx.from);
        }
    });

    return Array.from(payers);
}


module.exports(getPayersFromLastBlock)

