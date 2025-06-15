
import React from 'react';
import { ComparisonCard } from './ComparisonCard';

export function ComparisonCards() {
  return (
    <div className="flex flex-col sm:flex-row items-stretch justify-center gap-6 md:gap-8 mt-12 w-full max-w-3xl mx-auto px-4">
      <ComparisonCard
        title="JAVNI SISTEM"
        value="+6 mesecev"
        description={<>Povprečen čas do prve<br />obravnave v javnem sistemu</>}
        titleBgClass="bg-white"
        titleBorderClass="border-orange-300"
        cardBgClass="bg-orange-50/70"
        cardBorderClass="border-orange-200"
        valueTextClass="text-app-orange"
      />
      <ComparisonCard
        title="TOMI TALK"
        value="Takoj"
        description={<>Govorne vaje na voljo<br />takoj &ndash; brez čakanja</>}
        titleBgClass="bg-white"
        titleBorderClass="border-dragon-green"
        cardBgClass="bg-light-cloud"
        cardBorderClass="border-green-200"
        valueTextClass="text-dragon-green"
      />
    </div>
  );
}
