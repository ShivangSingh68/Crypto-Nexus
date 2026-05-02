import { useEffect, useState } from "react";
import { getBalanceAndHoldings } from "../action";


export function useBalanceAndHolings (coinId: string) {
    const [balance, setBalance] = useState<number>(0);
    const [holdings, setHoldings] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchData(){
            try {
                setLoading(true);
                const {bl, hld} = await getBalanceAndHoldings(coinId);
                setBalance(bl);
                setHoldings(hld);
            
            } catch (error) {
                console.error("Error in hook: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    },[coinId]);


    return {
        balance,
        holdings,
        loading,
    }
}