import React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { ethers } from "ethers";

const TransferCrypto = ({ open, setOpen, smartAccountAddress }) => {
  const [amount, setAmount] = useState(0);

  const handleClose = () => {
    setOpen(false);
  };

  async function sendETH(address, amount) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const transaction = {
      to: address,
      value: ethers.utils.parseEther(amount), // Convert amount to wei
    };

    try {
      const txResponse = await signer.sendTransaction(transaction);
      console.log("Transaction hash:", txResponse.hash);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Transfer ETH</DialogTitle>

      <DialogContent>
        <DialogContentText>
          <b>Destination:</b> {smartAccountAddress}
        </DialogContentText>
        <DialogContentText>
          <b>Required minimum:</b> 0.02 ETH
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Amount"
          type="number"
          fullWidth
          variant="standard"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={() => {
            sendETH(smartAccountAddress, amount);
            handleClose();
          }}
        >
          Transfer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransferCrypto;
