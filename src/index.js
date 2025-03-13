import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { CoinProvider } from "./context/CoinContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <CoinProvider>
    {" "}
    <App />
  </CoinProvider>
);
