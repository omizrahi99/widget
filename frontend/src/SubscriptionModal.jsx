import React, { useEffect } from "react";
import { useState } from "react";

import Card from "@mui/material/Card";

import CardContent from "@mui/material/CardContent";

import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";
import { useSDK } from "@metamask/sdk-react";

const SubscriptionModal = ({ planName = "Premium" }) => {
  const [account, setAccount] = useState();
  const { sdk, connected, connecting, provider, chainId } = useSDK();

  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      setAccount(accounts?.[0]);
    } catch (err) {
      console.warn(`failed to connect..`, err);
    }
  };

  return (
    <Card sx={{ minWidth: 400, boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Card variant="outlined">
          <CardContent>
            <Typography
              style={{ fontWeight: 600, textAlign: "start", marginBottom: 10 }}
            >
              Subscription
            </Typography>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 5,
                marginBottom: 10,
              }}
            >
              <Typography style={{ fontWeight: 300 }}>Premium Plan</Typography>
              <Typography style={{ fontWeight: 300 }}>
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
              <Typography fontWeight={500}>0.1 ETH</Typography>
            </div>
          </CardContent>
        </Card>
        <button style={{ padding: 10, margin: 10 }} onClick={connect}>
          Connect
        </button>
      </CardContent>
      {/* <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions> */}
    </Card>
  );
};

export default SubscriptionModal;
