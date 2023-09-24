import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

function preventDefault(event) {
  event.preventDefault();
}
let ignore=false

export default function Deposits() {

  const [balance, setBalance] = React.useState(0);
  const [gotBalance, setGotBalance] = React.useState(false);

  function getBalance() {
    setGotBalance(false)
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "jsonrpc": "2.0",
      "method": "eth_getBalance",
      "params": [
        "0xa2d4fB0440634a9a358AED866C30A5Adc46207BA",
        "latest"
      ],
      "id": 1
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("https://linea-goerli.infura.io/v3/e302ac38a22645c4825ea31758a7ac08", requestOptions)
      .then(response => response.json())
      .then(res => {
        setBalance(parseInt(res.result) / (Math.pow(10, 18)))
        setGotBalance(true)
      })
      .catch(error => console.log('error', error));

  }
  React.useEffect(() => {
    if(!ignore) getBalance()
    ignore=true
  });
  return (
    <React.Fragment>
      <Title>Current Balance</Title>
      <Typography component="p" variant="p">Wallet: 0xa2d4fB04...</Typography>
      {gotBalance ? <Typography component="p" variant="h4">
        {balance.toPrecision(5)} ETH
      </Typography> : <Box sx={{ display: 'flex' }}><CircularProgress /></Box>}
      <Typography color="text.secondary" sx={{ flex: 1 }}>

      </Typography>
      <div>
        <Link color="primary" href="#" onClick={getBalance}>
          Refresh
        </Link>
      </div>
    </React.Fragment>
  );
}
