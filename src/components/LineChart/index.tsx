import React, { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import { priceReplaceHandler } from "../../handlers";

interface PriceData {
  prices: number[][];
}
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);
interface LineChart {
  active: boolean;
  onMove?: () => void;
  onLeave?: () => void;
  currency: string;
  setShowChart?: React.Dispatch<React.SetStateAction<boolean>>;
}
// USDC
// USDT
// ETH
// BTC
// BNB
// TON
// SOL

const LineChart: React.FC<LineChart> = ({
  active,
  onLeave,
  onMove,
  currency,
  // setShowChart,
}) => {
  const [data, setData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  // const [touchCount, setTouchCount] = useState<number|string>(0);

  const BinanceAPI = `https://api.binance.com/api/v3/klines?symbol=${currency}USDT&interval=1d&limit=365`;
  const UsdtAPI = `https://api.coingecko.com/api/v3/coins/tether/market_chart?vs_currency=usd&days=365`;
  // let months: string[] = [
  //   "Jan",
  //   "Febr",
  //   "Mar",
  //   "Apr",
  //   "May",
  //   "Jun",
  //   "Jul",
  //   "Aug",
  //   "Semp",
  //   "Oct",
  //   "Nov",
  //   "Dec",
  // ];

  const modalRef = useRef<HTMLDivElement>(null);
  // const handleClickOutside = (event: TouchEvent | null) => {
  //   console.log(`touch:${touchCount}`);
  //  if (!touchCount) {
  //   setTouchCount("true")
  //  }
  //  else {
  //   const target = event?.target as HTMLElement;
  //   const closestElement = target.closest(".chart");
  //   if (!closestElement?.classList.contains("chart")) {
  //     setShowChart && setShowChart(false);
  //   }
  //  }
  // };

  const BinanceFetchAPI = async () => {
    try {
      const response = await axios.get(BinanceAPI);

      const prices = response.data;
      setData(prices.map((price: any) => parseFloat(price[4]))); // Закрывающая цена
      setLabels(
        prices.map((price: any) => new Date(price[0]).toLocaleDateString())
      ); // Даты
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const UsdtFetchAPI = async () => {
    try {
      const response = await axios.get<PriceData>(UsdtAPI);
      const prices = response.data.prices;
      setData(prices.map((price) => price[1])); // Цены
      setLabels(prices.map((price) => new Date(price[0]).toLocaleDateString())); // Даты
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // if (window.innerWidth < 800 && active && touchCount==0) {
    //   setTimeout(() => {
    //     window.addEventListener("touchend", handleClickOutside);
    //   }, 500);
    // }
    // return () => {
    //   window.removeEventListener("touchend", handleClickOutside);
    // };
  }, [active]);

  useEffect(() => {
    if (currency == "tether") {
      UsdtFetchAPI();
    } else {
      BinanceFetchAPI();
    }
  }, []);

  const options: ChartOptions<"line"> = {
    layout: {},
    interaction: {
      intersect: false,
    },
    plugins: {
      tooltip: {
        titleFont: {
          size: 17,
          weight: 200,
        },
        footerFont: {
          size: 17,
          weight: 100,
        },
        padding: 10,
        caretSize: 0,
        cornerRadius: 8,
        titleMarginBottom: 2,
        caretPadding: 15,
        footerColor: "#fff",
        displayColors: false,
        backgroundColor: "#da9413",
        borderWidth: 1,
        borderColor: "#084236",
        callbacks: {
          // title: function (context) {
          //   const splitData = context[0].label.split(".");
          //   return `${splitData[0]} ${months[+splitData[1] - 1]} ${
          //     splitData[2]
          //   }`;
          // },
          label: function (context) {
            if (context) {
            }
            return ``;
          },
          footer: function (context) {
            const cost = context[0].dataset.data[context[0].dataIndex]
              ?.toString()
              .split(".");

            return `${
              cost && priceReplaceHandler(Number(cost[0].split(".")[0]))
            }${
              cost &&
              (currency == "TON" || currency == "USDC" || currency == "tether")
               ? cost[1].length >= 4
               ? "," + cost[1].slice(0,4)
               : cost[1].length == 3
               ? "," + cost[1] + "0"
               : cost[1].length == 2
               ? "," + cost[1] + "00"
               : cost[1].length == 1
               ? "," + cost[1] + "000"
               : ",0000"
               
                : cost && (currency == "ETH" || currency == "BTC" || currency == "SOL")
                ? cost[1].length >= 2
                  ? "," + cost[1].slice(0,2)
                  : cost[1].length == 1
                  ? "," + cost[1] + "0"
                  : ",00"
                : cost && (currency == "BNB")
                ? cost[1].length >= 3
                  ? "," + cost[1].slice(0,3)
                  : cost[1].length == 2
                  ? "," + cost[1] + "0"
                  : cost[1].length == 1
                  ? "," + cost[1] + "00"
                  : ",000"
                : ""
            } $`;
          },
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        border: {
          display: false,
        },
        grid: {
          display: false,
        },
        min: 0,
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6,
          color: "#da9413",
          callback: function (value, index, values) {
            if (values.length - 1 > 4) {
              if (index === 0) {
                return "";
              } else if (index === values.length - 1) {
                return "";
              }
            } else if (value) {
              return "";
            }
          },
        },
      },
      y: {
        border: {
          display: false,
        },
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    },
    clip: false,
  };

  const chartData: ChartData<"line", number[], string> = {
    labels,
    datasets: [
      {
        data,
        pointRadius: 0,
        pointBackgroundColor: "#da9413",
        pointHoverRadius: 7,
        pointHoverBackgroundColor: "#da9413",
        hoverBorderWidth: 4,
        hoverBorderColor: "#fff",
        backgroundColor: "#da9413",
        borderColor: "#fff",
        fill: true,
        borderWidth: 1.5,
        capBezierPoints: true,
        tension: 0.1,
      },
    ],
  };

  return (
    <>
      {window.innerWidth > 800 ? (
        <div
          className={`chart ${active ? "line_chart_active" : ""}`}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
        >
          <Line
            data={chartData}
            options={options}
            style={{ transform: "translate(-3px,23px)", cursor: "pointer" }}
          />
        </div>
      ) : (
        <div
          className={`chart ${active ? "line_chart_active" : ""}`}
          ref={modalRef}
        >
          <Line
            data={chartData}
            options={options}
            style={{ transform: "translate(-3px,23px)", cursor: "pointer" }}
          />
        </div>
      )}
    </>
  );
};

export default LineChart;
