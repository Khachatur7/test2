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
// import { priceReplaceHandler } from "../../handlers";
const MainPage = () => {
  const [btc, setBTC] = useState<ItemDataType[] | null>(null);
  const [eth, setETH] = useState<ItemDataType[] | null>(null);
  const [usdt, setUSDT] = useState<ItemDataType[] | null>(null);
  const [usdc, setUSDC] = useState<ItemDataType[] | null>(null);
  const [bnb, setBnb] = useState<ItemDataType[] | null>(null);
  const [sol, setSol] = useState<ItemDataType[] | null>(null);
  const [ton, setTon] = useState<ItemDataType[] | null>(null);
  const [xrp, setXrp] = useState<ItemDataType[] | null>(null);
  // Добавил state "update" для включения функции UpdateData каждые 10 сек, которая проверяет,есть ли новая транзакция или нет
  const [update, setUpdate] = useState<boolean>(false);
  const [txCounter, setTxCounter] = useState<TxCounter | null>(null);
  const [btcInDay, setBtcInDay] = useState<number | null>(null);
  const [ethInDay, setEthInDay] = useState<number | null>(null);
  const [usdtInDay, setUsdtInDay] = useState<number | null>(null);
  const [usdcInDay, setUsdcInDay] = useState<number | null>(null);
  const [bnbInDay, setBnbInDay] = useState<number | null>(null);
  const [tonInDay, setTonInDay] = useState<number | null>(null);
  const [solInDay, setSolInDay] = useState<number | null>(null);
  // const [coinsCount, setCoinsCount] = useState({
  //   bnb: "0",
  //   ton: "0",
  //   sol:"0"
  // });

  const [loading, setLoading] = useState(true);
  // const [online, setOnline] = useState({
  //   btc: {
  //     name: "btc",
  //     on: false,
  //   },
  //   eth: {
  //     name: "eth",
  //     on: false,
  //   },
  //   usdt: {
  //     name: "usdt",
  //     on: false,
  //   },
  //   usdc: {
  //     name: "usdc",
  //     on: false,
  //   },
  //   bnb: {
  //     name: "bnb",
  //     on: false,
  //   },
  //   sol: {
  //     name: "sol",
  //     on: false,
  //   },
  //   ton: {
  //     name: "ton",
  //     on: false,
  //   },
  //   xrp: {
  //     name: "xrp",
  //     on: false,
  //   },
  // });
  const [btcOnline, setBtcOnline] = useState(false);
  const [ethOnline, setEthOnline] = useState(false);
  const [usdtOnline, setUsdtOnline] = useState(false);
  const [usdcOnline, setUsdcOnline] = useState(false);
  const [solOnline, setSolOnline] = useState(false);
  const [tonOnline, setTonOnline] = useState(false);
  const [bnbOnline, setBnbOnline] = useState(false);

  // console.log(online);

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
      if (!xrp?.length && name == "usdt") {
        setXrp(currencyItems);
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
      const res = await axios.post("/pultikMon");

      if (!res.data) {
        throw Error();
      }

      if (res.data.answer[20].online) {
        setSolOnline(res.data.answer[20].online);
      }
      if (res.data.answer[19].online) {
        setTonOnline(res.data.answer[19].online);
      }
      if (res.data.answer[18].online) {
        setBnbOnline(res.data.answer[18].online);
      }
      if (res.data.answer[10].online) {
        setBtcOnline(res.data.answer[10].online);
      }
      if (res.data.answer[11].online) {
        setEthOnline(res.data.answer[11].online);
      }
      if (res.data.answer[12].online) {
        setUsdtOnline(res.data.answer[12].online);
      }
      if (res.data.answer[16].online) {
        setUsdcOnline(res.data.answer[16].online);
      }


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
    getData("sol", setSol, sol);
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
    const allNeedDate = `${day < 10 ? "0" : ""}${day}.${month + 1 < 10 ? "0" : ""
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

  // const getCoinCount = async () => {
  //   try {
  //     const res = await axios.get<{ result: CoinCount[] }>("/frontier");
  //     if (res.data) {

  //       setCoinsCount({
  //         bnb: res.data.result[0].frontier,
  //         ton: res.data.result[1].frontier,
  //         sol: res.data.result[2].frontier,
  //       });
  //     }
  //   } catch (error) {
  //     console.log(`Не удалось получить данные про количество монет`);
  //   }
  // };

  const updateData = useMemo(() => {
    UpdateData("btc", setBTC, btc);
    UpdateData("eth", setETH, eth);
    UpdateData("usdt", setUSDT, usdt);
    UpdateData("usdc", setUSDC, usdc);
    UpdateData("bnb", setBnb, bnb);
    UpdateData("ton", setTon, ton);
    UpdateData("sol", setSol, sol);
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
    getTXinDay("sol", setSolInDay);
    // getCoinCount();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setUpdate(true);
    }, 40000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const txInterval = setInterval(() => {
      getTx();
    }, 4000);
    return () => {
      clearInterval(txInterval);
    };
  }, []);

  useEffect(() => {
    const onlineInterval = setInterval(() => {
      getOnline();
    }, 120000);
    return () => {
      clearInterval(onlineInterval);
    };
  }, []);

  const handleScroll = (
    event: React.UIEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    const elem = event.currentTarget;

    if (elem.scrollHeight-1 <= Math.floor(elem.scrollTop + elem.offsetHeight)) {
      const currencyName = elem.getAttribute("id");

      if (currencyName == "btc") {
        console.log(555);
        getData("btc", setBTC, btc);
      } else if (currencyName == "eth") {
        getData("eth", setETH, eth);
      } else if (currencyName == "usdt") {
        getData("usdt", setUSDT, usdt);
      } else if (currencyName == "usdc") {
        getData("usdc", setUSDC, usdc);
      } else if (currencyName == "bnb") {
        getData("bnb", setBnb, bnb);
      } else if (currencyName == "sol") {
        getData("sol", setSol, sol);
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
              id={"btc"}
              title={"More than\n1 000 BTC"}
              items={btc}
              countValue={txCounter?.btcTx}
              txInDay={btcInDay}
              online={btcOnline}
              scroll={handleScroll}
              touchMove={handleScroll}
              currency="BTC"
            />
            <Column
              id={"eth"}
              title={"More than\n10 000 ETH"}
              items={eth}
              countValue={txCounter?.ethTx}
              txInDay={ethInDay}
              online={ethOnline}
              scroll={handleScroll}
              touchMove={handleScroll}
              currency="ETH"
            />
            <Column
              id={"usdt"}
              title={`More than\n50 000 000 USDT`}
              items={usdt}
              countValue={txCounter?.usdtTx}
              txInDay={usdtInDay}
              online={usdtOnline}
              scroll={handleScroll}
              touchMove={handleScroll}
              currency="tether"
            />
            <Column
              id={"usdc"}
              title={`More than\n50 000 000 USDC`}
              items={usdc}
              countValue={txCounter?.usdcTx}
              txInDay={usdcInDay}
              online={usdcOnline}
              scroll={handleScroll}
              touchMove={handleScroll}
              currency="USDC"
            />
            <Column
              id={"sol"}
              title={`More than\n50 000 SOL`}
              items={sol}
              countValue={txCounter?.solTx}
              scroll={handleScroll}
              touchMove={handleScroll}
              txInDay={solInDay}
              online={solOnline}
              currency="SOL"
            />

            <Column
              id={"ton"}
              title={`More than\n2 000 000 TON`}
              items={ton}
              countValue={txCounter?.tonTx}
              scroll={handleScroll}
              touchMove={handleScroll}
              online={tonOnline}
              txInDay={tonInDay}
              currency="TON"
            />
            <Column
              id={"bnb"}
              title={`More than\n15 000 BNB`}
              items={bnb}
              countValue={txCounter?.bnbTx}
              online={bnbOnline}
              txInDay={bnbInDay}
              scroll={handleScroll}
              touchMove={handleScroll}
              currency="BNB"
            />

            <Column
              id={"xrp"}
              title={`XRP\n(in development)`}
              items={sol}
              disabled
              countValue={txCounter?.xrpTx}
              online={false}
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
                id={"btc"}
                title={"More than\n1 000 BTC"}
                items={btc}
                countValue={txCounter?.btcTx}
                txInDay={btcInDay}
                online={btcOnline}
                scroll={handleScroll}
                touchMove={handleScroll}
                currency="BTC"
              />
            </SwiperSlide>
            <SwiperSlide style={{ width: "100%" }}>
              <Column
                id={"eth"}
                title={"More than\n10 000 ETH"}
                items={eth}
                countValue={txCounter?.ethTx}
                txInDay={ethInDay}
                online={ethOnline}
                scroll={handleScroll}
                touchMove={handleScroll}
                currency="ETH"
              />
            </SwiperSlide>
            <SwiperSlide style={{ width: "100%" }}>
              <Column
                id={"usdt"}
                title={`More than\n30 000 000 USDT`}
                items={usdt}
                countValue={txCounter?.usdtTx}
                txInDay={usdtInDay}
                online={usdtOnline}
                scroll={handleScroll}
                touchMove={handleScroll}
                currency="tether"
              />
            </SwiperSlide>
            <SwiperSlide style={{ width: "100%" }}>
              <Column
                id={"usdc"}
                title={`More than\n30 000 000 USDC`}
                items={usdc}
                countValue={txCounter?.usdcTx}
                txInDay={usdcInDay}
                online={usdcOnline}
                scroll={handleScroll}
                touchMove={handleScroll}
                currency="USDC"
              />
            </SwiperSlide>
            <SwiperSlide style={{ width: "100%" }}>
              <Column
                id={"sol"}
                title={`More then\n50 000 SOL`}
                items={sol}
                countValue={txCounter?.solTx}
                scroll={handleScroll}
                touchMove={handleScroll}
                txInDay={solInDay}
                online={solOnline}
                currency="SOL"
              />
            </SwiperSlide>
            <SwiperSlide style={{ width: "100%" }}>
              <Column
                id={"ton"}
                title={`More than\n2 000 000 TON`}
                items={ton}
                countValue={txCounter?.tonTx}
                scroll={handleScroll}
                touchMove={handleScroll}
                online={tonOnline}
                txInDay={tonInDay}
                currency="TON"
              />
            </SwiperSlide>
            <SwiperSlide style={{ width: "100%" }}>
              <Column
                id={"bnb"}
                title={`More than\n15 000 BNB`}
                items={bnb}
                countValue={txCounter?.bnbTx}
                online={bnbOnline}
                txInDay={bnbInDay}
                scroll={handleScroll}
                touchMove={handleScroll}
                currency="BNB"
              />
            </SwiperSlide>

            <SwiperSlide style={{ width: "100%" }}>
              <Column
                id={"xrp"}
                title={`XRP\n(in development)`}
                items={xrp}
                countValue={txCounter?.xrpTx}
                disabled
                online={false}
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
