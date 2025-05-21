
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
    isCheckingEmail,
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
    addChild,
    removeChild,
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
  return <AuthLayout title="Ustvarite račun" subtitle="Registrirajte se in začnite uporabljati aplikacijo.">
      {/* Progress Tracker */}
      <div className="mb-6 mt-4">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Korak {getCurrentStep()} od {getTotalSteps()}</span>
        </div>
        <Progress value={getCurrentStep() / getTotalSteps() * 100} className="h-2" />
      </div>

      {currentStep === RegistrationStep.ACCOUNT_INFO && <form onSubmit={goToNextStep} className="mt-6 space-y-6">
          {error && !error.includes("otrok") && <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>}
          
          <div>
            <h2 className="font-semibold text-lg mb-4">Uporabniški podatki</h2>
            <AccountInfoForm username={username} setUsername={setUsername} email={email} setEmail={setEmail} password={password} setPassword={setPassword} confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} />
          </div>
          
          <div>
            
            <ChildInformationForm children={children} selectedChildIndex={selectedChildIndex} setSelectedChildIndex={setSelectedChildIndex} removeChild={removeChild} updateChildField={updateChildField} error={error} />
          </div>
          
          {children.some(child => child.isComplete) && <Button type="button" variant="outline" onClick={addChild} className="mt-4 border-dragon-green text-dragon-green hover:bg-dragon-green/10 w-full">
              Dodaj otroka
            </Button>}
          
          <Button type="submit" className="w-full bg-dragon-green hover:bg-dragon-green/90 text-base font-medium py-6" disabled={isLoading || isCheckingEmail}>
            {isCheckingEmail ? "Preverjanje..." : "Naprej"}
          </Button>
          
          <div className="text-sm text-center">
            Že imate račun?{" "}
            <Link to="/login" className="text-dragon-green hover:underline font-medium">
              Prijavite se
            </Link>
          </div>
        </form>}

      {currentStep === RegistrationStep.SPEECH_DIFFICULTIES && <div className="mt-6">
          <SpeechDifficultiesStep onBack={goBack} onSubmit={handleSpeechDifficultiesSubmit} childName={currentChild.name} initialDifficulties={currentChild.speechDifficulties} submitButtonText="Naprej" />
        </div>}

      {currentStep === RegistrationStep.SPEECH_DEVELOPMENT && <div className="mt-6">
          <SpeechDevelopmentQuestions onBack={goBack} onSubmit={handleSpeechDevelopmentSubmit} childName={currentChild.name} initialAnswers={currentChild.speechDevelopment} />
        </div>}

      {currentStep === RegistrationStep.PAYMENT_CONFIRMATION && <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-2xl font-bold font-extrabold text-dragon-green mb-4 text-center">Začnite 7-dnevni brezplačni preizkus</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {subscriptionOptions.map(option => <div key={option.id} className={`border rounded-lg p-4 cursor-pointer ${selectedPlan === option.fullName ? "border-dragon-green bg-green-50" : "hover:bg-gray-50"}`} onClick={() => setSelectedPlan(option.fullName)}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{option.name}</h4>
                      {option.discount && <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">{option.discountPercent}</span>}
                    </div>
                    <div className="h-4 w-4 rounded-full border border-dragon-green flex items-center justify-center">
                      {selectedPlan === option.fullName && <div className="h-2 w-2 rounded-full bg-dragon-green"></div>}
                    </div>
                  </div>
                  <p className="font-bold text-xl">{option.price} <span className="text-gray-500 text-sm font-normal">/ {option.period}</span></p>
                  <p className="text-sm text-gray-600 mt-1">{option.billing}</p>
                </div>)}
            </div>
          </div>
          
          <PaymentConfirmationForm selectedPlan={selectedPlan} />
          
          <Button type="button" onClick={handleSubmit} className="w-full bg-dragon-green hover:bg-dragon-green/90 text-base font-medium py-6" disabled={isLoading}>
            {isLoading ? "Ustvarjam račun..." : "Zaključi registracijo"}
          </Button>
          
          <Button type="button" variant="outline" size="sm" onClick={goBack} className="flex items-center gap-1 w-full mt-4">
            <ArrowLeft className="h-4 w-4" />
            Nazaj
          </Button>
        </div>}
    </AuthLayout>;
}
