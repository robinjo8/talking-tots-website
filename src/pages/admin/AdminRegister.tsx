import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Eye, EyeOff, UserPlus, ArrowLeft } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Organization {
  id: string;
  name: string;
  type: string;
}

export default function AdminRegister() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, user, isLogopedist, isLoading: authLoading } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user && isLogopedist) {
      navigate('/admin');
    }
  }, [user, isLogopedist, authLoading, navigate]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select('id, name, type')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching organizations:', error);
        return;
      }

      setOrganizations(data || []);
    };

    fetchOrganizations();
  }, []);

  const validateForm = () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword || !organizationId) {
      toast.error('Prosimo, izpolnite vsa polja');
      return false;
    }

    if (password.length < 8) {
      toast.error('Geslo mora biti dolgo vsaj 8 znakov');
      return false;
    }

    if (password !== confirmPassword) {
      toast.error('Gesli se ne ujemata');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Prosimo, vnesite veljaven email naslov');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { error } = await signUp(email, password, firstName, lastName, organizationId);

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('Ta email je že registriran. Prosimo, uporabite prijavo.');
        } else {
          toast.error('Napaka pri registraciji: ' + error.message);
        }
      } else {
        toast.success('Registracija uspešna! Preverite vaš email za potrditev.');
        navigate('/admin/login');
      }
    } catch (err) {
      toast.error('Napaka pri registraciji');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-app-blue/10 via-background to-app-blue/5">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-blue" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-app-blue/10 via-background to-app-blue/5 p-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Nazaj na glavno stran
          </Link>
          <div className="flex items-center justify-center gap-1 mb-2">
            <span className="text-3xl font-extrabold text-dragon-green uppercase">Tomi</span>
            <span className="text-3xl font-extrabold text-app-orange uppercase">Talk</span>
          </div>
          <p className="text-lg text-app-blue font-semibold">Portal za organizacije</p>
        </div>

        <Card className="border-app-blue/20 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Registracija</CardTitle>
            <CardDescription>
              Ustvarite račun za portal za logopede
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Ime</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Ime"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isLoading}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Priimek</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Priimek"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isLoading}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="vas.email@primer.si"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">Organizacijska enota</Label>
                <Select value={organizationId} onValueChange={setOrganizationId} disabled={isLoading}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Izberite organizacijo" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Geslo</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-11 w-11"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Vsaj 8 znakov</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Ponovite geslo</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="h-11"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-app-blue hover:bg-app-blue/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Registracija
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Že imate račun?{' '}
              <Link to="/admin/login" className="text-app-blue hover:underline font-medium">
                Prijavite se
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Ta portal je namenjen izključno logopedinjam in logopedinjam
        </p>
      </div>
    </div>
  );
}
