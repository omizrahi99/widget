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
import { defaultAbiCoder } from "ethers/lib/utils";
import { IPaymaster, BiconomyPaymaster } from "@biconomy/paymaster";
import { Ethereum, provider } from "./Ethereum.js";
import { DEFAULT_SESSION_KEY_MANAGER_MODULE  } from "@biconomy-devx/modules";
import ContractAddresses from "./ContractAddresses.js";

const sessionKeyEOA = '0xa2d4fB0440634a9a358AED866C30A5Adc46207BA';


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
      const bundler = new Bundler({
        bundlerUrl: `https://bundler.biconomy.io/api/v2/${ChainId.LINEA_TESTNET}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`,    
        chainId: ChainId.LINEA_TESTNET,
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
      })
      const biconomySmartAccount = await BiconomySmartAccountV2.create({
        chainId: ChainId.LINEA_TESTNET, //or any chain of your choice
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS, //entry point address for chain,
        bundler,
        defaultValidationModule: module, // either ECDSA or Multi chain to start
        activeValidationModule: module, // either ECDSA or Multi chain to start
      });

      return biconomySmartAccount;
    } catch (e) {
      console.log(e);
    }
  },
  createSession: async (biconomySmartAccount, smartAccountAddress, subscriptionAmountEth, start = 0, end = 0, contractAddressKey = 'linea') => {
    let biconomySmartAccount = smartAccount;
    const managerModuleAddr = DEFAULT_SESSION_KEY_MANAGER_MODULE;
    const sessionKeyModuleAddress = ContractAddresses[contractAddressKey];

    // -----> setMerkle tree tx flow
    // create dapp side session key
    console.log("sessionKeyEOA", sessionKeyEOA);

    // generate sessionModule
    const sessionModule = await SessionKeyManagerModule.create({
      moduleAddress: managerModuleAddr,
      smartAccountAddress: smartAccountAddress,
    });

    const sessionKeyData = defaultAbiCoder.encode(
      ["address", "address", "uint256"],
      [
        sessionKeyEOA,
        sessionKeyEOA, // receiver address
        ethers.utils.parseEther(subscriptionAmountEth), 
      ]
    );

    const sessionTxData = await sessionModule.createSessionData([
      {
        validUntil: start,
        validAfter: end,
        sessionValidationModule: sessionKeyModuleAddress,
        sessionPublicKey: sessionKeyEOA,
        sessionKeyData: sessionKeyData,
      },
      // can optionally enable multiple leaves(sessions) altogether
    ]);

    // tx to set session key
    const tx2 = {
      to: managerModuleAddr, // session manager module address
      data: sessionTxData.data,
    };

    let transactionArray = [];
    const isEnabled = await biconomySmartAccount.isModuleEnabled(
      managerModuleAddr
    );
    if (!isEnabled) {
      // -----> enableModule session manager module
      const tx1 = await biconomySmartAccount.getEnableModuleData(
        managerModuleAddr
      );
      transactionArray.push(tx1);
    }
    transactionArray.push(tx2);
    let partialUserOp = await biconomySmartAccount.buildUserOp(
      transactionArray
    );

    const userOpResponse = await biconomySmartAccount.sendUserOp(
      partialUserOp
    );

    console.log(`userOp Hash: ${userOpResponse.userOpHash}`);
    const transactionDetails = await userOpResponse.wait();
    console.log("txHash", transactionDetails.receipt.transactionHash);
    showInfoMessage("Session Created Successfully");

    return {sessionModule, sessionKeyData, sessionTxData, userOpResponse, transactionDetails}
  }

};

export { Biconomy };
