import SocialLogin from "@biconomy/web3-auth";
import { ChainId } from "@biconomy/core-types";
import { ethers } from "ethers";
import { IBundler, Bundler } from "@biconomy/bundler";
import {
  BiconomySmartAccountV2,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from "@biconomy/account";
import {
  ECDSAOwnershipValidationModule,
  DEFAULT_ECDSA_OWNERSHIP_MODULE,
} from "@biconomy/modules";
import { IPaymaster, BiconomyPaymaster } from "@biconomy/paymaster";
import { Ethereum, provider } from "./Ethereum.js";

const Biconomy = {
  createModule: async () => {
    const ownerShipModule = await ECDSAOwnershipValidationModule.create({
      signer: await Ethereum.getSigner(), // ethers signer object
      moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE,
    });
    return ownerShipModule;
  },
  createAccount: async () => {
    try {
      const module = await Biconomy.createModule();
      const biconomySmartAccount = await BiconomySmartAccountV2.create({
        chainId: ChainId.LINEA_TESTNET, //or any chain of your choice
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS, //entry point address for chain
        defaultValidationModule: module, // either ECDSA or Multi chain to start
        activeValidationModule: module, // either ECDSA or Multi chain to start
      });

      return biconomySmartAccount;
    } catch (e) {
      console.log(e);
    }
  },
};

export { Biconomy };
