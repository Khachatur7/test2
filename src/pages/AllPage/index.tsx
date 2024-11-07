import { useEffect, useState } from 'react'

import axios from "../../axios";
import { ItemDataType } from '../../App';
import { Column } from '../../components';
import TopHeader from '../../components/TopHeader';

const MainPage = () => {

    const [btc, setBtc] = useState<ItemDataType[] | null>(null);
    const [eth, setEth] = useState<ItemDataType[] | null>(null);
    const [usdt, setUsdt] = useState<ItemDataType[] | null>(null);
    const [usdc, setUsdc] = useState<ItemDataType[] | null>(null);
    const [bnb, setBnb] = useState<ItemDataType[] | null>(null);
    const [loading, setLoading] = useState(true);

    const getData = async () => {
        try {
            const res = await axios.get<{ result: ItemDataType[] }>("/txData");

            if (!res.data) {
                throw Error();
            }

            const btcItems = [];
            const ethItems = [];
            const usdtItems = [];
            const usdcItems = [];

            for (let i = res.data.result.length - 1; i > -1; i--) {

                const item = res.data.result[i];

                if (item.type === "btc") {
                    btcItems.push(item);
                    continue;
                }

                if (item.type === "eth") {
                    ethItems.push(item);
                    continue;
                }

                if (item.type === "usdt") {
                    usdtItems.push(item);
                    continue;
                }

                if (item.type === "usdc") {
                    usdcItems.push(item);
                    continue;
                }

            }
            setBtc(btcItems);
            setEth(ethItems);
            setUsdt(usdtItems);
            setUsdc(usdcItems);
            setLoading(false);

            if (!bnb?.length) {
                setBnb(usdtItems);
            }

        } catch (error) {
            console.log("Не удалось получить данные");
        }
    }

    useEffect(() => {

        getData();

        const interval = setInterval(() => {
            getData();
        }, 10000);


        return () => {
            clearInterval(interval);
        }

    }, []);

    return (
        <div>
            <TopHeader />
            {
                !loading ?
                    <div className="flex items-start justify-start gap-2 pt-8 pb-8 md:gap-4 w-full overflow-x-auto lg:px-[4vw]">
                        <Column
                            supTitle={"All transactions"}
                            title="More than 1 000 BTC"
                            items={btc}
                            countValue={null}
                        />
                        <Column
                            supTitle={"All transactions"}
                            title="More than 5 000 ETH"
                            items={eth}
                            countValue={null}
                        />
                        <Column
                            supTitle={"All transactions"}
                            title={`More than 20 000 000 USDT`}
                            items={usdt}
                            countValue={null}
                        />
                        <Column
                            supTitle={"All transactions"}
                            title={`More than 20 000 000 USDC`}
                            items={usdc}
                            countValue={null}
                        />
                    </div>
                    :
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    </div>
            }
        </div>
    )
}

export default MainPage
