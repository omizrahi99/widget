import React, { useEffect } from "react";
import { useState } from "react";
import Card from "@mui/material/Card";
import { Button, CircularProgress } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";
import { useSDK } from "@metamask/sdk-react";
import EthereumIcon from "./components/EthereumIcon";
import Transak from "@biconomy/transak";
import "./SubscriptionModal.css";
import CircleIcon from "@mui/icons-material/Circle";
import { Biconomy } from "./helpers/Biconomy";
import { Ethereum } from "./helpers/Ethereum";
import { Addresses } from "./helpers/Addresses";
import TransferCrypto from "./components/TransferCrypto";
import { ChainId } from "@biconomy/core-types";
import { ethers } from "ethers";
import Confetti from "react-confetti";

const SubscriptionModal = ({ planName = "Premium" }) => {
  const [metamaskAccountAddress, setMetamaskAccountAddress] = useState();
  const [smartAccountAddress, setSmartAccountAddress] = useState();
  const [smartAccount, setSmartAccount] = useState();
  const [smartAccountBalance, setSmartAccountBalance] = useState(0);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [userFinishedSubscribing, setUserFinishedSubscribing] = useState(false);

  const monthlyPayment = 0.01;

  const subscribeButtonDisabled =
    !metamaskAccountAddress || smartAccountBalance < monthlyPayment;

  console.log(smartAccountBalance);

  const { sdk, connected, connecting, chainId } = useSDK();
  console.log({ smartAccountAddress, metamaskAccountAddress });

  const getUserAddress = async () => {
    try {
      const accounts = await sdk?.connect();
      return accounts?.[0];
    } catch (err) {
      console.warn(`failed to connect..`, err);
    }
  };

  const addFiatCallback = async () => {
    const transak = new Transak("STAGING", {
      walletAddress: smartAccountAddress,
    });
    transak.init();
  };

  useEffect(() => {
    if (connected) {
      const init = async () => {
        setMetamaskAccountAddress(await getUserAddress());
        const biconomySmartAccount = await Biconomy.createAccount();
        setSmartAccount(biconomySmartAccount);
        const smartAddress = await biconomySmartAccount.getAccountAddress();
        setSmartAccountAddress(smartAddress);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = ethers.utils.formatEther(
          await provider.getBalance(smartAddress)
        );
        setSmartAccountBalance(balance);
      };
      init();
    }
  }, [connected]);

  const subscribeUser = () => {
    // Define the URL where you want to send the POST request
    const apiUrl = "http://localhost:3000/add-user";
    // const { walletAdress, sessionKey, payDate, publicKey, userState } = req.body;
    // Define the data you want to send in the request body (in JSON format)
    const postData = {
      walletAddress: metamaskAccountAddress,
      sessionKey: "sessionKey",
      payDate: Date.now(),
      publicKey: smartAccountAddress,
      userState: "healthy",
    };

    // Create the request options, including method, headers, and body
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Specify the content type as JSON
        // Add any other headers you need here
      },
      body: JSON.stringify(postData), // Convert the JavaScript object to JSON
    };

    // Send the POST request using fetch
    fetch(apiUrl, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Parse the response as JSON
      })
      .then((data) => {
        console.log("Response data:", data); // Handle the response data
      })
      .catch((error) => {
        console.error("Error:", error); // Handle any errors that occur during the request
      });
  };

  useEffect(() => {
    if (metamaskAccountAddress) {
      fetch(`http://localhost:3000/get-user/${metamaskAccountAddress}`);
    }
  }, [metamaskAccountAddress]);

  const getSubButtonText = () => {
    if (subscribeLoading) {
      return <CircularProgress size={20} sx={{ color: "white" }} />;
    } else {
      return "Subscribe";
    }
  };
  return (
    <>
      <Card sx={{ minWidth: 400, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography
            style={{
              display: "flex",
              fontWeight: 500,
              gap: 5,
            }}
          >
            <CircleIcon
              style={{ color: metamaskAccountAddress ? "#90EE90" : "red" }}
            />{" "}
            {metamaskAccountAddress
              ? "Wallet Connected"
              : "Wallet Not Connected"}
          </Typography>
          {!metamaskAccountAddress && (
            <Button
              style={{
                display: "flex",
                textTransform: "capitalize",
                padding: 0,
                paddingLeft: 0,
                marginTop: 5,
              }}
              onClick={getUserAddress}
            >
              Connect Wallet
            </Button>
          )}

          <Card style={{ marginTop: 10 }} variant="outlined">
            <CardContent style={{ padding: "16px" }}>
              <Typography
                style={{
                  fontWeight: 600,
                  textAlign: "start",
                  marginBottom: 10,
                }}
              >
                Subscription
              </Typography>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 5,
                  marginBottom: 10,
                }}
              >
                <Typography style={{ fontWeight: 300 }}>
                  Premium Plan
                </Typography>
                <Typography
                  style={{
                    display: "flex",
                    fontWeight: 300,
                    alignItems: "center",
                  }}
                >
                  <span style={{ marginRight: 5 }}>
                    <EthereumIcon />
                  </span>
                  {monthlyPayment} ETH billed monthly
                </Typography>
              </div>
              <Divider style={{ marginBottom: 10 }} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 5,
                }}
              >
                <Typography fontWeight={500}>Due Today</Typography>
                <Typography
                  style={{ display: "flex", alignItems: "center" }}
                  fontWeight={500}
                >
                  {" "}
                  <span style={{ marginRight: 5 }}>
                    <EthereumIcon />
                  </span>
                  {monthlyPayment} ETH
                </Typography>
              </div>
            </CardContent>
          </Card>
          {smartAccountAddress && (
            <>
              <Typography
                id="balance"
                fontSize="14px"
                fontWeight={500}
                display={"flex"}
              >
                Smart Account Balance
              </Typography>
              <Typography display={"flex"}>
                {smartAccountBalance} ETH
              </Typography>
              <Button id="buyCrypto" onClick={addFiatCallback}>
                Buy Crypto
              </Button>
              <Button
                id="transferCrypto"
                onClick={() => setTransferModalOpen(true)}
              >
                Transfer Crypto
              </Button>
            </>
          )}
          {userFinishedSubscribing ? (
            "Subscribed!"
          ) : (
            <Button
              // disabled={subscribeButtonDisabled}
              style={{
                padding: 10,
                marginTop: 20,
                backgroundColor: subscribeButtonDisabled ? "gray" : "#00796b",
                color: "white",
                width: "100%",
                textTransform: "capitalize",
              }}
              onClick={async () => {
                setSubscribeLoading(true);
                await Biconomy.createSession(
                  smartAccount,
                  smartAccountAddress,
                  0.01
                );
                setSubscribeLoading(false);
                setUserFinishedSubscribing(true);
              }}
            >
              {getSubButtonText()}
            </Button>
          )}
        </CardContent>
      </Card>
      <TransferCrypto
        open={transferModalOpen}
        setOpen={setTransferModalOpen}
        smartAccountAddress={smartAccountAddress}
      />
      {userFinishedSubscribing && <Confetti />}
    </>
  );
};

export default SubscriptionModal;
