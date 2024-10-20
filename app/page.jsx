"use client";
import React from "react";
import * as motion from "framer-motion/client";
import { useRouter } from "next/navigation";

export default function page() {
  const router = useRouter();
  return (
    <div className="w-full h-[100vh] bg-[#110f0f] flex justify-center ">
      <div className="corousell flex-col mt-16">
        <motion.img
          initial={{ scale: 0, opacity: 0, rotate: -90 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.3 }}
          src="/board.png"
          className="brd w-96 h-96 rounded-xl"
          alt=""
        />
        <div className="flex flex-col gap-20">
          <div className="flex flex-col gap-8">
            <h1 className="plch text-center mt-12 font-mono text-nowrap text-3xl text-white absolute left-[50%] -translate-x-[50%]">
              Play Chess On the #1 Chess Website
            </h1>
          </div>
          <motion.button
            onClick={() => router.push("/game")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1 }}
            className="bt bg-white text-black text-xl font-mono font-bold h-12 p-3 rounded-2xl w-72 ml-12 mt-12"
          >
            Start Playing Now !
          </motion.button>
        </div>
      </div>
    </div>
  );
}
