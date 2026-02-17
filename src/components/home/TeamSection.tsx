import { useState, useCallback, useEffect } from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { WavyDivider } from "./WavyDivider";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";

interface TeamMember {
  name: string;
  description: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Špela Kastelic",
    description: "Špela je logopedinja z več kot desetletnimi izkušnjami, ki dela z otroki z govorno-jezikovnimi motnjami in je članica komisije za usmerjanje otrok s posebnimi potrebami."
  },
  {
    name: "Ema Erzar Vidmar",
    description: "Ema je logopedinja z več kot desetletnimi izkušnjami v šolskem okolju, kjer s sodobnimi pristopi in lastnimi didaktičnimi materiali podpira razvoj govorno-jezikovnih sposobnosti otrok."
  },
  {
    name: "Jasna Kastigar Kujavec",
    description: "Jasna je magistra varstvoslovja, specializirana za informacijsko in kibernetsko varnost, ki v projektu TomiTalk skrbi za varnostni in zakonodajni vidik razvoja ter skladnost z veljavnimi predpisi."
  },
  {
    name: "Robert Kujavec",
    description: "Robert je pobudnik projekta TomiTalk z jasno vizijo omogočiti otrokom hiter in učinkovit dostop do podpore pri govorno-jezikovnih težavah."
  }
];

export function TeamSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative py-16 md:py-24 bg-dragon-green">
      <WavyDivider color="green" position="top" />
      <WavyDivider color="green" position="bottom" />

      <div className="max-w-5xl mx-auto px-4 md:px-10 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
          Kdo smo
        </h2>

        {/* Desktop: 2x2 grid */}
        <div className="hidden md:grid grid-cols-2 gap-8">
          {teamMembers.map((member, index) => (
            <TeamCard key={index} member={member} />
          ))}
        </div>

        {/* Mobile: carousel */}
        <div className="md:hidden">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {teamMembers.map((member, index) => (
                <div key={index} className="min-w-0 shrink-0 grow-0 basis-full px-4">
                  <TeamCard member={member} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {teamMembers.map((_, i) => (
              <button
                key={i}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-300",
                  i === selectedIndex ? "bg-white scale-125" : "bg-white/40 hover:bg-white/60"
                )}
                onClick={() => emblaApi?.scrollTo(i)}
                aria-label={`Pojdi na člana ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <Button asChild variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20">
            <Link to="/kdo-smo">Več o nas</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="flex flex-col items-center text-center gap-4">
      <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center">
        <User className="w-14 h-14 text-white/70" />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
        <p className="text-white/80 leading-relaxed">{member.description}</p>
      </div>
    </div>
  );
}
