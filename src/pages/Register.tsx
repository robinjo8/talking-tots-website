import { Link } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft } from "lucide-react";
import { SpeechDifficultiesStep, SpeechDevelopmentQuestions } from "@/components/speech";
import { useRegistration, RegistrationStep } from "@/hooks/useRegistration";
import { AccountInfoForm, ChildInformationForm, PaymentConfirmationForm } from "@/components/registration";
import { Progress } from "@/components/ui/progress";
export default function Register() {
  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    isLoading,
    selectedPlan,
    setSelectedPlan,
    children,
    currentStep,
    selectedChildIndex,
    setSelectedChildIndex,
    goToNextStep,
    goBack,
    handleSpeechDifficultiesSubmit,
    handleSpeechDevelopmentSubmit,
    updateChildField,
    handleSubmit,
    currentChild,
    getTotalSteps,
    getCurrentStep
  } = useRegistration();

  // Define consistent subscription options
  const subscriptionOptions = [{
    id: "monthly",
    name: "Mesečna naročnina",
    fullName: "Mesečna naročnina - 19,90 € / mesec",
    price: "19,90 €",
    period: "mesec",
    billing: "Zaračunano mesečno po koncu preizkusa",
    discount: false
  }, {
    id: "yearly",
    name: "Letna naročnina",
    fullName: "Letna naročnina - 9,90 € / mesec (plačilo letno)",
    price: "9,90 €",
    period: "mesec",
    billing: "Zaračunano letno po koncu preizkusa",
    discount: true,
    discountPercent: "PRIHRANEK 50%"
  }];
  return <AuthLayout title="" subtitle="">
      {/* Progress Tracker */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Korak {getCurrentStep()} od {getTotalSteps()}</span>
        </div>
        <Progress value={getCurrentStep() / getTotalSteps() * 100} className="h-2" />
      </div>

      {currentStep === RegistrationStep.ACCOUNT_INFO && <>
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Ustvarite račun</h1>
          <p className="text-gray-600">Registrirajte se in začnite uporabljati aplikacijo.</p>
        </div>
        <form onSubmit={goToNextStep} className="space-y-6">
          <div>
            <h2 className="font-semibold text-lg mb-4">Uporabniški podatki</h2>
            <AccountInfoForm username={username} setUsername={setUsername} email={email} setEmail={setEmail} password={password} setPassword={setPassword} confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} />
          </div>
          
          <div>
            
            <ChildInformationForm children={children} selectedChildIndex={selectedChildIndex} setSelectedChildIndex={setSelectedChildIndex} updateChildField={updateChildField} error={error} />
          </div>
          
          
          <Button type="submit" className="w-full bg-dragon-green hover:bg-dragon-green/90 text-base font-medium py-6" disabled={isLoading}>
            Naprej
          </Button>
          
          {error && !error.includes("otrok") && <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>}
          
          <div className="text-sm text-center">
            Že imate račun?{" "}
            <Link to="/login" className="text-dragon-green hover:underline font-medium">
              Prijavite se
            </Link>
          </div>
        </form>
      </>}

      {currentStep === RegistrationStep.SPEECH_DIFFICULTIES && <div>
          <SpeechDifficultiesStep onBack={goBack} onSubmit={handleSpeechDifficultiesSubmit} childName={currentChild.name} initialDifficulties={currentChild.speechDifficulties} submitButtonText="Naprej" />
        </div>}

      {currentStep === RegistrationStep.SPEECH_DEVELOPMENT && <div>
          <SpeechDevelopmentQuestions onBack={goBack} onSubmit={handleSpeechDevelopmentSubmit} childName={currentChild.name} initialAnswers={currentChild.speechDevelopment} />
        </div>}

      {currentStep === RegistrationStep.PAYMENT_CONFIRMATION && <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold font-extrabold text-dragon-green mb-4 text-center py-[22px] my-[4px]">ZAČNITE 7-DNEVNI BREZPLAČNI PREIZKUS</h3>
          </div>
          
          <PaymentConfirmationForm selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} onBack={goBack} />
          
          <Button type="button" onClick={handleSubmit} className="w-full bg-dragon-green hover:bg-dragon-green/90 text-base font-medium py-6" disabled={isLoading}>
            {isLoading ? "Ustvarjam račun..." : "Zaključi registracijo"}
          </Button>
        </div>}
    </AuthLayout>;
}