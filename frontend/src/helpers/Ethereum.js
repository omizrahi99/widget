import { ethers } from "ethers";

const Ethereum = {
  getProvider: () => {
    return new ethers.providers.Web3Provider(window.ethereum);
  },
  getSigner: async () => {
    return Ethereum.getProvider().getSigner();
  },
  getAccounts: async () => {
    return await Ethereum.getProvider().send("eth_requestAccounts", []);
  },
};

export { Ethereum };
