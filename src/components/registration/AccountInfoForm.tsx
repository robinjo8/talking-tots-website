
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AccountInfoFormProps = {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
};

export function AccountInfoForm({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword
}: AccountInfoFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Ime</Label>
          <Input
            id="firstName"
            type="text"
            placeholder="Vnesite vaše ime"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="rounded-md text-base"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Priimek</Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Vnesite vaš priimek"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="rounded-md text-base"
            required
          />
        </div>
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
    </div>
  );
}
