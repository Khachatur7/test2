import { useEffect, useMemo, useState } from "react";
import axios from "../../axios";
import { ItemDataType, TxCounter } from "../../App";
import { Column } from "../../components";
import TopHeader from "../../components/TopHeader";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import TopHeaderTel from "../../components/TopHeaderTel";
const MainPage = () => {
  const [btc, setBTC] = useState<ItemDataType[] | null>(null);
  const [eth, setETH] = useState<ItemDataType[] | null>(null);
  const [usdt, setUSDT] = useState<ItemDataType[] | null>(null);
  const [usdc, setUSDC] = useState<ItemDataType[] | null>(null);
  const [bnb, setBnb] = useState<ItemDataType[] | null>(null);
  const [sol, setSol] = useState<ItemDataType[] | null>(null);
  const [ton, setTon] = useState<ItemDataType[] | null>(null);
  // Добавил state "update" для включения функции UpdateData каждые 10 сек, которая проверяет,есть ли новая транзакция или нет
  const [update, setUpdate] = useState<boolean>(false);
  const [txCounter, setTxCounter] = useState<TxCounter | null>(null);
  const [btcInDay, setBtcInDay] = useState<number | null>(null);
  const [ethInDay, setEthInDay] = useState<number | null>(null);
  const [usdtInDay, setUsdtInDay] = useState<number | null>(null);
  const [usdcInDay, setUsdcInDay] = useState<number | null>(null);
  const [bnbInDay, setBnbInDay] = useState<number | null>(null);
  const [tonInDay, setTonInDay] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState({
    btc: {
      name: "btc",
      on: false,
    },
    eth: {
      name: "eth",
      on: false,
    },
    usdt: {
      name: "usdt",
      on: false,
    },
    usdc: {
      name: "usdc",
      on: false,
    },
    bnb: {
      name: "bnb",
      on: false,
    },
    sol: {
      name: "sol",
      on: false,
    },
    ton: {
      name: "ton",
      on: false,
    },
  });

  // функция для поиска данных по конкретному 1 роуту из 6
  const getData = async (
    // название валюты,для использования его в роуте
    name: string,
    // state и setState для обработки информации
    setState: (value: React.SetStateAction<ItemDataType[] | null>) => void,
    state: ItemDataType[] | null
  ) => {
    try {
      const res = await axios.get<{ result: ItemDataType[] }>(`/${name}`);

      if (!res.data) {
        throw Error();
      }
      const currencyItems = [];
      const currnecyLength = 5;
      if (res.data.result.length <= 5) {
        setState(res.data.result);
      } else {
        // создаем цикл для конкретного роута
        for (let i = 0; i < res.data.result.length - 1; i++) {
          const item = res.data.result[i];
          // если длина currencyItems равна currnecyLength,то цикл заканчивается,чтобы не перегружать сайт
          if (currencyItems.length - 1 == currnecyLength) {
            break;
          }
          // если предыдущее условие не работает,то мы проверяем,есть ли уже item в колонне
          else {
            // если есть,то переходи к следующему item
            if (JSON.stringify(state)?.includes(JSON.stringify(item))) {
              continue;
            }
            // если нету,то добавляем его в массив
            else {
              currencyItems.push(item);
              continue;
            }
          }
        }
        
        // далее если в state уже загружался массив,то мы добавляем новый сохраняя старый
        // (это выполняется,когда нужно уже подгрузить новые данные при скролле вниз)
        if (state && state.length > 0) {
          setState([...state, ...currencyItems]);
        }
        // если state пустой,то отправляем лишь новый массив (это выполняется лишь в первый раз,когда сайт только загрузился)
        else {
          setState(currencyItems);
        }
      }

      if (!sol?.length && name == "usdt") {
        setSol(currencyItems);
      }
   
    } catch (error) {
      console.log(`Не удалось получить данные про ${name}`);
    }
  };
  // функция для того,чтобы проверять,появилась новая транзакция или нет
  const UpdateData = async (
    name: string,
    setState: (value: React.SetStateAction<ItemDataType[] | null>) => void,
    state: ItemDataType[] | null
  ) => {
    try {
      const res = await axios.get<{ result: ItemDataType[] }>(`/${name}`);
      const item = res.data.result[0];

      if (!JSON.stringify(state)?.includes(JSON.stringify(item)) && state) {
        return setState([item, ...state]);
      }
    } catch (error) {
      console.log(`Не удалось получить данные про ${name} для обновления `);
    }
  };

  const getTx = async () => {
    try {
      const res = await axios.get<{ result: TxCounter[] }>("/txCounter");

      if (!res.data) {
        throw Error();
      }

      setTxCounter(res.data.result[0]);
    } catch (error) {
      console.log("Не удалось получить данные");
    }
  };

  const getOnline = async () => {
    try {
      const res = await axios.get("/pultikMon");
console.log(res.data.answer);

      if (!res.data) {
        throw Error();
      }
      
      setOnline({
        btc: {
          name: online.btc.name,
          on: res.data.answer[10].online,
        },
        eth: {
          name: online.eth.name,
          on: res.data.answer[11].online,
        },
        usdt: {
          name: online.usdt.name,
          on: res.data.answer[12].online,
        },
        bnb: {
          name: online.bnb.name,
          on: res.data.answer[18].online,
        },
        usdc: {
          name: online.usdc.name,
          on: res.data.answer[16].online,
        },
        sol: {
          name: "sol",
          on: false,
        },
        ton: {
          name: "ton",
          on: res.data.answer[29].online,
        },
      });
    } catch (error) {
      console.log("Не удалось получить данные");
    }
  };

  const getAllData = () => {
    getData("btc", setBTC, btc);
    getData("eth", setETH, eth);
    getData("usdt", setUSDT, usdt);
    getData("usdc", setUSDC, usdc);
    getData("bnb", setBnb, bnb);
    getData("ton", setTon, ton);
    setLoading(false);
  };

  const getTXinDay = async (
    name: string,
    setState: (value: React.SetStateAction<number | null>) => void
  ) => {
    const res = await axios.get<{ result: ItemDataType[] }>(`/${name}`);
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth();
    const year = today.getFullYear();
    const allNeedDate = `${day < 10 ? "0" : ""}${day}.${
      month + 1 < 10 ? "0" : ""
    }${month + 1}.${year}`;
    let TxinDay = 0;
    for (let i = 0; i < res.data.result.length; i++) {
      const itemData = res.data.result[i].moment.split(" ")[1];

      if (itemData == allNeedDate) {
        TxinDay += 1;
      }
    }
    setState(TxinDay);
  };

  const updateData = useMemo(() => {
    UpdateData("btc", setBTC, btc);
    UpdateData("eth", setETH, eth);
    UpdateData("usdt", setUSDT, usdt);
    UpdateData("usdc", setUSDC, usdc);
    UpdateData("bnb", setBnb, bnb);
    UpdateData("ton", setTon, ton);
    setUpdate(false);
  }, [update]);
  console.log(updateData);

  useEffect(() => {
    getAllData();
    getTx();
    getOnline();
    getTXinDay("btc", setBtcInDay);
    getTXinDay("eth", setEthInDay);
    getTXinDay("usdt", setUsdtInDay);
    getTXinDay("usdc", setUsdcInDay);
    getTXinDay("bnb", setBnbInDay);
    getTXinDay("ton", setTonInDay);

    const interval = setInterval(() => {
      setUpdate(true);
    }, 30000);

    const txInterval = setInterval(() => {
      getTx();
    }, 3000);

    const onlineInterval = setInterval(() => {
      getOnline();
    }, 60000);

    return () => {
      clearInterval(onlineInterval);
      clearInterval(interval);
      clearInterval(txInterval);
    };
  }, []);

  const handleScroll = (
    event: React.UIEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    const elem = event.currentTarget;

    if (elem.scrollHeight <= Math.ceil(elem.scrollTop + elem.offsetHeight)) {
      const currencyName = elem.getAttribute("id");

      if (currencyName == "btc") {
        getData("btc", setBTC, btc);
      } else if (currencyName == "eth") {
        getData("eth", setETH, eth);
      } else if (currencyName == "usdt") {
        getData("usdt", setUSDT, usdt);
      } else if (currencyName == "usdc") {
        getData("usdc", setUSDC, usdc);
      } else if (currencyName == "bnb") {
        getData("bnb", setBnb, bnb);
      }
      else if (currencyName == "ton") {
        getData("ton", setTon, ton);
      }
    }
  };

  return (
    <div className="md:flex md:gap-10 md:h-screen">
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
        window.innerWidth > 768 ? (
          <div className="pt-8 pb-8 flex items-start justify-start gap-2 md:gap-4 w-full overflow-x-auto overflow-y-hidden scrollbar">
            <Column
              id={online.btc.name}
              title={"More than\n1 000 BTC"}
              items={btc}
              countValue={txCounter?.btcTx}
              txInDay={btcInDay}
              online={online.btc.on}
              scroll={handleScroll}
              touchMove={handleScroll}
              currency="bitcoin"
            />
            <Column
              id={online.eth.name}
              title={"More than\n10 000 ETH"}
              items={eth}
              countValue={txCounter?.ethTx}
              txInDay={ethInDay}
              online={online.eth.on}
              scroll={handleScroll}
              touchMove={handleScroll}
              currency="ethereum"
            />
            <Column
              id={online.usdt.name}
              title={`More than\n30 000 000 USDT`}
              items={usdt}
              countValue={txCounter?.usdtTx}
              txInDay={usdtInDay}
              online={online.usdt.on}
              scroll={handleScroll}
              touchMove={handleScroll}
              currency="tether"
            />
            <Column
              id={online.usdc.name}
              title={`More than\n30 000 000 USDC`}
              items={usdc}
              countValue={txCounter?.usdcTx}
              txInDay={usdcInDay}
              online={online.usdc.on}
              scroll={handleScroll}
              touchMove={handleScroll}
              currency="usd-coin"
            />
            <Column
              id={online.bnb.name}
              title={`More than\n20 000 BNB`}
              items={bnb}
              countValue={txCounter?.bnbTx}
              online={online.bnb.on}
              txInDay={bnbInDay}
              scroll={handleScroll}
              touchMove={handleScroll}
              currency="binancecoin"
            />
            <Column
              id={online.ton.name}
              title={`More than\n100 000 TON`}
              items={ton}
              countValue={txCounter?.tonTx}
              scroll={handleScroll}
              touchMove={handleScroll}
              online={online.ton.on}
              txInDay={tonInDay}
            />
            <Column
              id={online.sol.name}
              title={`SOL\n(in development)`}
              items={sol}
              countValue={txCounter?.solTx}
              disabled
              online={online.sol.on}
            />
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            slidesPerView={1}
            slidesPerGroup={1}
            centeredSlides={true}
            centeredSlidesBounds={true}
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            navigation
            className="pt-32 pl-5 pr-5 flex items-start justify-start gap-2 md:gap-4 w-full overflow-x-auto lg:px-[4vw]"
          >
            <SwiperSlide style={{ width: "90%" }}>
              <Column
                id={online.btc.name}
                title={"More than\n1 000 BTC"}
                items={btc}
                countValue={txCounter?.btcTx}
                txInDay={btcInDay}
                online={online.btc.on}
                scroll={handleScroll}
                touchMove={handleScroll}
                currency="bitcoin"
              />
            </SwiperSlide>
            <SwiperSlide style={{ width: "100%" }}>
              <Column
                id={online.eth.name}
                title={"More than\n10 000 ETH"}
                items={eth}
                countValue={txCounter?.ethTx}
                txInDay={ethInDay}
                online={online.eth.on}
                scroll={handleScroll}
                touchMove={handleScroll}
                currency="ethereum"
              />
            </SwiperSlide>
            <SwiperSlide style={{ width: "100%" }}>
              <Column
                id={online.usdt.name}
                title={`More than\n30 000 000 USDT`}
                items={usdt}
                countValue={txCounter?.usdtTx}
                txInDay={usdtInDay}
                online={online.usdt.on}
                scroll={handleScroll}
                touchMove={handleScroll}
                currency="tether"
              />
            </SwiperSlide>
            <SwiperSlide style={{ width: "100%" }}>
              <Column
                id={online.usdc.name}
                title={`More than\n30 000 000 USDC`}
                items={usdc}
                countValue={txCounter?.usdcTx}
                txInDay={usdcInDay}
                online={online.usdc.on}
                scroll={handleScroll}
                touchMove={handleScroll}
                currency="usd-coin"
              />
            </SwiperSlide>
            <SwiperSlide style={{ width: "100%" }}>
              <Column
                id={online.bnb.name}
                title={`More than\n20 000 BNB`}
                items={bnb}
                countValue={txCounter?.bnbTx}
                online={online.bnb.on}
                txInDay={bnbInDay}
                scroll={handleScroll}
                touchMove={handleScroll}
                currency="binancecoin"
              />
            </SwiperSlide>
            <SwiperSlide style={{ width: "100%" }}>
              <Column
                id={online.sol.name}
                title={`SOL\n(in development)`}
                items={sol}
                countValue={txCounter?.solTx}
                disabled
                online={online.sol.on}
              />
            </SwiperSlide>
            <SwiperSlide style={{ width: "100%" }}>
              <Column
                id={online.ton.name}
                title={`TON\n(in development)`}
                items={ton}
                countValue={txCounter?.tonTx}
                disabled
                online={online.ton.on}
              />
            </SwiperSlide>
          </Swiper>
        )
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

export default MainPage;
