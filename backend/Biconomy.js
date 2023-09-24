const { ChainId } = require("@biconomy/core-types");
const { ethers } = require("ethers");
const { IBundler, Bundler } = require("@biconomy/bundler");
const {
  ECDSAOwnershipValidationModule,
  DEFAULT_ECDSA_OWNERSHIP_MODULE,
} = require("@biconomy-devx/modules");
const {
  SessionKeyManagerModule,
  DEFAULT_SESSION_KEY_MANAGER_MODULE,
  StorageType,
} = require("@biconomy-devx/modules");
const {
  BiconomySmartAccountV2,
  DEFAULT_ENTRYPOINT_ADDRESS,
} = require("@biconomy/account");

const privateKey =
  "0xb857f3cbc74ef044a2e57cbc8696529db47f7f1684c7921f9d432478918ee33c";
const wallet = new ethers.Wallet(privateKey);
console.log(wallet.getAddress());
const Biconomy = {
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
      storageType: StorageType.FILE_STORAGE,
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

module.exports = Biconomy;
