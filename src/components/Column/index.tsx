import React, { useEffect, useState } from "react";

import { CSSTransition, TransitionGroup } from "react-transition-group";
import { ItemDataType } from "../../App";
import ColumnElement from "../ColumnElement";
import bitcoinImg from "../../images/bitcoin.png";
import ethereumImg from "../../images/ethereum.png";
import usdtImg from "../../images/usdt.png";
import usdsImg from "../../images/usdc.png";
import bnbImg from "../../images/bnb.png";
import solimg from "../../images/sol.png";
import tonImg from "../../images/toncoin.svg";
import xrpImg from "../../images/xrp.png";
import search from "../../images/search_1.svg"
import LineChart from "../LineChart";

interface ColumnProps extends React.PropsWithChildren {
  id?: string;
  supTitle?: string;
  title: string;
  items: ItemDataType[] | null;
  disabled?: boolean;
  countValue?: number | null;
  txInDay?: number | null;
  onlineLinkCheck?: string;
  online?: boolean;
  scroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  touchMove?: (e: React.TouchEvent<HTMLDivElement>) => void;
  topFiat?: boolean;
  currency?: string;
}

interface OnlineCheckProps {
  online: boolean;
  logoName: string | undefined;
  currency?: string;
}

// Функция которая проверяет какое изображение нужно вставить в блок logo
const OnlineCheck: React.FC<OnlineCheckProps> = ({
  online,
  logoName,
  currency,
}) => {
  const [showChart, setShowChart] = useState<boolean>(false);
  const [hoverCount, setHoverCount] = useState<number>(0);
  const [mouseOnChartPopup, setMouseOnChartPopup] = useState<boolean>(false);

  // const chartIcon = useRef<HTMLDivElement>(null);
  const handleClickOnChartIcon = (event: TouchEvent | null) => {
    const target = event?.target as HTMLElement;
    const element = target;
    const closestElement = target.closest(".chart");

    if (element?.classList.contains(`${currency}`)) {
      setShowChart(true);
    } else if (
      !element?.classList.contains(`${currency}`) &&
      !closestElement?.classList.contains(`chart`)
    ) {
      setShowChart(false);
    }
  };

  const CloseChart = () => {
    setShowChart(false);
    setHoverCount(0);
    setMouseOnChartPopup(false);
  };

  const CheckChart = () => {
    return setTimeout(() => {
      if (hoverCount < 1 && showChart) {
        setHoverCount(hoverCount + 1);
      } else if (hoverCount > 0 && !mouseOnChartPopup) {
        CloseChart();
      }
    }, 500);
  };

  const checkMouseOnChartPopup = () => {
    setShowChart(true);
    setMouseOnChartPopup(true);
  };
  useEffect(() => {
    CheckChart();
  }, [hoverCount]);

  const FindLogoURL = () => {
    if (logoName == "btc" && online) {
      return bitcoinImg;
    } else if (logoName == "btc" && !online) {
      return bitcoinImg;
    } else if (logoName == "eth" && online) {
      return ethereumImg;
    } else if (logoName == "eth" && !online) {
      return ethereumImg;
    } else if (logoName == "usdt" && online) {
      return usdtImg;
    } else if (logoName == "usdt" && !online) {
      return usdtImg;
    } else if (logoName == "usdc" && online) {
      return usdsImg;
    } else if (logoName == "usdc" && !online) {
      return usdsImg;
    } else if (logoName == "bnb" && online) {
      return bnbImg;
    } else if (logoName == "bnb" && !online) {
      return bnbImg;
    } else if (logoName == "sol" && online) {
      return solimg;
    } else if (logoName == "sol" && !online) {
      return solimg;
    } else if (logoName == "ton" && online) {
      return tonImg;
    } else if (logoName == "ton" && !online) {
      return tonImg;
    } else if (logoName == "xrp" && online) {
      return xrpImg;
    } else if (logoName == "xrp" && !online) {
      return xrpImg;
    }
  };

  useEffect(() => {
    if (window.innerWidth < 800) {
      setTimeout(() => {
        document.addEventListener("touchend", handleClickOnChartIcon);
      }, 500);
    }
    return () => {
      document.removeEventListener("touchend", handleClickOnChartIcon);
    };
  }, []);

  return (
    <div className="flex justify-between items-center">
      {currency &&
        (window.innerWidth > 800 ? (
          <LineChart
            active={showChart}
            onLeave={CloseChart}
            onMove={checkMouseOnChartPopup}
            currency={currency}
          />
        ) : (
          <LineChart
            active={showChart}
            currency={currency}
            setShowChart={setShowChart}
          />
        ))}
      <div className="flex gap-2 items-center">
        <p className="rounded-lg bg-gold text-sm md:text-base pt-1 pb-1 pl-3 pr-3">
          Own node
        </p>
        <div
          className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${
            online ? "bg-green" : "bg-red"
          }`}
        ></div>
      </div>
      <div className="h-5 md:w-6 md:h-6 flex gap-3 mr-16 logo_column">
        {typeof FindLogoURL() == "string" && (
          <>
            <img src={search} className="search_icon"/>
            {window.innerWidth > 800 ? (
              <div
                className="chart_bttn"
                onMouseMove={() => setShowChart(true)}
                onMouseLeave={CheckChart}
              >
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 16 16"
                  version="1.1"
                  fill="#084236"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0" />

                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path d="M16,14L16,16L0,16L0,14L16,14ZM11,5L11,13L9,13L9,5L11,5ZM15,1L15,13L13,13L13,1L15,1ZM3,9L3,13L1,13L1,9L3,9ZM7,3L7,13L5,13L5,3L7,3Z" />{" "}
                  </g>
                </svg>
              </div>
            ) : (
              <div className={`chart_bttn ${currency}`}>
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 16 16"
                  version="1.1"
                  fill="#084236"
                  className={currency}
                >
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      className={currency}
                      d="M16,14L16,16L0,16L0,14L16,14ZM11,5L11,13L9,13L9,5L11,5ZM15,1L15,13L13,13L13,1L15,1ZM3,9L3,13L1,13L1,9L3,9ZM7,3L7,13L5,13L5,3L7,3Z"
                    />{" "}
                  </g>
                </svg>
              </div>
            )}
            <img src={FindLogoURL()} alt={logoName} />
          </>
        )}
      </div>
    </div>
  );
};

const Column: React.FC<ColumnProps> = (props) => {
  const [isShow, setIsShow] = useState(false);
  const style = {
    height: `${
      window.innerHeight -
      (window.innerWidth > 480 ? 260 : 200) +
      (props.topFiat ? 123 : 43)
    }px`,
  };
// console.log(`${props.currency}:${props.online}`);

  useEffect(() => {
    setTimeout(() => {
      setIsShow(true);
    }, 500);
  }, []);

  return (
    <div
      className={`flex items-center justify-center flex-col gap-4 relative w-[100%] min-w-[100%] md:w-[400px] md:min-w-[400px] lg:max-w-[27vw] lg:min-w-[27vw] lg:w-[27vw] `}
    >
      <div className="w-full">
        {props.supTitle ? (
          <p
            className="text-xl text-center font-bold text-[#2D2D2D] transition-all"
            style={{ opacity: isShow ? 1 : 0 }}
          >
            {props.supTitle}
          </p>
        ) : (
          <></>
        )}
        <div className="rounded-lg p-5 bg-white">
          {typeof props.online === "boolean" ? (
            <OnlineCheck
              logoName={props.id}
              online={props.online}
              currency={props.currency}
            />
          ) : (
            <></>
          )}
          <div className="flex justify-between items-end">
            <h2
              className="text-2xl lg:text-2xl xl:text-3xl mt-3 p-0 color-green transition-all "
              style={{ whiteSpace: "pre-wrap", opacity: isShow ? 1 : 0 }}
            >
              {props.title}
            </h2>
            <div className="tx_in">
              <p>
                {props.txInDay !== null ? (
                  <span className="-translate-y-1/2 text-base md:text-lg tx-sec color-goldLight">
                    Tx/today: {props.txInDay || 0}
                  </span>
                ) : (
                  <></>
                )}
              </p>
              <p>
                {props.countValue !== null ? (
                  <span className="-translate-y-1/2 text-base md:text-lg tx-sec color-goldLight">
                    Tx/sec: {props.countValue || 0}
                  </span>
                ) : (
                  <></>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      <TransitionGroup
        id={props.id}
        onScroll={props.scroll}
        onTouchMove={props.touchMove}
        className="flex flex-col gap-4 pr-3 w-full overflow-y-auto overflow-x-hidden column_scrollbar"
        style={style}
      >
        {props.items && props.items.length ? (
          props.items.map((item, index) => (
            <CSSTransition
              key={item._id}
              timeout={600}
              classNames={"column-item"}
            >
              <ColumnElement
                item={item}
                disabled={props.disabled}
                index={index}
                topFiat={props.topFiat}
              />
            </CSSTransition>
          ))
        ) : (
          <></>
        )}
      </TransitionGroup>
    </div>
  );
};

export default Column;
