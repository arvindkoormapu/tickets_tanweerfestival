import React from "react";

export default function Loader() {
  return (

    <div className="absolute top-0 left-0 right-0 h-2 bg-[#ffb787]">
      <div className="absolute w-full h-full bg-[#fff7e0] transform -translate-x-full animate-loading-bar"></div>
      <div className="absolute w-full h-full bg-[#c36c32] transform -translate-x-full animate-loading-bar animate-delay-1000"></div>
    </div>
  );
}
