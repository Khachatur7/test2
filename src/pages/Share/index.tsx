import ColumnElement from "../../components/ColumnElement";
import { ItemDataType } from "../../App";
import axios from "../../axios";
import { useEffect, useState } from "react";
import TopHeaderTel from "../../components/TopHeaderTel";
import TopHeader from "../../components/TopHeader";

const ShareTransactionPage = () => {

    const split = location.pathname.split("/")
    const transRoot = split[3].split("&")[0]
    const id = split[split.length - 1]

    const [transaction, setTransaction] = useState<ItemDataType | null>(null)
    const FindTransaction = async () => {
        try {
            const res = await axios.get<{ result: ItemDataType[] }>(`/${transRoot}`);

            if (!res.data) {
                throw Error();
            }

            for (let i = 0; i < res.data.result.length - 1; i++) {
                const item = res.data.result[i];

                if (item._id == id) {
                    setTransaction(item)
                }
            }
        } catch (error) {
            console.log(`Не удалось получить данные про ${name}`);
        }

    }

    useEffect(() => {
        FindTransaction()
    }, [])

    return (
        <div className="md:flex md:gap-10 md:h-screen parent">
            {window.innerWidth > 768 ?
                <TopHeader />
                : <TopHeaderTel />}
            <div className="share_trans_page">
                {transaction && (
                    <ColumnElement item={transaction} />
                )
                }
            </div>
        </div>


    )

}

export default ShareTransactionPage;