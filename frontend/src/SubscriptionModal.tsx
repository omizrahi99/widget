import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";

interface SubscriptionModalProps {}

const SubscriptionModal = ({ planName = "Premium" }): any => {
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
      </CardContent>
      {/* <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions> */}
    </Card>
  );
};

export default SubscriptionModal;
