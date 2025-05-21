
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AccountInfoFormProps = {
  username: string;
  setUsername: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
};

export function AccountInfoForm({
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword
}: AccountInfoFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Uporabniško ime</Label>
        <Input
          id="username"
          type="text"
          placeholder="Izberite uporabniško ime"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
    </div>
  );
}
