import Navigation from "../Navigation";
import qrCodeImg from "../../images/qrcode.png";
import logoImg from "../../images/logo.png";
import bitcoinImg from "../../images/bitcoin.png";
import ethereumImg from "../../images/ethereum.png";
import usdtImg from "../../images/usdt.png";
import usdcImg from "../../images/usdc.png";
import bnbImg from "../../images/bnb.png";
import solImg from "../../images/sol.png";
import tonImg from "../../images/toncoin.svg"
import xrpImg from "../../images/xrp.png"
import { useEffect, useState } from "react";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookMessengerShareButton,
  MailruIcon,
  MailruShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  ViberIcon,
  ViberShareButton,
  VKIcon,
  VKShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import axios from "../../axios";
import { ItemDataType, Message } from "../../App";

const TopHeader = () => {
  const [share, setShare] = useState(false);
  const [hoverCount, setHoverCount] = useState<number>(0);
  const [url, setUrl] = useState<string>("");
  const [onShareMenu, setOnShareMenu] = useState(false);
  const [BiggestTXinDay, setResBiggestTXinDay] = useState<ItemDataType | null>(null);
  const [BiggestTXEver, setResBiggestTXEver] = useState<ItemDataType | null>(null);
  const [printerMes, setPrinterMes] = useState<string>("");
  const ShareTransaction = () => {
    setUrl(location.origin + `/`);
    setShare(true);
    setOnShareMenu(true);
  };

  const CloseShare = () => {
    setShare(false);
    setHoverCount(0);
    setOnShareMenu(false);
  };

  const CheckShare = () => {
    return setTimeout(() => {
      if (hoverCount < 1 && share) {
        setHoverCount(hoverCount + 1);
      } else if (hoverCount > 0 && !onShareMenu) {
        CloseShare();
      }
    }, 500);
  };

  const GetBiggestTxOfDay = async () => {
    const btc = await axios.get<{ result: ItemDataType[] }>(`/btc`);
    const eth = await axios.get<{ result: ItemDataType[] }>(`/eth`);
    const usdc = await axios.get<{ result: ItemDataType[] }>(`/usdc`);
    const usdt = await axios.get<{ result: ItemDataType[] }>(`/usdt`);
    const bnb = await axios.get<{ result: ItemDataType[] }>(`/bnb`);
    const ton = await axios.get<{ result: ItemDataType[] }>(`/ton`);
    const sol = await axios.get<{ result: ItemDataType[] }>(`/sol`);

    const resData = [
      ...btc.data.result,
      ...eth.data.result,
      ...usdc.data.result,
      ...usdt.data.result,
      ...bnb.data.result,
      ...ton.data.result,
      ...sol.data.result
    ];
    if (resData) {
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth();
      const year = today.getFullYear();
      const allNeedDate = `${day < 10 ? "0" : ""}${day}.${
        month + 1 < 10 ? "0" : ""
      }${month + 1}.${year}`;
      let check = resData[0];
      for (let i = 0; i < resData.length; i++) {
        let tx = resData[i];
        const itemData = resData[i].moment.split(" ")[1];
        if (itemData == allNeedDate) {
          if (tx.dollarValue && check.dollarValue) {
            if (+check.dollarValue < +tx.dollarValue) {
              check = tx;
            }
          }
        }
      }
      setResBiggestTXinDay(check);
    }
  };

  const GetBiggestTxEver = async () => {
    const btc = await axios.get<{ result: ItemDataType[] }>(`/btc`);
    const eth = await axios.get<{ result: ItemDataType[] }>(`/eth`);
    const usdc = await axios.get<{ result: ItemDataType[] }>(`/usdc`);
    const usdt = await axios.get<{ result: ItemDataType[] }>(`/usdt`);
    const bnb = await axios.get<{ result: ItemDataType[] }>(`/bnb`);
    const ton = await axios.get<{ result: ItemDataType[] }>(`/ton`);
    const sol = await axios.get<{ result: ItemDataType[] }>(`/sol`);

    const resData = [
      ...btc.data.result,
      ...eth.data.result,
      ...usdc.data.result,
      ...usdt.data.result,
      ...bnb.data.result,
      ...ton.data.result,
      ...sol.data.result
    ];
    if (resData) {
      let check = resData[0];
      for (let i = 0; i < resData.length; i++) {
        let tx = resData[i];
      
          if (tx.dollarValue && check.dollarValue) {
            if (+check.dollarValue < +tx.dollarValue) {
              check = tx;
            }
      
        }
      }
      setResBiggestTXEver(check);
    }
  };

  const Mes = async () => {
    try {
      const res = await axios.get<{ monData: Message }>("/txMes");
      setPrinterMes(res.data.monData[0].text);
    } catch (error) {}
  };

  useEffect(() => {
    Mes();
  }, []);

  useEffect(() => {
    CheckShare();
  }, [hoverCount]);

  useEffect(() => {
    GetBiggestTxOfDay();
    GetBiggestTxEver()
  }, []);

  return (
    <div className="max-w-lg bg-white p-8 rounded-r-2xl flex flex-col justify-between ">
      <div className="big_text">
      <div className="relative">
        <div className="w-3/5 relative">
          <img className="w-full" src={logoImg} alt="logoBigcryptotx" />
          <div
            className="flex items-center gap-3 ml-auto nav_share text-white absolute"
            onMouseMove={() => setShare(true)}
            onMouseLeave={CheckShare}
          >
            <svg
              width="35px"
              height="35px"
              viewBox="0 -0.5 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M12.5 6.25C12.9142 6.25 13.25 5.91421 13.25 5.5C13.25 5.08579 12.9142 4.75 12.5 4.75V6.25ZM20.25 12.5C20.25 12.0858 19.9142 11.75 19.5 11.75C19.0858 11.75 18.75 12.0858 18.75 12.5H20.25ZM19.5 6.25C19.9142 6.25 20.25 5.91421 20.25 5.5C20.25 5.08579 19.9142 4.75 19.5 4.75V6.25ZM15.412 4.75C14.9978 4.75 14.662 5.08579 14.662 5.5C14.662 5.91421 14.9978 6.25 15.412 6.25V4.75ZM20.25 5.5C20.25 5.08579 19.9142 4.75 19.5 4.75C19.0858 4.75 18.75 5.08579 18.75 5.5H20.25ZM18.75 9.641C18.75 10.0552 19.0858 10.391 19.5 10.391C19.9142 10.391 20.25 10.0552 20.25 9.641H18.75ZM20.0303 6.03033C20.3232 5.73744 20.3232 5.26256 20.0303 4.96967C19.7374 4.67678 19.2626 4.67678 18.9697 4.96967L20.0303 6.03033ZM11.9697 11.9697C11.6768 12.2626 11.6768 12.7374 11.9697 13.0303C12.2626 13.3232 12.7374 13.3232 13.0303 13.0303L11.9697 11.9697ZM12.5 4.75H9.5V6.25H12.5V4.75ZM9.5 4.75C6.87665 4.75 4.75 6.87665 4.75 9.5H6.25C6.25 7.70507 7.70507 6.25 9.5 6.25V4.75ZM4.75 9.5V15.5H6.25V9.5H4.75ZM4.75 15.5C4.75 18.1234 6.87665 20.25 9.5 20.25V18.75C7.70507 18.75 6.25 17.2949 6.25 15.5H4.75ZM9.5 20.25H15.5V18.75H9.5V20.25ZM15.5 20.25C18.1234 20.25 20.25 18.1234 20.25 15.5H18.75C18.75 17.2949 17.2949 18.75 15.5 18.75V20.25ZM20.25 15.5V12.5H18.75V15.5H20.25ZM19.5 4.75H15.412V6.25H19.5V4.75ZM18.75 5.5V9.641H20.25V5.5H18.75ZM18.9697 4.96967L11.9697 11.9697L13.0303 13.0303L20.0303 6.03033L18.9697 4.96967Z"
                  fill="#da9413"
                />{" "}
              </g>
            </svg>
          </div>
        </div>
        <div
          className={`nav_transaction_popup absolute`}
          id={share ? "active_share_popup" : "none_share_popup"}
          onMouseLeave={CloseShare}
          onMouseMove={ShareTransaction}
        >
          <FacebookMessengerShareButton url={url} appId="1">
            <FacebookIcon
              className={`share_bttn_icon ${
                share ? "acive_s_bttn" : "none_s_bttn"
              }`}
            />
          </FacebookMessengerShareButton>
          <TelegramShareButton url={url}>
            <TelegramIcon
              className={`share_bttn_icon ${
                share ? "acive_s_bttn" : "none_s_bttn"
              }`}
            />
          </TelegramShareButton>
          <WhatsappShareButton url={url}>
            <WhatsappIcon
              className={`share_bttn_icon ${
                share ? "acive_s_bttn" : "none_s_bttn"
              }`}
            />
          </WhatsappShareButton>
          <EmailShareButton url={url}>
            <EmailIcon
              className={`share_bttn_icon ${
                share ? "acive_s_bttn" : "none_s_bttn"
              }`}
            />
          </EmailShareButton>
          <TwitterShareButton url={url}>
            <TwitterIcon
              className={`share_bttn_icon ${
                share ? "acive_s_bttn" : "none_s_bttn"
              }`}
            />
          </TwitterShareButton>
          <RedditShareButton url={url}>
            <RedditIcon
              className={`share_bttn_icon ${
                share ? "acive_s_bttn" : "none_s_bttn"
              }`}
            />
          </RedditShareButton>
          <VKShareButton url={url}>
            <VKIcon
              className={`share_bttn_icon ${
                share ? "acive_s_bttn" : "none_s_bttn"
              }`}
            />
          </VKShareButton>
          <ViberShareButton url={url}>
            <ViberIcon
              className={`share_bttn_icon ${
                share ? "acive_s_bttn" : "none_s_bttn"
              }`}
            />
          </ViberShareButton>
          <MailruShareButton url={url}>
            <MailruIcon
              className={`share_bttn_icon ${
                share ? "acive_s_bttn" : "none_s_bttn"
              }`}
            />
          </MailruShareButton>
        </div>
      </div>
      <p className="printer_message">
        {printerMes.split(" ")[0]}
       
       {printerMes.split(" ")[1] && <span className="color-green">{` ${printerMes.split(" ")[1]} `}</span>}
        {printerMes.split(" ")[2]?printerMes.split(" ")[2]:""} 
      </p>
      </div>
      <Navigation BiggestTXinDay={BiggestTXinDay} BiggestTXEver={BiggestTXEver}/>
      <div>
        <p className="lg:text-2xl 2xl:text-3xl color-gold mb-2">
          Subscribe<span className="color-green"> to the telegram!</span>
        </p>
        <div className="flex gap-3">
          <a
            href="https://t.me/+TzNRg_I0rrAzZjgy"
            target="_blank"
            className="block"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="54"
              height="54"
              viewBox="0 0 54 54"
              fill="none"
            >
              <g clipPath="url(#clip0_612_14)">
                <path
                  d="M39.2141 0H14.7859C6.61988 0 0 6.61988 0 14.7859V39.2141C0 47.3801 6.61988 54 14.7859 54H39.2141C47.3801 54 54 47.3801 54 39.2141V14.7859C54 6.61988 47.3801 0 39.2141 0Z"
                  fill="url(#paint0_radial_612_14)"
                  fillOpacity="0.7"
                />
                <path
                  d="M26.2328 34.2273L25.4656 34.9771C24.5938 35.7792 23.8091 36.5899 22.9635 37.3833C22.618 37.7361 22.1798 37.984 21.6994 38.0982H21.5947H21.464C21.4596 38.0576 21.4596 38.0167 21.464 37.9761C21.5424 36.9038 21.6296 35.8228 21.7168 34.7417C21.7865 33.7914 21.865 32.8412 21.9347 31.8822C21.9347 31.6119 21.9783 31.3329 22.0045 31.0627C22.019 31.0015 22.0526 30.9466 22.1004 30.9057L25.9887 27.3487L33.835 20.1999L34.8811 19.2409C34.952 19.1747 35.0163 19.1017 35.0729 19.0229C35.1776 18.8747 35.1253 18.7527 34.9509 18.7091C34.8604 18.681 34.7653 18.6711 34.671 18.6801C34.5767 18.6891 34.4852 18.7167 34.4016 18.7614C34.2591 18.8324 34.1222 18.914 33.9919 19.0055L19.0491 28.4036C18.7701 28.578 18.4998 28.7611 18.1772 28.9267C18.1009 28.9526 18.0182 28.9526 17.9418 28.9267L11.2463 26.8954C11.0198 26.8339 10.7983 26.7552 10.5838 26.66C10.4804 26.624 10.3874 26.5633 10.3128 26.4831C10.2383 26.4029 10.1845 26.3057 10.1561 26.2C10.1277 26.0943 10.1257 25.9832 10.1501 25.8765C10.1744 25.7697 10.2246 25.6706 10.2961 25.5877C10.4705 25.3278 10.7198 25.1272 11.0109 25.0123C11.6968 24.7217 12.3855 24.4311 13.0771 24.1405L24.3584 19.7814L38.3074 14.4023C38.4927 14.3288 38.6857 14.2762 38.8828 14.2454C39.2182 14.208 39.5551 14.3027 39.8219 14.5094C40.0888 14.716 40.2648 15.0185 40.3125 15.3526C40.3908 15.7263 40.3908 16.1122 40.3125 16.486C39.7371 19.1973 39.153 21.9086 38.5689 24.6287L36.616 33.6607C36.3022 35.1427 35.9971 36.6161 35.6658 38.0895C35.6033 38.3912 35.5037 38.684 35.3694 38.9613C35.3171 39.1034 35.237 39.2336 35.1339 39.3445C35.0308 39.4554 34.9067 39.5446 34.7688 39.6071C34.6309 39.6695 34.4819 39.704 34.3306 39.7083C34.1793 39.7127 34.0286 39.687 33.8873 39.6326C33.5231 39.5376 33.18 39.3749 32.876 39.1531C30.6964 37.5228 28.5169 35.9012 26.3112 34.2709L26.2328 34.2273Z"
                  fill="url(#paint1_linear_612_14)"
                />
              </g>
              <defs>
                <radialGradient
                  id="paint0_radial_612_14"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(25.98 -22.9112) scale(62.7791)"
                >
                  <stop stopColor="#DA9413" />
                  <stop offset="0.2" stopColor="#DA9413" />
                  <stop offset="0.42" stopColor="#DA9413" />
                  <stop offset="0.67" stopColor="#DA9413" />
                  <stop offset="1" stopColor="#DA9413" />
                </radialGradient>
                <linearGradient
                  id="paint1_linear_612_14"
                  x1="25.2563"
                  y1="39.7197"
                  x2="25.2563"
                  y2="14.2716"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0.16" stopColor="#FDF3E1" />
                  <stop offset="0.4" stopColor="#FEFAF2" />
                  <stop offset="0.67" stopColor="#FFFEFC" />
                  <stop offset="1" stopColor="white" />
                </linearGradient>
                <clipPath id="clip0_612_14">
                  <rect width="54" height="54" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </a>
          <div className="lg:w-16 lg:h-16 xl:w-48 xl:h-48 gr_code">
            <img src={qrCodeImg} alt="QrCode" className="" />
          </div>
        </div>
      </div>
      <div className="flex justify-around">
        <img
          src={bitcoinImg}
          alt="bitcoin"
          className="md:w-5 md:h-5 lg:w-7 lg:h-7 xl:w-10 xl:h-10"
        />
        <img
          src={ethereumImg}
          alt="ethereum"
          className="md:w-5 md:h-5 lg:w-7 lg:h-7 xl:w-10 xl:h-10"
        />
        <img
          src={usdtImg}
          alt="usdt"
          className="md:w-5 md:h-5 lg:w-7 lg:h-7 xl:w-10 xl:h-10"
        />
        <img
          src={usdcImg}
          alt="usdc"
          className="md:w-5 md:h-5 lg:w-7 lg:h-7 xl:w-10 xl:h-10"
        />
        <img
          src={bnbImg}
          alt="bnb"
          className="md:w-5 md:h-5 lg:w-7 lg:h-7 xl:w-10 xl:h-10"
        />
         <img
          src={tonImg}
          alt="ton"
          className="md:w-5 md:h-5 lg:w-7 lg:h-7 xl:w-10 xl:h-10"
        />
        <img
          src={solImg}
          alt="sol"
          className="md:w-5 md:h-5 lg:w-7 lg:h-7 xl:w-10 xl:h-10"
        />
         <img
          src={xrpImg}
          alt="xrp"
          className="md:w-5 md:h-5 lg:w-7 lg:h-7 xl:w-10 xl:h-10"
        />
      </div>
    </div>
  );
};

export default TopHeader;
