import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, UserX } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ChildProfile } from "@/hooks/registration/types";
import { avatarOptions } from "@/components/AvatarSelector";
type ChildInformationFormProps = {
  children: ChildProfile[];
  selectedChildIndex: number;
  setSelectedChildIndex: (index: number) => void;
  removeChild: (id: string) => void;
  updateChildField: (id: string, field: keyof ChildProfile, value: any) => void;
  error: string | null;
};
export function ChildInformationForm({
  children,
  selectedChildIndex,
  setSelectedChildIndex,
  removeChild,
  updateChildField,
  error
}: ChildInformationFormProps) {
  // Function to get gender display text
  const getGenderDisplayText = (gender: string): string => {
    switch (gender) {
      case "M":
        return "Deček";
      case "Ž":
        return "Deklica";
      case "F":
        return "Deklica";
      // Handle old format "F" as "Deklica"
      case "N":
        return "Ni izbrano";
      default:
        return "Ni izbrano";
    }
  };
  return <div className="pt-4 border-t">
      <h3 className="text-lg font-medium mb-4">Podatki o otrocih</h3>
      
      <div className="space-y-6">
        {children.map((child, index) => <div key={child.id} className={`p-4 border rounded-lg ${selectedChildIndex === index ? 'bg-sky-50/50 border-dragon-green' : 'bg-gray-50/50'}`}>
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium">
                Otrok {index + 1}
                {child.isComplete && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    Dokončano
                  </span>}
              </h4>
              {children.length > 1 && <Button type="button" variant="outline" size="sm" onClick={() => removeChild(child.id)} className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </Button>}
            </div>
            
            {selectedChildIndex === index ? <div className="space-y-4">
                <div>
                  <Label htmlFor={`child-name-${child.id}`}>Ime otroka</Label>
                  <Input id={`child-name-${child.id}`} value={child.name} onChange={e => updateChildField(child.id, "name", e.target.value)} placeholder="Vnesite ime otroka" className="mt-1" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`birth-date-${child.id}`}>Datum rojstva otroka <span className="text-red-500">*</span></Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button id={`birth-date-${child.id}`} variant="outline" className={cn("w-full justify-start text-left font-normal", !child.birthDate && "text-muted-foreground")}>
                        {child.birthDate ? format(child.birthDate, "dd.MM.yyyy") : "Izberite datum rojstva"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={child.birthDate || undefined} onSelect={date => updateChildField(child.id, "birthDate", date)} disabled={date => date > new Date()} initialFocus className={cn("p-3 pointer-events-auto")} />
                    </PopoverContent>
                  </Popover>
                  {!child.birthDate && <p className="text-sm text-red-500">Datum rojstva je obvezen, saj je profil uporabnika prilagojen starosti otroka.</p>}
                </div>
                
                <div>
                  <Label>Spol</Label>
                  <RadioGroup value={child.gender} onValueChange={value => updateChildField(child.id, "gender", value)} className="flex space-x-4 mt-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="M" id={`gender-m-${child.id}`} />
                      <Label htmlFor={`gender-m-${child.id}`} className="cursor-pointer">M</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Ž" id={`gender-f-${child.id}`} />
                      <Label htmlFor={`gender-f-${child.id}`} className="cursor-pointer">Ž</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="N" id={`gender-n-${child.id}`} />
                      <Label htmlFor={`gender-n-${child.id}`} className="cursor-pointer">Ne želim izbrati</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label>Izberi avatarja</Label>
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    {avatarOptions.map(avatar => <div key={avatar.id} onClick={() => updateChildField(child.id, "avatarId", avatar.id)} className={`cursor-pointer rounded-lg p-2 transition-all flex items-center justify-center ${child.avatarId === avatar.id ? 'bg-dragon-green/20 ring-2 ring-dragon-green' : 'hover:bg-gray-100'}`}>
                        {avatar.id === 0 ? <div className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-full flex items-center justify-center bg-gray-100 border border-gray-200">
                            <UserX className="h-8 w-8 text-gray-400" />
                            <span className="sr-only">{avatar.alt}</span>
                          </div> : <Avatar className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24">
                            <AvatarImage src={avatar.src} alt={avatar.alt} className="object-contain" />
                            <AvatarFallback className="text-xs text-center p-1">
                              {avatar.alt.substring(0, 10)}...
                            </AvatarFallback>
                          </Avatar>}
                      </div>)}
                  </div>
                </div>
              </div> : <div className="flex items-center gap-3">
                {child.avatarId === 0 ? <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gray-100">
                    <UserX className="h-6 w-6 text-gray-400" />
                  </div> : <Avatar className="h-12 w-12">
                    <AvatarImage src={avatarOptions.find(a => a.id === child.avatarId)?.src} alt="Avatar otroka" />
                    <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
                  </Avatar>}
                <div>
                  <p className="font-medium">{child.name || "Brez imena"}</p>
                  <p className="text-sm text-gray-600">
                    Spol: {getGenderDisplayText(child.gender)}
                  </p>
                  {child.birthDate && <p className="text-sm text-gray-600">
                      Datum rojstva: {format(child.birthDate, "dd.MM.yyyy")}
                    </p>}
                </div>
                <Button type="button" variant="outline" size="sm" className="ml-auto" onClick={() => setSelectedChildIndex(index)}>
                  Uredi
                </Button>
              </div>}
          </div>)}
      </div>
      
      {error && error.includes("otrok") && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>;
}