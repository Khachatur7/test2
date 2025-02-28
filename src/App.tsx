import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import Top50Page from "./pages/Top200Page";
import ShareTransactionPage from "./pages/Share";

export interface ItemDataType {
  _id: string;
  hash: string;
  moment: string;
  from: string;
  to: string;
  type: string;
  value: number;
  cryptoPrice?: number;
  dollarValue?: string;
  likes?: number;
}

export interface TxCounter {
  btcTx: number;
  ethTx: number;
  bnbTx: number;
  usdtTx: number;
  usdcTx: number;
  solTx: number;
  tonTx: number;
  xrpTx: number 
}

export interface CoinCount {
  crypto: string
  frontier:string
  _id:string
}

export interface Message {
  0 : {
    massage:string
    text:string
    _id:string
  }
}

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        {/* <Route path="/all" element={<AllPage />} /> */}
        <Route path="/top-200" element={<Top50Page />} />
        <Route path="/share/item/:item_name&id/:id" element={<ShareTransactionPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
