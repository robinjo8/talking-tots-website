
import React from 'react';

export function SectionHeadline() {
  return <div className="mb-5 w-full flex flex-col items-center justify-center">
      <h2 className="flex flex-col items-center w-full text-center">
        {/* Main line */}
        <span style={{
        letterSpacing: '.01em',
        textTransform: 'none'
      }} className="block font-black text-[2.2rem] sm:text-[2.6rem] md:text-3xl text-dragon-green mb-1 leading-snug lg:text-6xl whitespace-nowrap">
          Zakaj starši izberejo TomiTalk?
        </span>
        {/* Subline */}
        <span className="text-[1.4rem] sm:text-[1.7rem] font-extrabold text-app-orange leading-tight -mt-1 mb-1 md:text-4xl">
          Zato, ker napredujejo bistveno hitreje
        </span>
      </h2>
    </div>;
}
