
import React from 'react';
export function SectionHeadline() {
  return <div className="mb-5 w-full flex flex-col items-center justify-center">
      <h2 className="flex flex-col items-center w-full text-center">
        {/* Main line */}
        <span style={{
        letterSpacing: '.01em',
        textTransform: 'none'
      }} className="block font-black text-[2.6rem] sm:text-5xl md:text-3xl text-dragon-green mb-1 leading-snug lg:text-6xl whitespace-nowrap">
          Napreduj hitreje
        </span>
        {/* Subline */}
        <span className="text-[1.7rem] font-extrabold text-app-orange leading-tight -mt-1 mb-1 md:text-4xl">
          z aplikacijo Tomi Talk
        </span>
      </h2>
    </div>;
}
