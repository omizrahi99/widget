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
import { Ethereum } from "./Ethereum.js";
import {
  SessionKeyManagerModule,
  DEFAULT_SESSION_KEY_MANAGER_MODULE,
} from "@biconomy/modules";
import { ContractAddresses } from "./ContractAddresses.js";

const sessionKeyEOA = "0xa2d4fB0440634a9a358AED866C30A5Adc46207BA";

const privateKey =
  "0xb857f3cbc74ef044a2e57cbc8696529db47f7f1684c7921f9d432478918ee33c";
const wallet = new ethers.Wallet(privateKey);

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
      });
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
  createSession: async (
    biconomySmartAccount,
    smartAccountAddress,
    subscriptionAmountEth,
    start = 0,
    end = 0,
    contractAddressKey = "linea"
  ) => {
    const managerModuleAddr = DEFAULT_SESSION_KEY_MANAGER_MODULE;
    const sessionKeyModuleAddress = ContractAddresses[contractAddressKey];

    // -----> setMerkle tree tx flow
    // create dapp side session key
    console.log("sessionKeyEOA", sessionKeyEOA);
    console.log({ smartAccountAddress, managerModuleAddr });
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
        ethers.utils.parseEther(subscriptionAmountEth.toString()),
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
    let isEnabled = false;
    try {
      isEnabled = await biconomySmartAccount.isModuleEnabled(managerModuleAddr);
    } catch (e) {
      console.log("error ", e);
    }
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

    const userOpResponse = await biconomySmartAccount.sendUserOp(partialUserOp);

    console.log(`userOp Hash: ${userOpResponse.userOpHash}`);
    const transactionDetails = await userOpResponse.wait();
    console.log("txHash", transactionDetails.receipt.transactionHash);

    return {
      sessionModule,
      sessionKeyData,
      sessionTxData,
      userOpResponse,
      transactionDetails,
    };
  },
  chargeSubscription: async (
    smartAccountAddress,
    subscriptionAmountEth,
    sessionKeyModuleAddress
  ) => {
    const bundler = new Bundler({
      bundlerUrl: `https://bundler.biconomy.io/api/v2/${ChainId.LINEA_TESTNET}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`,
      chainId: ChainId.LINEA_TESTNET,
      entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    });
    const mockAccount = ethers.Wallet.createRandom();
    const ownerShipModule = await ECDSAOwnershipValidationModule.create({
      signer: mockAccount, // ethers signer object
      moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE,
    });
    let biconomySmartAccount = await BiconomySmartAccountV2.create({
      chainId: ChainId.LINEA_TESTNET, //or any chain of your choice
      entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS, //entry point address for chain,
      bundler,
      defaultValidationModule: ownerShipModule, // either ECDSA or Multi chain to start
      activeValidationModule: ownerShipModule, // either ECDSA or Multi chain to start
    });
    biconomySmartAccount.accountAddress = smartAccountAddress;
    const managerModuleAddr = DEFAULT_SESSION_KEY_MANAGER_MODULE;

    // generate sessionModule
    const sessionModule = await SessionKeyManagerModule.create({
      moduleAddress: managerModuleAddr,
      smartAccountAddress: smartAccountAddress,
    });

    // set active module to sessionModule
    biconomySmartAccount =
      biconomySmartAccount.setActiveValidationModule(sessionModule);

    // TODO // get these from config
    // generate tx data to erc20 transfer
    const tx1 = {
      to: await wallet.getAddress(),
      data: "0x",
      value: ethers.parseEther(subscriptionAmountEth.toString()),
    };
    console.log(tx1);
    // build user op
    let userOp = await biconomySmartAccount.buildUserOp([tx1], {
      overrides: {},
      skipBundlerGasEstimation: false,
      params: {
        sessionSigner: wallet,
        sessionValidationModule: sessionKeyModuleAddress,
      },
    });
    console.log(userOp);

    // send user op
    const userOpResponse = await biconomySmartAccount.sendUserOp(userOp, {
      sessionSigner: wallet,
      sessionValidationModule: sessionKeyModuleAddress,
    });

    console.log("userOpHash", userOpResponse);
    const { receipt } = await userOpResponse.wait(1);
    console.log("txHash", receipt.transactionHash);
    return receipt;
  },
};

export { Biconomy };
