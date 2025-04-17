
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Phone, User, Home, MapPin } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const personalDataSchema = z.object({
  email: z.string().email("Vnesi veljaven email naslov").optional(),
  phone: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
});

type PersonalDataFormValues = z.infer<typeof personalDataSchema>;

type PersonalDataSectionProps = {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
};

export function PersonalDataSection({ isExpanded, setIsExpanded }: PersonalDataSectionProps) {
  const { user, profile } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<PersonalDataFormValues>({
    resolver: zodResolver(personalDataSchema),
    defaultValues: {
      email: user?.email || "",
      phone: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      country: "",
      postalCode: "",
    },
  });

  // Load user profile data
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("phone, first_name, last_name, address, city, country, postal_code")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Napaka pri nalaganju podatkov:", error);
          return;
        }

        if (data) {
          form.reset({
            email: user.email || "",
            phone: data.phone || "",
            firstName: data.first_name || "",
            lastName: data.last_name || "",
            address: data.address || "",
            city: data.city || "",
            country: data.country || "",
            postalCode: data.postal_code || "",
          });
        }
      } catch (error) {
        console.error("Napaka pri pridobivanju podatkov:", error);
      }
    };

    loadUserData();
  }, [user, form]);

  const onSubmit = async (values: PersonalDataFormValues) => {
    if (!user) return;
    
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from("profiles")
        .update({
          phone: values.phone,
          first_name: values.firstName,
          last_name: values.lastName,
          address: values.address,
          city: values.city,
          country: values.country,
          postal_code: values.postalCode,
        })
        .eq("id", user.id);
      
      if (error) throw error;
      
      toast.success("Osebni podatki uspešno posodobljeni");
    } catch (error: any) {
      console.error("Napaka pri posodobitvi podatkov:", error);
      toast.error("Napaka pri posodobitvi podatkov");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div 
        className="p-4 flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-dragon-green" />
          <h2 className="text-lg font-semibold">Moji podatki</h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-0 h-auto"
        >
          {isExpanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m18 15-6-6-6 6"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m6 9 6 6 6-6"/></svg>
          )}
        </Button>
      </div>
      
      {isExpanded && (
        <div className="px-4 pb-6">
          <p className="text-sm text-muted-foreground mb-4">
            Prosto lahko urediš svoje podatke spodaj.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Kontaktni podatki */}
              <div className="space-y-4">
                <h3 className="text-md font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Kontaktni podatki
                </h3>
                
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-pošta:</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      readOnly
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email naslov ni mogoče spremeniti
                    </p>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" />
                            <span>Telefonska številka (neobvezno):</span>
                          </div>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Telefonska številka" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Naslov */}
              <div className="space-y-4">
                <h3 className="text-md font-medium flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Naslov (neobvezno)
                </h3>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ime:</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ime" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priimek:</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Priimek" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Naslov:</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Naslov" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mesto:</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Mesto" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Država:</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Država" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Poštna številka:</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Poštna številka" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full sm:w-auto"
                disabled={isUpdating}
              >
                {isUpdating ? "Shranjevanje..." : "Shrani podatke"}
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}
