import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useState } from 'react';

interface CookieSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onSavePreferences: (preferences: CookiePreferences) => void;
  initialPreferences: CookiePreferences;
}

export interface CookiePreferences {
  functional: boolean;
  analytics: boolean;
  performance: boolean;
  marketing: boolean;
}

export function CookieSettingsDialog({
  open,
  onOpenChange,
  onAcceptAll,
  onRejectAll,
  onSavePreferences,
  initialPreferences
}: CookieSettingsDialogProps) {
  const [preferences, setPreferences] = useState<CookiePreferences>(initialPreferences);

  const handleSave = () => {
    onSavePreferences(preferences);
    onOpenChange(false);
  };

  const handleAcceptAll = () => {
    onAcceptAll();
    onOpenChange(false);
  };

  const handleRejectAll = () => {
    onRejectAll();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Prilagodite nastavitve soglasja</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Uporabljamo piškotke, da vam pomagamo pri učinkoviti navigaciji in izvajanju določenih funkcij. 
            Spodaj boste našli podrobne informacije o vseh piškotkih pod vsako kategorijo soglasja.
          </DialogDescription>
        </DialogHeader>

        <Accordion type="multiple" className="w-full">
          {/* Potrebni - vedno aktivni */}
          <AccordionItem value="necessary">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full pr-4">
                <span className="font-medium">Potrebni</span>
                <span className="text-xs text-dragon-green font-medium">Vedno aktivni</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              Potrebni piškotki so ključni za osnovne funkcije spletne strani in spletna stran brez njih ne bo delovala na svoj predviden način. 
              Ti piškotki ne shranjujejo nobenih osebnih podatkov, ki bi jih bilo mogoče identificirati.
            </AccordionContent>
          </AccordionItem>

          {/* Funkcionalni */}
          <AccordionItem value="functional">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full pr-4">
                <span className="font-medium">Funkcionalni</span>
                <Switch
                  checked={preferences.functional}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, functional: checked }))}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              Funkcionalni piškotki pomagajo izvajati določene funkcionalnosti, kot so skupna raba vsebine spletnega mesta na 
              platformah družbenih medijev, zbiranje povratnih informacij in druge funkcije tretjih oseb.
            </AccordionContent>
          </AccordionItem>

          {/* Analitični */}
          <AccordionItem value="analytics">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full pr-4">
                <span className="font-medium">Analitični</span>
                <Switch
                  checked={preferences.analytics}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, analytics: checked }))}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              Analitični piškotki se uporabljajo za razumevanje interakcije obiskovalcev s spletno stranjo. Ti piškotki pomagajo 
              zagotoviti informacije o meritvi števila obiskovalcev, hitrost odskoka, prometni vir itd.
            </AccordionContent>
          </AccordionItem>

          {/* Uspešnosti */}
          <AccordionItem value="performance">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full pr-4">
                <span className="font-medium">Uspešnosti</span>
                <Switch
                  checked={preferences.performance}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, performance: checked }))}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              Piškotki uspešnosti se uporabljajo za razumevanje in analizo ključnih kazal uspešnosti spletne strani, ki pomagajo pri 
              zagotavljanju boljše uporabniške izkušnje za obiskovalce.
            </AccordionContent>
          </AccordionItem>

          {/* Oglaševalski */}
          <AccordionItem value="marketing">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full pr-4">
                <span className="font-medium">Oglaševalski</span>
                <Switch
                  checked={preferences.marketing}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, marketing: checked }))}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              Oglaševalski piškotki se uporabljajo za zagotavljanje obiskovalcev s prilagojenimi oglasi na podlagi strani, ki so jih 
              obiskali prej, in za analizo učinkovitosti oglaševalske akcije.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleRejectAll}
            className="flex-1 border-app-orange text-app-orange hover:bg-app-orange/10"
          >
            Zavrni
          </Button>
          <Button
            variant="outline"
            onClick={handleSave}
            className="flex-1 border-dragon-green text-dragon-green hover:bg-dragon-green/10"
          >
            Shrani moje nastavitve
          </Button>
          <Button
            onClick={handleAcceptAll}
            className="flex-1 bg-dragon-green hover:bg-dragon-green/90 text-white"
          >
            Sprejmi vse
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
