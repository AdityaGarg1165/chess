"use client";
import { io } from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import { Chess } from "chess.js";
import * as motion from "framer-motion/client";
import Modal from "@/components/Modal";

export default function Home() {
  const CHESS = new Chess();
  const [BOARD, setBoard] = useState(CHESS.board());
  const [from, setFrom] = useState();
  const [winner, setWinner] = useState();
  const [to, setTo] = useState();
  const [prevBox, setBox] = useState();
  const [color, setColor] = useState();
  const [turn, setTurn] = useState(0);
  const [initialized, setInit] = useState(false);
  const [connectedToServer, setConnection] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showModal, setModal] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:5000/");

      socketRef.current.on("disconnect", () => {});
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  function emit(event, data) {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  }
  useEffect(() => {
    if (!socketRef.current) return;
    socketRef.current.on("INIT", () => {
      setInit(true);
    });
    socketRef.current.on("cts", () => {
      setConnection(true);
    });
    socketRef.current.on("winner", (data) => {
      setModal(true);
      setGameOver(true);
      setWinner(data === color);
    });
    socketRef.current.on("color", (col) => {
      setColor(col);
    });
    socketRef.current.on("board", (data) => {
      try {
        if (!data.board) return;
        setBoard(data.board);
        setTurn(data.turn);
      } catch {}
    });
    socketRef.current.on("abd", () => {
      const mainText = document.getElementById("mainText");
      mainText.innerText = "Your opponents has left the match";
    });
  }, [socketRef.current]);

  return (
    <main className="w-full h-[80vh]">
      {connectedToServer === true ? (
        <>
          {initialized ? (
            <>
              {turn % 2 === 0 && color !== "black" ? (
                <h1
                  id="mainText"
                  className="font-mono text-nowrap text-2xl text-white absolute top-12 left-[50%] -translate-x-[50%] -ml-4"
                >
                  Your Turn{" "}
                </h1>
              ) : (
                <>
                  {turn % 2 !== 0 && color !== "white" ? (
                    <h1
                      id="mainText"
                      className="font-mono text-nowrap text-2xl text-white absolute top-12 left-[50%] -translate-x-[50%] -ml-4"
                    >
                      Your Turn
                    </h1>
                  ) : (
                    <h1
                      id="mainText"
                      className="font-mono text-2xl text-nowrap text-white absolute top-12 left-[50%] -translate-x-[50%] -ml-4"
                    >
                      Opponents Turn
                    </h1>
                  )}
                </>
              )}
              <div
                className={`flex flex-col items-center justify-center mt-32 gap-12 ${color === "white" ? "" : "rotate-180"}`}
              >
                <div className="rounded-lg">
                  {BOARD.map((row, i) => (
                    <div className="flex" key={i}>
                      {row.map((column, j) => {
                        const piece =
                          String.fromCharCode(97 + (j % 8)) + "" + (8 - i);
                        return (
                          <div
                            onClick={(e) => {
                              if (
                                turn % 2 === 0 &&
                                color !== "black" &&
                                !gameOver
                              ) {
                                if (!from || to) {
                                  if (to) {
                                    prevBox.box.style.backgroundColor =
                                      prevBox.color;
                                  }
                                  try {
                                    if (column.type) {
                                      setFrom(piece);
                                      setBox({
                                        box: e.target,
                                        color: e.target.style.backgroundColor,
                                      });
                                      e.target.style.backgroundColor =
                                        "#f5f682";
                                    }
                                  } catch {}
                                }
                                if (from) {
                                  setTo(piece);
                                  setFrom(null);
                                  prevBox.box.style.backgroundColor =
                                    prevBox.color;
                                  emit("move", { from, piece });
                                }
                              }
                              if (
                                turn % 2 !== 0 &&
                                color !== "white" &&
                                !gameOver
                              ) {
                                if (!from || to) {
                                  if (to) {
                                    prevBox.box.style.backgroundColor =
                                      prevBox.color;
                                  }
                                  try {
                                    if (column.type) {
                                      setFrom(piece);
                                      setBox({
                                        box: e.target,
                                        color: e.target.style.backgroundColor,
                                      });
                                      e.target.style.backgroundColor =
                                        "#f5f682";
                                    }
                                  } catch {}
                                }
                                if (from) {
                                  setTo(piece);
                                  setFrom(null);
                                  prevBox.box.style.backgroundColor =
                                    prevBox.color;
                                  emit("move", { from, piece });
                                }
                              }
                            }}
                            key={j}
                            className={`${(i + j) % 2 === 0 ? "bg-[#ebecd0]" : "bg-[#779556]"} h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:w-16 lg:h-16`}
                          >
                            <motion.img
                              src={`/peices/${column?.color}${column?.type}.png`}
                              className={`w-16 ${color === "white" ? "" : "rotate-180"} `}
                              alt=""
                            />
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <h1 className="font-mono text-white text-4xl absolute left-[50%] -translate-x-[50%] top-36">
              Waiting For Opponent...
            </h1>
          )}
        </>
      ) : (
        <h1 className="font-mono text-white text-4xl absolute left-[50%] -translate-x-[50%] top-36">
          Loading...
        </h1>
      )}
      <Modal showModal={showModal} winner={winner} />
    </main>
  );
}
