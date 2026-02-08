import React, { useState, useEffect, useCallback } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Mail, RefreshCw, ShieldCheck, Timer } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MfaVerificationProps {
  userId: string;
  email: string;
  onVerified: () => void;
  onCancel: () => void;
}

export function MfaVerification({ userId, email, onVerified, onCancel }: MfaVerificationProps) {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [expirySeconds, setExpirySeconds] = useState(600);

  // Countdown for resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Countdown for code expiry
  useEffect(() => {
    if (expirySeconds <= 0) return;
    const timer = setInterval(() => {
      setExpirySeconds((prev) => {
        if (prev <= 1) {
          toast.error('Koda je potekla. Zahtevajte novo kodo.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleVerify = useCallback(async (otpCode: string) => {
    if (otpCode.length !== 6) return;

    setIsVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-mfa-code', {
        body: { user_id: userId, code: otpCode },
      });

      if (error) {
        toast.error('Napaka pri preverjanju kode');
        setCode('');
        return;
      }

      if (data?.success) {
        toast.success('Koda potrjena! Prijava uspešna.');
        onVerified();
      } else {
        const errorMsg = data?.error || 'Napačna koda';
        toast.error(errorMsg);
        setCode('');

        if (data?.expired || data?.locked) {
          setExpirySeconds(0);
        }
      }
    } catch {
      toast.error('Napaka pri preverjanju kode');
      setCode('');
    } finally {
      setIsVerifying(false);
    }
  }, [userId, onVerified]);

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-mfa-code', {
        body: { user_id: userId, email },
      });

      if (error) {
        toast.error('Napaka pri pošiljanju nove kode');
        return;
      }

      if (data?.success) {
        toast.success('Nova koda poslana na vaš email');
        setResendCooldown(60);
        setExpirySeconds(600);
        setCode('');
      } else {
        const errorMsg = data?.error || 'Napaka pri pošiljanju';
        toast.error(errorMsg);
        if (data?.seconds_remaining) {
          setResendCooldown(data.seconds_remaining);
        }
      }
    } catch {
      toast.error('Napaka pri pošiljanju nove kode');
    } finally {
      setIsResending(false);
    }
  };

  const handleCodeChange = (value: string) => {
    setCode(value);
    if (value.length === 6) {
      handleVerify(value);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, '$1***$3');

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
            <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-app-blue/10 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-app-blue" />
            </div>
            <CardTitle className="text-2xl">Dvostopenjska prijava</CardTitle>
            <CardDescription>
              Na <strong>{maskedEmail}</strong> smo poslali 6-mestno potrditveno kodo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* OTP Input */}
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={handleCodeChange}
                disabled={isVerifying || expirySeconds <= 0}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <span className="mx-2 text-muted-foreground">—</span>
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* Expiry timer */}
            {expirySeconds > 0 ? (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Timer className="h-4 w-4" />
                <span>Koda velja še {formatTime(expirySeconds)}</span>
              </div>
            ) : (
              <div className="text-center text-sm text-destructive font-medium">
                Koda je potekla. Zahtevajte novo kodo.
              </div>
            )}

            {/* Verify button */}
            <Button
              onClick={() => handleVerify(code)}
              className="w-full h-11 bg-app-blue hover:bg-app-blue/90"
              disabled={code.length !== 6 || isVerifying || expirySeconds <= 0}
            >
              {isVerifying ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Potrdi kodo
                </>
              )}
            </Button>

            {/* Resend button */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-11"
              onClick={handleResend}
              disabled={resendCooldown > 0 || isResending}
            >
              {isResending ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-app-blue" />
              ) : resendCooldown > 0 ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Pošlji novo kodo ({resendCooldown}s)
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Pošlji novo kodo
                </>
              )}
            </Button>

            {/* Cancel */}
            <button
              type="button"
              onClick={onCancel}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Nazaj na prijavo
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
