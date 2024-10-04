import React, { useEffect, useState } from "react";

import { CSSTransition, TransitionGroup } from "react-transition-group";
import { ItemDataType } from "../../App";
import ColumnElement from "../ColumnElement";
import bitcoinImg from "../../images/bitcoin.png";
import ethereumImg from "../../images/ethereum.png";
import usdtImg from "../../images/usdt.png";
import usdsImg from "../../images/usdc.png";
import bnbImg from "../../images/bnb.png";
import solimg from "../../images/sol.png"
import chart from "../../images/chart.svg"

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
}

interface OnlineCheckProps {
  online: boolean;
  logoName: string | undefined;
}

// Функция которая проверяет какое изображение нужно вставить в блок logo
const OnlineCheck: React.FC<OnlineCheckProps> = ({ online, logoName }) => {
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
    }
    else if (logoName == "sol" && online) {
      return solimg;
    } else if (logoName == "sol" && !online) {
      return solimg;
    }
  };

const showChart = () => {

}


  return (
    <div className="flex justify-between items-center">
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
      <div className="w-5 h-5 md:w-6 md:h-6 flex gap-3 mr-10">
        {typeof FindLogoURL() == "string" && (
          <>
            <img src={chart} alt={chart} onClick={showChart} className="cursor-pointer"/>
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

  useEffect(() => {
    setTimeout(() => {
      setIsShow(true);
    }, 500);
  }, []);

  return (
    <div
      className={`flex items-center justify-center flex-col gap-4 w-[100%] min-w-[100%] md:w-[400px] md:min-w-[400px] lg:max-w-[27vw] lg:min-w-[27vw] lg:w-[27vw] `}
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
            <OnlineCheck logoName={props.id} online={props.online} />
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
