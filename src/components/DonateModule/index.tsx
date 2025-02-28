import axios from "../../axios";
import { useEffect, useState } from "react";

interface DonutModule {
  setDonutOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface TRC20 {
  trc20: string;
  wallet: string;
  _id: string;
}

const DonateModule: React.FC<DonutModule> = ({ setDonutOpen }) => {
  const [wallet, setWallet] = useState<string>("");

  const donateWalletLink = async () => {
    try {
      const res = await axios.get<{ walData: TRC20[] }>("/txWal");
      setWallet(res.data.walData[0].trc20);
    } catch (error) {
      console.log(`Не удалось получить ссылку для доната`);
    }
  };

  const copyHandler = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  useEffect(() => {
    donateWalletLink();
  }, []);

  return (
    <div className="donate_module">
      <div className="exit_donate_module" onClick={() => setDonutOpen(false)}>
        <svg
          width="35px"
          height="35px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z"
            fill="#084236"
          />
        </svg>
      </div>
      <div className="module_content">
        <span>You can support this project with donation to:</span>
        <span>
          {" "}
          USDT (TRC20):{" "}
          <div className="wallet_link">
            <span>{wallet}</span>{" "}
            <button
              onClick={() => copyHandler(`${wallet}`)}
              onTouchEnd={() => copyHandler(`${wallet}`)}
              className="ml-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M13.3333 10.75V14.25C13.3333 17.1667 12.1666 18.3333 9.24996 18.3333H5.74996C2.83329 18.3333 1.66663 17.1667 1.66663 14.25V10.75C1.66663 7.83334 2.83329 6.66667 5.74996 6.66667H9.24996C12.1666 6.66667 13.3333 7.83334 13.3333 10.75Z"
                  fill="#f0a927"
                />
                <path
                  d="M14.2498 1.66667H10.7498C8.18054 1.66667 6.97559 2.57841 6.72457 4.78251C6.67205 5.24363 7.05394 5.625 7.51804 5.625H9.24981C12.7498 5.625 14.3748 7.25 14.3748 10.75V12.4818C14.3748 12.9458 14.7561 13.3278 15.2173 13.2753C17.4214 13.0242 18.3331 11.8193 18.3331 9.25V5.75C18.3331 2.83334 17.1665 1.66667 14.2498 1.66667Z"
                  fill="#f0a927"
                />
              </svg>
            </button>
          </div>
          <span>
          {" "}
          USDT (BEP20):
          <div className="wallet_link">
            <span>0x246549c678111c41db4b82234c3d9514ab0654f4</span>{" "}
            <button
              onClick={() =>
                copyHandler(`0x246549c678111c41db4b82234c3d9514ab0654f4`)
              }
              onTouchEnd={() =>
                copyHandler(`0x246549c678111c41db4b82234c3d9514ab0654f4`)
              }
              className="ml-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M13.3333 10.75V14.25C13.3333 17.1667 12.1666 18.3333 9.24996 18.3333H5.74996C2.83329 18.3333 1.66663 17.1667 1.66663 14.25V10.75C1.66663 7.83334 2.83329 6.66667 5.74996 6.66667H9.24996C12.1666 6.66667 13.3333 7.83334 13.3333 10.75Z"
                  fill="#f0a927"
                />
                <path
                  d="M14.2498 1.66667H10.7498C8.18054 1.66667 6.97559 2.57841 6.72457 4.78251C6.67205 5.24363 7.05394 5.625 7.51804 5.625H9.24981C12.7498 5.625 14.3748 7.25 14.3748 10.75V12.4818C14.3748 12.9458 14.7561 13.3278 15.2173 13.2753C17.4214 13.0242 18.3331 11.8193 18.3331 9.25V5.75C18.3331 2.83334 17.1665 1.66667 14.2498 1.66667Z"
                  fill="#f0a927"
                />
              </svg>
            </button>
          </div>
        </span>
        </span>
      </div>
     
    </div>
  );
};

export default DonateModule;
