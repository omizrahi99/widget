import { ethers } from 'ethers'

const provider = new ethers.providers.Web3Provider(window.ethereum)
 
const Ethereum = {
    getSigner: async () => {
        return await provider.getSigner()
    },
    getAccounts: async () => {
        return await provider.send("eth_requestAccounts", [])
    }
}

export default {Ethereum, provider}