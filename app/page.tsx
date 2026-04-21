"use client"
import UserButton from "@/modules/auth/components/user-btn";
import { generateNewsEvent } from "@/modules/news/generateNews";
import { useEffect, useRef } from "react";

import { AreaSeries, BarSeries, BaselineSeries, CandlestickSeries, ColorType, createChart } from 'lightweight-charts';

export default function Home() {

  return (
    <>
    <div>Hello</div>
    {/* <Test/> */}
    <UserButton />
    </>
  );
}

