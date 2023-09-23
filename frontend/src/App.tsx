import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Button from "@mui/material/Button";
import SubscriptionModal from "./SubscriptionModal";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <SubscriptionModal />
    </>
  );
}

export default App;
