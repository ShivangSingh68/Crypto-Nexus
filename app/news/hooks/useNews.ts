"use client"
import { useEffect, useRef, useState } from "react";
import { NewsItem } from "../types";
import { getNews, getTickerItems } from "../action";

const POLL_INTERVAL_MS = 2*60*60*1000;

export function useNews() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [tickerItems, setTickerItems] = useState<string[]>([]);

    const newsRef = useRef<NewsItem[]>([]);

    useEffect(() => {
        async function fetchData(isInitial: boolean) {
            try {
                
                const [newsRes, tickerRes] = await Promise.all([getNews(), getTickerItems()]);
                if(newsRes) {

                    const hasChanged = newsRes.length !== newsRef.current.length || 
                    newsRes.some((n, i) => n.id !== newsRef.current[i]?.id);

                    if(hasChanged) {
                        newsRef.current = newsRes;
                        setNews(newsRes);
                    }
                }
                if(tickerRes) {
                    setTickerItems(tickerRes);
                }

            } catch (error) {
                
                console.error(error);
            
            } finally {
            
                if(isInitial) {
                    setIsLoading(false);
                }
            
            }
        };
        fetchData(true);

        const intervalId = setInterval(() => fetchData(false), POLL_INTERVAL_MS);

        return ()=> clearInterval(intervalId);
    }, [])
    return {
        news,
        isLoading, 
        tickerItems
    }
}