const express = require('express');
const fb = require('./fb')
const app = express();
const cron = require("node-cron");
const MonitorEth = require("./monitor");
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello, Express!');
});
app.get('/addSub', async (req, res) => {
    try {
        await fb.addUser({id:'test',name:'hello'})
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const httpProvider =
  "https://linea-goerli.infura.io/v3/e302ac38a22645c4825ea31758a7ac08";
const address = "0xa2d4fB0440634a9a358AED866C30A5Adc46207BA";

async function main() {
  try {
    const monitor = new MonitorEth(httpProvider);
    await monitor.initializeLastSyncedBlock();
    console.log('Looking for transactions...')

    cron.schedule("*/10 * * * * *", async () => {
      console.log('Cron started.')
      await monitor.searchTransaction(address);
      console.log('Cron finished.')

    });
  } catch (error) {
    console.log(error);
  }
}

main();