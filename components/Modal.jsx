"use client";
import React, { useEffect } from "react";

export default function Modal({ showModal, setModal, winner }) {
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto"; // or "scroll"
    }
    return () => {
      document.body.style.overflow = "auto"; // or "scroll"
    };
  }, [showModal]);

  return (
    <div>
      {showModal && winner !== null ? (
        <>
          <main className="w-[100vw] h-[100vh] bg-[rgba(0,0,0,0.4)] absolute top-0 left-0 flex justify-center items-center">
            <div className="w-64 h-64 bg-[#404649] rounded-lg flex flex-col items-center">
              <h1 className="text-2xl font-mono text-white mt-4">Game Over</h1>
              {winner ? (
                <div className="flex flex-col gap-12">
                  <h1 className="text-4xl font-mono text-white mt-4">
                    You Win
                  </h1>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-white p-2 rounded-3xl"
                  >
                    Play Again ?
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-12">
                  <h1 className="text-4xl font-mono text-white mt-4">
                    You Lose
                  </h1>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-white p-2 rounded-3xl"
                  >
                    Play Again ?
                  </button>
                </div>
              )}
            </div>
          </main>
        </>
      ) : null}
    </div>
  );
}
