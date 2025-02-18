import { Connection, PublicKey } from "@solana/web3.js";
import axios from "axios";

const SOLANA_RPC = "https://solana-api.instantnodes.io/token-RJ3azHaMiu4NfTuT24hEImKAUIUlwgIy"; 
const COINGECKO_API_URL = "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd";

export const fetchSolanaBalance = async (solanaAddress) => {
  try {
    if (!solanaAddress) throw new Error("Invalid Solana address");

    const publicKey = new PublicKey(solanaAddress);
    
    const connection = new Connection(SOLANA_RPC, "confirmed");
    const balance = await connection.getBalance(publicKey);

    if (typeof balance !== "number") throw new Error("Invalid balance response");

    const solBalance = balance / 1e9; 

    const priceResponse = await axios.get(COINGECKO_API_URL);
    const solPrice = priceResponse.data.solana?.usd || 34;

    return {
      solBalance,
      solBalanceUSD: (solBalance * solPrice).toFixed(2),
    };
  } catch (error) {
    console.error("Error fetching SOL balance:", error.message);
    return { solBalance: 0, solBalanceUSD: "Error" };
  }
};
