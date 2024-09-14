import { useEffect, useState, useRef } from "react";

export default function CounterDownTimer({ timer, percent }) {
  return (
    <div className="flex flex-col justify-center p-5  min-h-[72px] h-fit bg-primary-orange  sm:mx-auto  w-full sm:w-full sm:max-w-md  ">
      <div className="flex items-center justify-between w-full mb-3">
        <p className="text-sm font-medium text-left text-white mb-1">
          Time left to complete you order:
        </p>
        <div className="text-sm font-medium text-right text-white">{timer}</div>
      </div>
      <div className={`flex w-full h-[3px]  rounded-[100px] bg-formGray `}>
        <div
          style={{
            marginRight: `${100 - percent}%`,
          }}
          className={`flex  w-full   h-[3px]  rounded-[100px] bg-white transition-all duration-500 `}
        />
      </div>
    </div>
  );
}
