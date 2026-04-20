"use client"
import UserButton from "@/modules/auth/components/user-btn";
import { generateNewsEvent } from "@/modules/news/generateNews";
import Image from "next/image";
import { useEffect } from "react";

export default function Home() {
  return (
    <>
    <div>Hello</div>
    <Test/>
    <UserButton /></>
  );
}

 function Test() {
  useEffect(() => {
    async function testing() {
      await generateNewsEvent();
    };
    testing();
  },[])
  return (
    <>Testing</>
  )
}