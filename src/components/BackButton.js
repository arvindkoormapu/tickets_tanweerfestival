import React from "react";
import CaretIcon from "./Icons/CaretIcon";

export default function BackButton({ stroke = "#111111" }) {
  return (
    <div className="flex cursor-pointer">
      <div style={{ transform: "rotate(180deg)" }}>
        <CaretIcon stroke={stroke} />
      </div>
    </div>
    // <div className="mb-[3rem] w-full">
    //   <img width="25px" height="25px" src={caretLeftBlack} />
    // </div>
  );
}
