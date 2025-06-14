
import React from "react";
import {
  Target,
  BarChart2,
  Gamepad2,
  Trophy,
  Video,
  Mic,
  LineChart,
  Users,
  Sparkles
} from "lucide-react";

const featuresConfig = [
  {
    icon: <Target className="h-5 w-5 text-dragon-green" />,
    text: "Govorne vaje (po črkah)"
  },
  {
    icon: <BarChart2 className="h-5 w-5 text-app-blue" />,
    text: "Govorno jezikovne vaje"
  },
  {
    icon: <Gamepad2 className="h-5 w-5 text-app-purple" />,
    text: "Govorne igre"
  },
  {
    icon: <Trophy className="h-5 w-5 text-app-orange" />,
    text: "Izzivi za dodatno izboljšanje govora"
  },
  {
    icon: <Video className="h-5 w-5 text-app-teal" />,
    text: "Video navodila logopeda"
  },
  {
    icon: <Mic className="h-5 w-5 text-app-purple" />,
    text: "Snemanje in primerjava z AI"
  },
  {
    icon: <LineChart className="h-5 w-5 text-dragon-green" />,
    text: "Sledenje napredku"
  },
  {
    icon: <Users className="h-5 w-5 text-app-blue" />,
    text: "2 otroka vključena (v osnovi)"
  },
  {
    icon: <Sparkles className="h-5 w-5 text-app-yellow" />,
    text: "Motivacija z zmajčkom Tomijem"
  }
];

export function PricingFeaturesList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 mt-2">
      {featuresConfig.map((feature, i) => (
        <div key={i} className="flex items-start gap-2">
          {feature.icon}
          <span>{feature.text}</span>
        </div>
      ))}
    </div>
  );
}

export const featuresTexts = featuresConfig.map(f => f.text);

