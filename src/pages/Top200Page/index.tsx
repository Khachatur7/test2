import { useEffect, useState } from "react";

import axios from "../../axios";
import { ItemDataType } from "../../App";
import { Column } from "../../components";
import TopHeader from "../../components/TopHeader";
import TopHeaderTel from "../../components/TopHeaderTel";

const Top50Page = () => {
  const [items, setItems] = useState<ItemDataType[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [sliceItemsLength, setSliceItemsLength] = useState<number>(5);
  const getData = async () => {
    try {
      const resBTC = await axios.get<{ result: ItemDataType[] }>(`/btc`);
      const resETH = await axios.get<{ result: ItemDataType[] }>(`/eth`);
      const resUSDT = await axios.get<{ result: ItemDataType[] }>(`/usdt`);
      const resUSDC = await axios.get<{ result: ItemDataType[] }>(`/usdc`);
      const resBNB = await axios.get<{ result: ItemDataType[] }>(`/bnb`);
      const resTON = await axios.get<{ result: ItemDataType[] }>(`/ton`);
      const resSOL = await axios.get<{ result: ItemDataType[] }>(`/sol`);

      if (
        !resBTC.data.result ||
        !resETH.data.result ||
        !resUSDT.data.result ||
        !resUSDC.data.result ||
        !resBNB.data.result ||
        !resTON.data.result ||
        !resSOL.data.result
      ) {
        throw Error();
      }

      let btc = [...resBTC.data.result]
        .sort((a, b) => {
          const x = a.dollarValue ? +a.dollarValue : 0;
          const y = b.dollarValue ? +b.dollarValue : 0;
          return x > y ? -1 : x < y ? 1 : 0;
        })
        .slice(0, 200);

      let eth = [...resETH.data.result]
        .sort((a, b) => {
          const x = a.dollarValue ? +a.dollarValue : 0;
          const y = b.dollarValue ? +b.dollarValue : 0;
          return x > y ? -1 : x < y ? 1 : 0;
        })
        .slice(0, 200);
      let usdc = [...resUSDC.data.result]
        .sort((a, b) => {
          const x = a.dollarValue ? +a.dollarValue : 0;
          const y = b.dollarValue ? +b.dollarValue : 0;
          return x > y ? -1 : x < y ? 1 : 0;
        })
        .slice(0, 200);
      let usdt = [...resUSDT.data.result]
        .sort((a, b) => {
          const x = a.dollarValue ? +a.dollarValue : 0;
          const y = b.dollarValue ? +b.dollarValue : 0;
          return x > y ? -1 : x < y ? 1 : 0;
        })
        .slice(0, 200);
      let sol = [...resSOL.data.result]
        .sort((a, b) => {
          const x = a.dollarValue ? +a.dollarValue : 0;
          const y = b.dollarValue ? +b.dollarValue : 0;
          return x > y ? -1 : x < y ? 1 : 0;
        })
        .slice(0, 200);

      let bnb = [...resBNB.data.result]
        .sort((a, b) => {
          const x = a.dollarValue ? +a.dollarValue : 0;
          const y = b.dollarValue ? +b.dollarValue : 0;
          return x > y ? -1 : x < y ? 1 : 0;
        })
        .slice(0, 200);
      let ton = [...resTON.data.result]
        .sort((a, b) => {
          const x = a.dollarValue ? +a.dollarValue : 0;
          const y = b.dollarValue ? +b.dollarValue : 0;
          return x > y ? -1 : x < y ? 1 : 0;
        })
        .slice(0, 200);
      setItems(
        [...btc, ...eth, ...usdc, ...usdt, ...bnb, ...ton, ...sol]
          .sort((a, b) => {
            const x = a.dollarValue ? +a.dollarValue : 0;
            const y = b.dollarValue ? +b.dollarValue : 0;
            return x > y ? -1 : 0;
          })
          .slice(0, 200)
      );
      setLoading(false);
    } catch (error) {
      console.log("Не удалось получить данные");
    }
  };

  const handleScroll = (
    event: React.UIEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    const elem = event.currentTarget;

    if (elem.scrollHeight <= Math.ceil(elem.scrollTop + elem.offsetHeight)) {
      setSliceItemsLength(sliceItemsLength + 5);
    }
  };

  useEffect(() => {
    getData();

    const interval = setInterval(() => {
      getData();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="md:flex md:gap-10 md:h-screen md:max-w-5xl">
      {!loading ? (
        window.innerWidth > 768 ? (
          <TopHeader />
        ) : (
          <TopHeaderTel />
        )
      ) : (
        <></>
      )}
      {!loading ? (
        <div className="pt-32 pl-5 pr-5 md:pl-0 md:pr-0 md:pt-8 md:pb-8 height">
          <Column
            title="Top 200 fiat transactions"
            items={items && items?.slice(0, sliceItemsLength)}
            topFiat={true}
            countValue={null}
            txInDay={null}
            scroll={handleScroll}
            touchMove={handleScroll}
          />
        </div>
      ) : (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-spin"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default Top50Page;
