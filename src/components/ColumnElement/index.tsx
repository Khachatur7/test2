import React, { useEffect, useState } from "react";
import { ItemDataType } from "../../App";
import { priceReplaceHandler } from "../../handlers";
import { parse } from "date-fns";
import like1Img from "../../images/like1.png";
import fireImg from "../../images/fire.png";
import axios from "../../axios";
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

interface ColumnElementProps {
  item: ItemDataType;
  disabled?: boolean;
  index?: number;
  topFiat?: boolean;
}

const ColumnElement: React.FC<ColumnElementProps> = ({
  item,
  disabled,
  topFiat,
  index,
}) => {
  const [isNew, setIsNew] = useState(false);
  const [likeDisabled, setLikeDisabled] = useState(
    localStorage.getItem("transaction-likes")?.includes(item._id)
  );
  const [likes, setLikes] = useState(0);
  const [share, setShare] = useState(false);
  const [onShareMenu, setOnShareMenu] = useState(false);
  const [hoverCount, setHoverCount] = useState<number>(0);
  const [urlData, setUrlData] = useState<string>("");
  const freshDateCheck = () => {
    const date = parse(item.moment, "HH:mm dd.MM.yyyy", new Date());
    const currentDate = new Date();
    setIsNew(currentDate.getTime() - date.getTime() < 3600000);
  };

  const copyHandler = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  // const likeCheck = () => {
  //   try {
  //     const transactionsLikes = JSON.parse(
  //       localStorage.getItem("transaction-likes") || ""
  //     );

  //     setLikeDisabled(transactionsLikes.indexOf(item._id) !== -1);
  //   } catch (error) {
  //     setLikeDisabled(false);
  //   }
  // };

  const likeTransaction = async () => {
    if (likeDisabled) {
      return;
    }
    const storageLikes = localStorage.getItem("transaction-likes");

    try {
      if (!storageLikes?.includes(item._id)) {
        const res = await axios.post("/txLikes", {
          _id: item._id,
          type: item.type,
        });

        if (!res.data || res.status !== 200) {
          throw Error();
        }
        setLikes(res.data.likes);

        let transactionLikes;

        if (storageLikes) {
          transactionLikes = JSON.parse(storageLikes);
        }

        localStorage.setItem(
          "transaction-likes",
          JSON.stringify([
            ...(transactionLikes ? transactionLikes : []),
            item._id,
          ])
        );
        setLikeDisabled(true);
      } else {
        setLikeDisabled(true);
      }
    } catch (error) {
      setLikeDisabled(false);
    }
  };

  const ShareTransaction = () => {
    setUrlData(`bigcryptotx.com
Value: ${item.value} ${item.type} 
Fiat: ${item.dollarValue}$  
From: ${item.from} 
To: ${item.to}
Hash: ${item.hash.substring(0, 50)}
${item.hash.substring(50, item.hash.length - 1)}
Time: ${item.moment}`);
    setShare(true);
    setOnShareMenu(true);
  };

  const CloseShare = () => {
    if (window.innerWidth > 800) {
      setShare(false);
      setHoverCount(0);
      setOnShareMenu(false);
    }
  };

  const MobileShareTransaction = () => {
    setUrlData(`bigcryptotx.com
Value: ${item.value} ${item.type} 
Fiat: ${item.dollarValue}$  
From: ${item.from} 
To: ${item.to}
Hash: ${item.hash.substring(0, 50)}
${item.hash.substring(50, item.hash.length - 1)}
Time: ${item.moment}`);
    setShare(!share);
  };

  const CheckShare = () => {
    if (window.innerWidth > 800) {
      return setTimeout(() => {
        if (hoverCount < 1 && share) {
          setHoverCount(hoverCount + 1);
        } else if (hoverCount > 0 && !onShareMenu) {
          CloseShare();
        }
      }, 500);
    }
  };

  useEffect(() => {
    freshDateCheck();
    // likeCheck();
    if (typeof item.likes === "number") {
      setLikes(item.likes);
    }
  }, [item]);

  useEffect(() => {
    CheckShare();
  }, [hoverCount]);

  return (
    <div
      className={`card relative flex flex-col gap-2 md:text-xl bg-white p-7 rounded-lg w-full transition-all ${
        disabled ? `!opacity-70` : ""
      }`}
      style={{ wordBreak: "break-all", position: "relative" }}
    >
      {isNew && !disabled ? (
        <div className="w-7 h-7 fire">
          <img src={fireImg} alt="fire" />
        </div>
      ) : (
        <></>
      )}
      {topFiat && (
        <>
          <div className="index">
            <p className="text-white">{index ? index + 1 : 1}</p>
          </div>
        </>
      )}
      <p className="text-white">
        Value:{" "}
        <span className="text-gray-300">
          {!disabled
            ? priceReplaceHandler(Number(item.value.toString().split(".")[0]))
            : 0}
          .
          {!disabled
            ? item.value.toString().split(".")[1]?.length == 2
              ? item.value.toString().split(".")[1]
              : item.value.toString().split(".")[1]?.length == 1
              ? item.value.toString().split(".")[1] + "0"
              : "00"
            : 0}
        </span>{" "}
        <span className="uppercase text-gray-300">
          {!disabled ? item.type : "DOGE"}
        </span>
      </p>
      <p className="text-white">
        Fiat:{" "}
        <span className="text-gray-300">
          {!disabled && item.dollarValue ? (
            <>
              {priceReplaceHandler(Number(item.dollarValue.split(".")[0]))}.
              {item.dollarValue.split(".")[1]}
              <span className="uppercase text-gray-300"> $</span>
            </>
          ) : (
            "-"
          )}
          {" || "}
          {!disabled && item.cryptoPrice ? (
            <>
              {priceReplaceHandler(
                Number(JSON.stringify(item.cryptoPrice).split(".")[0])
              )}
              .{JSON.stringify(item.cryptoPrice).split(".")[1] || "00"}
              {JSON.stringify(item.cryptoPrice).split(".")[1]?.length == 1 &&
                "0"}
              {JSON.stringify(item.cryptoPrice).split(".")[1]?.length == 3 &&
                "0"}
              <span className="uppercase text-gray-300"> $</span>
            </>
          ) : (
            "-"
          )}
        </span>
      </p>
      <div className="text-white">
        <p>From: </p>
        <span className="text-gray-300">{!disabled ? item.from : ""}</span>
        <button onClick={() => copyHandler(`${item.from}`)} className="ml-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M13.3333 10.75V14.25C13.3333 17.1667 12.1666 18.3333 9.24996 18.3333H5.74996C2.83329 18.3333 1.66663 17.1667 1.66663 14.25V10.75C1.66663 7.83334 2.83329 6.66667 5.74996 6.66667H9.24996C12.1666 6.66667 13.3333 7.83334 13.3333 10.75Z"
              fill="#D9D9D9"
              fillOpacity="0.3"
            />
            <path
              d="M14.2498 1.66667H10.7498C8.18054 1.66667 6.97559 2.57841 6.72457 4.78251C6.67205 5.24363 7.05394 5.625 7.51804 5.625H9.24981C12.7498 5.625 14.3748 7.25 14.3748 10.75V12.4818C14.3748 12.9458 14.7561 13.3278 15.2173 13.2753C17.4214 13.0242 18.3331 11.8193 18.3331 9.25V5.75C18.3331 2.83334 17.1665 1.66667 14.2498 1.66667Z"
              fill="#D9D9D9"
              fillOpacity="0.3"
            />
          </svg>
        </button>
      </div>
      <div className="text-white">
        <p>To:</p>{" "}
        <span className="text-gray-300">{!disabled ? item.to : ""}</span>
        <button onClick={() => copyHandler(`${item.to}`)} className="ml-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M13.3333 10.75V14.25C13.3333 17.1667 12.1666 18.3333 9.24996 18.3333H5.74996C2.83329 18.3333 1.66663 17.1667 1.66663 14.25V10.75C1.66663 7.83334 2.83329 6.66667 5.74996 6.66667H9.24996C12.1666 6.66667 13.3333 7.83334 13.3333 10.75Z"
              fill="#D9D9D9"
              fillOpacity="0.3"
            />
            <path
              d="M14.2498 1.66667H10.7498C8.18054 1.66667 6.97559 2.57841 6.72457 4.78251C6.67205 5.24363 7.05394 5.625 7.51804 5.625H9.24981C12.7498 5.625 14.3748 7.25 14.3748 10.75V12.4818C14.3748 12.9458 14.7561 13.3278 15.2173 13.2753C17.4214 13.0242 18.3331 11.8193 18.3331 9.25V5.75C18.3331 2.83334 17.1665 1.66667 14.2498 1.66667Z"
              fill="#D9D9D9"
              fillOpacity="0.3"
            />
          </svg>
        </button>
      </div>
      <div className="text-white">
        <p>Hash: </p>
        <span className="text-gray-300">
          {!disabled ? (
            <a
              className="underline"
              href={
                item.type == "bnb"
                  ? `https://bscscan.com/tx/${item.hash}`
                  : item.type == "ton"
                  ? `https://tonscan.org/ru/tx/${item.hash}`
                  : `https://www.blockchain.com/explorer/search?search=${item.hash}`
              }
              target="_blank"
            >
              {item.hash}
            </a>
          ) : (
            ""
          )}
        </span>
        <button onClick={() => copyHandler(`${item.hash}`)} className="ml-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M13.3333 10.75V14.25C13.3333 17.1667 12.1666 18.3333 9.24996 18.3333H5.74996C2.83329 18.3333 1.66663 17.1667 1.66663 14.25V10.75C1.66663 7.83334 2.83329 6.66667 5.74996 6.66667H9.24996C12.1666 6.66667 13.3333 7.83334 13.3333 10.75Z"
              fill="#D9D9D9"
              fillOpacity="0.3"
            />
            <path
              d="M14.2498 1.66667H10.7498C8.18054 1.66667 6.97559 2.57841 6.72457 4.78251C6.67205 5.24363 7.05394 5.625 7.51804 5.625H9.24981C12.7498 5.625 14.3748 7.25 14.3748 10.75V12.4818C14.3748 12.9458 14.7561 13.3278 15.2173 13.2753C17.4214 13.0242 18.3331 11.8193 18.3331 9.25V5.75C18.3331 2.83334 17.1665 1.66667 14.2498 1.66667Z"
              fill="#D9D9D9"
              fillOpacity="0.3"
            />
          </svg>
        </button>
      </div>
      <p className="mt-4 text-sm md:text-base text-gray-300">
        Time:{" "}
        <span className="text-base color-greenLight">
          {!disabled ? item.moment : ""}{" "}
        </span>
      </p>
      <div className="flex items-center gap-3 ml-auto like">
        <p className="text-white">{likes ? likes : item.likes || 0}</p>
        <button
          className="flex items-center justify-center disabled:opacity-50"
          onClick={likeTransaction}
          disabled={likeDisabled}
        >
          <img
            src={like1Img}
            alt="Like img"
            className="w-6 h-6 object-scale-down"
          />
        </button>
      </div>
      <div
        className="flex items-center gap-3 ml-auto share text-white"
        onMouseMove={() => !disabled?setShare(true):""}
        onMouseLeave={CheckShare}
        onTouchEnd={() =>
          window.innerWidth < 800 ? MobileShareTransaction() : ""
        }
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
              fill="#d7d7d7"
            />{" "}
          </g>
        </svg>
      </div>
      <div
        className={`share_transaction_popup`}
        id={share ? "active_share_popup" : "none_share_popup"}
        onMouseLeave={CloseShare}
        onMouseMove={ShareTransaction}
      >
        <FacebookMessengerShareButton url={urlData} appId="1">
          <FacebookIcon
            className={`share_bttn_icon ${
              share ? "acive_s_bttn" : "none_s_bttn"
            }`}
          />
        </FacebookMessengerShareButton>
        <TelegramShareButton url={urlData}>
          <TelegramIcon
            className={`share_bttn_icon ${
              share ? "acive_s_bttn" : "none_s_bttn"
            }`}
          />
        </TelegramShareButton>
        <WhatsappShareButton url={urlData}>
          <WhatsappIcon
            className={`share_bttn_icon ${
              share ? "acive_s_bttn" : "none_s_bttn"
            }`}
          />
        </WhatsappShareButton>
        <EmailShareButton url={urlData}>
          <EmailIcon
            className={`share_bttn_icon ${
              share ? "acive_s_bttn" : "none_s_bttn"
            }`}
          />
        </EmailShareButton>
        <TwitterShareButton url={urlData}>
          <TwitterIcon
            className={`share_bttn_icon ${
              share ? "acive_s_bttn" : "none_s_bttn"
            }`}
          />
        </TwitterShareButton>
        <RedditShareButton url={urlData}>
          <RedditIcon
            className={`share_bttn_icon ${
              share ? "acive_s_bttn" : "none_s_bttn"
            }`}
          />
        </RedditShareButton>
        <VKShareButton url={urlData}>
          <VKIcon
            className={`share_bttn_icon ${
              share ? "acive_s_bttn" : "none_s_bttn"
            }`}
          />
        </VKShareButton>
        <ViberShareButton url={urlData}>
          <ViberIcon
            className={`share_bttn_icon ${
              share ? "acive_s_bttn" : "none_s_bttn"
            }`}
          />
        </ViberShareButton>
        <MailruShareButton url={urlData}>
          <MailruIcon
            className={`share_bttn_icon ${
              share ? "acive_s_bttn" : "none_s_bttn"
            }`}
          />
        </MailruShareButton>
      </div>
    </div>
  );
};

export default ColumnElement;
