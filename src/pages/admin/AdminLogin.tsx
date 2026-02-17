import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Eye, EyeOff, LogIn, Home } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { MfaVerification } from '@/components/admin/MfaVerification';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mfaStep, setMfaStep] = useState(false);
  const [mfaUserId, setMfaUserId] = useState('');
  const [mfaEmail, setMfaEmail] = useState('');
  const { signIn, user, isLogopedist, isLoading: authLoading, signOut, mfaVerified, setMfaVerified } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    
    if (user && isLogopedist && mfaVerified) {
      navigate('/admin');
      return;
    }

    // User is already logged in as logopedist but MFA not yet verified - auto-trigger MFA
    if (user && isLogopedist && !mfaVerified && !mfaStep && !isLoading) {
      const autoTriggerMfa = async () => {
        setIsLoading(true);
        try {
          const { data: mfaData, error: mfaError } = await supabase.functions.invoke('send-mfa-code', {
            body: { user_id: user.id, email: user.email },
          });

          if (mfaError || !mfaData?.success) {
            console.error('Auto MFA send error:', mfaError, mfaData);
            toast.error(mfaData?.error || 'Napaka pri pošiljanju potrditvene kode');
            setIsLoading(false);
            return;
          }

          setMfaUserId(user.id);
          setMfaEmail(user.email || '');
          setMfaStep(true);
          toast.info('Potrditvena koda je bila poslana na vaš email');
        } catch (err) {
          console.error('Auto MFA trigger error:', err);
          toast.error('Napaka pri pošiljanju potrditvene kode');
        } finally {
          setIsLoading(false);
        }
      };
      autoTriggerMfa();
    }
  }, [user, isLogopedist, authLoading, mfaVerified, mfaStep, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Prosimo, izpolnite vsa polja');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Napačen email ali geslo');
        } else {
          toast.error('Napaka pri prijavi: ' + error.message);
        }
        setIsLoading(false);
        return;
      }

      // Get the current user after successful login
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        toast.error('Napaka pri pridobivanju uporabniških podatkov');
        setIsLoading(false);
        return;
      }

      // SECURITY CHECK: Verify user is actually a logopedist in database
      const { data: logopedistProfile } = await supabase
        .from('logopedist_profiles')
        .select('id, is_verified')
        .eq('user_id', currentUser.id)
        .maybeSingle();

      if (!logopedistProfile) {
        console.log('AdminLogin: User is not a logopedist, signing out');
        await signOut();
        toast.error('Ta račun ni registriran kot logoped. Za prijavo uporabite glavno stran.');
        setIsLoading(false);
        return;
      }

      if (!logopedistProfile.is_verified) {
        console.log('AdminLogin: Logopedist membership not verified yet');
        await signOut();
        toast.info('Vaše članstvo še ni potrjeno. Ko bo potrjeno, vas bomo obvestili po emailu.');
        setIsLoading(false);
        return;
      }

      // Send MFA code
      const { data: mfaData, error: mfaError } = await supabase.functions.invoke('send-mfa-code', {
        body: { user_id: currentUser.id, email: currentUser.email },
      });

      if (mfaError || !mfaData?.success) {
        console.error('MFA send error:', mfaError, mfaData);
        toast.error(mfaData?.error || 'Napaka pri pošiljanju potrditvene kode');
        setIsLoading(false);
        return;
      }

      // Show MFA verification screen
      setMfaUserId(currentUser.id);
      setMfaEmail(currentUser.email || email);
      setMfaStep(true);
      toast.info('Potrditvena koda je bila poslana na vaš email');
    } catch (err) {
      toast.error('Napaka pri prijavi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMfaVerified = () => {
    setMfaVerified(true);
    navigate('/admin');
  };

  const handleMfaCancel = async () => {
    setMfaStep(false);
    setMfaUserId('');
    setMfaEmail('');
    await signOut();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-app-blue/10 via-background to-app-blue/5">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-blue" />
      </div>
    );
  }

  // Show MFA verification screen
  if (mfaStep && mfaUserId) {
    return (
      <MfaVerification
        userId={mfaUserId}
        email={mfaEmail}
        onVerified={handleMfaVerified}
        onCancel={handleMfaCancel}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-app-blue/10 via-background to-app-blue/5 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-1 mb-2">
            <span className="text-3xl font-extrabold text-dragon-green uppercase">Tomi</span>
            <span className="text-3xl font-extrabold text-app-orange uppercase">Talk</span>
          </div>
          <p className="text-lg text-app-blue font-semibold">Portal za organizacije</p>
        </div>

        <Card className="border-app-blue/20 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Prijava</CardTitle>
            <CardDescription>
              Prijavite se v portal za logopede
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    <LogIn className="h-4 w-4 mr-2" />
                    Prijava
                  </>
                )}
              </Button>

              <button
                type="button"
                onClick={() => window.location.href = '/'}
                className="w-full h-11 inline-flex items-center justify-center gap-2 bg-white text-black rounded-md border border-gray-200 shadow-sm hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                <Home className="h-4 w-4" />
                Nazaj na začetno stran
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Še nimate računa?{' '}
              <Link to="/admin/register" className="text-app-blue hover:underline font-medium">
                Registrirajte se
              </Link>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
