
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AccountInfoFormProps = {
  fullName: string;
  setFullName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
};

export function AccountInfoForm({
  fullName,
  setFullName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword
}: AccountInfoFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-medium mb-3">Uporabniški podatki</h3>
      
      <div className="space-y-2">
        <Label htmlFor="fullName">Ime in priimek</Label>
        <Input
          id="fullName"
          type="text"
          placeholder="Vnesite vaše ime in priimek"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="rounded-md text-base"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">E-pošta</Label>
        <Input
          id="email"
          type="email"
          placeholder="vnesite@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md text-base"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Geslo</Label>
        <Input
          id="password"
          type="password"
          placeholder="Ustvarite geslo"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md text-base"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Ponovite geslo</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Potrdite geslo"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="rounded-md text-base"
          required
        />
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="text-xl font-medium mb-3">Plačilni podatki</h3>
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-sm">
          <p className="text-amber-800">
            Na voljo imate 7-dnevni brezplačni preizkus. Po tem obdobju bo zaračunana izbrana naročnina.
          </p>
        </div>
      </div>
    </div>
  );
}
