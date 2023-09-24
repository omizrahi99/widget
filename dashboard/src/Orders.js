import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import { db } from './firebase';
import { collection, addDoc, getDocs } from "firebase/firestore";
import moment from 'moment'

export default function Orders() {
  const [subscribers,setSubscribers]=React.useState([])
  const fetchTransactions = async () => {

    await getDocs(collection(db, "merchant1"))
      .then((querySnapshot) => {
        const newData = querySnapshot.docs
          .map((doc) => ({ ...doc.data(), hash: doc.hash }));
        // setTodos(newData);                
        console.log(newData);
        setSubscribers(newData)
      })

  }
  React.useEffect(() => {
    fetchTransactions();
  }, [])
  function preventDefault(event) {
    event.preventDefault();
  }


  return (
    <React.Fragment>
      <Title>Subscribers</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Public Key</TableCell>
            <TableCell>Pay Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Subscription Interval</TableCell>
            <TableCell>Amount</TableCell>

            {/* <TableCell>Payment Method</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {subscribers.map((sub) => (
            <TableRow key={sub.publicKey}>
              <TableCell>{sub.publicKey}</TableCell>
              <TableCell>{moment(new Date(sub.payDate)).format('MMMM Do YYYY, h:mm:ss a')}</TableCell>
              <TableCell>{sub.userState}</TableCell>
              {/* <TableCell>{sub.walletAdress}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={fetchTransactions} sx={{ mt: 3 }}>
      Refresh      
      </Link>
    </React.Fragment>
  );
}
