import React, { useEffect } from "react";
import { useState } from "react";
import Card from "@mui/material/Card";
import { Button } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";
import { useSDK } from "@metamask/sdk-react";
import EthereumIcon from "./components/EthereumIcon";
import Transak from "@biconomy/transak";
import "./SubscriptionModal.css";
import CircleIcon from "@mui/icons-material/Circle";

const SubscriptionModal = ({ planName = "Premium" }) => {
  const [account, setAccount] = useState();
  const { sdk, connected, connecting, provider, chainId } = useSDK();

  const getUserAddress = async () => {
    try {
      const accounts = await sdk?.connect();
      setAccount(accounts?.[0]);
    } catch (err) {
      console.warn(`failed to connect..`, err);
    }
  };
  useEffect(() => {
    if (connected) {
      getUserAddress();
    }
  }, [connected]);

  return (
    <Card sx={{ minWidth: 400, boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography
          style={{
            display: "flex",
            fontWeight: 500,
            gap: 5,
          }}
        >
          <CircleIcon style={{ color: account ? "#90EE90" : "red" }} />{" "}
          {account ? "Wallet Connected" : "Wallet Not Connected"}
        </Typography>
        {!account && (
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
              style={{ fontWeight: 600, textAlign: "start", marginBottom: 10 }}
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
              <Typography style={{ fontWeight: 300 }}>Premium Plan</Typography>
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
                0.1 ETH billed monthly
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
                0.1 ETH
              </Typography>
            </div>
          </CardContent>
        </Card>
        {account && (
          <Button
            id="addFunds"
            onClick={() => {
              const transak = new Transak("STAGING", {
                walletAddress: account,
              });
              transak.init();
            }}
          >
            Add Funds to Wallet
          </Button>
        )}
        <Button
          disabled={!account}
          style={{
            padding: 10,
            marginTop: 20,
            backgroundColor: !account ? "gray" : "#00796b",
            color: "white",
            width: "100%",
            textTransform: "capitalize",
          }}
        >
          Subscribe
        </Button>
      </CardContent>
    </Card>
  );
};

export default SubscriptionModal;
