
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Trash2, UserX, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChildProfile } from "@/hooks/registration/types";
import { avatarOptions } from "@/components/AvatarSelector";
type ChildInformationFormProps = {
  children: ChildProfile[];
  selectedChildIndex: number;
  setSelectedChildIndex: (index: number) => void;
  updateChildField: (id: string, field: keyof ChildProfile, value: any) => void;
  error: string | null;
};
export function ChildInformationForm({
  children,
  selectedChildIndex,
  setSelectedChildIndex,
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
            </div>
            
            {selectedChildIndex === index ? <div className="space-y-4">
                <div>
                  <Label htmlFor={`child-name-${child.id}`}>Ime otroka</Label>
                  <Input id={`child-name-${child.id}`} value={child.name} onChange={e => updateChildField(child.id, "name", e.target.value)} placeholder="Vnesite ime otroka" className="mt-1" required />
                </div>
                
                <div className="space-y-2">
                  <Label>Datum rojstva otroka <span className="text-red-500">*</span></Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor={`birth-day-${child.id}`} className="text-xs text-gray-600">Dan</Label>
                      <Select 
                        value={child.birthDate ? child.birthDate.getDate().toString() : ""} 
                        onValueChange={(value) => {
                          const currentDate = child.birthDate || new Date();
                          const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), parseInt(value));
                          updateChildField(child.id, "birthDate", newDate);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Dan" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                            <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`birth-month-${child.id}`} className="text-xs text-gray-600">Mesec</Label>
                      <Select 
                        value={child.birthDate ? child.birthDate.getMonth().toString() : ""} 
                        onValueChange={(value) => {
                          const currentDate = child.birthDate || new Date();
                          const newDate = new Date(currentDate.getFullYear(), parseInt(value), currentDate.getDate());
                          updateChildField(child.id, "birthDate", newDate);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Mesec" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Januar</SelectItem>
                          <SelectItem value="1">Februar</SelectItem>
                          <SelectItem value="2">Marec</SelectItem>
                          <SelectItem value="3">April</SelectItem>
                          <SelectItem value="4">Maj</SelectItem>
                          <SelectItem value="5">Junij</SelectItem>
                          <SelectItem value="6">Julij</SelectItem>
                          <SelectItem value="7">Avgust</SelectItem>
                          <SelectItem value="8">September</SelectItem>
                          <SelectItem value="9">Oktober</SelectItem>
                          <SelectItem value="10">November</SelectItem>
                          <SelectItem value="11">December</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`birth-year-${child.id}`} className="text-xs text-gray-600">Leto</Label>
                      <Select 
                        value={child.birthDate ? child.birthDate.getFullYear().toString() : ""} 
                        onValueChange={(value) => {
                          const currentDate = child.birthDate || new Date();
                          const newDate = new Date(parseInt(value), currentDate.getMonth(), currentDate.getDate());
                          updateChildField(child.id, "birthDate", newDate);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Leto" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: new Date().getFullYear() - 1990 + 1 }, (_, i) => new Date().getFullYear() - i).map(year => (
                            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {!child.birthDate && <p className="text-sm text-red-500">Datum rojstva je obvezen.</p>}
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
                  <Label className="text-base font-medium mb-4 block">Izberi avatarja</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full mt-2 justify-between h-16 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-dragon-green/40"
                      >
                        <div className="flex items-center justify-center">
                          {child.avatarId === 0 || !child.avatarId ? (
                            <UserX className="h-10 w-10 text-gray-400" />
                          ) : (
                            <Avatar className="h-12 w-12 ring-2 ring-dragon-green/20">
                              <AvatarImage src={avatarOptions.find(a => a.id === child.avatarId)?.src} alt="Avatar" className="object-contain" />
                              <AvatarFallback className="text-xs">A</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                        <ChevronDown className="h-5 w-5 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[600px] p-6 bg-white border-2 shadow-xl z-50" align="start">
                      <h4 className="text-lg font-medium mb-4 text-center">Izberi avatarja za otroka</h4>
                      <div className="grid grid-cols-5 gap-4 mb-6">
                        {avatarOptions.slice(1).map(avatar => (
                          <div 
                            key={avatar.id}
                            onClick={() => updateChildField(child.id, "avatarId", avatar.id)}
                            className={cn(
                              "cursor-pointer rounded-xl p-4 transition-all duration-200 flex flex-col items-center justify-center min-h-[100px] hover:shadow-lg border-2",
                              child.avatarId === avatar.id 
                                ? "bg-dragon-green/20 ring-3 ring-dragon-green shadow-xl scale-[1.02] border-dragon-green" 
                                : "bg-white hover:bg-gray-50 border-gray-200 hover:border-dragon-green/40"
                            )}
                          >
                            <Avatar className="h-16 w-16 lg:h-20 lg:w-20 ring-2 ring-transparent mb-2">
                              <AvatarImage 
                                src={avatar.src} 
                                alt={avatar.alt} 
                                className="object-contain w-full h-full p-1" 
                              />
                              <AvatarFallback className="text-xs bg-dragon-green/10">🐲</AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-center text-gray-600 leading-tight max-w-full break-words">
                              Zmajček {avatar.id}
                            </span>
                          </div>
                        ))}
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => updateChildField(child.id, "avatarId", 0)}
                        className="w-full"
                      >
                        Ne želim izbrati avatarja
                      </Button>
                    </PopoverContent>
                  </Popover>
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
                      Datum rojstva: {child.birthDate.getDate()}.{child.birthDate.getMonth() + 1}.{child.birthDate.getFullYear()}
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
